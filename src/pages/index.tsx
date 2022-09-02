import type { NextPage } from "next";
import Head from "next/head";
import {
  a,
  useSpring,
  config,
  useSpringRef,
  useChain,
  useTransition,
} from "@react-spring/web";
import SignInButton from "../components/SignInButton";
import React from "react";

const Home: NextPage = () => {
  // const { data, status } = useSession();
  // const user = trpc.useQuery(["auth.getSession"]);
  const [animationComplete, setAnimationComplete] = React.useState(false);

  const callSpringRef = useSpringRef();
  const callSpring = useSpring({
    from: {
      y: -100,
      opacity: 0,
    },
    to: {
      y: 0,
      opacity: 1,
    },
    ref: callSpringRef,
    config: { mass: 2, tension: 800, friction: 50 },
  });

  const dibsSpringRef = useSpringRef();
  const dibsSpring = useSpring({
    from: {
      rotateZ: -45,
      opacity: 0,
      scale: 2.5,
    },
    to: {
      rotateZ: 0,
      opacity: 1,
      scale: 1,
    },
    ref: dibsSpringRef,
    config: { mass: 2, tension: 800, friction: 40 },
  });

  const onSpringRef = useSpringRef();
  const onSpring = useSpring({
    from: {
      x: -30,
      opacity: 0,
    },
    to: {
      x: 0,
      opacity: 1,
    },
    ref: onSpringRef,
    config: { mass: 2, tension: 900, friction: 50 },
  });

  const stuffSpringRef = useSpringRef();
  const stuffSpring = useSpring({
    from: {
      rotateZ: -90,
      x: -10,
      y: -80,
      opacity: 0,
    },
    to: {
      rotateZ: 0,
      x: 0,
      y: 0,
      opacity: 1,
    },
    ref: stuffSpringRef,
    config: { mass: 2, tension: 900, friction: 35 },
  });

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

  useChain(
    [
      callSpringRef,
      dibsSpringRef,
      onSpringRef,
      stuffSpringRef,
      // exploreSpringRef,
    ],
    [0, 0.2, 0.4, 0.6, 1]
  );

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
        <div className="text-4xl sm:text-6xl font-bold flex space-x-2.5 sm:space-x-3">
          <a.h1 style={callSpring}>Call</a.h1>
          <a.h1
            style={dibsSpring}
            className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold"
          >
            Dibs
          </a.h1>
          <a.h1 style={onSpring}>on</a.h1>
          <a.h1
            style={stuffSpring}
            className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold"
          >
            Stuff
          </a.h1>
        </div>

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
