import { initTRPC } from "@trpc/server";

// Base tRPC instance. No context is needed (in-memory store is global).
const t = initTRPC.create();

export const router = t.router;

// Simulates network latency (2s) for every request.
const delayMiddleware = t.middleware(async ({ next }) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return next();
});

export const publicProcedure = t.procedure.use(delayMiddleware);
export const createCallerFactory = t.createCallerFactory;
