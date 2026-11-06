import { describe, expect, it } from "vite-plus/test";
import { generateLlmsFullTxt, generateLlmsTxt } from "./llms";
import { profile } from "./profile";

describe("generateLlmsTxt", () => {
  const txt = generateLlmsTxt(profile);

  it("starts with the name and bio", () => {
    expect(txt.startsWith(`# ${profile.nameEn}\n\n> ${profile.bio}\n`)).toBe(true);
  });

  it("lists every profile link", () => {
    for (const link of profile.links) {
      expect(txt).toContain(`- [${link.label}](${link.url})`);
    }
  });

  it("links to the page sections", () => {
    for (const id of ["about", "links", "skills"]) {
      expect(txt).toContain(`${profile.url}#${id}`);
    }
  });
});

describe("generateLlmsFullTxt", () => {
  const txt = generateLlmsFullTxt(profile);

  it("includes name, title and website", () => {
    expect(txt).toContain(`**Name:** ${profile.nameEn} (${profile.name})`);
    expect(txt).toContain(`**Title:** ${profile.jobTitle}`);
    expect(txt).toContain(`**Website:** ${profile.url}`);
  });

  it("groups every skill under its category heading", () => {
    for (const skill of profile.skills) {
      const heading = txt.indexOf(`### ${skill.category}`);
      expect(heading).toBeGreaterThan(-1);
      expect(txt.indexOf(`- ${skill.name}`, heading)).toBeGreaterThan(heading);
    }
  });
});
