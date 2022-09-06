import { useScroll } from "@use-gesture/react";
import Image from "next/image";
import React from "react";
import useMeasure from "react-use-measure";
import { trpc } from "../../utils/trpc";

type Props = {};

const DibsedPage = (props: Props) => {
  const [currentUserFilter, setCurrentUserFilter] = React.useState<
    string | null | undefined
  >(null);
  const [currentImg, setCurrentImg] = React.useState(0);
  const items = trpc.useQuery(["giveawayItem.getDibsed"]);

  const user = trpc.useQuery(["auth.getSession"]);

  const [ref, { width }] = useMeasure();

  const bindScroll = useScroll((state) => {
    setCurrentImg(Math.round(state.offset[0] / width));
  });

  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  return (
    <div className="px-9 py-4 flex flex-col items-center max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full">
        <button
          className="bg-[#1C2031] p-2 rounded-[6px] text-white font-bold"
          onClick={() => setCurrentUserFilter(null)}
        >
          Clear Filter
        </button>

        <p className="font-medium text-lg">
          Filter: {currentUserFilter ?? "None"}
        </p>
      </div>

      {items.data
        ?.filter((item) => {
          if (!currentUserFilter) return true;
          return item?.dibsByUser?.name === currentUserFilter;
        })
        .map((item) => (
          <div
            key={item.id}
            className="w-full my-[20px] border rounded-[6px] shadow pt-4 bg-[#1C2031]"
          >
            <h3 className="font-bold text-xl px-4 text-chartreuse">
              {item.name}
            </h3>
            <p
              className="font-medium text-lg px-4 text-chartreuse/60 hover:underline hover:cursor-pointer"
              onClick={() => setCurrentUserFilter(item.dibsByUser?.name)}
            >
              {item.dibsByUser?.name}
            </p>

            {/* Images */}
            <div className="relative mt-[20px] z-0 rounded-b-[6px] overflow-hidden">
              <div
                {...bindScroll()}
                ref={ref}
                className="aspect-square w-full flex overflow-x-scroll snap-mandatory snap-x shadow-md shadow-[#00000029] relative"
              >
                {item.images.map((image) => (
                  <div
                    key={image}
                    className="relative overflow-hidden aspect-square w-full snap-center flex-shrink-0"
                  >
                    <Image
                      src={image}
                      alt={"Image of " + item.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>

              {/* Indicator */}
              <div className="absolute flex items-center justify-center inset-x-0 bottom-[8px]">
                {item.images.map((_img, i) => (
                  <div
                    key={i}
                    className={`transition-colors rounded-full aspect-square w-[8px] mx-1 ${
                      currentImg === i ? "bg-[#1C2031]" : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DibsedPage;
