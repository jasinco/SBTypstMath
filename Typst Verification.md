# Typst Verification

Move the cursor outside each expression or code block to see its rendered preview.

## Inline math

Inline equation: $sum_(n=1)^infinity 1/n^2 = pi^2/6$ after text.

## Display math

$$
integral_(-infinity)^infinity e^(-x^2) dif x = sqrt(pi)
$$

## Proof tree

The two premises should appear above the inference line and the conclusion below it.

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

## Proof table

The eleven-row table should render at its native size. On narrow screens, scroll horizontally to see the Reason column. The fence metadata `size=0.9` is ignored.

```typst size=0.9
#table(
columns: (auto ,auto, auto),
inset: 10pt,
  align: horizon,
  table.header(
    [],[*Step*], [*Reason*],
  ),
  [1],$forall x [P(x) or Q(x)]$, [premise],
  [2],$P(x) or Q(x)$, [UI 1],
  [3],$R(x) or P(x) or Q(x)$, [addition 2],
  [4],$not R(x) -> P(x) or Q(x)$, [equiv 2],
  [5],$forall x [(not P(x) and Q(x)) -> R(x)]$,[premise],
  [6],$(not P(x) and Q(x)) -> R(x)$,[UI 5],
  [7],$not R(x) -> not (not P(x) and Q(x)) $,[equiv 6],
  [8],$not R(x) -> (P(x) or not Q(x)) $,[equiv 7],
  [9],$not R(x) -> (P(x) or not Q(x)) and (P(x) or Q(x)) $,[conj 8 4],
  [10],$not R(x) -> P(x) $,[equiv 9 (distribute)],
  [11],$forall x [not R(x) -> P(x)]$,[UG 10],
)
```

## Native sizing

The second block should display larger text than the first.

```typst
Hello
```

```typst
#set text(size: 18pt)
Hello
```

## Error recovery

The first block intentionally fails; hover over its underlined source for the diagnostic. The next block should still render.

```typst
#table(
```

```typst
Hello after an error
```
