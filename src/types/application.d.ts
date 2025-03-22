interface ImageProps {
  url: string;
}

interface VideoProps {
  url: string;
  type?: string;
}

interface ContentProps {
  description: string;
  title: string;
  images: ImageProps[];
  username: string;
  post?: string;
  imageType: string;
  video: VideoProps[];
  oembedStat: string;
  quotedPost?: QuotedPostProps;
  userAgent: string;
}

interface DataProps {
  type: string;
  content: ContentProps;
}

interface OembedPostProps {
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  title: string;
  type: string;
  version: string;
}

interface QuotedPostProps {
  username: string;
  caption: string;
  quoted: boolean;
}
