import type { CSSProperties, ReactNode } from "react";

export const fieldStyle: CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 6,
  padding: "10px 12px",
  border: "1px solid #888",
  borderRadius: 6,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  outline: "none",
};

type Props = {
  label: string;
  error?: string | null;
  children: ReactNode;
};

// Wraps a control with a label and an optional error message.
export default function Field({ label, error, children }: Props) {
  return (
    <label style={{ display: "block", fontWeight: 600, fontSize: 14 }}>
      {label}
      {children}
      {error && (
        <small style={{ display: "block", marginTop: 4, color: "crimson", fontWeight: 400 }}>
          {error}
        </small>
      )}
    </label>
  );
}
