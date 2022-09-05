import React from "react";
import { a, config, useSpring, useTrail } from "@react-spring/web";
import useMeasure from "react-use-measure";

type Props = {};

const DibsedItems = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [ref, { width }] = useMeasure();

  const wrapperSpring = useSpring({
    from: {
      width: 50,
    },
    to: {
      width: isOpen ? width * 0.9 : 50,
    },
    config: { mass: 0.6, tension: 500, friction: 70 },
  });

  return (
    <>
      <a.div
        style={wrapperSpring}
        className="fixed inset-y-0 right-0 h-screen z-50 bg-gradient-to-t from-emerald-500 to-sky-500"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-0 inset-y-0 w-[50px] h-full"
        >
          <p className="font-bold uppercase -rotate-90 whitespace-nowrap text-sky-900">
            My Dibs
          </p>
        </button>
      </a.div>

      {/* Screen width div */}
      <div ref={ref} className="w-screen -z-50" />
    </>
  );
};

export default DibsedItems;
