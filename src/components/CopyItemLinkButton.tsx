import { a, config, useSpring, useTransition } from "@react-spring/web";
import React from "react";

type Props = {
  idToCopy: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CopyItemLinkButton = (props: Props) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const asyncCopyStateHandler = async () => {
    setIsCopied(true);
    await sleep(800);
    setIsCopied(false);
  };

  const handlePress = () => {
    try {
      if (navigator.clipboard.writeText)
        navigator.clipboard.writeText(
          process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/item/" + props.idToCopy
        );
      else {
        throw "No navigator.clipboard.writeText.";
      }

      asyncCopyStateHandler();
    } catch (err) {
      window.alert(err);
    }
  };

  const buttonSpring = useSpring({
    from: {
      scale: 1,
    },
    to: {
      scale: isPressed ? 0.75 : 1,
    },
    config: { mass: 1.5, tension: 800, friction: 30 },
  });

  const copiedTransition = useTransition(isCopied, {
    from: {
      opacity: 0,
      x: 10,
    },
    enter: {
      opacity: 1,
      x: 0,
    },
    leave: {
      opacity: 0,
      x: -10,
    },
    config: config.stiff,
  });

  return (
    <div className="flex relative items-center">
      {copiedTransition(
        (style, show) =>
          show && (
            <a.p
              style={style}
              className="text-gray-600 text-sm font-medium whitespace-nowrap px-1 absolute -left-20"
            >
              Copied Link
            </a.p>
          )
      )}

      <a.button
        style={buttonSpring}
        onClick={handlePress}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => {
          setIsPressed(true);
        }}
        onTouchEnd={() => {
          setIsPressed(false);
        }}
        className="relative text-gray-600 p-1 rounded-[3px]"
      >
        <svg
          className="w-5 aspect-square"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M13.544 10.456a4.368 4.368 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177" />
            <path d="M10.456 13.544a4.368 4.368 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823" />
          </g>
        </svg>
      </a.button>
    </div>
  );
};

export default CopyItemLinkButton;
