import type { Plugin } from "vite";
import { generateLlmsFullTxt, generateLlmsTxt } from "../lib/llms";
import { profile } from "../lib/profile";
import { generateSitemap } from "../lib/sitemap";
import { indexPage, notFoundPage, type PageParts } from "../templates/pages";

/** Text files generated from profile.json, served at the site root. */
const generatedFiles: Record<string, { type: string; render: () => string }> = {
  "llms.txt": { type: "text/plain", render: () => generateLlmsTxt(profile) },
  "llms-full.txt": { type: "text/plain", render: () => generateLlmsFullTxt(profile) },
  "sitemap.xml": { type: "application/xml", render: () => generateSitemap(profile) },
};

function pageFor(path: string): PageParts {
  return path.endsWith("/404.html") ? notFoundPage() : indexPage(profile);
}

/**
 * Renders the HTML entry points from profile.json and emits llms.txt / sitemap.xml,
 * so the whole site is static output built by Vite.
 */
export function site(): Plugin {
  return {
    name: "kom3da:site",
    transformIndexHtml: {
      order: "pre",
      handler(source, ctx) {
        const { head, body } = pageFor(ctx.path);
        // Function replacers keep `$` sequences in content from being expanded
        return source.replace("<!--head-->", () => head).replace("<!--body-->", () => body);
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = generatedFiles[(req.url ?? "").split("?")[0]?.slice(1) ?? ""];
        if (!file) return next();
        res.setHeader("Content-Type", `${file.type}; charset=utf-8`);
        res.end(file.render());
      });
    },
    generateBundle() {
      if (this.environment.name !== "client") return;
      for (const [fileName, file] of Object.entries(generatedFiles)) {
        this.emitFile({ type: "asset", fileName, source: file.render() });
      }
    },
  };
}
