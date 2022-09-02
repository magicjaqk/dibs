import React from "react";
import { trpc } from "../../utils/trpc";

type Props = {};

const DibsedPage = (props: Props) => {
  const items = trpc.useQuery(["giveawayItem.getDibsed"]);

  const user = trpc.useQuery(["auth.getSession"]);
  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  return (
    <div>
      {items.data?.map((item) => (
        <p key={item.id}>
          {item.dibsByUser?.name}: {item?.name}
        </p>
      ))}
    </div>
  );
};

export default DibsedPage;
