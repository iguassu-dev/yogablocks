import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getPreview(content: string) {
  const lines = content.split("\n").filter(Boolean);
  if (lines.length === 0) return "";
  if (lines.length === 1) return lines[0];
  return `${lines[0]}\n${lines[1]}`;
}
