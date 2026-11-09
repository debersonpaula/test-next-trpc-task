import type { ComponentProps } from "react";
import Field, { fieldStyle } from "./Field";

type Props = ComponentProps<"input"> & { label: string; error?: string | null };

export default function Input({ label, error, style, ...props }: Props) {
  return (
    <Field label={label} error={error}>
      <input
        {...props}
        style={{
          ...fieldStyle,
          ...(error ? { borderColor: "crimson" } : null),
          ...(props.disabled ? { opacity: 0.6 } : null),
          ...style,
        }}
      />
    </Field>
  );
}
