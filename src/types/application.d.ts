interface ImageProps {
  url: string;
}

interface VideoProps {
  url: string;
}

interface ContentProps {
  description: string;
  title: string;
  images: ImageProps[];
  username: string;
  post?: string;
  imageType: string;
  video: VideoProps[];
}

interface DataProps {
  type: string;
  content: ContentProps;
}
