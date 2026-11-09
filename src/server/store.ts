import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number; // epoch ms (plain number keeps SSR serialization trivial)
};

const SEED_COUNT = 35; // > 3 pages, so infinite scroll is visible

// Generates random tasks, with creation dates spread over the last 30 days.
function seed(): Task[] {
  return Array.from({ length: SEED_COUNT }, () => ({
    id: randomUUID(),
    titulo: faker.hacker.phrase().slice(0, 60),
    descricao: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    dataCriacao: faker.date.recent({ days: 30 }).getTime(),
  }));
}

// Stored on globalThis so the list survives dev-mode hot reloads
// and is shared between API routes and getServerSideProps.
// Seeded only once, when the store is first created.
const g = globalThis as unknown as { __tasks?: Task[] };
export const tasks: Task[] = (g.__tasks ??= seed());
