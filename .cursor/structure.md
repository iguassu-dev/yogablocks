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

## Component Hierarchy

AppShell
├── HeaderProvider
│ └── Header
│ ├── Library Mode → Shows brand title + search icon
│ ├── Doc View Mode → Shows document title
│ ├── Doc Edit Mode → Shows "Editing..." title
│ └── Doc Create Mode → Shows "New Document" title
└── Main Content
│
├── Library Page
│ ├── PageContainer → Provides consistent layout and spacing
│ ├── DocCard (for each document) → Displays document preview
│ └── FAB (Create) → Floating action button to create new docs
│
├── Document detail view
│ ├── PageContainer → Provides consistent layout and spacing
│ ├── TypographyHeading1 → Displays document title
│ ├── TypographyBody → Displays document content
│ └── FAB (Edit) → Floating action button to edit doc
│
├── Create doc
│ └── DocEditor → Empty editor
│
└── Edit doc
└── DocEditor → Editor populated with existing content

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
