import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "a",
  "blockquote",
  "br",
  "img",
  "div",
  "iframe",
] as const;

const ALLOWED_IFRAME_HOSTNAMES = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
];

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...ALLOWED_TAGS],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title"],
      div: ["data-youtube-video"],
      iframe: [
        "src",
        "width",
        "height",
        "title",
        "frameborder",
        "allow",
        "allowfullscreen",
      ],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      iframe: ["https"],
    },
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
    allowIframeRelativeUrls: false,
  });
}
