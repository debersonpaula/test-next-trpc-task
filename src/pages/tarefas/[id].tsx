import type { GetServerSideProps } from "next";
import TaskForm from "@/components/TaskForm";
import { createCaller } from "@/server/routers/_app";
import type { Task } from "@/server/store";

type Props = { task: Task };

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  try {
    const task = await createCaller({}).task.get({ id: String(params?.id) });
    return { props: { task: JSON.parse(JSON.stringify(task)) } };
  } catch {
    return { notFound: true }; // unknown id -> 404
  }
};

export default function EditarTarefa({ task }: Props) {
  return (
    <main style={{ padding: 24 }}>
      <TaskForm task={task} />
    </main>
  );
}
