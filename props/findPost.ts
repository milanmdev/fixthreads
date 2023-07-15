import parse from "node-html-parser";

async function findPost({ post }: { post: string }) {
  const postRes = await fetch(`https://www.threads.net/t/${post}`, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.5",
      "Cache-Control": "no-cache",
      Connection: "	keep-alive",
      Host: "www.threads.net",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "	document",
      "Sec-Fetch-Mode": "	navigate",
      "Sec-Fetch-Site": "	none",
      "Sec-Fetch-User": "	?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
    },
  });
  const postResJson = await postRes.text();

  const parsed = parse(postResJson);
  let script = parsed.getElementsByTagName("script");
  let scriptFilter = script.filter((item) => {
    let findNested = item.childNodes.filter((item) => {
      if (
        item.rawText.startsWith(
          `requireLazy(["JSScheduler","ServerJS","ScheduledApplyEach"]`
        ) == true
      ) {
        return item.rawText;
      }
    });
    return findNested[0];
  });
  let splitToJson =
    scriptFilter[0].childNodes[0].rawText.split(`ScheduledApplyEach,`);
  let splitToJson2 = splitToJson[1].split(`);}`);
  let splitJson = JSON.parse(splitToJson2[0]);
  let filterJson = splitJson.require.filter((item: any) => {
    if (item[1] && item[1] == "init") return item;
  });
  if (!filterJson[0][3][3]) {
    return false;
  }
  let id = filterJson[0][3][3].rootView.props.post_id; // this should probably cleaned up this is rly messy

  let details = {
    variables: `{"postID":"${id}"}`,
    doc_id: "5587632691339264",
    lsd: "uBfU8H0eeG06f5Mtrk851X",
  };
  let formBody = [];
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
      "X-Fb-Lsd": "uBfU8H0eeG06f5Mtrk851X",
      "X-Ig-App-Id": "238260118697367",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: finalFormBody,
  });
  let fetchThreadsAPIJson = await fetchThreadsAPI.json();
  if (!fetchThreadsAPIJson.data) {
    return false;
  }
  let postObj = fetchThreadsAPIJson.data.data.containing_thread.thread_items[0];

  let caption =
    `💬 ${
      postObj.view_replies_cta_string
        ? postObj.view_replies_cta_string
        : "0 replies"
    }` +
    "\n" +
    `❤️ ${postObj.post.like_count} likes` +
    `\n\n` +
    (postObj.post.caption != null ? postObj.post.caption.text : "");

  let images;
  let vidCnt = 0;
  if (postObj.post.carousel_media_count > 0) {
    images = postObj.post.carousel_media.map((item: any) => {
      if (item.video_versions.length > 0) {
        vidCnt++;
        return;
      }
      return {
        url: item.image_versions2.candidates[0].url,
        width: item.original_width,
        height: item.original_height,
      };
    });
    images = images.filter((item: any) => {
      if (item) return item;
    });
  } else {
    if (postObj.post.image_versions2.candidates.length > 0) {
      images = [
        {
          url: postObj.post.image_versions2.candidates[0].url,
          width: postObj.post.original_width,
          height: postObj.post.original_height,
        },
      ];
    } else {
      images = [
        {
          url: postObj.post.user.profile_pic_url,
        },
      ];
    }
  }

  let video = null;
  if (vidCnt > 0) {
    video = postObj.post.carousel_media.map((item: any) => {
      if (item.video_versions.length > 0) {
        return {
          url: item.video_versions[0].url,
          width: item.original_width,
          height: item.original_height,
        };
      } else {
        return;
      }
    });
    video = video.filter((item: any) => {
      if (item) return item;
    });
  } else {
    if (postObj.post.video_versions.length > 0) {
      video = [
        {
          url: postObj.post.video_versions[0].url,
          width: postObj.post.original_width,
          height: postObj.post.original_height,
        },
      ];
    }
  }

  let returnJson = {
    description: caption,
    title: `@${postObj.post.user.username} on Threads`,
    images,
    post,
    username: postObj.post.user.username,
    imageType:
      postObj.post.carousel_media_count > 0 ||
      postObj.post.image_versions2.candidates.length > 0
        ? "carousel"
        : "single",
    video,
  };

  return returnJson;
}

export default findPost;
