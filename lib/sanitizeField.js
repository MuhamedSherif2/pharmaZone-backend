import sanitizeHtml from "sanitize-html";

export function sanitizeField(field) {
  const clean = sanitizeHtml(field, {
    allowedTags: [],
  });

  return clean;
}
