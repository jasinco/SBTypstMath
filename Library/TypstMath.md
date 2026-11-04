---
name: Library/TypstMath
tags: meta/library
files:
  - TypstMath/renderer.mjs
  - TypstMath/compiler.wasm
  - TypstMath/renderer.wasm
  - TypstMath/NewCMMath-Regular.otf
  - TypstMath/NewCM10-Regular.otf
  - TypstMath/NewCM10-Italic.otf
  - TypstMath/NewCM10-Bold.otf
  - TypstMath/NewCM10-BoldItalic.otf
---

# Typst Math

```space-lua
local typstMath = js.importFromSpace("Library/TypstMath/renderer.mjs")

local function html(body, display)
  return typstMath.render(body, display)
end

syntax.define {
  name = "TypstMathInline",
  startMarker = "\\$(?![\\${])",
  endMarker = "\\$(?![\\${])",
  mode = "inline",
  renderWidget = function(body)
    return widget.new { display = "inline", html = html(body, false) }
  end,
  renderHtml = function(body) return html(body, false) end,
}

syntax.define {
  name = "TypstMathBlock",
  startMarker = "^\\$\\$$",
  endMarker = "^\\$\\$$",
  mode = "block",
  renderWidget = function(body)
    return widget.new { display = "block", html = html(body, true) }
  end,
  renderHtml = function(body) return html(body, true) end,
}
```

```space-style
.typst-math-image { vertical-align: middle; max-width: 100%; height: auto; }
.typst-math-error { color: var(--error-color, #c33); text-decoration: underline wavy; }
@media (prefers-color-scheme: dark) {
  .typst-math-image { filter: invert(1); }
}
```
