import type { ComponentProps } from "react";
import Field, { fieldStyle } from "./Field";

type Props = ComponentProps<"textarea"> & { label: string; error?: string | null };

export default function TextArea({ label, error, style, ...props }: Props) {
  return (
    <Field label={label} error={error}>
      <textarea
        rows={4}
        {...props}
        style={{
          ...fieldStyle,
          resize: "vertical",
          ...(error ? { borderColor: "crimson" } : null),
          ...(props.disabled ? { opacity: 0.6 } : null),
          ...style,
        }}
      />
    </Field>
  );
}
