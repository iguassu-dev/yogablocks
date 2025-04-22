Outlines the current project file structure so Cursor can locate relevant files for each task.

```md
# File Structure Overview

## Presentation Layer (UI + Pages)

- `src/app/(authenticated)/library/page.tsx` → Library home page
- `src/app/(authenticated)/library/[id]/page.tsx` → Document detail view
- `src/app/(authenticated)/library/create/page.tsx` → Create doc
- `src/app/(authenticated)/library/edit/[id]/page.tsx` → Edit doc
- `src/components/ui/` → UI primitives (FAB, buttons, inputs)
- `src/components/drawer/library-drawer.tsx` → Overlay drawer
- `src/components/editor/doc-editor.tsx` → Entry point for editor
- `src/components/editor/rich-text-editor.tsx` → TipTap implementation

## Logic Layer

- `src/hooks/useUser.ts` → Auth logic
- `src/hooks/useLibrary.ts` → Fetch + filter docs
- `src/hooks/useEditor.ts` → Handle text editing and doc state
- `src/hooks/useHeader.tsx` → Header state (search, title, mode)

## Data Layer

- `data/asanas.json` → Source for official asana data
- `scripts/seedAsanas.ts` → Script to seed data into Supabase

## Supabase Logic

- `src/lib/supabaseClient.ts` → Shared Supabase client
- `src/lib/createAsana.ts`, `linking.ts`, `utils.ts` → DB & parsing utilities
```
