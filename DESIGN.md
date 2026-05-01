# Aperture & Ink — Design ("The Studio Manifesto")

## North star

**Typographic-poster + risograph color-block.** Type *is* the artwork. The
page is a brand book that became a website. Aperture & Ink stops being a
template fork and starts being a one-of-a-kind voice in the family of
Clockless industry verticals.

The site reads as a manifesto wall in W+K's reception, a Pentagram Papers
monograph, and a DUMBO risograph zine — all at once.

## Reference voices

- **Pentagram** — brand-book monographs, mono-font case study indices,
  white-or-black field with one accent.
- **Wieden+Kennedy** — manifesto walls, oversized hand-painted slogans,
  copy-as-art.
- **DUMBO indie studio scene** — risograph print culture, color-block
  posters, mixed type voice.

## Family map (vs other Clockless industries)

| Industry | Family | Display | Body | Mono | Surface | Signature |
|---|---|---|---|---|---|---|
| Accounting (CLO-49) | editorial-print 报刊 | Newsreader | Inter | IBM Plex Mono | warm vellum | masthead + tax calendar |
| Finance (CLO-71) | editorial-print 私人信 | Source Serif 4 | Inter | IBM Plex Mono | warm vellum | concentration horizon + memo chat |
| Insurance (CLO-53) | engineering-drafting 工程图 | Instrument Serif | IBM Plex Sans | JetBrains Mono | cool blueprint | isometric + transmittal |
| **Agency (this)** | **typographic-poster + riso** | **Bricolage Grotesque** | **Bricolage Grotesque** | **Geist Mono** | **paper + bleed-out blackout** | **mega type + marquee + lime/magenta** |

## Color tokens

```
--paper:       #F1EDE3   /* warm newsprint */
--paper-deep:  #E6DFCF   /* tonal step */
--blackout:    #0A0A0A   /* full-bleed dark, signature reel */
--ink:         #0A0A0A   /* primary text */
--ink-soft:    #4A453E   /* secondary text only */

--lime:        #D7FF00   /* primary accent */
--magenta:     #FF2E6F   /* secondary accent, sparingly */

--rule:        #1F1F1F   /* hairline only, 1px */

--on-blackout-fg:    #F1EDE3
--on-blackout-muted: #8B8579
```

**Hard rules:**

- Only those tokens. **No gradients. No shadows. No `rgba()` overlays
  except `--rule`.**
- Lime and magenta are mutually exclusive on a single component. A button
  is lime *or* magenta, not both.
- Old palette tokens (`--green`, `--gold`, `--peach`, `--mint`,
  `--surface-green-*`, `#1d3a30`, `#b88354`, `#f7f2ea`, `#fffdf9`) are
  deleted, not aliased.

## Typography

```
--font-display: "Bricolage Grotesque" (variable, opsz 12-96, wght 400-800)
--font-body:    "Bricolage Grotesque" (lower opsz)
--font-mono:    "Geist Mono"
```

**Every entry-point HTML must `<link>` the actual font stylesheet,** not
just the preconnect. Without the stylesheet, the page silently falls
back to PingFang SC (CJK) or Hiragino, which destroys the W+K /
Pentagram tone the Manifesto depends on. The required `<link>` is:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500&display=swap" />
```

This must appear in `index.html`, `about/index.html`,
`services/index.html`, `testimonials/index.html`, `contact/index.html`,
**and** `portal/index.html`. Any new entry point copies this block
verbatim or the typography drifts.

The variable opsz axis on Bricolage covers everything from 12px legal copy
to 200px hero — same family does small body and giant manifesto headline.
The third voice is **mono**, used for production callouts: case study
indices, runtimes, deadlines, project codes.

| Role | Font | weight | size | tracking |
|---|---|---|---|---|
| Hero H1 | Bricolage opsz 96 | 800 | clamp(4rem, 12vw, 11rem) | -0.04em |
| Section H2 | Bricolage opsz 72 | 700 | clamp(2.4rem, 6vw, 5.2rem) | -0.03em |
| H3 | Bricolage opsz 36 | 700 | clamp(1.4rem, 3vw, 2.2rem) | -0.02em |
| Body | Bricolage opsz 14 | 400 | 1rem | -0.005em |
| Eyebrow | Geist Mono | 500 | 0.72rem | 0.18em uppercase |
| Marquee | Bricolage opsz 96 | 800 | clamp(3rem, 8vw, 7rem) | -0.03em uppercase |

**Italics:** Bricolage has no italic. Emphasis uses `<em>` rendered as a
**lime underline** (text-decoration-thickness: 0.18em).

## Layout & composition

- **12-column** grid. Container width 1180px. Body copy stays inside;
  hero, marquee, and case-study covers overflow `.container`.
- **Layout tokens — single source of truth for site AND portal.**

  ```
  --page-max:    1180px   /* canonical page width */
  --page-gutter: 24px     /* hard gutter, never less */
  --container:   var(--page-max)   /* legacy alias only */
  ```

  Every horizontally-bounded surface — `.container` on landing pages,
  `.pv-running__inner`, `.pv-header__top`, `.pv-tabs`, `.pv-tabpanel`,
  `.pv-footer__inner` on the portal — uses the **same** formula:

  ```css
  width: min(var(--page-max), calc(100% - var(--page-gutter) * 2));
  ```

  This is why `/` → `/portal/` does not shift the brand even by a pixel
  at any viewport. **Never** hand-write `min(calc(100% - 48px), 1180px)`
  in a new rule — always go through the tokens.
- **Sharp edges.** `border-radius: 0` everywhere except `.lang-toggle`
  (single 999px pill, intentional contrast).
- **Hairlines, not cards.** `1px solid var(--rule)` for separators. **No
  `box-shadow` anywhere.**
- **Bleed-out sections.** At least three sections per page go full-bleed
  (margin-trimmed): the marquee, the blackout reel, and the contact CTA.
- **Section rhythm — paper / blackout alternation.** Every public page
  contains at least one `.blackout` section. Stats and CTA are blackout;
  hero, services, and testimonial are paper.
- **Spacing.** Vertical section padding `clamp(96px, 12vw, 184px)`.
  Internal block gap `clamp(24px, 3vw, 56px)` exposed as
  `--block-gap`; small variant `--block-gap-sm: clamp(20px, 2vw, 32px)`
  exposed for `.actions` rows. **HTML must never inline `margin-top`** —
  rhythm is enforced via adjacent-sibling rules in `site.css`:
  - `.lede + .actions / + form / + .poster-tiles / + .team-grid /
    + .editorial-3 / + .manifesto-wall / + .tab-block` →
    `margin-top: var(--block-gap)`.
  - `h1 + .lede`, `h2 + .lede` → `margin-top: clamp(1rem, 1.4vw, 1.4rem)`.
  - `h2 + .editorial-3 / + .manifesto-wall / + .team-grid /
    + .poster-tiles / + form / + .tab-block` → `margin-top: var(--block-gap)`.
  - `.section > .container + .poster-tiles` → `margin-top: var(--block-gap)`.
  - `h3 + .dim`, `.editorial-3 .dim` → `margin-top: 0.4rem`.
  - `.signature + .actions, .lede + .actions, .pull-quote + .actions,
    p + .actions, .editorial-3 + .actions, .eyebrow + .actions` →
    `margin-top: var(--block-gap-sm)`.
  - `.container--gap-top` modifier where two sibling `.container`s sit
    inside the same section.
  Triptych panels use modifier classes (`.triptych__panel--lime /
  --paper-deep / --blackout`); riso swatches inside a triptych get
  `margin-top: auto` automatically.
- **No card chrome.** `.service-card` is replaced by `.poster-tile`:
  full-bleed background (`--lime` / `--magenta` / `--blackout`), oversized
  mono index, H2-scale service title, single-line copy, lime arrow link.

## Imagery primitives — CSS only, no photo files

**No stock photography. No gradient blocks. No SVG illustrations of
houses, archways, or geometric flourishes.** Three primitives:

- **Halftone portrait** (`.halftone-portrait`): rectangular 4:5 frame,
  radial-gradient halftone dots over a solid `--lime` / `--magenta` /
  `--paper-deep` field, monogram in heavy Bricolage on top with
  `mix-blend-mode: multiply`.
- **Riso swatch tile** (`.riso-swatch`): solid color block with a mono
  code label in the corner (`MARK 01 / WORK NO. 04 / SWATCH C`),
  misregistration effect via 2px translate of a duplicated label.
- **Type-as-image case-study cover** (`.case-cover`): brand name set in
  200px Bricolage against `--blackout` or `--magenta`, mono index
  (`CASE 01`) in the corner. Zero photographic content.

## Motion primitives — three motion grammars

- **Marquee** (`.marquee` / `.marquee__track`): infinite horizontal
  scroll, 28s linear, uppercase Bricolage 800 with lime accent. Always
  present in three places: under the hero, before the footer, in the
  portal's `WHAT'S RUNNING` panel. Pure CSS keyframes; site.js duplicates
  the children once for seamless looping.
- **Reveal-block** (`.reveal-block` / `.reveal-block::before`): on
  `IntersectionObserver` intersect, a solid color block wipes left-to-
  right behind the section, then text fades in. Replaces `translateY(28px)`
  scroll-reveal entirely.
- **Cursor-tracked label** (case studies + portal Wall tiles): on hover, a
  12-character mono label follows the cursor offset by 16px.

`prefers-reduced-motion: reduce` collapses all three: marquee freezes,
wipe is instant, cursor label is static at center.

## Portal visual language (Studio Manifesto)

The portal is the same brand book applied to a working tool. Same
two-font system, same lime/magenta riso, same paper/blackout alternation.

| Tab | Treatment |
|---|---|
| `journey` (Runsheet) | Hairline-ruled production schedule. Each step is one row: mono index + tag + H3 title + mono date + status pill. Current row goes blackout reverse-out. No dots, no gradients. |
| `deliverables` (Work Wall) | Riso swatch tiles, each = one deliverable, mono filename, lime/magenta/blackout/paper-deep field, type-as-image cover. |
| `brand` (Mark) | Single-page brand book spread: wordmark in 6 states (paper / lime / magenta / blackout / paper-deep / inverse), 4 stats on blackout, 6 voice cards in 2-col grid. |
| `schedule` (Calendar) | Wide horizontal grid, hairlines only, key dates highlighted lime/magenta, mono day-number labels. |
| `billing` (Statement) | Single tabular mono ledger: date / description / status pill / amount. Hairline rules between rows. Lime balance line at the bottom. No card chrome. |
| `documents` (File Room) | Mono filename, deliverable type tag, lime/magenta status pill (`SIGNED` / `PENDING`). |
| `messages` (Studio Line) | Slack-style monospaced thread, no rounded bubbles. Sender names in mono uppercase, timestamps in `--ink-soft`. My messages right-aligned with thin lime right-border, theirs left-aligned with thin magenta left-border. |

**`WHAT'S RUNNING` panel** (always-visible top of portal): full-bleed
`--blackout`, mono eyebrow `WHAT'S RUNNING`, H1-scale current task in
lime, mono deadline with marquee underneath listing the next three
actions. This is the **signature portal moment** — should look like a wall
in W+K's reception.

**Floating chat bubble (`.chat-bubble` / `.studio-chat__bubble`):**
squared blackout pill labeled `STUDIO` in mono lime. No rounded corners.
Magenta outline on hover. Replaces the dark green circle entirely.

## Bilingual / CJK behavior

- `data-en` / `data-zh` toggling preserved exactly, swapped via
  `/src/scripts/site.js`. localStorage key `agency-lang`.
- Font stack falls through `Bricolage Grotesque → PingFang SC → Hiragino
  Sans GB → Microsoft YaHei → system-ui`. Bricolage has no CJK glyphs;
  CJK falls to PingFang/Hiragino. The scale and weight carry the family
  identity, not the latin glyph forms.
- For ZH hero H1, weight 800 + tracking -0.04em looks heavier than
  expected. `[lang="zh"] h1` resets letter-spacing to `-0.02em`.
- Mono labels in marquees stay latin even in ZH mode (these are
  production codes, not body copy).

## Don't (anti-patterns from the Ray-fork era)

- **No** Cormorant Garamond, Manrope, or Instrument Sans.
- **No** archway hero, no `.portrait-arch`, no `.roundel`, no
  `.monogram` 6rem circles.
- **No** `box-shadow` declarations.
- **No** gradients (`linear-gradient`, `radial-gradient`) — the only
  exception is the radial-gradient *halftone dot pattern* used inside
  `.halftone-portrait` (1px-radius dot on transparent), which renders as
  print, not gradient.
- **No** `border-radius` ≥ 4rem outside `.lang-toggle`.
- **No** scroll-reveal `translateY(28px)`; use `.reveal-block` color wipe.
- **No** old palette: `#1d3a30` / `#b88354` / `#dccbbb` / `#dce7d8` /
  `#f7f2ea` / `#fffdf9` / `--green` / `--gold` / `--peach` / `--mint` /
  `--surface-green*`.
- **No** stock photography or photo files in `public/`. Only `favicon.svg`
  and `icons.svg`.
- **No** mid-sentence emoji in client copy. (Pull-quotes use lime
  underline `<em>` instead.)

## File map

- `src/styles/site.css` — all design tokens, primitives, public-page CSS,
  studio-chat (used by both landing and portal).
- `src/scripts/site.js` — language toggle, marquee duplication, reveal-
  block IntersectionObserver, contact form (demo).
- `src/portal/portal.css` — portal shell (running panel, header, tabs,
  footer, chat).
- `src/portal/dashboard.css` — per-tab layouts (runsheet, work wall,
  mark, calendar, statement, file room, studio line).
- `src/portal/Dashboard.tsx` — bilingual data + tab views.
- `src/portal/ChatBubble.tsx` — squared blackout `STUDIO` pill.
- `public/chat.js` — landing-page chat bubble (mirror of the portal one).

## Fallback direction (`The Studio Catalog`)

If the chairman pivots to the Pentagram-house quiet variant, the swap is
isolated to `:root` tokens and the Google Fonts import:

```
--lime   → --ink-blue: #002FA7  (Klein blue)
--magenta → drop entirely
--font-display / --font-body → Inter at extreme weights (Inter 900 +
                                Inter Tight)
--font-mono → keep Geist Mono
```

No structural rework needed. Marquee removed, blackout retained, type-as-
object hero retained.
