import { isEmail, type Profile } from "./profile";

export function generateJsonLd(profile: Profile, now = new Date()): string {
  const person = {
    "@type": "Person",
    name: profile.nameEn,
    alternateName: profile.name,
    jobTitle: profile.jobTitle,
    description: profile.bio,
    url: profile.url,
    email: profile.links.find(isEmail)?.url.replace("mailto:", ""),
    sameAs: profile.links.filter((l) => !isEmail(l)).map((l) => l.url),
    knowsAbout: profile.skills.map((s) => s.name),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        dateCreated: "2026-04-03T00:00:00+09:00",
        dateModified: now.toISOString(),
        mainEntity: person,
      },
      {
        "@type": "WebSite",
        name: "kom3da.dev",
        url: profile.url,
      },
    ],
  };

  // Escape "<" so the JSON cannot close the surrounding <script> tag
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
