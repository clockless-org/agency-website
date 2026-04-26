# Aperture & Ink — Design

**North star:** Warm, calm, senior creative studio — built on the
`ray-website` visual kit (CLO-41 fork) with bilingual content and a
demo-grade portal. The design system is preserved as the template's
agency-vertical migration; visual language is shared with the Ray template.

## Reference sites

- **Primary template:** ray-website (direct lift of the layout and most CSS;
  forked for CLO-41 agency-vertical migration).
- **Secondary:** independent Brooklyn / Manhattan studio sites for tone cues
  (Pentagram, Mucca, etc.).

## Color palette

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f7f2eb` | Surface cream |
| `--bg-strong` | `#ede2d1` | Surface deep |
| `--surface` | `#fffdf9` | Paper-white card |
| `--text` | `#2a231f` | Ink (deep warm brown) |
| `--muted` | `#786c60` | Secondary text |
| `--green` | `#1d3a30` | Primary forest green (CTA + deep sections) |
| `--green-soft` | `#29463a` | Hover variant |
| `--gold` | `#b58a5d` | Bronze accent (View Portal CTA, links) |
| `--peach` | `#dccbbb` | Warm accent block |
| `--mint` | `#dce7d8` | Cool accent block |

## Typography

- **Display:** Cormorant Garamond (weights 500/600/700).
- **Body & UI:** Manrope (400/500/700/800).
- Display sizes on hero: `clamp(2.8rem, 10vw, 3.6rem)` on mobile, larger
  on desktop.
- Eyebrows are uppercase sans with 0.18em letter-spacing.

## Layout rules

- Sharp corners on cards (radius 0). Curves reserved for avatars,
  archways, and step dots.
- Full-viewport archway hero with Reese's portrait on right, copy on left.
- Sections alternate between `--bg`, `--surface`, and `--bg-strong` for
  tonal depth; never rely on flat borders as dividers.
- Mobile: nav loses the secondary "Start a Project" button, keeps the
  accent "View Portal" + language toggle. Section padding 72px vertical.

## Motion

- Scroll-reveal animation on text + cards (translateY ~28px, easing
  `cubic-bezier(0.16, 1, 0.3, 1)`).
- Hero fade-in (no translate) on first paint.
- Chat bubble: subtle pop on appear, scale hover.

## Imagery — gradient blocks, no stock photography

- **No stock photography.** Every photo-shaped block is replaced by a
  layered gradient (`forest-green → mint → bronze` palette). Reason: a
  fictional creative studio with stock product shots reads as fake
  immediately. Gradient blocks read as "design system primitives" instead.
- **Portraits** are gradient + Cormorant Garamond monogram blocks (`RO`
  for Reese, `PA` `JW` `SH` `DM` for the team). Reason: avoids "same face,
  two fictional personas" failure mode and aligns with how Pentagram /
  Mucca / Brand New present their senior team.
- **Service art** uses three named gradient tones: `green` (forest
  identity), `bronze` (packaging warmth), `mint` (campaign cool).

## Iconography

- None in the brand. Use serif numerals and letter badges for step
  markers and team avatars.

## Language

- Bilingual (zh / en), toggled via `data-en` / `data-zh` attributes
  swapped by `/site.js`. localStorage key: `agency-lang`.
- Default language respects `navigator.language`; stored in localStorage.

## Per-feature conventions

- **Chat bubble:** dark green circle, white SVG message icon — matches
  the portal's chat bubble exactly. Namespace: `studio-chat`.
- **"Meet Reese" section:** quote + signature only (portrait lives in
  hero, not duplicated here). BEM namespace: `meet-creative`.
- **Stats band:** forest green background with cream serif numbers.
- **Portal tab IDs:** `journey | deliverables | brand | schedule | billing
  | documents | messages` (renamed from Ray's `properties / neighborhood
  / payments` to agency semantics; internal IDs match user-facing labels
  to avoid Ray-residue leakage).

## Don't

- Don't add emojis in client-facing copy.
- Don't use rounded corners on cards.
- Don't use blue accents.
- Don't duplicate the portrait across multiple hero blocks on the same
  page.
- Don't reintroduce stock photography or `/media/*.jpg` references —
  gradient blocks are intentional, not a placeholder.
