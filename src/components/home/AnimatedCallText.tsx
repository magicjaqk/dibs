import { a, config, useTrail } from "@react-spring/web";
import React from "react";

type Props = {};

const AnimatedCallText = (props: Props) => {
  const callString = "CALL".split("");

  const callTrail = useTrail(callString.length, {
    from: {
      rotateZ: -90,
      scale: 4,
      opacity: 0,
      y: -20,
      x: -40,
    },
    to: {
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      y: 0,
      x: 0,
    },
    config: { tension: 800, friction: 30, mass: 0.6 },
  });

  return (
    <div className="uppercase text-chartreuse text-[21pt] font-black -mb-3 tracking-[2.73pt] flex">
      {callTrail.map((style, i) => (
        <a.div key={i} style={{ ...style }}>
          {callString[i]}
        </a.div>
      ))}
    </div>
  );
};

export default AnimatedCallText;
