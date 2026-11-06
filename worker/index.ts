const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const ROOT_LINK_HEADER = [
  '</llms.txt>; rel="alternate"; type="text/plain"',
  '</llms-full.txt>; rel="alternate"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

function withHeaders(response: Response, isRoot: boolean): Response {
  const res = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.headers.set(name, value);
  if (isRoot) {
    res.headers.set("Link", ROOT_LINK_HEADER);
    res.headers.append("Vary", "Accept");
  }
  return res;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.kom3da.dev") {
      url.hostname = "kom3da.dev";
      return withHeaders(
        new Response(null, { status: 301, headers: { Location: url.toString() } }),
        false,
      );
    }

    if (url.pathname === "/favicon.ico") {
      const icon = await env.ASSETS.fetch(new Request(new URL("/favicon.svg", url), request));
      return withHeaders(icon, false);
    }

    const isRoot = url.pathname === "/";

    // Markdown content negotiation for AI agents
    if (isRoot && (request.headers.get("Accept") ?? "").includes("text/markdown")) {
      const md = await env.ASSETS.fetch(new URL("/llms-full.txt", url));
      if (!md.ok) return withHeaders(md, true);
      return withHeaders(
        new Response(request.method === "HEAD" ? null : md.body, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
        true,
      );
    }

    const res = withHeaders(await env.ASSETS.fetch(request), isRoot);
    // Vite emits content-hashed file names under /assets/, so they never change
    if (url.pathname.startsWith("/assets/") && (res.ok || res.status === 304)) {
      res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }
    return res;
  },
} satisfies ExportedHandler<Env>;
