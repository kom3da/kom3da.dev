# kom3da.dev

Personal profile site for Ryuichi Komeda (米田 龍一).

## Tech Stack

- [Astro](https://astro.build/) (static output) + [Tailwind CSS](https://tailwindcss.com/) + TypeScript
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) (Static Assets + a thin Worker)
- Tooling: mise, pnpm, Biome, Vitest, Playwright + axe, lefthook, Renovate
- GitHub Actions (checks + E2E on every PR, deploy with cache purge on `main`)

## Features

- tmux-style terminal UI, dark only, with scroll-triggered motion (pausable, respects reduced motion)
- AI-optimized: `/llms.txt`, `/llms-full.txt`, markdown content negotiation, `Link` header, JSON-LD (ProfilePage + Person + WebSite), semantic HTML
- SEO: robots.txt, sitemap.xml, canonical URL, OGP / Twitter Cards
- Accessibility: WCAG AA contrast (checked by axe), skip navigation, works without JS
- Mobile: responsive, PWA manifest, Apple touch icon, theme-color
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Analytics: Cloudflare Web Analytics + GA4

## Development

```bash
mise install
pnpm install
pnpm dev
```

See [CLAUDE.md](CLAUDE.md) for all commands.

## Data

Edit [`profile.json`](profile.json) to update profile content. Push to `main` to deploy.
