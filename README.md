# SilverBullet Typst Math

Render Typst math in SilverBullet live preview using typst.ts 0.8.0-rc3 (Typst 0.15.0). This is a release-candidate compiler, not the older `latest` typst.ts release. Tested against SilverBullet 2.12.1.

## Install

Build with Node.js and npm, then copy the library into your SilverBullet space:

```sh
npm ci
npm run build
cp -r Library/TypstMath.md Library/TypstMath /path/to/space/Library/
```

Create `/path/to/space/Library` first if it does not exist. Reload SilverBullet twice, or run **System: Reload**, after the space has indexed the new files. Remove other extensions that register `$`/`$$` syntax first. The build downloads the New Computer Modern fonts from the pinned Typst assets release; the resulting library includes its WASM and fonts and does not need a CDN at runtime.

## Usage

Inline: `$sum_(n=1)^infinity 1/n^2 = pi^2/6$`.

Display math uses `$$` on separate lines:

```text
$$
integral_(-infinity)^infinity e^(-x^2) dif x = sqrt(pi)
$$
```

Use a `typst` fenced block for a full Typst document:

````markdown
```typst
#set text(size: 18pt)
Hello, *Typst*!
```
````

The document defaults to 12pt New Computer Modern text and an automatically sized transparent page; Typst set rules in the block can override those defaults. Wide documents scroll horizontally. Fence metadata such as `size=0.9` is ignored by SilverBullet; use Typst rules for sizing instead.

These are Typst expressions and documents, not LaTeX. Compilation errors appear as underlined source; hover for the diagnostic. Compilation runs in the browser with an isolated in-memory compiler world, not against the space's files. Typst input is executable and can consume substantial CPU or memory; do not open untrusted input. SVG is rendered as an image rather than inserted as active HTML.

Inline SVGs include vertical padding for superscripts, subscripts, and fractions that extend beyond Typst's paragraph line box.

## Local test server

Use the [SilverBullet server binary](https://docs.silverbullet.md/Install/Server%20Binary) and run `silverbullet -p 3100 /path/to/space`, then open `http://localhost:3100`. The server defaults to loopback; use proper authentication and TLS before exposing a space.

To check the installed library, copy `Typst Verification.md` to the root of your space and open the **Typst Verification** page. It exercises inline and display math, the proof table, native sizing, and error recovery.
