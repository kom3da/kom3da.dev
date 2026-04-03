import type { Profile } from "../data/profile";

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <section id="about" aria-label="About">
      <h2 className="section-prompt">
        <span className="prompt-symbol">&gt;</span> About
      </h2>
      <article className="section-content">
        <p className="output-line">
          <span className="label">Name:</span> {profile.nameEn} ({profile.name}
          )
        </p>
        <p className="output-line">
          <span className="label">Title:</span> {profile.jobTitle}
        </p>
        <p className="output-line">
          <span className="label">Bio:</span> {profile.bio}
        </p>
      </article>
      {profile.links.length > 0 && (
        <nav aria-label="External links">
          <h3 className="section-prompt sub">
            <span className="prompt-symbol">&gt;</span> Links
          </h3>
          <ul className="link-list">
            {profile.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
