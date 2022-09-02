import { a, config, useSpring, useTransition } from "@react-spring/web";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMove } from "@use-gesture/react";
import useMeasure from "react-use-measure";
import React from "react";

type Props = {
  animationComplete: boolean;
};

const SignInButton = (props: Props) => {
  const { status } = useSession();
  const [ref, { width, height, x, y }] = useMeasure();

  const [buttonSpring, api] = useSpring(() => ({
    from: {
      y: 0,
      x: 0,
    },
    config: config.stiff,
  }));

  const transition = useTransition(props.animationComplete, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
  });

  const bind = useMove((state) => {
    const xPercent = (state.xy[0] - x) / width - 0.5;
    const yPercent = (state.xy[1] - y) / height - 0.5;

    api.start({ x: xPercent * 35, y: yPercent * 20 });
  });

  const buttonText = React.useMemo(() => {
    switch (status) {
      case "unauthenticated":
        return "Sign In";
      case "loading":
        return "Loading...";
      case "authenticated":
        return "Sign Out";
      default:
        return "Loading...";
    }
  }, [status]);

  const handleClick = () => {
    if (status === "authenticated") {
      signOut();
    }

    signIn("google", {
      callbackUrl: "/stuff",
    });
  };

  if (!props.animationComplete) return null;

  return transition(
    (style, item) =>
      item && (
        <a.button
          ref={ref}
          {...bind()}
          style={{ ...buttonSpring, ...style }}
          onClick={handleClick}
          onMouseLeave={() => api.start({ x: 0, y: 0 })}
          className="w-full h-full rounded-full text-white font-bold bg-emerald-500 text-lg"
        >
          {buttonText}
        </a.button>
      )
  );
};

export default SignInButton;
