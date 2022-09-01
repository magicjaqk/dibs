// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { giveawayItemRouter } from "./giveawayItem";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("giveawayItem.", giveawayItemRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
