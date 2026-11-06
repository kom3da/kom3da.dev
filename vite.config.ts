import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import { site } from "./src/build/site-plugin";

export default defineConfig({
  plugins: [site(), tailwindcss(), cloudflare()],
  server: { port: 4321 },
  environments: {
    client: {
      build: { rollupOptions: { input: { index: "index.html", notFound: "404.html" } } },
    },
  },
  fmt: {
    ignorePatterns: [".cloudflare/**", "dist/**"],
    // Leave html`...` templates as written; reflowing them changes the rendered strings
    embeddedLanguageFormatting: "off",
  },
  lint: {
    ignorePatterns: [".cloudflare/**", "dist/**"],
    // Type-check through tsgolint; each file uses its nearest tsconfig (worker/ has its own)
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    "*": "vp check --fix",
  },
});
