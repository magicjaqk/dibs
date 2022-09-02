import axios from "axios";
import Head from "next/head";
import React, { ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";
import {
  a,
  useSpring,
  useSpringRef,
  useChain,
  config,
} from "@react-spring/web";
import Link from "next/link";
import Image from "next/image";
import SuccessfulToast from "../../components/SuccessfulToast";
import AnimatedTitle from "../../components/AnimatedTitle";

type Props = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Admin = (props: Props) => {
  const [itemName, setItemName] = React.useState("");
  const [imageFile, setImageFile] = React.useState<{
    file: File | null;
    fileName: string;
  }>({ file: null, fileName: "" });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);

  const user = trpc.useQuery(["auth.getSession"]);
  const addItem = trpc.useMutation(["giveawayItem.add"]);

  /**
   * LOADING ANIMATION
   */
  const loadingSpring = useSpring({
    from: { rotate: 0 },
    to: { rotate: 360 * 1.5 },
    loop: true,
    config: config.wobbly,
  });

  /**
   * SUBMIT FORM LOGIC
   */
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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

      addItem.mutate(
        {
          name: itemName,
          imageFilePath: supabaseData.path,
        },
        {
          onSuccess: async () => {
            setImageFile({ file: null, fileName: "" });
            setItemName("");
            setIsLoading(false);

            setIsSuccessful(true);
            await sleep(3000);
            setIsSuccessful(false);
          },
          onError: (err) => {
            setIsLoading(false);
            throw err;
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  /**
   * RENDER
   */
  if (!user.data && !user.error && user.isLoading)
    return (
      <a.div
        style={loadingSpring}
        className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative text-emerald-500"
      >
        <div className="w-40 aspect-square flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 23.8 25.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 7a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm-5.696 9.134a1 1 0 1 0 1.366.366a1 1 0 0 0-1.366-.366Zm11.392 0a1 1 0 1 0 .366 1.366a1 1 0 0 0-.366-1.366Zm2.914-2.791a4.918 4.918 0 0 0-4.526-1.197l-.419-.763a4.989 4.989 0 0 0-2.503-8.251a5.035 5.035 0 0 0-4.279.958A4.978 4.978 0 0 0 7 8a4.929 4.929 0 0 0 1.352 3.392l-.419.75a4.989 4.989 0 0 0-5.926 6.286a5.03 5.03 0 0 0 2.97 3.226a4.97 4.97 0 0 0 6.588-3.19l.867.014a4.981 4.981 0 0 0 4.76 3.524a5.017 5.017 0 0 0 4.8-3.573a4.95 4.95 0 0 0-1.382-5.086Zm-.528 4.495a3.006 3.006 0 0 1-4.386 1.76a2.965 2.965 0 0 1-1.352-1.705a1.994 1.994 0 0 0-1.91-1.43h-.869a1.995 1.995 0 0 0-1.91 1.43a2.98 2.98 0 0 1-3.948 1.899a2.993 2.993 0 0 1 1.767-5.704a1.967 1.967 0 0 0 2.173-.942l.436-.754a1.995 1.995 0 0 0-.281-2.369a2.98 2.98 0 0 1 .329-4.37a2.993 2.993 0 0 1 4.069 4.369a2 2 0 0 0-.283 2.37l.435.753a1.974 1.974 0 0 0 2.174.943a2.988 2.988 0 0 1 3.556 3.75Z"
            />
          </svg>
        </div>
      </a.div>
    );

  if (!user.data?.admin) return <div>403: Forbidden Request.</div>;

  return (
    <>
      <Head>
        <title>Dibs Admin</title>
        <meta name="description" content="Upload items to give away!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative">
        <AnimatedTitle wordArray={["Get", "Rid", "of", "Shit"]} />

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

          <label htmlFor="photo" className="relative mt-4 group">
            <div className="w-full h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600/50 to-sky-600/50 flex items-center justify-center hover:cursor-pointer relative">
              <div className="group-hover:scale-110 group-active:scale-100 rounded-full bg-white w-40 h-12 font-bold text-sky-700 shadow-md flex items-center justify-center transition-all z-10">
                {imageFile ? "Change Photo" : "Upload a Photo"}
              </div>

              {imageFile && imageFile.file && (
                <div className="absolute inset-0 w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={URL.createObjectURL(imageFile.file)}
                      alt="Preview image."
                    />
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg image/png"
              value={imageFile?.fileName}
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  setImageFile({
                    file: e.target.files[0],
                    fileName: e.target.value,
                  });
              }}
              name="photo"
              id="photo"
              className="file:hidden absolute bottom-4 left-4 text-sky-800 font-bold hover:cursor-pointer"
            />
          </label>

          <button
            type="submit"
            className="p-2 px-3 rounded mt-4 text-white font-semibold bg-emerald-500 hover:bg-emerald-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
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
          <p className="font-medium text-red-600 max-w-lg">
            Error: {addItem.error.message}
          </p>
        )}

        <Link href="/admin/dibsed">
          <a className="flex font-medium text-emerald-500 items-center hover:bg-emerald-100 h-14 w-full max-w-xs justify-center rounded transition-colors">
            <p>Shit you are giving away</p>
            <svg
              className="aspect-square w-5 ml-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12h16m-7-7l7 7l-7 7"
              />
            </svg>
          </a>
        </Link>
      </div>

      <SuccessfulToast show={isSuccessful} />
    </>
  );
};

export default Admin;
