import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

// Browser-side typed client (vanilla client, no react-query for simplicity).
export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
});

/** Extracts a user-friendly message from any thrown error. */
export function errorMessage(err: unknown): string {
  if (err instanceof TRPCClientError) {
    // Zod validation errors arrive as a JSON array in message; use first issue.
    try {
      const issues = JSON.parse(err.message);
      if (Array.isArray(issues) && issues[0]?.message) return issues[0].message;
    } catch {}
    return err.message;
  }
  return err instanceof Error ? err.message : "Erro inesperado";
}
