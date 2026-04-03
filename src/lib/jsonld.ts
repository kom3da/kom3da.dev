import type { Profile } from "../types";

export function generateJsonLd(profile: Profile): string {
  const person = {
    "@type": "Person",
    name: profile.nameEn,
    alternateName: profile.name,
    jobTitle: profile.jobTitle,
    description: profile.bio,
    url: profile.url,
    email: profile.links.find((l) => l.label === "Email")?.url.replace("mailto:", ""),
    sameAs: profile.links.filter((l) => l.label !== "Email").map((l) => l.url),
    knowsAbout: profile.skills.map((s) => s.name),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        dateCreated: "2026-04-03T00:00:00+09:00",
        dateModified: new Date().toISOString(),
        mainEntity: person,
      },
      {
        "@type": "WebSite",
        name: "kom3da.dev",
        url: profile.url,
      },
    ],
  };

  return JSON.stringify(jsonLd);
}
