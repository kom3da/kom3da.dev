import type { ReactNode } from "react";

interface TerminalProps {
  title: string;
  children: ReactNode;
}

export function Terminal({ title, children }: TerminalProps) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
