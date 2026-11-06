import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("routes", () => {
  test.skip(({ isMobile }) => isMobile, "Route checks are viewport independent");

  for (const [path, type] of [
    ["/", "text/html"],
    ["/llms.txt", "text/plain"],
    ["/llms-full.txt", "text/plain"],
    ["/sitemap.xml", "application/xml"],
    ["/favicon.ico", "image/svg+xml"],
  ]) {
    test(`GET ${path} → 200 ${type}`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain(type);
      expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    });
  }

  test("unknown paths return the 404 page", async ({ request }) => {
    const res = await request.get("/nonexistent");
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("noindex");
  });

  test("root advertises markdown alternates", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers().link).toContain("</llms.txt>");
    expect(res.headers().vary).toContain("Accept");
  });

  test("root serves markdown to agents that ask for it", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/markdown" } });
    expect(res.headers()["content-type"]).toContain("text/markdown");
    expect(await res.text()).toMatch(/^# Ryuichi Komeda/);
  });
});

test.describe("page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the name as the only h1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Ryuichi Komeda");
  });

  test("does not scroll horizontally", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("has no detectable accessibility violations", async ({ page }) => {
    // Let the hero typing and pane reveals finish so axe sees final colors
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });

  test("reveals the skills pane once it scrolls into view", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Skills pane starts in view on desktop");
    const skills = page.locator("#skills");
    await expect(skills).not.toHaveClass(/is-visible/);
    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toHaveClass(/is-visible/);
  });

  test("status bar follows the section in view", async ({ page }) => {
    const tab = (id: string) => page.locator(`[data-spy="${id}"]`);
    await expect(tab("about")).toHaveAttribute("aria-current", "true");
    await tab("skills").click();
    await expect(tab("skills")).toHaveAttribute("aria-current", "true");
    await expect(tab("about")).not.toHaveAttribute("aria-current", "true");
  });

  test("motion toggle pauses looping animations and is remembered", async ({ page }) => {
    const toggle = page.locator("[data-motion-toggle]:visible");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveText("motion: off");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  });
});
