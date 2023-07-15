import { NextSeo } from "next-seo";
import { useEffect } from "react";

interface ImageProps {
  url: string;
  width: number;
  height: number;
}

interface VideoProps {
  url: string;
  width: number;
  height: number;
}

interface ContentProps {
  description: string;
  title: string;
  images: ImageProps[];
  username: string;
  post?: string;
  imageType: string;
  video?: VideoProps[];
}

interface DataProps {
  type: string;
  content: ContentProps;
}

export default function RenderSeo({ type, content }: DataProps) {
  if (!type || !content) {
    return "No type/content provided - this is not expected so if you're a client report this to milan@milanm.org";
  }

  let url = `https://www.threads.net/${content.username}${
    content.post ? `/post/${content.post}` : ""
  }`;

  /*useEffect(() => {
    window.location.assign(url);
  }, [content.username]);*/

  return (
    <main>
      <NextSeo
        title={content.title}
        description={content.description}
        canonical={url}
        openGraph={{
          url,
          title: content.title,
          description: content.description,
          images: content.images,
          videos: content.video ? content.video : [],
          siteName: "ThreadsFix - Consistent Embedding of Metadata for Threads",
        }}
        twitter={{
          cardType:
            content.imageType == "single" ? "summary" : "summary_large_image",
        }}
      />
      <meta httpEquiv="refresh" content={`0;url=${url}`} />
    </main>
  );
}
