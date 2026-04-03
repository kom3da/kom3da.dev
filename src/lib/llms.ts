import type { Profile } from "../data/profile";

export function generateLlmsTxt(profile: Profile): string {
  const lines = [
    `# ${profile.nameEn}`,
    "",
    `> ${profile.bio}`,
    "",
    "## Links",
    "",
    `- [Website](${profile.url})`,
    ...profile.links.map((l) => `- [${l.label}](${l.url})`),
    "",
    "## Sections",
    "",
    `- [About](${profile.url}#about)`,
    `- [Skills](${profile.url}#skills)`,
    "",
  ];
  return lines.join("\n");
}

export function generateLlmsFullTxt(profile: Profile): string {
  const skillsByCategory = new Map<string, typeof profile.skills>();
  for (const skill of profile.skills) {
    const list = skillsByCategory.get(skill.category) ?? [];
    list.push(skill);
    skillsByCategory.set(skill.category, list);
  }

  const skillSections: string[] = [];
  for (const [category, skills] of skillsByCategory) {
    skillSections.push(`### ${category}`);
    skillSections.push("");
    for (const s of skills) {
      skillSections.push(`- ${s.name}`);
    }
    skillSections.push("");
  }

  const lines = [
    `# ${profile.nameEn}`,
    "",
    `> ${profile.bio}`,
    "",
    "## About",
    "",
    `**Name:** ${profile.nameEn} (${profile.name})`,
    `**Title:** ${profile.jobTitle}`,
    `**Website:** ${profile.url}`,
    "",
    "### Links",
    "",
    ...profile.links.map((l) => `- [${l.label}](${l.url})`),
    "",
    "## Skills",
    "",
    ...skillSections,
  ];
  return lines.join("\n");
}
