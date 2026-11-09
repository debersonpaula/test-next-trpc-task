import { useCallback, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { createCaller } from "@/server/routers/_app";
import type { Task } from "@/server/store";
import { trpc, errorMessage } from "@/utils/trpc";

const PAGE_SIZE = 10;

type Page = { items: Task[]; total: number; nextCursor: number | null };

// SSR: the first page is fetched on the server by calling the router directly
// (no HTTP round-trip). Further pages are loaded by infinite scroll.
export const getServerSideProps: GetServerSideProps<{ initial: Page }> = async () => {
  const initial = await createCaller({}).task.list({ limit: PAGE_SIZE, cursor: 0 });
  return { props: { initial: JSON.parse(JSON.stringify(initial)) } };
};

export default function Home({ initial }: { initial: Page }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initial.items);
  const [nextCursor, setNextCursor] = useState(initial.nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const sentinel = useRef<HTMLDivElement>(null);

  // Message coming from the form page (?msg=created|updated), derived from the URL
  const urlMsg =
    router.query.msg === "created"
      ? "Tarefa criada com sucesso"
      : router.query.msg === "updated"
        ? "Tarefa atualizada com sucesso"
        : null;

  const loadMore = useCallback(async () => {
    if (nextCursor === null || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await trpc.task.list.query({ limit: PAGE_SIZE, cursor: nextCursor });
      // Dedupe in case the list shifted between requests
      setTasks((prev) => [
        ...prev,
        ...page.items.filter((i) => !prev.some((p) => p.id === i.id)),
      ]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      setFeedback({ type: "err", text: errorMessage(err) });
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  // Infinite scroll: load more when the sentinel enters the viewport.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((e) => e[0].isIntersecting && loadMore());
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  async function remove(id: string) {
    if (!confirm("Excluir esta tarefa?")) return;
    setDeleting(id);
    try {
      await trpc.task.delete.mutate({ id });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setFeedback({ type: "ok", text: "Tarefa excluída com sucesso" });
    } catch (err) {
      setFeedback({ type: "err", text: errorMessage(err) });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Tarefas</h1>
      <p>
        <Link href="/tarefas/nova">+ Nova tarefa</Link>
      </p>

      {feedback ? (
        <p
          role="alert"
          style={{ color: feedback.type === "ok" ? "green" : "crimson" }}
        >
          {feedback.text}
        </p>
      ) : (
        urlMsg && <p role="alert" style={{ color: "green" }}>{urlMsg}</p>
      )}

      {tasks.length === 0 && <p>Nenhuma tarefa cadastrada.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ border: "1px solid #888", padding: 12 }}>
            <strong>{t.titulo}</strong>
            {t.descricao && <p>{t.descricao}</p>}
            <small>{new Date(t.dataCriacao).toLocaleString("pt-BR")}</small>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Link href={`/tarefas/${t.id}`}>Editar</Link>
              <button onClick={() => remove(t.id)} disabled={deleting === t.id}>
                {deleting === t.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div ref={sentinel} style={{ height: 20 }} />
      {loadingMore && <p>Carregando...</p>}
    </main>
  );
}
