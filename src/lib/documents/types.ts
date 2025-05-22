// src/types.ts

export interface Doc {
  id: string;
  title: string;
  content: string;
  doc_type: "system" | "user";
  created_by: string;
  created_at: string;
  updated_at: string;
}
