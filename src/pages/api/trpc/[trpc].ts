import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/routers/_app";

// Exposes the tRPC router at /api/trpc
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
