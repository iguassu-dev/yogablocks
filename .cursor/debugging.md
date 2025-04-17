Contains dev rules for troubleshooting, debugging, and environment setup.

# Debugging & Dev Rules

## Supabase

- Use a singleton Supabase client:

  ```ts
  // lib/supabaseClient.ts
  import { createBrowserClient } from "@supabase/ssr";

  export default createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  ```

- Never instantiate Supabase clients in components, hooks, or pages.

- Hot Reload Issues. If sessions break in dev:
  rm -rf .next
  npm run dev

- Always test session-dependent logic in incognito to avoid stale state.
