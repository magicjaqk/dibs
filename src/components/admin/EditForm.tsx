import axios from "axios";
import Image from "next/image";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";
import SuccessfulToast from "../SuccessfulToast";
import DeleteButton from "./DeleteButton";

type Inputs = {
  name: string;
  images: FileList | string[];
  description: string;
};

type Props = {
  id: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const EditForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      description: "",
      images: [],
      name: "",
    },
  });
  const itemToEdit = trpc.useQuery(["giveawayItem.get", { itemId: props.id }], {
    onSuccess: (data) => {
      if (data) {
        setValue("name", data.name);
        setValue("description", data.description);
      }
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const [previewImgURLs, setPreviewImgURLs] = React.useState<string[]>([]);

  const editItem = trpc.useMutation(["giveawayItem.update"]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    let supabaseImgPaths: string[] = [];

    const files = data.images;
    console.log("Photos: ", files);

    if (!files || !data.name) {
      setIsLoading(false);
      return null;
    }

    for (let i = 0; i < files.length; i++) {
      let file = files[i] as File;

      // if filesize is greater than 1.5mb
      // if (file.size > 1024 * 1000 * 1.5) {
      //   // Don't allow upload.
      //   window.alert(
      //     `File: ${file.name} is too large. Files must be smaller than 1.5mb.`
      //   );
      //   setIsLoading(false);
      //   return null;
      // }

      if (!file) break;

      console.log(file);

      // @ts-ignore
      const fileType = file.type.split("/")[1];
      console.log(fileType);

      if (!fileType || (fileType !== "jpeg" && fileType !== "png")) {
        window.alert(
          `File: ${file.name} is an invalid type. Please only upload PNG or JPEG files.`
        );
        setIsLoading(false);
        return null;
      }

      const {
        data: { randomID },
      } = await axios.get("/api/randomId");

      const uniqueFileName = `${randomID as string}.${fileType}`;

      try {
        const { data: supabaseData, error: supabaseError } =
          await supabase.storage.from("images").upload(uniqueFileName, file);
        if (supabaseError) throw supabaseError;

        supabaseImgPaths.push(supabaseData.path);
      } catch (err) {
        console.error(err);
      }
    }

    editItem.mutate(
      {
        id: props.id,
        name: data.name ?? undefined,
        images: supabaseImgPaths,
        description: data.description ?? undefined,
      },
      {
        onSuccess: async () => {
          // Reset form values
          reset({
            images: [],
            name: "",
            description: "",
          });
          setPreviewImgURLs([]);

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
    setIsLoading(false);
  };

  return (
    <>
      <h1 className="text-center font-black text-5xl">Edit Form</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col my-4 text-lg font-medium max-w-lg py-4"
      >
        <label htmlFor="name">What is this item?</label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Moldy underwear, cocaine, day-old bread, etc."
          className="border rounded-[6px] p-2 text-[#1C2031]"
        />

        <label htmlFor="photo" className="relative mt-4 group w-full">
          <div className="w-full aspect-square rounded-[6px] overflow-hidden bg-[#EAEAEA]/60 flex items-center justify-center hover:cursor-pointer relative">
            <div className="group-hover:scale-110 group-active:scale-100 rounded-full bg-white w-40 h-12 font-bold text-[#1C2031] shadow-md flex items-center justify-center transition-all z-10">
              {previewImgURLs ? "Change Photo" : "Upload a Photo"}
            </div>

            {previewImgURLs[0] && (
              <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={previewImgURLs[0]}
                    alt="Preview image."
                  />
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg image/png"
            {...register("images", {
              onChange: (e) => {
                const files: FileList = e.target.files;

                let previewURLs: string[] = [];
                for (let i = 0; i < files.length; i++) {
                  if (files[i]) {
                    previewURLs.push(URL.createObjectURL(files[i]!));
                  }
                }

                setPreviewImgURLs(previewURLs);
              },
            })}
            id="photo"
            className="file:hidden absolute bottom-4 left-4 font-bold hover:cursor-pointer text-[#1C2031]"
          />
        </label>

        <label className="mt-4" htmlFor="description">
          How would you describe this item?
        </label>
        <textarea
          className="border rounded-[6px] p-2 text-[#1C2031]"
          {...register("description")}
          id="description"
          placeholder="A large mound of steaming hot poop."
          rows={4}
        />

        <button
          type="submit"
          className="p-2 px-3 w-full rounded-[6px] font-bold text-[#1C2031] mt-4 bg-chartreuse hover:scale-105 transition-all"
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
            "Save"
          )}
        </button>
      </form>

      <DeleteButton id={props.id} />
      <SuccessfulToast show={isSuccessful} />
    </>
  );
};

export default EditForm;
