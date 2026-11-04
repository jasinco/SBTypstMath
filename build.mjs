import { build } from 'esbuild';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';

const out = 'Library/TypstMath';
await mkdir(out, { recursive: true });
await build({ entryPoints: ['renderer.mjs'], outfile: `${out}/renderer.mjs`, bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
for (const [packageName, source, target] of [
  ['typst-ts-web-compiler', 'typst_ts_web_compiler_bg.wasm', 'compiler.wasm'],
  ['typst-ts-renderer', 'typst_ts_renderer_bg.wasm', 'renderer.wasm'],
]) await copyFile(`node_modules/@myriaddreamin/${packageName}/pkg/${source}`, `${out}/${target}`);
for (const font of ['NewCMMath-Regular.otf', 'NewCM10-Regular.otf', 'NewCM10-Italic.otf', 'NewCM10-Bold.otf', 'NewCM10-BoldItalic.otf']) {
  const response = await fetch(`https://raw.githubusercontent.com/typst/typst-assets/v0.15.0/files/fonts/${font}`);
  if (!response.ok) throw new Error(`Cannot download ${font}: ${response.status}`);
  await writeFile(`${out}/${font}`, new Uint8Array(await response.arrayBuffer()));
}
