# SilverBullet Typst Math

Render Typst math in SilverBullet live preview using typst.ts 0.8.0-rc3 (Typst 0.15.0). This is a release-candidate compiler, not the older `latest` typst.ts release. Tested against SilverBullet 2.12.1.

## Install

Download `typst-math-library.tar.gz` from the [latest GitHub release](https://github.com/jasinco/SBTypstMath/releases/latest), then extract it into your SilverBullet space root:

```sh
tar -xzf typst-math-library.tar.gz -C /path/to/space
```

The archive contains `Library/TypstMath.md` and the `Library/TypstMath/` assets.


Build with Node.js and npm, then copy the library into your SilverBullet space:

```sh
npm ci
npm run build
cp -r Library/TypstMath.md Library/TypstMath /path/to/space/Library/
```

Create `/path/to/space/Library` first if it does not exist. Reload SilverBullet twice, or run **System: Reload**, after the space has indexed the new files. Remove other extensions that register `$`/`$$` syntax first. The build downloads the New Computer Modern fonts and the pinned curryst package; the resulting library includes its WASM, fonts, and package and does not need a CDN at runtime.

GitHub Actions builds and publishes the library archive as a GitHub release when a `v*` tag is pushed.

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

The library bundles `@preview/curryst:0.6.0` for proof trees, including offline:

````markdown
```typst
#import "@preview/curryst:0.6.0": prooftree, rule
#prooftree(
  rule(
    $forall x [P(x) or Q(x)]$,
    $forall x [(not P(x) and Q(x)) -> R(x)]$,
    $therefore forall x [not R(x) -> P(x)]$
  ),
)
```
````

Other Typst packages and curryst versions are not bundled or fetched at runtime.

These are Typst expressions and documents, not LaTeX. Compilation errors appear as underlined source; hover for the diagnostic. Compilation runs in the browser with an isolated in-memory compiler world, not against the space's files. Typst input is executable and can consume substantial CPU or memory; do not open untrusted input. SVG is rendered as an image rather than inserted as active HTML.

Inline SVGs include vertical padding for superscripts, subscripts, and fractions that extend beyond Typst's paragraph line box.

## Adding a Typst package dependency

Imports in fenced blocks resolve only packages registered in the browser compiler. To bundle another `@preview/name:version` package:

1. In `build.mjs`, download `https://packages.typst.org/preview/name-version.tar.gz` into `Library/TypstMath/name-version.tar.gz`, checking the response as for curryst. Pin the exact version.
2. Add `TypstMath/name-version.tar.gz` to the `files` list in `Library/TypstMath.md` so SilverBullet indexes and serves it.
3. In `renderer.mjs`, load the archive as a `Uint8Array` in `loadPackages()`, using `asset(...)` and checking the response. Extend the `TypstSnippet.fetchPackageBy` callback to return those bytes for the matching namespace, name, and version. Keep returning `undefined` for packages that are not bundled.
4. Repeat these steps for any packages imported by the dependency itself. The registry does not download transitive dependencies automatically.
5. Run `npm run build`, copy the updated library into the space, and reload SilverBullet as described above. Try a fenced block importing the exact package version, including a path that exercises its dependencies.

The archives are loaded locally before document compilation; package imports do not grant access to files in the SilverBullet space.

## Local test server

Use the [SilverBullet server binary](https://docs.silverbullet.md/Install/Server%20Binary) and run `silverbullet -p 3100 /path/to/space`, then open `http://localhost:3100`. The server defaults to loopback; use proper authentication and TLS before exposing a space.

To check the installed library, copy `Typst Verification.md` to the root of your space and open the **Typst Verification** page. It exercises inline and display math, the proof table, native sizing, and error recovery.
