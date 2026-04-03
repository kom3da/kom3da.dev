# kom3da.dev

Personal profile site for Ryuichi Komeda (米田 龍一).

## Tech Stack

- [Vite 8](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) (SSR + Cache API)
- GitHub Actions (CI/CD with auto cache purge)

## Features

- Terminal-style UI with dark/light theme (follows OS preference)
- AI-optimized: `/llms.txt`, `/llms-full.txt`, JSON-LD (ProfilePage + Person + WebSite), semantic HTML
- SEO: robots.txt, sitemap.xml, canonical URL, OGP / Twitter Cards
- Accessibility: WCAG AA contrast, skip navigation, prefers-reduced-motion, ARIA labels
- Mobile: responsive, PWA manifest, Apple touch icon, theme-color
- Security: CSP-ready headers, Permissions-Policy, X-Frame-Options
- Analytics: Cloudflare Web Analytics + GA4
- Auto-deploy on push to `main`

## Development

```bash
npm install
npm run dev
```

## Data

Edit [`profile.json`](profile.json) to update profile content. Push to `main` to deploy.
