import { GlobalVars } from "./utils";

let proxies = process.env.PROXIES?.split(",") || [];

export default function renderSeo({ type, content }: DataProps) {
  if (!type || !content) {
    return "No type/content provided - this is not expected so if you're a client report this to milan@milanm.org";
  }

  let url = `https://www.threads.net/${content.username}${
    content.post ? `/post/${content.post}` : ""
  }`;

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];

  let videoURL = "";
  if (content.video.length > 0) {
    videoURL = `https://${proxy}/${encodeURIComponent(content.video[0].url)}`;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="canonical" href="${url}" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta property="og:site_name" content="${GlobalVars.name}" />
        <meta
          property="og:description"
          content="${content.description}"
        />
        <meta property="og:title" content="${content.title}">

        ${
          content.video.length == 0
            ? `
            <meta name="twitter:card" content="${
              content.imageType == "carousel"
                ? "summary_large_image"
                : "summary"
            } />
            <meta property="og:image" content="${content.images[0].url}" />`
            : `
            <meta name="twitter:card" content="player" />
            <meta name="twitter:player" content="${videoURL}" />
            <meta property="og:video:url" content="${videoURL}">
            <meta property="og:video:secure_url" content="${videoURL}">
            <meta property="og:video:type" content="video/mp4">
            `
        }

        <link href="${
          process.env.ENVIRONMENT == "production"
            ? "https://fixthreads.net"
            : "https://local.milanm.cc"
        }/oembed?text=${encodeURIComponent(
    content.oembedStat
  )}&url=${encodeURIComponent(url)}" type="application/json+oembed">
        <meta http-equiv="refresh" content="0;url=${url}" />
      </head>
    </html>
  `;
}
