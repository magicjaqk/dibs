import React from "react";
import { trpc } from "../../utils/trpc";
import GiveAwayItemCard from "./GiveawayItemCard";

type Props = {};

const AvailableItems = (props: Props) => {
  const availableItems = trpc.useQuery(["giveawayItem.getAvailable"]);

  return (
    <>
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
              />
            );
          })}

          {availableItems.data?.length === 0 && (
            <p className="text-center px-9 my-[20px] font-bold text-xl">
              All things have been dibsed! Come back later to find more neat
              stuff!
            </p>
          )}
        </>
      )}
    </>
  );
};

export default AvailableItems;
