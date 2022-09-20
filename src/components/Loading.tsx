import { useEffect, useState } from "react";
import { a, config, useSpring, useTransition } from "@react-spring/web";
import useMeasure from "react-use-measure";
import Image from "next/image";
import HandSVG from "../assets/hand-svg.svg";

type Props = {};

function Loading(props: Props) {
  const [barProgress, setBarProgress] = useState(0.6);
  const [isError, setIsError] = useState(false);
  const [ref, { width }] = useMeasure();

  const barSpring = useSpring({
    width: barProgress * width,
    config: config.molasses,
  });

  const transition = useTransition(isError, {
    initial: {
      opacity: 1,
      y: 0,
    },
    from: {
      opacity: 0,
      y: 50,
    },
    enter: {
      opacity: 1,
      y: 0,
    },
    leave: {
      opacity: 0,
      y: -50,
      position: "absolute",
    },
    config: config.default,
  });

  useEffect(() => {
    if (!width) return;
    setTimeout(() => {
      if (barProgress < 0.995) {
        const currentProgress = barProgress;
        const unfilledPortion = 1 - currentProgress;
        const percentToAdd = unfilledPortion / 8;

        setBarProgress(currentProgress + percentToAdd);
      } else {
        setIsError(true);
      }
    }, 800);
  }, [width, barProgress]);

  return transition((style, error) =>
    error ? (
      <a.div
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={style}
      >
        <a.p>Sorry, there&apos;s been an error.</a.p>
      </a.div>
    ) : (
      <a.div
        style={style}
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      >
        <Image
          height={83.63}
          width={75.81}
          src={HandSVG}
          alt={"A hand."}
          // Flip image
          style={{ transform: "rotateY(180deg)" }}
          className="scale-110 p-2"
        />
        <div className="w-full h-1 max-w-lg flex items-center justify-center relative my-2">
          <div
            ref={ref}
            className="w-full h-full rounded-full bg-gray-500 overflow-hidden"
          >
            <a.div
              style={barSpring}
              className="h-full bg-gradient-to-r from-chartreuse/50 to-chartreuse rounded-full"
            />
          </div>
        </div>
      </a.div>
    )
  );
}

export default Loading;
