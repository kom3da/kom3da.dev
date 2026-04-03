import { Terminal } from "./components/Terminal";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Neofetch } from "./components/Neofetch";
import { ThemeToggle } from "./components/ThemeToggle";
import profile from "../profile.json";

export function App() {
  return (
    <div className="app">
      <a href="#about" className="skip-link">Skip to content</a>
      <header className="site-header">
        <h1 className="site-title">kom3da.dev</h1>
        <ThemeToggle />
      </header>
      <main>
        <Terminal title="komeda@dev ~ ">
          <About profile={profile} />
          <Skills skills={profile.skills} />
          <Neofetch />
        </Terminal>
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {profile.nameEn}</p>
        <p className="footer-source">
          <a href="https://github.com/kom3da/kom3da.dev" target="_blank" rel="noopener noreferrer">
            View Source on GitHub
          </a>
          {" · "}
          Built with <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>
        </p>
      </footer>
    </div>
  );
}
