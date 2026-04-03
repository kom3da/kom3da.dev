# kom3da.dev

Personal profile site for Ryuichi Komeda.

## Tech Stack

- [Vite 8](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) (SSR + Cache API)
- GitHub Actions (CI/CD)

## Features

- Terminal-style UI with dark/light theme
- AI-optimized: `/llms.txt`, `/llms-full.txt`, JSON-LD (Person schema), semantic HTML
- Auto-deploy on push to `main`

## Development

```bash
npm install
npm run dev
```

## Data

Edit [`profile.json`](profile.json) to update profile content.
