import type { Profile } from "../types";

export function generatePersonJsonLd(profile: Profile): string {
  const person = {
    "@type": "Person",
    name: profile.nameEn,
    alternateName: profile.name,
    jobTitle: profile.jobTitle,
    url: profile.url,
    email: profile.links.find((l) => l.label === "Email")?.url.replace("mailto:", ""),
    sameAs: profile.links.filter((l) => l.label !== "Email").map((l) => l.url),
    knowsAbout: profile.skills.map((s) => s.name),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2026-04-03T00:00:00+09:00",
    dateModified: new Date().toISOString(),
    mainEntity: person,
  };

  return JSON.stringify(jsonLd);
}
