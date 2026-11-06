import { describe, expect, it } from "vite-plus/test";
import { generateJsonLd } from "./jsonld";
import { type Profile, profile } from "./profile";

describe("generateJsonLd", () => {
  const now = new Date("2026-11-07T00:00:00Z");
  const data = JSON.parse(generateJsonLd(profile, now));
  const [page, site] = data["@graph"];

  it("describes a ProfilePage about the person and the WebSite", () => {
    expect(data["@context"]).toBe("https://schema.org");
    expect(page["@type"]).toBe("ProfilePage");
    expect(page.dateModified).toBe(now.toISOString());
    expect(page.mainEntity.name).toBe(profile.nameEn);
    expect(site).toEqual({ "@type": "WebSite", name: "kom3da.dev", url: profile.url });
  });

  it("splits email from sameAs links", () => {
    expect(page.mainEntity.email).toBe("me@kom3da.dev");
    expect(page.mainEntity.sameAs).toEqual(["https://github.com/kom3da", "https://x.com/kom3da"]);
  });

  it("escapes < so the output cannot break out of a script tag", () => {
    const hostile: Profile = { ...profile, bio: "</script><script>alert(1)</script>" };
    const json = generateJsonLd(hostile, now);
    expect(json).not.toContain("<");
    expect(JSON.parse(json)["@graph"][0].mainEntity.description).toBe(hostile.bio);
  });
});
