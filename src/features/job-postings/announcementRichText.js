const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'UL',
  'OL',
  'LI',
  'DIV',
  'A',
  'IMG',
  'SPAN',
  'FONT',
]);

export function sanitizeAnnouncementHtml(html = '') {
  const template = document.createElement('template');
  template.innerHTML = html;
  const clean = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
    const fragment = document.createDocumentFragment();
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(node.nodeName)) return fragment;
    const element = ALLOWED_TAGS.has(node.nodeName)
      ? document.createElement(node.nodeName.toLowerCase())
      : fragment;
    if (element.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'A') {
        const href = node.getAttribute('href')?.trim() || '';
        if (/^https?:\/\//i.test(href)) {
          element.setAttribute('href', href);
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener noreferrer');
        }
      }
      if (node.nodeName === 'IMG') {
        const src = node.getAttribute('src')?.trim() || '';
        if (
          !/^https?:\/\//i.test(src) &&
          !/^\/(?!\/)/.test(src) &&
          !/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(src)
        )
          return fragment;
        element.setAttribute('src', src);
        element.setAttribute('alt', node.getAttribute('alt') || 'รูปประกอบรายละเอียดงาน');
      }
      const color =
        node.style?.color || (node.nodeName === 'FONT' ? node.getAttribute('color') : '');
      if (color && CSS.supports('color', color)) element.style.color = color;
    }
    for (const child of node.childNodes) element.append(clean(child));
    return element;
  };
  const result = document.createElement('div');
  for (const child of template.content.childNodes) result.append(clean(child));
  return result.innerHTML;
}
