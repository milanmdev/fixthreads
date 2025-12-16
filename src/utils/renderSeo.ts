import { GlobalVars } from "./utils";
import escape from "escape-html";

let proxies = process.env.PROXIES?.split(",") || [];

export default function renderSeo({ type, content }: DataProps) {
  if (!type || !content) {
    return "No type/content provided - this is not expected so if you're a client, report this to milan@milanm.org";
  }

  let url = `https://www.threads.com/${content.username}${
    content.post ? `/post/${content.post}` : ""
  }`;

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];

  let videoURL = "";
  if (content.video.length > 0) {
    if (content.video[0].type == "ddinstagram") {
      videoURL = content.video[0].url;
    } else if (content.video[0].type == "instagram") {
      if (proxy && proxies.length > 0) {
        videoURL = `https://${proxy}/${encodeURIComponent(content.video[0].url)}`;
      } else {
        videoURL = content.video[0].url;
      }
    } else {
      videoURL = content.video[0].url;
    }
  }

  if (content.userAgent.includes("Telegram")) content.video = [];

  if (content.description) content.description = escape(content.description);
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
            ${content.images
              .map((img) => {
                return `<meta property="og:image" content="${img.url}" />`;
              })
              .join("")}`
            : `
            <meta name="twitter:card" content="player" />
            <meta name="twitter:player" content="${videoURL}" />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
            <meta name="twitter:player:stream" content="${videoURL}" />
            <meta name="twitter:player:stream:content_type" content="video/mp4" />
            <meta property="og:video" content="${videoURL}">
            <meta property="og:video:url" content="${videoURL}">
            <meta property="og:video:secure_url" content="${videoURL}">
            <meta property="og:video:type" content="video/mp4">
            <meta property="og:video:width" content="1280">
            <meta property="og:video:height" content="720">
            ${content.images && content.images.length > 0
              ? `<meta property="og:image" content="${content.images[0].url}" />
            <meta name="twitter:image" content="${content.images[0].url}" />`
              : ""
            }
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
