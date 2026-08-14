import sanitizeHtml from "sanitize-html";
import {
  classifyArticleHref,
  isOffsiteArticleHref,
} from "@/lib/blog/article-href";

const ALLOWED_TAGS = [
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

export interface SanitizeArticleHtmlOptions {
  siteOrigin?: string;
}

function articleAnchorAttribs(
  attribs: Record<string, string>,
  siteOrigin?: string,
): Record<string, string> {
  const href = attribs.href?.trim() ?? "";
  const next: Record<string, string> = {};

  if (href.length > 0) {
    next.href = href;
  }

  if (typeof attribs.title === "string" && attribs.title.length > 0) {
    next.title = attribs.title;
  }

  const kind = classifyArticleHref(href);

  if (kind === "external" && isOffsiteArticleHref(href, siteOrigin)) {
    next.target = "_blank";
    next.rel = "noopener noreferrer";
    return next;
  }

  return next;
}

export function sanitizeArticleHtml(
  html: string,
  options: SanitizeArticleHtmlOptions = {},
): string {
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
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      iframe: ["https"],
    },
    transformTags: {
      h1: "h2",
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: articleAnchorAttribs(attribs, options.siteOrigin),
      }),
    },
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
    allowIframeRelativeUrls: false,
  });
}
