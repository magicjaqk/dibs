import axios from "axios";
import { randomUUID } from "crypto";
import React, { ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";

type Props = {};

const Admin = (props: Props) => {
  const [itemName, setItemName] = React.useState("");

  const user = trpc.useQuery(["auth.getSession"]);

  const addItem = trpc.useMutation(["giveawayItem.add"]);

  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const file = formData.get("photo");
    console.log("Photo: ", file);

    if (!file || !itemName) {
      return null;
    }

    // @ts-ignore
    const fileType = file.type.split("/")[1];

    if (!fileType) return console.error("File has no type!");

    const {
      data: { randomID },
    } = await axios.get("/api/randomId");

    const uniqueFileName = `${randomID as string}.${fileType}`;

    try {
      const { data: supabaseData, error: supabaseError } =
        await supabase.storage.from("images").upload(uniqueFileName, file);
      if (supabaseError) throw supabaseError;

      addItem.mutate({
        name: itemName,
        imageFilePath: supabaseData.path,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-4xl">Admin</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col p-4"
      >
        <label htmlFor="name">What is this item?</label>
        <input
          type="text"
          name="name"
          id="name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Moldy underwear, cocaine, day-old bread, etc."
          className="border rounded p-1"
        />

        <label htmlFor="photo" className="mt-4">
          Add a photo:
        </label>
        <input
          type="file"
          accept="image/jpeg image/png"
          name="photo"
          id="photo"
        />

        <button
          type="submit"
          className="p-2 px-3 rounded mt-4 text-white font-semibold bg-emerald-500 hover:bg-emerald-600 transition-colors"
          disabled={addItem.isLoading}
        >
          {addItem.isLoading ? (
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
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {addItem.isError && (
        <p className="font-medium text-red-600">
          Error: {addItem.error.message}
        </p>
      )}
    </div>
  );
};

export default Admin;
