import { render } from "./entry-server";
import { generatePersonJsonLd } from "./lib/jsonld";
import { generateLlmsTxt, generateLlmsFullTxt } from "./lib/llms";
import profile from "../profile.json";

interface Env {
  ASSETS: Fetcher;
}

function isPageRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (/\.\w+$/.test(pathname)) return false;
  if (pathname.startsWith("/@") || pathname.startsWith("/node_modules/")) return false;
  return true;
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

    // llms.txt routes (before static asset check — .txt has extension)
    if (url.pathname === "/llms.txt") {
      return new Response(generateLlmsTxt(profile), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    if (url.pathname === "/llms-full.txt") {
      return new Response(generateLlmsFullTxt(profile), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    // Static assets → pass through directly
    if (!isPageRoute(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // Check Cache API for SSR
    const cache = (caches as unknown as { default: Cache }).default;
    const cached = await cache.match(request);
    if (cached) return cached;

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

    const response = new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });

    // Store in cache
    const ctx = globalThis as unknown as { waitUntil?: (p: Promise<void>) => void };
    if (ctx.waitUntil) {
      ctx.waitUntil(cache.put(request, response.clone()));
    } else {
      await cache.put(request, response.clone());
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
