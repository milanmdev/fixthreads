/* Credit to https://github.com/Wikidepia/InstaFix for the base for this script */

addEventListener("fetch", (event) => {
  event.respondWith(stream(event.request));
});

async function stream(request) {
  const { pathname } = new URL(request.url);
  let url = pathname.slice(1);
  url = decodeURIComponent(url);

  let response = await fetch(url, {
    headers: {
      accept: "*/*",
      "accept-language": "id-ID,id",
      range: "bytes=0-",
      referer: "https://threads.net",
      "sec-ch-ua":
        '" Not;A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "video",
      "sec-fetch-mode": "no-cors",
      "sec-fetch-site": "cross-site",
    },
    body: null,
    method: "GET",
  });

  const responseInit = {
    headers: {
      "Content-Length": response.headers.get("Content-Length"),
      "Content-Type": "video/mp4",
      "Content-Disposition": 'attachment; filename="video.mp4"',
    },
  };

  return new Response(response.body, responseInit);
}
