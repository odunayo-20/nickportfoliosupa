import sanitizeHtml from 'sanitize-html'

/**
 * Rich-text HTML from the admin editor (TinyMCE) is rendered with dangerouslySetInnerHTML on
 * public pages. Sanitize it on the server (inside the cached fetchers, so it runs once per cache
 * fill) so a compromised/over-privileged account can't plant scripts on the public site.
 *
 * Keeps what the editor produces — headings, lists, links, images, tables, code, inline
 * alignment/colour styles, classes, YouTube/Vimeo embeds — and strips scripts, event handlers,
 * javascript: URLs, forms and other active content.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img', 'figure', 'figcaption', 'picture', 'source', 'video', 'audio', 'iframe',
    'span', 'del', 'ins', 's', 'u', 'sub', 'sup', 'mark', 'kbd', 'hr', 'colgroup', 'col',
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'style', 'title', 'lang', 'dir', 'align'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'],
    source: ['src', 'srcset', 'type', 'media', 'sizes'],
    video: ['src', 'poster', 'controls', 'width', 'height', 'muted', 'loop', 'playsinline', 'preload'],
    audio: ['src', 'controls', 'preload'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
    td: ['colspan', 'rowspan', 'width'],
    th: ['colspan', 'rowspan', 'scope', 'width'],
    col: ['span', 'width'],
    ol: ['start', 'type', 'reversed'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify|start|end)$/],
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'font-weight': [/^(normal|bold|bolder|lighter|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^[a-z\s-]+$/i],
      width: [/^\d+(\.\d+)?(px|%|em|rem)?$/],
      height: [/^\d+(\.\d+)?(px|%|em|rem)?$/],
      'max-width': [/^\d+(\.\d+)?(px|%|em|rem)?$/],
      float: [/^(left|right|none)$/],
      margin: [/^[\d\s.a-z%-]+$/i],
      'margin-left': [/^[\d.a-z%-]+$/i],
      'margin-right': [/^[\d.a-z%-]+$/i],
      'padding-left': [/^[\d.a-z%]+$/i],
      'list-style-type': [/^[a-z-]+$/i],
      'vertical-align': [/^[a-z-]+$/i],
      'border-collapse': [/^(collapse|separate)$/],
    },
  },
  transformTags: {
    // Links opening a new tab must not get window.opener.
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs,
    }),
  },
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return ''
  return sanitizeHtml(html, OPTIONS)
}
