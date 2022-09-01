import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, status } = useSession();
  const user = trpc.useQuery(["auth.getSession"]);

  return (
    <>
      <Head>
        <title>Dibs</title>
        <meta
          name="description"
          content="Call dibs on things that Andrew and Mayra are getting rid of."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll">
        <h1 className="text-5xl font-bold">
          Call{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold">
            Dibs{" "}
          </span>
          on{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold">
            Stuff
          </span>
        </h1>

        <div className="flex flex-col space-y-2 items-start w-full max-w-lg my-4">
          {data?.user ? (
            <>
              <p>Hey, {data.user.name}</p>
              <button
                className="p-3 px-4 rounded bg-sky-500 hover:bg-sky-600 transition-colors text-white font-semibold"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="p-3 px-4 rounded bg-sky-500 hover:bg-sky-600 transition-colors text-white font-semibold"
                onClick={() => signIn("google")}
              >
                Sign In
              </button>
            </>
          )}
          <Link href="/stuff">
            <a className="hover:underline text-emerald-600 font-medium">
              See Stuff
            </a>
          </Link>

          {user.data?.admin && (
            <Link href="/admin">
              <a className="hover:underline text-emerald-600 font-medium">
                Add stuff
              </a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
