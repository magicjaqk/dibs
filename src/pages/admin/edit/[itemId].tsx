import { useRouter } from "next/router";
import React from "react";
import EditForm from "../../../components/admin/EditForm";
import { trpc } from "../../../utils/trpc";

type Props = {};

const EditItemPage = (props: Props) => {
  const router = useRouter();
  const { itemId } = router.query;

  const user = trpc.useQuery(["auth.getSession"]);

  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  return (
    <div className="w-full mx-auto px-9 py-9 bg-oxford-blue flex flex-col items-center text-white">
      <EditForm id={itemId as string} />
    </div>
  );
};

export default EditItemPage;
