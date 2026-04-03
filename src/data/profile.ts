import profileData from "../../profile.json";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Profile {
  name: string;
  nameEn: string;
  jobTitle: string;
  bio: string;
  url: string;
  links: { label: string; url: string }[];
  skills: Skill[];
}

const profile: Profile = profileData;

export default profile;
