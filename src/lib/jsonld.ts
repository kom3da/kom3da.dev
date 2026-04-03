import type { Profile } from "../data/profile";

export function generatePersonJsonLd(profile: Profile): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.nameEn,
    alternateName: profile.name,
    jobTitle: profile.jobTitle,
    url: profile.url,
    sameAs: profile.links.map((l) => l.url),
    knowsAbout: profile.skills.map((s) => s.name),
  };
  return JSON.stringify(jsonLd);
}
