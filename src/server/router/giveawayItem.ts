import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { supabase } from "../../utils/supabase";

export const giveawayItemRouter = createRouter()
  // QUERIES
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.giveawayItem.findMany();
    },
  })
  .query("get", {
    input: z.object({
      itemId: z.string(),
    }),
    async resolve({ ctx, input: { itemId } }) {
      return await ctx.prisma.giveawayItem.findUnique({
        where: {
          id: itemId,
        },
        include: {
          dibsByUser: true,
        },
      });
    },
  })
  .query("getAvailable", {
    async resolve({ ctx }) {
      return await ctx.prisma.giveawayItem.findMany({
        where: {
          dibsByUser: null,
        },
        orderBy: {
          dibsUpdatedAt: "desc",
        },
      });
    },
  })
  .query("getDibsed", {
    async resolve({ ctx }) {
      return await ctx.prisma.giveawayItem.findMany({
        where: {
          NOT: {
            dibsByUser: null,
          },
        },
        orderBy: {
          dibsUpdatedAt: "desc",
        },
        include: {
          dibsByUser: true,
        },
      });
    },
  })
  // MIDDLEWARE
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session || !ctx.session.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  // Authenticated requests
  .query("getUserDibsed", {
    async resolve({ ctx }) {
      return await ctx.prisma.giveawayItem.findMany({
        where: {
          dibsByUserEmail: ctx.session?.user?.email,
        },
        orderBy: {
          dibsUpdatedAt: "desc",
        },
      });
    },
  })
  // MUTATIONS
  .mutation("add", {
    input: z.object({
      name: z.string(),
      imageFilePaths: z.array(z.string()),
      description: z.string(),
      id: z.optional(z.string()),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email!,
        },
      });

      if (!user?.admin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not permitted to perform this action. Please contact an admin to do this for you.",
        });
      }

      const getPublicURLS = async () => {
        let urls: string[] = [];

        input.imageFilePaths.forEach(async (imageFilePath) => {
          const {
            data: { publicUrl: imagePublicURL },
          } = await supabase.storage.from("images").getPublicUrl(imageFilePath);

          urls.push(imagePublicURL);
        });

        return urls;
      };

      const imagePublicURLs = await getPublicURLS();

      return await ctx.prisma.giveawayItem.create({
        data: {
          name: input.name,
          images: imagePublicURLs,
          description: input.description,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      name: z.optional(z.string()),
      description: z.optional(z.string()),
      images: z.optional(z.array(z.string())),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email!,
        },
      });

      if (!user?.admin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not permitted to perform this action. Please contact an admin to do this for you.",
        });
      }

      const currentItem = await ctx.prisma.giveawayItem.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!currentItem)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Item #${input.id} does not exist.`,
        });

      const getPublicURLS = async () => {
        // If no images to update, return the current image paths.
        if (!input.images || input.images.length <= 0)
          return currentItem?.images;

        // Otherwise, delete current supabase images
        const pathsToRemove = currentItem.images.map((url) => {
          const fileName = url.split("/").pop()!;
          return fileName;
        });
        console.log("Removing:", pathsToRemove);
        const { data, error } = await supabase.storage
          .from("images")
          .remove(pathsToRemove);

        // Then, get the public urls for the new images and return them.
        let publicURLs: string[] = [];

        input.images?.forEach(async (imageFilePath) => {
          const {
            data: { publicUrl: imagePublicURL },
          } = await supabase.storage.from("images").getPublicUrl(imageFilePath);

          publicURLs.push(imagePublicURL);
        });

        return publicURLs;
      };

      const imagePublicURLs = await getPublicURLS();

      return await ctx.prisma.giveawayItem.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          images: imagePublicURLs,
        },
      });
    },
  })
  .mutation("remove", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email!,
        },
      });

      if (!user?.admin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not permitted to perform this action. Please contact an admin to do this for you.",
        });
      }

      const itemToDelete = await ctx.prisma.giveawayItem.findUnique({
        where: { id: input.id },
      });

      if (!itemToDelete)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Item #${input.id} not found.`,
        });

      // Delete supabase images
      const pathsToRemove = itemToDelete.images.map((url) => {
        const fileName = url.split("/").pop()!;
        return fileName;
      });
      console.log("Removing:", pathsToRemove);
      const { data, error } = await supabase.storage
        .from("images")
        .remove(pathsToRemove);

      return await ctx.prisma.giveawayItem.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("dibs", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // Check if dibsed by another user
      const isDibsedAlready = await ctx.prisma.giveawayItem.findUnique({
        where: {
          id: input.id,
        },
      });
      if (isDibsedAlready?.dibsByUserEmail !== null) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Sorry, this item has already been dibsed by another user.",
        });
      }

      // If not dibsed by another user already, set the item dibsed by current user.
      return await ctx.prisma.giveawayItem.update({
        where: {
          id: input.id,
        },
        data: {
          dibsByUser: { connect: { email: ctx.session?.user?.email! } },
        },
      });
    },
  })
  .mutation("undibs", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.email || !ctx.session) {
        return ctx.res
          ?.status(401)
          .send("Unauthorized account. Please sign in to make this request.");
      }

      return await ctx.prisma.giveawayItem.update({
        where: {
          id: input.id,
        },
        data: {
          dibsByUser: { disconnect: true },
        },
      });
    },
  });
