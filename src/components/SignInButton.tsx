import { a, config, useSpring, useTransition } from "@react-spring/web";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMove } from "@use-gesture/react";
import useMeasure from "react-use-measure";
import React from "react";
import { useRouter } from "next/router";

type Props = {};

const SignInButton = (props: Props) => {
  const { status } = useSession();
  const [ref, { width, height, x, y }] = useMeasure();

  const router = useRouter();

  const [buttonSpring, api] = useSpring(() => ({
    from: {
      scale: 1,
    },
    config: { mass: 1.5, tension: 800, friction: 30 },
  }));

  const signOutButtonSpring = useSpring({
    from: {
      height: 0,
    },
    to: {
      height: height,
    },
  });

  const buttonText = React.useMemo(() => {
    switch (status) {
      case "unauthenticated":
        return "Sign In";
      case "loading":
        return "Loading...";
      case "authenticated":
        return "See Stuff";
      default:
        return "Loading...";
    }
  }, [status]);

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("/stuff");
      return;
    }

    signIn("google", {
      callbackUrl: "/stuff",
    });
  };

  return (
    <>
      <a.button
        style={buttonSpring}
        onClick={handleClick}
        onMouseEnter={() => api.start({ scale: 1.1 })}
        onMouseLeave={() => api.start({ scale: 1 })}
        onTouchStart={() => api.start({ scale: 0.9 })}
        onTouchEnd={() => api.start({ scale: 1 })}
        disabled={status === "loading"}
        className="uppercase bg-chartreuse text-[#1C2031] rounded-[20px] shadow shadow-[#00000029] w-[208px] h-[64px] font-black text-[21px] tracking-[0.9px] leading-7 mt-11 disabled:opacity-50"
      >
        {buttonText}
      </a.button>
      {status === "authenticated" && (
        <a.button
          ref={ref}
          onClick={() => signOut()}
          style={signOutButtonSpring}
          className="text-sm font-medium text-chartreuse/80 hover:underline uppercase mt-6"
        >
          Sign Out
        </a.button>
      )}
    </>
  );
};

export default SignInButton;
