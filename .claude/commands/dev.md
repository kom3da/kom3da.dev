Start the local development server and verify it's running.

Steps:

1. Kill any existing process on port 4321 if occupied
2. Run `pnpm dev` (Astro dev server) in background
3. Wait for the server to be ready, then confirm the URL
4. Test the root page responds with 200

Note: `pnpm dev` serves the Astro site only. To exercise the Worker (markdown negotiation, headers, 404), use `pnpm preview` (builds, then `wrangler dev` on port 8787).
