import { TRPCError } from "@trpc/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { publicProcedure, router, createCallerFactory } from "../trpc";
import { tasks, type Task } from "../store";

// Validation: title is required (whitespace-only is rejected too).
const titulo = z.string().trim().min(1, "O título é obrigatório");
const descricao = z.string().trim().optional();

const notFound = (id: string) =>
  new TRPCError({ code: "NOT_FOUND", message: `Tarefa ${id} não encontrada` });

export const appRouter = router({
  task: router({
    // Cursor-based pagination (cursor = offset) used by the infinite scroll.
    list: publicProcedure
      .input(
        z
          .object({
            limit: z.number().int().min(1).max(100).default(10),
            cursor: z.number().int().min(0).default(0),
          })
          .default({ limit: 10, cursor: 0 })
      )
      .query(({ input }) => {
        // Newest first
        const sorted = [...tasks].sort((a, b) => b.dataCriacao - a.dataCriacao);
        const items = sorted.slice(input.cursor, input.cursor + input.limit);
        const next = input.cursor + input.limit;
        return {
          items,
          total: sorted.length,
          nextCursor: next < sorted.length ? next : null,
        };
      }),

    get: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
      const task = tasks.find((t) => t.id === input.id);
      if (!task) throw notFound(input.id);
      return task;
    }),

    create: publicProcedure
      .input(z.object({ titulo, descricao }))
      .mutation(({ input }) => {
        const task: Task = {
          id: randomUUID(),
          titulo: input.titulo,
          descricao: input.descricao || undefined,
          dataCriacao: Date.now(),
        };
        tasks.push(task);
        return task;
      }),

    update: publicProcedure
      .input(z.object({ id: z.string(), titulo, descricao }))
      .mutation(({ input }) => {
        const task = tasks.find((t) => t.id === input.id);
        if (!task) throw notFound(input.id);
        task.titulo = input.titulo;
        task.descricao = input.descricao || undefined;
        return task;
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const idx = tasks.findIndex((t) => t.id === input.id);
        if (idx === -1) throw notFound(input.id);
        tasks.splice(idx, 1);
        return { id: input.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
