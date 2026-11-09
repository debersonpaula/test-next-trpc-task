import Link from "next/link";
import type { ComponentProps } from "react";

const style: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  border: "1px solid #888",
  borderRadius: 6,
  background: "#0070f3",
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  cursor: "pointer",
};

export default function ButtonLink({ style: extra, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} style={{ ...style, ...extra }} />;
}
