import type { ComponentProps, CSSProperties } from "react";

const style: CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  border: "1px solid #888",
  borderRadius: 6,
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};

const variants = {
  primary: "#0070f3",
  warning: "#f57c00",
} as const;

type Props = ComponentProps<"button"> & { variant?: keyof typeof variants };

export default function Button({
  style: extra,
  disabled,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...style,
        background: variants[variant],
        ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : null),
        ...extra,
      }}
    />
  );
}
