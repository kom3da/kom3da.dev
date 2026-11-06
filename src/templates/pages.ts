import { html, raw } from "../lib/html";
import { generateJsonLd } from "../lib/jsonld";
import type { Profile } from "../lib/profile";
import { footer, header, hero, links, skills, statusBar, ticker } from "./components";

export interface PageParts {
  head: string;
  body: string;
}

export function indexPage(profile: Profile): PageParts {
  const title = `${profile.nameEn} - ${profile.jobTitle} | kom3da.dev`;
  const description = `${profile.nameEn} (${profile.name}) - ${profile.jobTitle}。${profile.bio}`;
  const ogImage = `${profile.url}/og-image.png?v=3`;

  const head = html`<title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${profile.url}/">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${profile.bio}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${profile.url}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${profile.bio}">
    <meta name="twitter:image" content="${ogImage}">
    <script type="application/ld+json">${raw(generateJsonLd(profile))}</script>`;

  const body = html`<a href="#main" class="skip">Skip to content</a>
    ${header(profile)}
    ${hero(profile)}
    ${ticker(profile)}
    <main id="main" class="mx-auto flex w-full max-w-[1360px] flex-col lg:flex-row lg:border-x lg:border-line">
      ${links(profile)}
      ${skills(profile)}
    </main>
    ${footer(profile)}
    ${statusBar()}`;

  return { head: head.value, body: body.value };
}

export function notFoundPage(): PageParts {
  const head = html`<title>404 Not Found | kom3da.dev</title>
    <meta name="description" content="Page not found">
    <meta name="robots" content="noindex">`;

  const body = html`<main class="mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center gap-6 px-4 py-16 lg:px-10">
      <p class="text-muted"><span class="text-lime">~</span> $ cd ./this-page</p>
      <h1 class="text-[clamp(64px,18vw,184px)] leading-[0.9] font-extrabold tracking-[-0.07em]">404</h1>
      <p class="text-muted">zsh: no such file or directory</p>
      <a href="/" class="text-lime">cd ~ →</a>
    </main>`;

  return { head: head.value, body: body.value };
}
