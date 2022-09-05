import { useScroll } from "@use-gesture/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import useMeasure from "react-use-measure";
import { trpc } from "../../utils/trpc";

type Props = {
  id: string;
  name: string;
  images: string[];
  description: string;
  refetchList: () => void;
};

const GiveAwayItemCard = (props: Props) => {
  const [currentImg, setCurrentImg] = React.useState(0);
  const [ref, { width }] = useMeasure();
  const session = useSession();

  const item = trpc.useQuery(["giveawayItem.get", { itemId: props.id }]);
  const { mutate: dibs } = trpc.useMutation(["giveawayItem.dibs"]);
  const { mutate: undibs } = trpc.useMutation(["giveawayItem.undibs"]);

  const handleDibs = () => {
    if (!item.data?.dibsByUserEmail) {
      dibs(
        { id: props.id },
        {
          onSuccess: () => item.refetch(),
          onError: (e) => window.alert(e.message),
        }
      );
    } else {
      undibs(
        { id: props.id },
        {
          onSuccess: () => item.refetch(),
          onError: (e) => window.alert(e.message),
        }
      );
    }

    props.refetchList();
  };

  const dibsText = () => {
    if (item.isLoading && !item.data && !item.error) {
      return "Loading...";
    } else if (item.data?.dibsByUserEmail === session.data?.user?.email) {
      return "undibs";
    } else if (item.data?.dibsByUserEmail) {
      return "dibsed";
    } else {
      return "call dibs";
    }
  };

  const bindScroll = useScroll((state) => {
    setCurrentImg(Math.round(state.offset[0] / width));
  });

  return (
    <div className="w-full flex flex-col py-[30.5px] border-b px-9">
      {/* Title */}
      <h1 className="text-[22px] w-full font-black">{props.name}</h1>

      {/* Images */}
      <div className="relative my-[20px]">
        <div
          {...bindScroll()}
          ref={ref}
          className="aspect-square w-full flex overflow-x-scroll snap-mandatory snap-x rounded-[6px] shadow-md shadow-[#00000029] relative"
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
      </div>

      <p className="leading-[22px] mb-[20px]">{props.description}</p>

      <button
        onClick={handleDibs}
        className="w-full rounded-[13px] shadow-lg bg-chartreuse font-bold p-2 text-[#1C2031] uppercase text-lg h-12"
      >
        {dibsText()}
      </button>
    </div>
  );
};

export default GiveAwayItemCard;
