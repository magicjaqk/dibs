import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import GiveAwayItemCard from "../../components/stuff/GiveawayItemCard";
import { trpc } from "../../utils/trpc";

type Props = {};

const IndividualItemPage = (props: Props) => {
  const router = useRouter();
  const { itemId } = router.query;

  const { data, error, isLoading } = trpc.useQuery([
    "giveawayItem.get",
    { itemId: itemId as string },
  ]);

  if (isLoading && !data && !error) return <div>Loading...</div>;

  if (data?.dibsByUserEmail !== null)
    return <div>Sorry this item has already been dibsed.</div>;

  return (
    data && (
      <div className="max-w-lg mx-auto relative">
        <GiveAwayItemCard
          id={data?.id}
          name={data?.name}
          description={data?.description}
          images={data?.images}
        />

        <Link href="/stuff">
          <a className="text-chartreuse bg-oxford-blue rounded-[6px] font-bold text-center flex items-center justify-center h-10 mx-9 my-10">
            See more stuff!
          </a>
        </Link>
      </div>
    )
  );
};

export default IndividualItemPage;
