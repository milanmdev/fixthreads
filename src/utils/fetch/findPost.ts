import fetch from "node-fetch";

async function findPost({
  post,
  userAgent,
}: {
  post: string;
  userAgent: string;
}) {
  // Credit to threads-api for this snippet
  let threadID = post;
  threadID = threadID.split("?")[0];
  threadID = threadID.replace(/\s/g, "");
  threadID = threadID.replace(/\//g, "");
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let postID = 0n;
  for (const letter of threadID) {
    postID = postID * 64n + BigInt(alphabet.indexOf(letter));
  }

  let details = {
    variables: `{"check_for_unavailable_replies":true,"first":10,"postID":"${postID.toString()}","__relay_internal__pv__BarcelonaIsLoggedInrelayprovider":true,"__relay_internal__pv__BarcelonaIsThreadContextHeaderEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaIsThreadContextHeaderFollowButtonEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaUseCometVideoPlaybackEnginerelayprovider":false,"__relay_internal__pv__BarcelonaOptionalCookiesEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaIsViewCountEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaShouldShowFediverseM075Featuresrelayprovider":false}`,
    doc_id: "7448594591874178",
    lsd: "hgmSkqDnLNFckqa7t1vJdn",
  };
  let formBody: string[] = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    // @ts-ignore
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  let finalFormBody = formBody.join("&");
  let fetchThreadsAPI = await fetch(`https://www.threads.net/api/graphql`, {
    method: "POST",
    headers: {
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": " same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "X-Fb-Lsd": "hgmSkqDnLNFckqa7t1vJdn",
      "X-Ig-App-Id": "238260118697367",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: finalFormBody,
  });
  let fetchThreadsAPIJson = (await fetchThreadsAPI.json()) as any;
  if (!fetchThreadsAPIJson.data) {
    return false;
  }

  /* Handle Post Finding */
  let thread_items = fetchThreadsAPIJson.data.data.edges[0].node.thread_items;
  let index = 0;
  let postObj = thread_items.filter((item: any) => {
    index++;
    if (item.post.code == post) return item;
  })[0];

  /* Handle Captions */
  let caption;
  if (index > 1) {
    caption =
      `⤴️ Replying to @${thread_items[index - 2].post.user.username}` +
      `\n\n` +
      (postObj.post.caption != null ? postObj.post.caption.text : "");
  } else {
    caption = postObj.post.caption != null ? postObj.post.caption.text : "";
  }
  let description = caption;

  /* Setup oEmbed */
  let oembedStat = `❤️ ${postObj.post.like_count.toLocaleString()} like${
    postObj.post.like_count > 1 || postObj.post.like_count == 0 ? "s" : ""
  } | 💬 ${
    postObj.post.text_post_app_info.direct_reply_count
      ? postObj.post.text_post_app_info.direct_reply_count.toLocaleString()
      : "0 replies"
  }`;

  /* Handle Images */
  let images;
  let vidData: VideoProps[] = [];
  let imgType = "";
  if (postObj.post.carousel_media && postObj.post.carousel_media.length > 0) {
    images = postObj.post.carousel_media.map((item: any) => {
      if (item.video_versions !== null && item.video_versions.length > 0) {
        vidData.push({ url: item.video_versions[0].url });
        return;
      }
      return {
        url: item.image_versions2.candidates[0].url,
      };
    });
    imgType = "carousel";
  } else if (
    postObj.post.text_post_app_info.link_preview_attachment &&
    postObj.post.text_post_app_info.link_preview_attachment.image_url
  ) {
    images = [
      {
        url: postObj.post.text_post_app_info.link_preview_attachment.image_url,
      },
    ];
    imgType = "carousel";
  } else {
    if (postObj.post.image_versions2.candidates.length > 0) {
      images = [
        {
          url: postObj.post.image_versions2.candidates[0].url,
        },
      ];
      imgType = "carousel";
    } else {
      images = [
        {
          url: postObj.post.user.profile_pic_url,
        },
      ];
      imgType = "single";
    }
  }

  /* Handle Videos */
  let video: VideoProps[] = [];
  if (postObj.post.video_versions || vidData.length >= 1) {
    if (vidData.length > 0) {
      video = vidData.map((item: any) => {
        return {
          url: item.url,
        };
      });
    } else {
      if (postObj.post.video_versions.length > 0) {
        video = [
          {
            url: postObj.post.video_versions[0].url,
          },
        ];
      }
    }
  }

  /* Handle Quote Repost Posts */
  let quotedPost: QuotedPostProps = {
    username: "",
    caption: "",
    quoted: false,
  };
  if (postObj.post.text_post_app_info.share_info.quoted_post != null) {
    quotedPost = {
      username:
        postObj.post.text_post_app_info.share_info.quoted_post.user.username,
      caption:
        postObj.post.text_post_app_info.share_info.quoted_post.caption.text,
      quoted: true,
    };

    description =
      description +
      `\n\n↪ Quoting @${quotedPost.username}\n` +
      quotedPost.caption;
  }

  let returnJson = {
    description,
    title: `@${postObj.post.user.username} on Threads`,
    images,
    post,
    username: postObj.post.user.username,
    imageType: imgType,
    video,
    oembedStat,
    quotedPost,
    userAgent,
  };

  return returnJson;
}

export default findPost;
