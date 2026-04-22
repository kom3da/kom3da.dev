import { render } from "./entry-server";
import { generateJsonLd } from "./lib/jsonld";
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

    // Non-root page routes → 404
    if (url.pathname !== "/" && isPageRoute(url.pathname)) {
      const notFound = await env.ASSETS.fetch(
        new Request(new URL("/404.html", request.url))
      );
      return new Response(notFound.body, {
        status: 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // Static assets → pass through directly
    if (!isPageRoute(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // Markdown content negotiation for AI agents
    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("text/markdown")) {
      return new Response(
        request.method === "HEAD" ? null : generateLlmsFullTxt(profile),
        {
          headers: {
            "content-type": "text/markdown; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
            "vary": "accept",
          },
        }
      );
    }

    // Check Cache API for SSR (production only, GET only — cache API rejects HEAD)
    const cache = typeof caches !== "undefined"
      ? (caches as unknown as { default: Cache }).default
      : null;
    const cacheable = cache && request.method === "GET";
    if (cacheable) {
      const cached = await cache.match(request);
      if (cached) return cached;
    }

    // SSR
    const appHtml = render();
    const jsonLd = generateJsonLd(profile);
    const jsonLdTag = `<script type="application/ld+json">${jsonLd}</script>`;

    const pageTitle = `${profile.nameEn} - ${profile.jobTitle} | kom3da.dev`;
    const description = `${profile.nameEn} (${profile.name}) - ${profile.jobTitle}。${profile.bio}`;
    const metaTags = [
      `<meta name="description" content="${description}" />`,
      `<meta property="og:title" content="${pageTitle}" />`,
      `<meta property="og:description" content="${profile.bio}" />`,
      `<meta property="og:image" content="${profile.url}/og-image.png?v=2" />`,
      `<meta property="og:url" content="${profile.url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${pageTitle}" />`,
      `<meta name="twitter:description" content="${profile.bio}" />`,
      `<meta name="twitter:image" content="${profile.url}/og-image.png?v=2" />`,
    ].join("\n    ");

    const templateResponse = await env.ASSETS.fetch(
      new Request(new URL("/index.html", request.url))
    );
    const template = await templateResponse.text();

    const html = template
      .replace("<!--ssr-->", appHtml)
      .replace("<!--jsonld-->", jsonLdTag)
      .replace("<!--meta-->", metaTags)
      .replace("<!--title-->", `<title>${pageTitle}</title>`);

    const linkHeader = [
      '</llms.txt>; rel="alternate"; type="text/markdown"',
      '</llms-full.txt>; rel="alternate"; type="text/markdown"',
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
    ].join(", ");

    const response = new Response(request.method === "HEAD" ? null : html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=86400",
        "link": linkHeader,
        "vary": "accept",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      },
    });

    // Store in cache (production only, GET only)
    if (cacheable) {
      const ctx = globalThis as unknown as { waitUntil?: (p: Promise<void>) => void };
      if (ctx.waitUntil) {
        ctx.waitUntil(cache.put(request, response.clone()));
      } else {
        await cache.put(request, response.clone());
      }
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
