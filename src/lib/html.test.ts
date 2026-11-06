import { describe, expect, it } from "vite-plus/test";
import { escapeHtml, html, raw } from "./html";

describe("html", () => {
  it("escapes interpolated strings", () => {
    expect(html`<p>${"<script>\"&'</script>"}</p>`.value).toBe(
      "<p>&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;</p>",
    );
  });

  it("keeps SafeHtml and nested templates as-is", () => {
    const inner = html`<b>${"x<y"}</b>`;
    expect(html`<p>${inner}${raw("<br>")}</p>`.value).toBe("<p><b>x&lt;y</b><br></p>");
  });

  it("flattens arrays and drops empty values", () => {
    expect(html`<ul>${["a", "b"].map((s) => html`<li>${s}</li>`)}${false}${null}</ul>`.value).toBe(
      "<ul><li>a</li><li>b</li></ul>",
    );
  });

  it("renders numbers", () => {
    expect(html`<i>${0}</i>`.value).toBe("<i>0</i>");
  });

  it("escapes attribute-breaking quotes", () => {
    expect(escapeHtml(`" onload="x`)).toBe("&quot; onload=&quot;x");
  });
});
