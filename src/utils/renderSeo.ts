export default function renderSeo({ type, content }: DataProps) {
  if (!type || !content) {
    return "No type/content provided - this is not expected so if you're a client report this to milan@milanm.org";
  }

  let url = `https://www.threads.net/${content.username}${
    content.post ? `/post/${content.post}` : ""
  }`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="canonical" href="${url}" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta property="og:site_name" content="FixThreads - Consistent Embedding of Metadata for Threads" />
        <meta
          property="og:description"
          content="${content.description}"
        />
        <meta property="og:title" content="${content.title}">

        <meta name="twitter:card" content="${
          content.imageType == "carousel" ? "summary_large_image" : "summary"
        }" />
        <meta property="og:image" content="${content.images[0].url}" />

        <meta http-equiv="refresh" content="0;url=${url}" />
      </head>
    </html>
  `;
}
