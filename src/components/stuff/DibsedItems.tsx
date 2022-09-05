import React from "react";
// import { a, config, useSpring, useTrail } from "@react-spring/web";
import { trpc } from "../../utils/trpc";
import DibsedItemCard from "./DibsedItemCard";

type Props = {};

const DibsedItems = (props: Props) => {
  const dibsedItems = trpc.useQuery(["giveawayItem.getUserDibsed"]);

  return (
    <>
      <p className="text-center text-lg px-9 font-medium leading-[24px] text-[#1C2031] my-[20px]">
        Message Andrew or Mayra when you are ready to come pick up your new fun
        things!
      </p>
      {!dibsedItems.data && !dibsedItems.error && dibsedItems.isLoading ? (
        "Loading..."
      ) : (
        <>
          {dibsedItems.data?.map((item) => {
            return (
              <DibsedItemCard
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
    </>
  );
};

export default DibsedItems;
