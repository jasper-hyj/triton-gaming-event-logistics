## Architecture

- Pages are rendered using Next.js Server and Client Components.
- Auth is handled via Supabase using JWT cookies.
- Middleware enforces route access.
- Roles are assigned in Supabase profiles table and accessed via a unified `User` class.

See `docs/auth-system.md` for details on auth flow.
