import { a, config, useTransition } from "@react-spring/web";
import React from "react";

type Props = {
  show: boolean;
};

const SuccessfulToast = (props: Props) => {
  const transition = useTransition(props.show, {
    from: {
      opacity: 0,
      y: 100,
      // scale: 0,
    },
    enter: {
      opacity: 1,
      y: 0,
      // scale: 1,
    },
    leave: {
      opacity: 0,
      y: 100,
      // scale: 0,
    },
    config: config.default,
  });

  return transition(
    (style, item) =>
      item && (
        <a.div
          style={style}
          className="absolute bottom-6 z-50 inset-x-0 mx-auto w-full max-w-sm rounded-md h-20 shadow-lg bg-gradient-to-r from-emerald-500 to-sky-500 font-extrabold text-white flex items-center justify-center"
        >
          <p className="drop-shadow text-2xl">Successful upload!</p>
        </a.div>
      )
  );
};

export default SuccessfulToast;
