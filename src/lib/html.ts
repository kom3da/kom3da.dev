/** Markup that is already safe to insert as-is. */
export class SafeHtml {
  constructor(readonly value: string) {}
  toString() {
    return this.value;
  }
}

export type HtmlValue = SafeHtml | string | number | false | null | undefined | HtmlValue[];

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

function renderValue(value: HtmlValue): string {
  if (value === null || value === undefined || value === false) return "";
  if (Array.isArray(value)) return value.map(renderValue).join("");
  if (value instanceof SafeHtml) return value.value;
  return escapeHtml(String(value));
}

/** Tagged template that escapes every interpolated value unless it is SafeHtml. */
export function html(strings: TemplateStringsArray, ...values: HtmlValue[]): SafeHtml {
  let out = strings[0] ?? "";
  values.forEach((value, i) => {
    out += renderValue(value) + (strings[i + 1] ?? "");
  });
  return new SafeHtml(out);
}

export const raw = (markup: string) => new SafeHtml(markup);
