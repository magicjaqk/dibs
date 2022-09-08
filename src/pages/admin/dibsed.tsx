import { GiveawayItem, User } from "@prisma/client";
import { useScroll } from "@use-gesture/react";
import Image from "next/image";
import React from "react";
import useMeasure from "react-use-measure";
import { trpc } from "../../utils/trpc";

type Props = {};

type DibsedItemCardProps = {
  item: GiveawayItem & {
    dibsByUser: User | null;
  };
  setCurrentUserFilter: (name: string | null | undefined) => void;
};

const DibsedItemCard = ({ item, ...props }: DibsedItemCardProps) => {
  const [currentImg, setCurrentImg] = React.useState(0);
  const [ref, { width }] = useMeasure();

  const itemMutation = trpc.useMutation(["giveawayItem.update"]);
  const itemQuery = trpc.useQuery(["giveawayItem.get", { itemId: item.id }]);

  const bindScroll = useScroll((state) => {
    setCurrentImg(Math.round(state.offset[0] / width));
  });

  const toggleReceived = async () => {
    if (
      itemMutation.status === "loading" ||
      itemMutation.status === "error" ||
      itemQuery.status === "loading" ||
      itemQuery.status === "error"
    )
      return;

    itemMutation.mutate(
      {
        id: item.id,
        receivedByDibser: !itemQuery.data?.receivedByDibser,
      },
      {
        onSuccess: () => itemQuery.refetch(),
        onError: (err) => window.alert(err),
      }
    );
  };

  return (
    <div
      key={item.id}
      className="w-full my-[20px] border rounded-[6px] shadow pt-4 bg-[#1C2031]"
    >
      <div className="flex items-center justify-between px-4">
        <h3 className="font-bold text-xl text-chartreuse">{item.name}</h3>

        <button
          onClick={toggleReceived}
          className="aspect-square w-5 rounded-[3px] border-2 border-chartreuse relative"
        >
          {itemQuery.data?.receivedByDibser && (
            <div className="w-full h-full bg-chartreuse flex items-center justify-center relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="m4 12l6 6L20 6"
                />
              </svg>
            </div>
          )}
        </button>
      </div>
      <p
        className="font-medium w-min whitespace-nowrap text-lg px-4 text-chartreuse/60 hover:underline hover:cursor-pointer"
        onClick={() => props.setCurrentUserFilter(item.dibsByUser?.name)}
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
  );
};

const DibsedPage = (props: Props) => {
  const [currentUserFilter, setCurrentUserFilter] = React.useState<
    string | null | undefined
  >(null);

  const items = trpc.useQuery(["giveawayItem.getDibsed"]);

  const user = trpc.useQuery(["auth.getSession"]);

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
          <DibsedItemCard
            key={item.id}
            item={item}
            setCurrentUserFilter={setCurrentUserFilter}
          />
        ))}
    </div>
  );
};

export default DibsedPage;
