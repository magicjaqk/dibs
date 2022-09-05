import { a, config, useSpring, useTransition } from "@react-spring/web";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMove } from "@use-gesture/react";
import useMeasure from "react-use-measure";
import React from "react";

type Props = {};

const SignInButton = (props: Props) => {
  const [show, setShow] = React.useState(false);
  const { status } = useSession();
  const [ref, { width, height, x, y }] = useMeasure();

  const [buttonSpring, api] = useSpring(() => ({
    from: {
      y: 0,
      x: 0,
    },
    config: config.stiff,
  }));

  const transition = useTransition(show, {
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

  React.useEffect(() => setShow(true), []);

  return transition(
    (style, item) =>
      item && (
        <a.button
          ref={ref}
          {...bind()}
          style={{ ...buttonSpring, ...style }}
          onClick={handleClick}
          onMouseLeave={() => api.start({ x: 0, y: 0 })}
          className="uppercase bg-chartreuse text-[#1C2031] rounded-[20px] shadow shadow-[#00000029] w-[208px] h-[64px] font-black text-[21px] tracking-[0.9px] leading-7 mt-11"
        >
          {buttonText}
        </a.button>
      )
  );
};

export default SignInButton;
