import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/trpc";

type Props = {
  id: string;
};

const DeleteButton = (props: Props) => {
  const router = useRouter();

  const [attemptDelete, setAttemptDelete] = React.useState(false);

  const deleteMutation = trpc.useMutation(["giveawayItem.remove"]);

  const handleDelete = async () => {
    deleteMutation.mutate(
      { id: props.id },
      {
        onSuccess: () => router.push("/stuff"),
        onError: (err) => window.alert(err),
      }
    );
  };

  return (
    <>
      {!attemptDelete ? (
        <button
          className="bg-red-700 text-white p-2 px-4 font-bold uppercase rounded-[3px] mx-2"
          onClick={() => setAttemptDelete(true)}
        >
          DELETE
        </button>
      ) : (
        <div className="w-full max-w-lg mx-auto p-4 z-50 bg-red-100 text-red-900 rounded-[6px] shadow">
          <h2 className="text-2xl font-black mb-4 text-center">
            Are you sure you want to delete?
          </h2>

          <div className="flex items-center justify-center">
            <button
              className="bg-slate-400 text-slate-900 p-2 px-4 font-bold uppercase rounded-[3px] mx-2"
              onClick={() => setAttemptDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-700 text-white p-2 px-4 font-bold uppercase rounded-[3px] mx-2"
              onClick={() => handleDelete()}
            >
              {deleteMutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
