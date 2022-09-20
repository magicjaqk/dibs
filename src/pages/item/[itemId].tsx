import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/Loading";
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
  const user = trpc.useQuery(["auth.getSession"]);

  if (isLoading && !data && !error) return <Loading />;

  if (data?.dibsByUserEmail !== null)
    return <div>Sorry this item has already been dibsed.</div>;

  return (
    <>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <meta name="title" content="Dibs!" />
        <meta
          name="description"
          content={`${data.name} has been listed on Dibs!`}
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://dibs.somethingabout.studio/item/${itemId}`}
        />
        <meta property="og:title" content="Dibs!" />
        <meta
          property="og:description"
          content={`${data.name} has been listed on Dibs!`}
        />
        <meta property="og:image" content={data.images[0]} />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://dibs.somethingabout.studio/item/${itemId}`}
        />
        <meta property="twitter:title" content="Dibs!" />
        <meta
          property="twitter:description"
          content={`${data.name} has been listed on Dibs!`}
        />
        <meta property="twitter:image" content={data.images[0]} />
      </Head>

      {data && (
        <div className="max-w-lg mx-auto relative">
          <GiveAwayItemCard
            isAdmin={user.data?.admin}
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
      )}
    </>
  );
};

export default IndividualItemPage;
