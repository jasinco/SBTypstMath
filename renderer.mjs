import { $typst, TypstSnippet } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs';

const asset = name => new URL(name, import.meta.url).href;
$typst.setCompilerInitOptions({ getModule: () => asset('compiler.wasm') });
$typst.setRendererInitOptions({ getModule: () => asset('renderer.wasm') });
$typst.use(TypstSnippet.disableDefaultFontAssets(), TypstSnippet.preloadFonts([
  asset('NewCMMath-Regular.otf'), asset('NewCM10-Regular.otf'),
  asset('NewCM10-Italic.otf'), asset('NewCM10-Bold.otf'),
  asset('NewCM10-BoldItalic.otf'),
]));

const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
let queue = Promise.resolve();

function renderSource(source, altText) {
  const job = queue.then(async () => {
    const svg = await $typst.svg({ mainContent: source });
    if (!svg) throw new Error('Typst could not compile this expression');
    const width = Number(svg.match(/<svg\b[^>]*\bwidth="([\d.]+)"/)?.[1]);
    if (!Number.isFinite(width) || width <= 0) throw new Error('Typst returned an invalid SVG');
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
    return `<img class="typst-math-image" style="width:${width / 12}em" src="${url}" alt="${escape(altText)}">`;
  });
  queue = job.catch(() => {});
  return job.catch(error => `<span class="typst-math-error" title="${escape(error.message || error)}">${escape(altText)}</span>`);
}

export function render(expression, display = false) {
  const math = display ? `$ ${expression} $` : `$${expression}$`;
  // Inline equations can extend above and below Typst's paragraph line box.
  // Give the exported page room for those glyphs before it becomes an image.
  const margin = display ? '0pt' : '(x: 0pt, y: 1em)';
  const source = `#set text(size: 12pt)\n#set page(width: auto, height: auto, margin: ${margin}, fill: none)\n${math}`;
  return renderSource(source, expression);
}

export function renderDocument(body) {
  if (!body.trim()) return Promise.resolve('');
  const source = `#set text(font: "New Computer Modern", size: 12pt)\n#set page(width: auto, height: auto, margin: 1em, fill: none)\n${body}`;
  return renderSource(source, body).then(html => `<div class="typst-document">${html}</div>`);
}
