import { groupSkills, type Profile } from "./profile";

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
    `- [Links](${profile.url}#links)`,
    `- [Skills](${profile.url}#skills)`,
    "",
  ];
  return lines.join("\n");
}

export function generateLlmsFullTxt(profile: Profile): string {
  const skillSections = groupSkills(profile.skills).flatMap(([category, skills]) => [
    `### ${category}`,
    "",
    ...skills.map((s) => `- ${s.name}`),
    "",
  ]);

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
