import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

export const authRouter = createRouter()
  .query("getSession", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email! },
      });

      return {
        ...ctx.session,
        admin: user?.admin,
      };
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  });
