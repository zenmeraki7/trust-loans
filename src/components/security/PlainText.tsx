import React, { type ElementType } from "react";

type PlainTextProps = {
  value: unknown;
  as?: "p" | "span" | "pre" | "div" | "h1" | "h2" | "h3";
  className?: string;
};

/** Text-only boundary for stored data. React escapes the child value. */
export default function PlainText({ value, as = "p", className = "" }: PlainTextProps) {
  const Tag = as as ElementType;
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  return <Tag className={`whitespace-pre-wrap break-words ${className}`.trim()}>{text}</Tag>;
}
