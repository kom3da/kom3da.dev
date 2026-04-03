import type { Skill } from "../types";

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" aria-label="Skills">
      <h2 className="section-prompt">
        <span className="prompt-symbol">&gt;</span> Skills
      </h2>
      {categories.map((category) => (
        <article key={category} className="section-content">
          <h3 className="category-label">{category}</h3>
          <ul className="skill-tags">
            {skills
              .filter((s) => s.category === category)
              .map((skill) => (
                <li key={skill.id} id={`skill-${skill.id}`} className="skill-tag">
                  {skill.name}
                </li>
              ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
