import sanitizeHtml from "sanitize-html";

const sanitizerOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "a",
    "code",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
  },
};

export function sanitizeRichText(value: string | null | undefined) {
  return sanitizeHtml(value ?? "", sanitizerOptions);
}

export function stripRichText(value: string | null | undefined) {
  return sanitizeHtml(value ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}

export function hasRichTextContent(value: string | null | undefined) {
  return stripRichText(value).length > 0;
}
