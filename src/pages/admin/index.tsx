import axios from "axios";
import Head from "next/head";
import React, { ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";
import { a, useSpring, config } from "@react-spring/web";
import Link from "next/link";
import AnimatedTitle from "../../components/AnimatedTitle";
import UploadForm from "../../components/admin/UploadForm";

type Props = {};

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Admin = (props: Props) => {
  const user = trpc.useQuery(["auth.getSession"]);

  /**
   * LOADING ANIMATION
   */
  const loadingSpring = useSpring({
    from: { rotate: 0 },
    to: { rotate: 360 * 1.5 },
    loop: true,
    config: config.wobbly,
  });

  /**
   * RENDER
   */
  if (!user.data && !user.error && user.isLoading)
    return (
      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative text-chartreuse bg-[#1C2031]">
        <a.div
          style={loadingSpring}
          className="w-40 aspect-square flex items-center justify-center overflow-hidden"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 23.8 25.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 7a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm-5.696 9.134a1 1 0 1 0 1.366.366a1 1 0 0 0-1.366-.366Zm11.392 0a1 1 0 1 0 .366 1.366a1 1 0 0 0-.366-1.366Zm2.914-2.791a4.918 4.918 0 0 0-4.526-1.197l-.419-.763a4.989 4.989 0 0 0-2.503-8.251a5.035 5.035 0 0 0-4.279.958A4.978 4.978 0 0 0 7 8a4.929 4.929 0 0 0 1.352 3.392l-.419.75a4.989 4.989 0 0 0-5.926 6.286a5.03 5.03 0 0 0 2.97 3.226a4.97 4.97 0 0 0 6.588-3.19l.867.014a4.981 4.981 0 0 0 4.76 3.524a5.017 5.017 0 0 0 4.8-3.573a4.95 4.95 0 0 0-1.382-5.086Zm-.528 4.495a3.006 3.006 0 0 1-4.386 1.76a2.965 2.965 0 0 1-1.352-1.705a1.994 1.994 0 0 0-1.91-1.43h-.869a1.995 1.995 0 0 0-1.91 1.43a2.98 2.98 0 0 1-3.948 1.899a2.993 2.993 0 0 1 1.767-5.704a1.967 1.967 0 0 0 2.173-.942l.436-.754a1.995 1.995 0 0 0-.281-2.369a2.98 2.98 0 0 1 .329-4.37a2.993 2.993 0 0 1 4.069 4.369a2 2 0 0 0-.283 2.37l.435.753a1.974 1.974 0 0 0 2.174.943a2.988 2.988 0 0 1 3.556 3.75Z"
            />
          </svg>
        </a.div>
      </div>
    );

  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  return (
    <>
      <Head>
        <title>Dibs Admin</title>
        <meta name="description" content="Upload items to give away!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center px-9 py-9 overflow-hidden relative bg-[#1C2031] text-white">
        <AnimatedTitle wordArray={["Get", "Rid", "of", "Shit"]} />

        <UploadForm />

        <Link href="/admin/dibsed">
          <a className="flex font-medium text-chartreuse items-center hover:bg-chartreuse/20 h-14 w-full max-w-xs justify-center rounded transition-colors">
            <p>Shit you are giving away</p>
            <svg
              className="aspect-square w-5 ml-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12h16m-7-7l7 7l-7 7"
              />
            </svg>
          </a>
        </Link>
      </div>
    </>
  );
};

export default Admin;
