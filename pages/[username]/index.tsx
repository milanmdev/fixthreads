import findUser from "@/props/findUser";
import RenderSeo from "@/props/render/seo";

interface ImageProps {
  url: string;
  width: number;
  height: number;
}

interface ParamProps {
  username: string;
}

interface UserProps {
  user: UserJson;
}

interface UserJson {
  description: string;
  title: string;
  images: ImageProps[];
  username: string;
  imageType: string;
}

export default function User({ user }: UserProps) {
  if (!user) {
    return null;
  }

  return RenderSeo({ type: "user", content: user });
}

export async function getStaticProps({ params }: { params: ParamProps }) {
  let user = await findUser({ username: params.username });
  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user },
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
