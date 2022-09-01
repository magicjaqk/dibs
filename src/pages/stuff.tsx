import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { trpc } from "../utils/trpc";

type Props = {};

const GiveAwayItemCard = ({ id }: { id: string }) => {
  const item = trpc.useQuery(["giveawayItem.get", { itemId: id }]);
  const { data: session, status } = useSession();

  const dibsMutation = trpc.useMutation(["giveawayItem.dibs"], {
    onSuccess: () => {
      item.refetch();
    },
  });
  const undibsMutation = trpc.useMutation(["giveawayItem.undibs"], {
    onSuccess: () => {
      item.refetch();
    },
  });

  const btnClasses = clsx([
    {
      "opacity-50": item.data?.dibsByUserEmail,
      "disabled:hover:cursor-not-allowed":
        (item.data?.dibsByUserEmail !== null &&
          session?.user?.email !== item.data?.dibsByUserEmail) ||
        !session?.user?.email,
      "hover:bg-gradient-to-r hover:from-emerald-500 hover:to-sky-500":
        (item.data?.dibsByUserEmail !== null &&
          session?.user?.email === item.data?.dibsByUserEmail) ||
        (item.data?.dibsByUserEmail === null && session?.user?.email),
    },
    "bg-gradient-to-r from-sky-500 to-sky-500 rounded w-full h-16 text-white font-bold transition-colors",
  ]);

  if (!item.data) return <div>Loading...</div>;

  return (
    <div className="p-2 rounded-md m-4 bg-slate-200 w-full max-w-lg">
      <h3 className="font-medium text-xl">{item.data.name}</h3>
      <Image
        src={item.data.image}
        alt={`Image of ${item.data.name}`}
        height={300}
        width={400}
        className="w-full"
      />
      <button
        className={btnClasses}
        onClick={() => {
          if (item.data?.dibsByUserEmail) {
            if (session?.user?.email === item.data.dibsByUserEmail)
              undibsMutation.mutate({ id: item.data.id });
          } else if (item.data?.id) {
            dibsMutation.mutate({ id: item.data.id });
          }
        }}
        disabled={
          (item.data?.dibsByUserEmail !== null &&
            session?.user?.email !== item.data.dibsByUserEmail) ||
          !session?.user?.email
        }
      >
        {dibsMutation.isLoading || undibsMutation.isLoading ? (
          <div className="animate-spin w-5 h-5 m-auto">
            <svg
              className="w-full h-full"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M140 32v32a12 12 0 0 1-24 0V32a12 12 0 0 1 24 0Zm33.3 62.7a11.6 11.6 0 0 0 8.4-3.5l22.7-22.6a12 12 0 1 0-17-17l-22.6 22.7a11.9 11.9 0 0 0 0 16.9a11.6 11.6 0 0 0 8.5 3.5ZM224 116h-32a12 12 0 0 0 0 24h32a12 12 0 0 0 0-24Zm-42.3 48.8a12 12 0 0 0-16.9 16.9l22.6 22.7a12 12 0 0 0 8.5 3.5a12.2 12.2 0 0 0 8.5-3.5a12 12 0 0 0 0-17ZM128 180a12 12 0 0 0-12 12v32a12 12 0 0 0 24 0v-32a12 12 0 0 0-12-12Zm-53.7-15.2l-22.7 22.6a12 12 0 0 0 0 17a12.2 12.2 0 0 0 8.5 3.5a12 12 0 0 0 8.5-3.5l22.6-22.7a12 12 0 0 0-16.9-16.9ZM76 128a12 12 0 0 0-12-12H32a12 12 0 0 0 0 24h32a12 12 0 0 0 12-12Zm-7.4-76.4a12 12 0 1 0-17 17l22.7 22.6a12 12 0 0 0 16.9 0a11.9 11.9 0 0 0 0-16.9Z"
              />
            </svg>
          </div>
        ) : item.data.dibsByUserEmail ? (
          session?.user?.email === item.data.dibsByUserEmail ? (
            "Undibs"
          ) : (
            "Dibsed"
          )
        ) : (
          "Dibs"
        )}
      </button>
    </div>
  );
};

const StuffPage = (props: Props) => {
  const items = trpc.useQuery(["giveawayItem.getAll"]);

  if (!items.data && !items.error) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Call dibs on stuff below</h1>
      <div className="flex flex-wrap">
        {items.data?.map((item) => {
          return <GiveAwayItemCard key={item.id} id={item.id} />;
        })}
      </div>
    </div>
  );
};

export default StuffPage;
