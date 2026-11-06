import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "kom3da-dev",
    compatibilityDate: "2026-11-01",
    entrypoint: "./worker/index.ts",
    assets: {
      notFoundHandling: "404-page",
      // Every request goes through the Worker; it hands static files to ASSETS
      runWorkerFirst: true,
    },
    domains: ["kom3da.dev", "www.kom3da.dev"],
    env: {
      ASSETS: bindings.assets(),
    },
  },
});
