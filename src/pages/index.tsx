import type { NextPage } from "next";
import Head from "next/head";
import {
  a,
  useSpring,
  config,
  useSpringRef,
  useChain,
} from "@react-spring/web";
import SignInButton from "../components/SignInButton";
import React from "react";
import Image from "next/image";
import HandSVG from "../assets/hand-svg.svg";
import AnimatedCallText from "../components/home/AnimatedCallText";

const Home: NextPage = () => {
  const dibs1Ref = useSpringRef();
  const dibs1Spring = useSpring({
    ref: dibs1Ref,
    from: {
      x: 300,
      opacity: 0,
      skewX: -50,
    },
    to: {
      x: 0,
      opacity: 1,
      skewX: 0,
    },
    config: { ...config.wobbly, friction: 20 },
  });

  const dibs2Ref = useSpringRef();
  const dibs2Spring = useSpring({
    ref: dibs2Ref,
    from: {
      x: -300,
      opacity: 0,
      skewX: 50,
    },
    to: {
      x: 0,
      opacity: 1,
      skewX: 0,
    },
    config: { ...config.wobbly, friction: 20 },
  });

  const dibs3Ref = useSpringRef();
  const dibs3Spring = useSpring({
    ref: dibs3Ref,
    from: {
      x: 300,
      opacity: 0,
      skewX: -50,
    },
    to: {
      x: 0,
      opacity: 1,
      skewX: 0,
    },
    config: { ...config.wobbly, friction: 20 },
  });

  const hand1Ref = useSpringRef();
  const hand1Spring = useSpring({
    ref: hand1Ref,
    from: {
      rotate: 90,
      opacity: 0,
      x: 150,
    },
    to: {
      rotate: 0,
      opacity: 1,
      x: 0,
    },
    config: config.wobbly,
  });

  const hand2Ref = useSpringRef();
  const hand2Spring = useSpring({
    ref: hand2Ref,
    from: {
      rotate: -90,
      opacity: 0,
      x: -150,
    },
    to: {
      rotate: 0,
      opacity: 1,
      x: 0,
    },
    config: config.wobbly,
  });

  const hand3Ref = useSpringRef();
  const hand3Spring = useSpring({
    ref: hand3Ref,
    from: {
      rotate: 90,
      opacity: 0,
      x: 150,
    },
    to: {
      rotate: 0,
      opacity: 1,
      x: 0,
    },
    config: config.wobbly,
  });

  const textRef = useSpringRef();
  const textSpring = useSpring({
    ref: textRef,
    from: {
      opacity: 0,
      scale: 0,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
    config: config.default,
  });

  useChain(
    [dibs1Ref, hand1Ref, dibs2Ref, hand2Ref, dibs3Ref, hand3Ref, textRef],
    [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.87]
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

      <div className="w-screen min-h-screen flex flex-col justify-center items-center overflow-x-hidden relative bg-[#1C2031] p-4">
        <AnimatedCallText />

        <div className="relative">
          <a.h1
            style={dibs1Spring}
            className="lowercase text-white text-[81pt] italic font-black px-2"
          >
            dibs!
          </a.h1>

          <a.div style={hand1Spring} className="absolute top-0 -right-10">
            <Image
              height={83.63}
              width={75.81}
              src={HandSVG}
              alt={"A hand."}
              // Flip image
              style={{ transform: "rotateY(180deg)" }}
            />
          </a.div>
        </div>

        <div className="relative">
          <a.h1
            style={dibs2Spring}
            className="lowercase text-white text-[81pt] italic font-black -my-12 px-2"
          >
            dibs!
          </a.h1>

          <a.div style={hand2Spring} className="absolute -top-8 -left-6">
            <Image
              height={83.63}
              width={75.81}
              src={HandSVG}
              alt={"A hand."}
              // Flip image
              // style={{ transform: "rotateY(180deg)" }}
            />
          </a.div>
        </div>

        <div className="relative mb-5">
          <a.h1
            style={dibs3Spring}
            className="lowercase text-white text-[81pt] italic font-black px-2"
          >
            dibs!
          </a.h1>

          <a.div style={hand3Spring} className="absolute top-10 -right-10">
            <Image
              height={83.63}
              width={75.81}
              src={HandSVG}
              alt={"A hand."}
              // Flip image
              style={{ transform: "rotateY(180deg)" }}
            />
          </a.div>
        </div>

        <a.div style={textSpring} className="flex flex-col items-center">
          <p className="text-white text-lg text-center font-medium leading-6 max-w-[308px]">
            A place to get the stuff that Mayra and Andrew want to get rid of
            before their big move to Massachusetts.
          </p>

          <SignInButton />
        </a.div>
      </div>
    </>
  );
};

export default Home;
