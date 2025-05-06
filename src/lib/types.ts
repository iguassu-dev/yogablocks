// centralize all Supabase table interfaces
// src/lib/types.ts

export interface DocumentLink {
  id: string;
  source_id: string;
  target_id: string;
  label: string;
  position: number;
  created_at: string;
}
