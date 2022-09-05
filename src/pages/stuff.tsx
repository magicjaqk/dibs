import { a, useTransition } from "@react-spring/web";
import React from "react";
import AvailableItems from "../components/stuff/AvailableItems";
import DibsedItems from "../components/stuff/DibsedItems";

type Props = {};

const StuffPage = (props: Props) => {
  const [showAvailable, setShowAvailable] = React.useState(true);
  const [animating, setAnimating] = React.useState(false);

  const pageTransitions = useTransition(showAvailable, {
    initial: {
      opacity: 0,
      x: "0vh",
    },
    from: {
      opacity: 0,
      x: showAvailable ? "-100vh" : "100vh",
    },
    enter: {
      opacity: 1,
      x: "0vh",
    },
    leave: {
      opacity: 0,
      position: "absolute",
      x: showAvailable ? "100vh" : "-100vh",
    },
    reverse: !showAvailable,
    onStart: () => setAnimating(true),
    onRest: () => setAnimating(false),
  });

  return (
    <>
      <div className="flex flex-col items-center justify-start space-y-4 max-w-lg mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#D0D1D4] h-[117.5px] flex w-full items-end justify-between pb-[14.5px] text-[#1F1F1F] text-lg leading-[24px] font-bold px-9">
          <button
            onClick={() => {
              if (!animating) setShowAvailable(true);
            }}
            className={`px-[18px] py-[9px] ${
              showAvailable ? "bg-[#8DCDFA]" : "bg-[#EAEAEA]"
            } rounded-[13px] transition-colors`}
          >
            Unclaimed Dibs
          </button>
          <button
            onClick={() => {
              if (!animating) setShowAvailable(false);
            }}
            className={`px-[28px] py-[9px] ${
              !showAvailable ? "bg-[#8DCDFA]" : "bg-[#EAEAEA]"
            } rounded-[13px] transition-colors`}
          >
            My Dibs
          </button>
        </div>

        {/* Body */}
        <div className="relative w-full">
          {pageTransitions((style, showAvailable) =>
            showAvailable ? (
              <a.div
                style={style}
                className="flex flex-col items-center pt-2 w-full"
              >
                <AvailableItems />
              </a.div>
            ) : (
              <a.div
                style={style}
                className="flex flex-col items-center pt-2 w-full"
              >
                <DibsedItems />
              </a.div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default StuffPage;
