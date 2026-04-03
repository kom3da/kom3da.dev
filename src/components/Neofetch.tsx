const info = [
  { key: "Framework", value: "React 19" },
  { key: "Build", value: "Vite 8" },
  { key: "Runtime", value: "Cloudflare Workers" },
  { key: "Lang", value: "TypeScript" },
  { key: "Style", value: "CSS (no framework)" },
  { key: "CI/CD", value: "GitHub Actions" },
  { key: "AI", value: "llms.txt / JSON-LD / Semantic HTML" },
];

const ascii = [
  "  _    ____      _       ",
  " | | _|___ \\  __| | __ _ ",
  " | |/ / __) |/ _` |/ _` |",
  " |   < / __/| (_| | (_| |",
  " |_|\\_\\_____|\\__,_|\\__,_|",
];

export function Neofetch() {
  return (
    <section id="built-with" aria-label="Built with">
      <h2 className="section-prompt">
        <span className="prompt-symbol">&gt;</span> Built with
      </h2>
      <div className="neofetch">
        <pre className="neofetch-ascii" aria-hidden="true">
          {ascii.join("\n")}
        </pre>
        <div className="neofetch-info">
          <p className="neofetch-title">
            komeda<span className="neofetch-at">@</span>dev
          </p>
          <p className="neofetch-separator">----------</p>
          {info.map((item) => (
            <p key={item.key} className="neofetch-line">
              <span className="neofetch-key">{item.key}</span>
              <span className="neofetch-value">{item.value}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
