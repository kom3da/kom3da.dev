Build the project and verify the production site is working correctly.

Steps:

1. Run `pnpm check` (Biome, astro check, worker tsc, Vitest) and verify it passes
2. Run `pnpm build` and verify it succeeds
3. Run `pnpm test:e2e` (Playwright starts `wrangler dev` itself) and report results. It covers:
   - `GET /`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/favicon.ico` → 200
   - `GET /nonexistent` → 404
   - Markdown negotiation, Link header, accessibility (axe), no horizontal scroll on mobile
4. Fetch `https://kom3da.dev/` and verify the live site responds correctly
5. Report results
