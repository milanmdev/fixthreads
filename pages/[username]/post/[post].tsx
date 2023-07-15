import findPost from "@/props/findPost";
import RenderSeo from "@/props/render/seo";

interface ImageProps {
  url: string;
  width: number;
  height: number;
}

interface ParamProps {
  username: string;
  post: string;
}

interface PostProps {
  post: PostJson;
}

interface PostJson {
  description: string;
  title: string;
  images: ImageProps[];
  username: string;
  post: string;
  imageType: string;
}

export default function Post({ post }: PostProps) {
  if (!post) {
    return null;
  }

  return RenderSeo({ type: "post", content: post });
}

export async function getStaticProps({ params }: { params: ParamProps }) {
  let post = await findPost({ post: params.post });

  return {
    props: { post },
    notFound: false,
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
