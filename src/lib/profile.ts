import data from "../../profile.json";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Link {
  label: string;
  url: string;
  handle?: string;
}

export interface Profile {
  name: string;
  nameEn: string;
  jobTitle: string;
  bio: string;
  url: string;
  links: Link[];
  skills: Skill[];
}

export const profile: Profile = data;

export const isEmail = (link: Link) => link.url.startsWith("mailto:");

export function groupSkills(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
  }
  return [...groups];
}
