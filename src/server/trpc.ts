import { initTRPC } from "@trpc/server";

// Base tRPC instance. No context is needed (in-memory store is global).
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
