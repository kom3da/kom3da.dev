const root = document.documentElement;
// Hide reveal targets only once this script runs, so a failed load leaves content visible
root.classList.add("js");

// Start pane animations once each pane scrolls into view
const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealer.unobserve(entry.target);
    }
  },
  { threshold: 0.15 },
);
for (const el of document.querySelectorAll("[data-reveal]")) revealer.observe(el);

// Mark the status bar tab of the section currently in view
const tabs = [...document.querySelectorAll<HTMLAnchorElement>("[data-spy]")];
const sections = tabs
  .map((tab) => document.getElementById(tab.dataset.spy ?? ""))
  .filter((section) => section !== null);

function currentSection(): HTMLElement | undefined {
  const line = window.innerHeight * 0.4;
  const passed = sections.filter((s) => s.getBoundingClientRect().top <= line);
  const last = passed.at(-1);
  if (!last) return sections[0];
  // Side-by-side panes share a top edge; prefer the one the user navigated to
  const top = last.getBoundingClientRect().top;
  const tied = passed.filter((s) => Math.abs(s.getBoundingClientRect().top - top) < 1);
  return tied.find((s) => `#${s.id}` === location.hash) ?? tied[0];
}

function updateSpy() {
  const id = currentSection()?.id;
  for (const tab of tabs) {
    if (tab.dataset.spy === id) tab.setAttribute("aria-current", "true");
    else tab.removeAttribute("aria-current");
  }
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateSpy();
    });
  },
  { passive: true },
);
window.addEventListener("hashchange", updateSpy);
updateSpy();

// Motion toggle: pauses the looping animations and remembers the choice
const toggles = document.querySelectorAll<HTMLButtonElement>("[data-motion-toggle]");

function renderMotion() {
  const on = root.dataset.motion !== "off";
  for (const button of toggles) {
    button.setAttribute("aria-pressed", String(on));
    button.textContent = `motion: ${on ? "on" : "off"}`;
  }
}

for (const button of toggles) {
  button.addEventListener("click", () => {
    const turnOff = root.dataset.motion !== "off";
    if (turnOff) root.dataset.motion = "off";
    else delete root.dataset.motion;
    try {
      localStorage.setItem("motion", turnOff ? "off" : "on");
    } catch {
      // Storage may be unavailable (private mode); the toggle still works for this visit
    }
    renderMotion();
  });
}
renderMotion();
