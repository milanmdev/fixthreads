import { GlobalVars } from "./utils";

let proxies = process.env.PROXIES?.split(",") || [];

export default function renderSeo({ type, content }: DataProps) {
  if (!type || !content) {
    return "No type/content provided - this is not expected so if you're a client, report this to milan@milanm.org";
  }

  let url = `https://www.threads.net/${content.username}${
    content.post ? `/post/${content.post}` : ""
  }`;

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];

  let videoURL = "";
  if (content.video.length > 0) {
    videoURL = `https://${proxy}/${encodeURIComponent(content.video[0].url)}`;
  }

  if (content.userAgent.includes("Telegram")) content.video = [];

  if (
    content.description &&
    content.video.length > 0 &&
    content.description.length > 100
  ) {
    content.description = content.description.slice(0, 253) + "...";
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="canonical" href="${url}" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta property="og:site_name" content="${
          content.video.length > 0 ? content.description : GlobalVars.name
        }" />
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
            }" />
            ${content.images.map((img) => {
              return `<meta property="og:image" content="${img.url}" />`;
            })}`
            : `
            <meta name="twitter:card" content="player" />
            <meta name="twitter:player" content="${videoURL}" />
            <meta property="og:video" content="${videoURL}">
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
        )}&url=${encodeURIComponent(url)}&videoText=${
          content.video.length > 0
            ? encodeURIComponent(content.description)
            : ""
        }" type="application/json+oembed">
        <meta http-equiv="refresh" content="0;url=${url}" />
      </head>
    </html>
  `;
}
