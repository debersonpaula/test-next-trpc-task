export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number; // epoch ms (plain number keeps SSR serialization trivial)
};

// Stored on globalThis so the list survives dev-mode hot reloads
// and is shared between API routes and getServerSideProps.
const g = globalThis as unknown as { __tasks?: Task[] };
export const tasks: Task[] = (g.__tasks ??= []);
