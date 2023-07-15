import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="absolute top-0 left-0 p-5">
        <FaGithub className="text-white text-3xl" />
      </div>
      <div className="my-auto mx-auto font-bold">
        <h1 className="text-3xl bg-gradient-to-r from-fuchsia-700 to-orange-500 bg-clip-text text-transparent">
          Consistent Embedding of Metadata for Threads
        </h1>
        <div className="ml-6 flex text-xl">
          <span className="font-semibold bg-gradient-to-r from-fuchsia-700 to-orange-500 bg-clip-text text-transparent text-xl mr-2">
            1.
          </span>
          Paste your threads.net link into the place where you are going to send
          it
        </div>
        <div className="ml-6 flex text-xl">
          <span className="font-semibold bg-gradient-to-r from-fuchsia-600 to-orange-700 bg-clip-text text-transparent text-xl mr-2">
            2.
          </span>
          Append{" "}
          <code className="bg-gray-600 p-1 rounded text-sm mx-1">fix</code>{" "}
          before threads.net - (It should look something like
          <span className="bg-gradient-to-r from-fuchsia-800 to-orange-400 bg-clip-text text-transparent mx-1.5">
            www.fixthreads.net/...
          </span>
          )
        </div>
      </div>
    </main>
  );
}
