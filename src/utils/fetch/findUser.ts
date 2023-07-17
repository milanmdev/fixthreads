import fetch from "node-fetch";
import parse from "node-html-parser";

async function findUser({ username }: { username: string }) {
  const postRes = await fetch(`https://www.threads.net/${username}`, {
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
      } else {
        return false;
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
  let id = filterJson[0][3][3].rootView.props.user_id; // this should probably cleaned up this is rly messy

  let details = {
    variables: `{"userID":"${id}"}`,
    doc_id: "23996318473300828",
    lsd: "uBfU8H0eeG06f5Mtrk851X",
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
      "X-Fb-Lsd": "uBfU8H0eeG06f5Mtrk851X",
      "X-Ig-App-Id": "238260118697367",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: finalFormBody,
  });
  let fetchThreadsAPIJson = (await fetchThreadsAPI.json()) as any;
  if (!fetchThreadsAPIJson.data) {
    return false;
  }
  let userObj = fetchThreadsAPIJson.data.userData.user;

  let oembedStat = `👤 ${userObj.follower_count} follower${
    (userObj.follower_count = 0 || userObj.follower_count) > 1 ? "s" : ""
  }`;

  let returnJson = {
    description: userObj.biography,
    title: `${userObj.full_name} (@${userObj.username}) on Threads`,
    images: [{ url: userObj.profile_pic_url }],
    username,
    imageType: "single",
    oembedStat,
    video: [],
  };

  return returnJson;
}

export default findUser;
