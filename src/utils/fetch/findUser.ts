import fetch from "node-fetch";
import { login, refreshToken } from "./igLogin";

async function findUser({
  username,
  userAgent,
}: {
  username: string;
  userAgent: string;
}) {
  let postResText: any = await fetch(`https://www.threads.net/@${username}`, {
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
  postResText = await postResText.text();
  // Credit to threads-api for this snippet
  postResText = postResText.replace(/\s/g, "");
  postResText = postResText.replace(/\n/g, "");
  const id: string | undefined = postResText.match(/"user_id":"(\d+)"/)?.[1];
  const lsdToken: string | undefined = postResText.match(
    /"LSD",\[\],{"token":"(\w+)"},\d+\]/
  )?.[1];

  let details = {
    variables: `{"userID":"${id}","__relay_internal__pv__BarcelonaIsSableEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaIsSuggestedUsersOnProfileEnabledrelayprovider":false,"__relay_internal__pv__BarcelonaShouldShowFediverseM075Featuresrelayprovider":false}`,
    doc_id: "6924492170994454",
    lsd: lsdToken || "GwDPK2EGiKW0LKebIEqqbF",
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
      "X-Fb-Lsd": lsdToken || "GwDPK2EGiKW0LKebIEqqbF",
      "X-Ig-App-Id": "238260118697367",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: finalFormBody,
  });
  let fetchThreadsAPIJson: any = await fetchThreadsAPI.json();
  if (fetchThreadsAPIJson.errors && fetchThreadsAPIJson.errors.length > 0) {
    if (fetchThreadsAPIJson.errors[0].summary == "Not Logged In") {
      let newToken = await login();
      if (newToken == false) {
        return false;
      } else {
        let fetchWithAuth = await fetch(`https://www.threads.net/api/graphql`, {
          method: "POST",
          headers: {
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": " same-origin",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "X-Fb-Lsd": lsdToken || "GwDPK2EGiKW0LKebIEqqbF",
            "X-Ig-App-Id": "238260118697367",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: newToken.token ? newToken.token : "",
          },
          body: finalFormBody,
        });
        fetchThreadsAPIJson = await fetchWithAuth.json();

        if (
          fetchThreadsAPIJson.errors &&
          fetchThreadsAPIJson.errors.length > 0
        ) {
          if (fetchThreadsAPIJson.errors[0].summary == "Not Logged In") {
            let tokenRefresh = await refreshToken();
            if (tokenRefresh == false) return false;
          }
        }
      }
    } else {
      return false;
    }
  } else if (!fetchThreadsAPIJson.data) {
    return false;
  }

  let userObj = fetchThreadsAPIJson.data.user;

  /* Setup oEmbed */
  let oembedStat = `👤 ${userObj.follower_count.toLocaleString()} follower${
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
    userAgent,
  };

  return returnJson;
}

export default findUser;
