import type { NextPage } from "next";
import Head from "next/head";
import { a, useSpring, config } from "@react-spring/web";
import SignInButton from "../components/SignInButton";
import React from "react";
// import { trpc } from "../utils/trpc";
// import { useRouter } from "next/router";
import AnimatedTitle from "../components/AnimatedTitle";

const Home: NextPage = () => {
  const [animationComplete, setAnimationComplete] = React.useState(false);

  // const user = trpc.useQuery(["auth.getSession"]);
  // const router = useRouter();

  // If signed in, push to respective pages.
  // if (user.data?.user) {
  //   router.push(user.data.admin ? "/admin" : "/stuff");
  // }

  // const exploreSpringRef = useSpringRef();
  const exploreSpring = useSpring({
    from: {
      height: 0,
    },
    to: {
      height: 300,
    },
    // ref: exploreSpringRef,
    delay: 2000,
    config: config.gentle,
    onRest: () => setAnimationComplete(true),
  });

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

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative">
        <AnimatedTitle wordArray={["Call", "Dibs", "on", "Stuff"]} />

        <a.div
          style={exploreSpring}
          className="w-full max-w-lg overflow-hidden relative"
        >
          <div className="flex flex-col items-center justify-center absolute inset-0 w-full h-[300px]">
            <p className="text-center font-medium text-lg">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-bold">
                Dibs
              </span>
              ! A place to get the{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-bold">
                stuff
              </span>{" "}
              that Mayra and Andrew want to get rid of before their big move to
              Massachusetts.
            </p>

            <div className="h-16 mt-10 mb-14 w-80 relative">
              <SignInButton animationComplete={animationComplete} />
            </div>
          </div>
        </a.div>
      </div>
    </>
  );
};

export default Home;
