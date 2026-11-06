import { html } from "../lib/html";
import { groupSkills, isEmail, type Profile } from "../lib/profile";

const SOURCE_URL = "https://github.com/kom3da/kom3da.dev";
const EXTERNAL = html`target="_blank" rel="noopener noreferrer"`;

function prompt(command: string, delay = 0) {
  return html`<p class="text-muted"><span class="text-lime">~</span> $ <span class="type-sm" style="--n: ${command.length}; --d: ${delay}">${command}</span></p>`;
}

/** Pauses the looping animations (ticker, pane glow); the label is synced by site.ts. */
function motionToggle(className: string) {
  return html`<button type="button" data-motion-toggle aria-pressed="true" class="cursor-pointer text-muted hover:text-lime ${className}">motion: on</button>`;
}

export function header(profile: Profile) {
  const github = profile.links.find((l) => l.label === "GitHub");
  return html`<header class="border-b border-line">
  <div class="mx-auto flex h-14 max-w-[1360px] items-center justify-between px-4 lg:px-10">
    <a href="#about" class="font-extrabold tracking-[-0.02em]">kom3da<span class="text-lime">.dev</span></a>
    ${github && html`<a href="${github.url}" ${EXTERNAL} class="flex min-h-11 items-center text-[13px] text-muted">github ↗</a>`}
  </div>
</header>`;
}

export function hero(profile: Profile) {
  const [firstRole = "", ...otherRoles] = profile.jobTitle.split(" / ");
  const handle = new URL(profile.url).hostname.split(".")[0] ?? "";
  return html`<section id="about" aria-labelledby="name" class="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 pt-14 pb-12 lg:gap-7 lg:px-10 lg:pt-24 lg:pb-20">
  <p class="text-[11px]/[1.6] tracking-[0.08em] text-lime lg:text-[13px]">// ${firstRole.toUpperCase()}${otherRoles.map((role) => html`<br class="lg:hidden"> × ${role.toUpperCase()}`)}</p>
  <p aria-hidden="true" class="prompt"><span class="text-dim">$</span><span class="type ml-[0.2em]" style="--n: ${handle.length}">${handle}</span><span class="cursor"></span></p>
  <div class="flex max-w-[680px] flex-col gap-2 lg:gap-2.5">
    <h1 id="name" class="text-[19px] font-bold tracking-[-0.02em] lg:text-2xl">${profile.nameEn} <span class="font-jp text-sm font-normal text-muted lg:text-base">${profile.name}</span></h1>
    <p class="mt-1.5 font-jp text-[15px]/[1.9] text-body lg:mt-0 lg:text-base/[1.9]">${profile.bio}</p>
  </div>
</section>`;
}

/** Decorative: the same skills are listed accessibly in the Skills pane. */
export function ticker(profile: Profile) {
  const run = html`<span class="flex gap-6 pr-6 whitespace-nowrap lg:gap-9 lg:pr-9">${profile.skills.map((s) => html`<span>${s.name}</span><span class="text-lime">/</span>`)}</span>`;
  return html`<div aria-hidden="true" class="overflow-hidden border-y border-line py-3.5 text-[17px] font-bold tracking-[-0.02em] lg:py-[18px] lg:text-[22px]">
  <div class="track">${run}${run}</div>
</div>`;
}

export function links(profile: Profile) {
  const rows = [
    ...profile.links
      .filter((l) => !isEmail(l))
      .map((l) => ({
        label: l.label.toLowerCase(),
        meta: l.handle ?? l.url,
        url: l.url,
        external: true,
      })),
    { label: "llms.txt", meta: "for AI agents", url: "/llms.txt", external: false },
  ];
  return html`<nav id="links" aria-labelledby="links-title" data-reveal class="relative flex flex-col gap-[18px] border-b border-line px-4 py-10 lg:flex-[1_1_340px] lg:gap-5 lg:border-r lg:border-b-0 lg:px-12 lg:py-12">
  <div class="edge" aria-hidden="true"></div>
  <h2 id="links-title" class="text-[11px] font-medium tracking-[0.08em] text-muted lg:text-xs">01 — LINKS</h2>
  ${prompt("ls links/")}
  <ul class="rise flex flex-col border-t border-line" style="--d: 2">
    ${rows.map(
      (row) =>
        html`<li><a href="${row.url}" ${row.external && EXTERNAL} class="row flex justify-between border-b border-line px-1 py-3.5 lg:px-0 lg:py-[13px]"><span>${row.label}</span><span class="text-muted">${row.meta} ↗</span></a></li>`,
    )}
  </ul>
</nav>`;
}

export function skills(profile: Profile) {
  const groups = groupSkills(profile.skills);
  return html`<section id="skills" aria-labelledby="skills-title" data-reveal class="flex flex-col gap-[18px] px-4 py-10 lg:flex-[2.2_1_520px] lg:gap-5 lg:px-12 lg:py-12">
  <h2 id="skills-title" class="text-[11px] font-medium tracking-[0.08em] text-muted lg:text-xs">02 — SKILLS</h2>
  ${prompt("tree skills/", 2)}
  <div class="rise flex flex-col gap-4 lg:gap-3" style="--d: 4">
    ${groups.map(
      (
        [category, items],
        i,
      ) => html`<div class="flex flex-col gap-1.5 lg:flex-row lg:items-baseline lg:gap-2.5">
      <h3 class="whitespace-nowrap text-muted lg:w-[20ch] lg:shrink-0">${i === groups.length - 1 ? "└──" : "├──"} ${category.toLowerCase()}/</h3>
      <ul class="flex flex-wrap gap-1.5 pl-7 lg:pl-0">${items.map((s) => html`<li id="skill-${s.id}" class="chip">${s.name}</li>`)}</ul>
    </div>`,
    )}
  </div>
</section>`;
}

export function footer(profile: Profile) {
  const email = profile.links.find(isEmail);
  return html`<footer class="flex-1 border-t border-line">
  <div class="mx-auto flex max-w-[1360px] flex-col gap-7 px-4 pt-12 pb-10 lg:gap-10 lg:px-10 lg:pt-[72px] lg:pb-12">
    ${email && html`<a href="${email.url}" class="cta text-[clamp(30px,5vw,72px)] leading-none font-extrabold tracking-[-0.05em]">${email.url.replace("mailto:", "")} <span class="arrow text-lime" aria-hidden="true">→</span></a>`}
    <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 text-[11px]/[1.8] text-muted lg:text-xs">
      <p>© ${new Date().getFullYear()} ${profile.nameEn}</p>
      ${motionToggle("border border-chip px-3.5 py-2.5 lg:hidden")}
      <p class="w-full lg:w-auto">built with Vite · Tailwind CSS · Cloudflare Workers — <a href="${SOURCE_URL}" ${EXTERNAL} class="text-muted">view source ↗</a></p>
    </div>
  </div>
</footer>`;
}

/** tmux-style status bar; site.ts moves aria-current to the section in view. */
export function statusBar() {
  const tabs = ["about", "links", "skills"];
  return html`<nav aria-label="Sections" class="sticky bottom-0 z-10 flex border-t border-line bg-bar text-xs">
  <span aria-hidden="true" class="flex items-center bg-lime px-3 font-extrabold text-ink lg:px-3.5 lg:font-bold"><span class="lg:hidden">❯</span><span class="hidden lg:inline">kom3da</span></span>
  <ul class="flex flex-1 lg:flex-none">
    ${tabs.map(
      (id, i) =>
        html`<li class="flex-1 lg:flex-none"><a href="#${id}" data-spy="${id}" ${i === 0 && html`aria-current="true"`} class="tab block py-3 text-center text-muted lg:px-3.5 lg:py-1.5">${i}:${id}<span class="mark">*</span></a></li>`,
    )}
  </ul>
  ${motionToggle("ml-auto hidden border-l border-line px-3.5 py-1.5 lg:block")}
</nav>`;
}
