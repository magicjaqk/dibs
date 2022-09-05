import { useScroll } from "@use-gesture/react";
import { useSession } from "next-auth/react";
import {
  a,
  config,
  useChain,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web";
import Image from "next/image";
import React from "react";
import useMeasure from "react-use-measure";
import { trpc } from "../../utils/trpc";
import HandSVG from "../../assets/hand-svg.svg";

type Props = {
  id: string;
  name: string;
  images: string[];
  description: string;
};

const GiveAwayItemCard = (props: Props) => {
  const [currentImg, setCurrentImg] = React.useState(0);
  const [isDibsed, setIsDibsed] = React.useState(false);

  const [ref, { width }] = useMeasure();

  const item = trpc.useQuery(["giveawayItem.get", { itemId: props.id }]);
  const { mutate: dibs, isLoading: dibsLoading } = trpc.useMutation([
    "giveawayItem.dibs",
  ]);
  const { mutate: undibs, isLoading: undibsLoading } = trpc.useMutation([
    "giveawayItem.undibs",
  ]);

  const handleDibs = () => {
    if (!item.data?.dibsByUserEmail) {
      setIsDibsed(true);
      dibs(
        { id: props.id },
        {
          onSuccess: () => item.refetch(),
          onError: (e) => {
            window.alert(e.message);
            setIsDibsed(false);
          },
        }
      );
    } else {
      setIsDibsed(false);
      undibs(
        { id: props.id },
        {
          onSuccess: () => item.refetch(),
          onError: (e) => {
            window.alert(e.message);
            setIsDibsed(true);
          },
        }
      );
    }
  };

  const dibsText = () => {
    if (dibsLoading || undibsLoading) {
      return "Loading...";
    } else if (isDibsed) {
      return "Undo Dibs";
    } else {
      return "Call Dibs";
    }
  };

  const bindScroll = useScroll((state) => {
    setCurrentImg(Math.round(state.offset[0] / width));
  });

  const overlayRef = useSpringRef();
  const overlayTransition = useTransition(isDibsed, {
    ref: overlayRef,
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    config: config.default,
  });

  const handSpringRef = useSpringRef();
  const handTransition = useTransition(isDibsed, {
    ref: handSpringRef,
    from: {
      x: 30,
      y: 50,
      opacity: 0,
    },
    enter: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    leave: {
      x: -30,
      y: -50,
      opacity: 0,
    },
    config: { mass: 1.5, tension: 800, friction: 25 },
  });

  const dibsSpringRef = useSpringRef();
  const dibsTransition = useTransition(isDibsed, {
    ref: dibsSpringRef,
    from: {
      x: -100,
      opacity: 0,
    },
    enter: {
      x: 0,
      opacity: 1,
    },
    leave: {
      x: 100,
      opacity: 0,
    },
    config: { mass: 1, tension: 800, friction: 40 },
  });

  useChain(
    isDibsed
      ? [overlayRef, dibsSpringRef, handSpringRef]
      : [handSpringRef, dibsSpringRef, overlayRef],
    isDibsed ? [0, 0.2, 0.35] : [0, 0.1, 0.2]
  );

  return (
    <div className="w-full flex flex-col py-[30.5px] border-b px-9">
      {/* Title */}
      <h1 className="text-[22px] w-full font-black">{props.name}</h1>

      {/* Images */}
      <div className="relative my-[20px] z-0 rounded-[6px] overflow-hidden">
        <div
          {...bindScroll()}
          ref={ref}
          className="aspect-square w-full flex overflow-x-scroll snap-mandatory snap-x shadow-md shadow-[#00000029] relative"
        >
          {props.images.map((image) => (
            <div
              key={image}
              className="relative overflow-hidden aspect-square w-full snap-center flex-shrink-0"
            >
              <Image
                src={image}
                alt={"Image of " + props.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>

        {/* Indicator */}
        <div className="absolute flex items-center justify-center inset-x-0 bottom-[8px]">
          {props.images.map((_img, i) => (
            <div
              key={i}
              className={`transition-colors rounded-full aspect-square w-[8px] mx-1 ${
                currentImg === i ? "bg-[#1C2031]" : "bg-white"
              }`}
            />
          ))}
        </div>

        {/* Dibsed Overlay */}
        {overlayTransition(
          (style, showOverlay) =>
            showOverlay && (
              <a.div
                style={style}
                className="absolute z-50 inset-0 w-full h-full bg-[#1C2031]/75 flex flex-col items-center justify-center"
              >
                {handTransition(
                  (handStyle, showHand) =>
                    showHand && (
                      <a.div
                        style={handStyle}
                        className="relative w-[90px] h-[104px]"
                      >
                        <Image
                          src={HandSVG}
                          alt="Dibs hand icon."
                          layout="fill"
                          objectFit="contain"
                          // Flip image
                          style={{ transform: "rotateY(180deg)" }}
                        />
                      </a.div>
                    )
                )}

                {dibsTransition(
                  (dibsStyle, showDibs) =>
                    showDibs && (
                      <a.p
                        style={dibsStyle}
                        className="lowercase font-black italic text-[41px] leading-[55px] text-white"
                      >
                        dibbed!
                      </a.p>
                    )
                )}
              </a.div>
            )
        )}
      </div>

      <p className="leading-[22px] mb-[20px]">{props.description}</p>

      <button
        onClick={handleDibs}
        className={`w-full rounded-[13px] ${
          isDibsed ? "bg-[#EAEAEA]" : "bg-chartreuse shadow-lg"
        } font-bold p-2 text-[#1C2031] uppercase text-lg h-12 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={dibsLoading || undibsLoading || item.isLoading}
      >
        {dibsText()}
      </button>
    </div>
  );
};

export default GiveAwayItemCard;
