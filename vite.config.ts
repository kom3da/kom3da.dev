import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { site } from "./src/build/site-plugin";

export default defineConfig({
  plugins: [site(), tailwindcss(), cloudflare()],
  server: { port: 4321 },
  environments: {
    client: {
      build: { rollupOptions: { input: { index: "index.html", notFound: "404.html" } } },
    },
  },
});
