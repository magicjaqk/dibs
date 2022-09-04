import axios from "axios";
import Image from "next/image";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";
import SuccessfulToast from "../SuccessfulToast";

type Inputs = {
  name: string;
  image: string;
};

type Props = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const UploadForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const [previewImgURL, setPreviewImgURL] = React.useState("");
  const addItem = trpc.useMutation(["giveawayItem.add"]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const file = data.image[0];
    console.log("Photo: ", file);

    if (!file || !data.name) {
      setIsLoading(false);
      return null;
    }

    // @ts-ignore
    const fileType = file.type.split("/")[1];
    console.log(fileType);

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
          name: data.name,
          imageFilePath: supabaseData.path,
        },
        {
          onSuccess: async () => {
            // Reset form values
            reset({
              image: "",
              name: "",
            });
            setPreviewImgURL("");

            // Stop loading state
            setIsLoading(false);

            // Show successful toast for 3 seconds
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg flex flex-col p-4"
      >
        <label htmlFor="name">What is this item?</label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Moldy underwear, cocaine, day-old bread, etc."
          className="border rounded p-1"
        />

        <label htmlFor="photo" className="relative mt-4 group">
          <div className="w-full h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600/50 to-sky-600/50 flex items-center justify-center hover:cursor-pointer relative">
            <div className="group-hover:scale-110 group-active:scale-100 rounded-full bg-white w-40 h-12 font-bold text-sky-700 shadow-md flex items-center justify-center transition-all z-10">
              {previewImgURL ? "Change Photo" : "Upload a Photo"}
            </div>

            {previewImgURL && (
              <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={previewImgURL}
                    alt="Preview image."
                  />
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg image/png"
            {...register("image", {
              onChange: (e) => {
                console.log(e);
                setPreviewImgURL(
                  e.target?.files[0]
                    ? URL.createObjectURL(e.target?.files[0])
                    : ""
                );
              },
            })}
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

      <SuccessfulToast show={isSuccessful} />
    </>
  );
};

export default UploadForm;
