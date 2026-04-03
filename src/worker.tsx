import { render } from "./entry-server";
import { generatePersonJsonLd } from "./lib/jsonld";
import { generateLlmsTxt, generateLlmsFullTxt } from "./lib/llms";
import profile from "./data/profile";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // www → apex redirect
    if (url.hostname === "www.kom3da.dev") {
      url.hostname = "kom3da.dev";
      return Response.redirect(url.toString(), 301);
    }

    // /favicon.ico → SVG favicon
    if (url.pathname === "/favicon.ico") {
      return env.ASSETS.fetch(new Request(new URL("/favicon.svg", request.url)));
    }

    // Check Cache API first
    const cache = (caches as unknown as { default: Cache }).default;
    const cached = await cache.match(request);
    if (cached) return cached;

    // Generate response
    let response: Response;

    if (url.pathname === "/llms.txt") {
      response = new Response(generateLlmsTxt(profile), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    } else if (url.pathname === "/llms-full.txt") {
      response = new Response(generateLlmsFullTxt(profile), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    } else {
      // SSR
      const appHtml = render();
      const jsonLd = generatePersonJsonLd(profile);
      const jsonLdTag = `<script type="application/ld+json">${jsonLd}</script>`;

      const templateResponse = await env.ASSETS.fetch(
        new Request(new URL("/index.html", request.url))
      );
      const template = await templateResponse.text();

      const html = template
        .replace("<!--ssr-->", appHtml)
        .replace("<!--jsonld-->", jsonLdTag);

      response = new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300, s-maxage=86400",
        },
      });
    }

    // Store in cache (non-blocking)
    const ctx = (globalThis as unknown as { waitUntil?: (p: Promise<void>) => void });
    if (ctx.waitUntil) {
      ctx.waitUntil(cache.put(request, response.clone()));
    } else {
      await cache.put(request, response.clone());
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
