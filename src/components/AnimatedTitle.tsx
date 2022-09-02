import React from "react";
import {
  a,
  useSpring,
  useSpringRef,
  useChain,
  config,
} from "@react-spring/web";

type Props = {
  wordArray: [string, string, string, string];
};

const AnimatedTitle = (props: Props) => {
  /**
   * TITLE ANIMATION
   */
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

  useChain(
    [callSpringRef, dibsSpringRef, onSpringRef, stuffSpringRef],
    [0.5, 0.7, 0.9, 1.1],
    500
  );

  return (
    <div className="text-4xl sm:text-6xl font-bold flex space-x-2.5 sm:space-x-3">
      <a.h1 style={callSpring}>{props.wordArray[0]}</a.h1>
      <a.h1
        style={dibsSpring}
        className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold"
      >
        {props.wordArray[1]}
      </a.h1>
      <a.h1 style={onSpring}>{props.wordArray[2]}</a.h1>
      <a.h1
        style={stuffSpring}
        className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent font-extrabold"
      >
        {props.wordArray[3]}
      </a.h1>
    </div>
  );
};

export default AnimatedTitle;
