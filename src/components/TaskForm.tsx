import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import Input from "./Input";
import TextArea from "./TextArea";
import { trpc, errorMessage } from "@/utils/trpc";

type Props = { task?: { id: string; titulo: string; descricao?: string } };

// Shared form for create (no `task`) and edit (`task` provided).
export default function TaskForm({ task }: Props) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    // Client-side validation (server validates again).
    if (!titulo.trim()) {
      setFieldError("O título é obrigatório");
      return;
    }
    setFieldError(null);
    setLoading(true);
    try {
      if (task)
        await trpc.task.update.mutate({ id: task.id, titulo, descricao });
      else await trpc.task.create.mutate({ titulo, descricao });
      await router.push(`/?msg=${task ? "updated" : "created"}`);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "grid", gap: 12, maxWidth: 480 }}
    >
      <h1>{task ? "Editar tarefa" : "Nova tarefa"}</h1>
      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}
      <Input
        label="Título *"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        disabled={loading}
        error={fieldError}
      />
      <TextArea
        label="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        disabled={loading}
      />
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <ButtonLink href="/" variant="warning">
          Cancelar
        </ButtonLink>
      </div>
    </form>
  );
}
