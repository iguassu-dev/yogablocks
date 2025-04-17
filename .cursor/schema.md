Defines the core Supabase schema and its implications for data structure and behavior.

# Supabase Schema

## documents table

Stores all types of content: asanas, sequences, notes.

```ts
{
  id: string; // UUID, PK
  doc_type: string; // 'asana' | 'sequence' | 'note'
  title: string;
  content: string; // markdown or JSON (TipTap)
  created_by: string; // user UUID
  created_at: string;
  updated_at: string;
}
```

## Notes:

- doc_type helps filter documents by kind
- content is free-form and unstructured
- Markdown or JSON is rendered differently depending on view
- Official vs. user-generated asanas are differentiated by created_by
