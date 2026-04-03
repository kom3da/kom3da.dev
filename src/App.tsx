import { Terminal } from "./components/Terminal";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Neofetch } from "./components/Neofetch";
import { ThemeToggle } from "./components/ThemeToggle";
import profile from "../profile.json";

export function App() {
  return (
    <div className="app">
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
      </footer>
    </div>
  );
}
