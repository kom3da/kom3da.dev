import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kom3da.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
