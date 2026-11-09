import Link from "next/link";
import type { ComponentProps } from "react";

const style: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  border: "1px solid #888",
  borderRadius: 6,
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  cursor: "pointer",
};

const variants = {
  primary: "#0070f3",
  warning: "#f57c00",
} as const;

type Props = ComponentProps<typeof Link> & { variant?: keyof typeof variants };

export default function ButtonLink({ style: extra, variant = "primary", ...props }: Props) {
  return <Link {...props} style={{ ...style, background: variants[variant], ...extra }} />;
}
