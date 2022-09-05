import { a, useTransition } from "@react-spring/web";
import React from "react";
import GiveAwayItemCard from "../components/stuff/GiveawayItemCard";
import { trpc } from "../utils/trpc";

type Props = {};

const StuffPage = (props: Props) => {
  const [showAvailable, setShowAvailable] = React.useState(true);

  const availableItems = trpc.useQuery(["giveawayItem.getAvailable"]);
  const dibsedItems = trpc.useQuery(["giveawayItem.getDibsed"]);

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
    reverse: showAvailable,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-start space-y-4 max-w-lg mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#D0D1D4] h-[117.5px] flex w-full items-end justify-between pb-[14.5px] text-[#1F1F1F] text-lg leading-[24px] font-bold px-9">
          <button
            onClick={() => setShowAvailable(true)}
            className={`px-[18px] py-[9px] ${
              showAvailable ? "bg-[#8DCDFA]" : "bg-[#EAEAEA]"
            } rounded-[13px] hover:bg-[#8DCDFA] transition-colors`}
          >
            Unclaimed Dibs
          </button>
          <button
            onClick={() => setShowAvailable(false)}
            className={`px-[28px] py-[9px] ${
              !showAvailable ? "bg-[#8DCDFA]" : "bg-[#EAEAEA]"
            } rounded-[13px] hover:bg-[#8DCDFA] transition-colors`}
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
                {!availableItems.data &&
                !availableItems.error &&
                availableItems.isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    {availableItems.data?.map((item) => {
                      return (
                        <GiveAwayItemCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          images={item.images}
                          description={item.description}
                          refetchList={() => availableItems.refetch()}
                        />
                      );
                    })}
                  </>
                )}
              </a.div>
            ) : (
              <a.div
                style={style}
                className="flex flex-col items-center pt-2 w-full"
              >
                {!dibsedItems.data &&
                !dibsedItems.error &&
                dibsedItems.isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    {dibsedItems.data?.map((item) => {
                      return (
                        <GiveAwayItemCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          images={item.images}
                          description={item.description}
                          refetchList={() => dibsedItems.refetch()}
                        />
                      );
                    })}
                  </>
                )}
              </a.div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default StuffPage;
