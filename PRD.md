# Aperture & Ink — PRD

**Client:** Aperture & Ink (fictional)
**Industry:** Independent Creative Agency — Brand identity, packaging, launch campaigns
**Stage:** Demo
**Slug:** `aperture-ink`

## Overview

Aperture & Ink is a fictional 12-person independent creative studio in DUMBO,
Brooklyn, created as a demo for the Clockless concierge-agency product. The
site serves two purposes:

1. Show a prospective creative agency what a full Clockless engagement looks
   like — marketing pages + client portal + floating studio chat.
2. Serve as a reference implementation for other agency vertical clients.

All content is fictional. The persona is deliberately distinct from real
agencies to avoid confusion. This site is forked from `ray-website` (CLO-41)
as the agency-vertical migration of the Ray template.

## Persona

**Reese Okonkwo** — Founder & ECD (Executive Creative Director) at
Aperture & Ink, an independent creative studio in DUMBO, Brooklyn.

- Studied Pratt Institute BFA Communications Design '14.
- 5 years at Wieden+Kennedy NY as Senior Art Director.
- 2 years at Pentagram as Associate Partner.
- Founded Aperture & Ink in 2022.
- EIN #88-3014502 (fictional).
- Calm, senior, scope-discipline-first.
- Voice: reads like a senior designer who runs a tight studio.

## Target users

### Guests (site visitors)

- Founder-led consumer and tech brands.
- 6–18 weeks out from launch, evaluating agencies.
- Want a small senior team that won't pitch-and-swap, that reads regulatory
  back-panel copy, that writes a tight SOW.

### Portal members (demo)

- Tide & Tonic — fictional Series Seed RTD craft cocktail brand mid-build,
  founders Camilla Vargas & Jonah Lin. Their brand identity + packaging +
  launch campaign build is the showcase content in the portal demo
  (no login required).

## MVP scope

### Must-have (live)

- 5 bilingual landing pages: Home, Studio, Services, Client Stories, Contact.
- Navigation with language toggle (zh / en), portal CTA prominent.
- Demo client portal at `/portal` — no login, showcases Tide & Tonic's
  9-stage build journey with industry-appropriate visualization (gradient
  blocks, no stock photography).
- Floating studio chat bubble on every landing page (canned replies,
  client-side only).
- Deployed to `agency.clockless.ai` via Cloudflare Pages.

### Should-have

- Real contact form backend (currently demo-only, doesn't POST).
- Replace canned chat with a backend-powered Studio Agent.

### Could-have

- Lead-capture integration into the Clockless CRM (Notion Clients DB).
- Case-study / past-work section beyond the Tide & Tonic demo.

## Core user flows

1. Visitor lands → reads hero + Meet Reese → either opens portal demo or
   navigates to Services/Studio → ends on Contact form.
2. Visitor opens chat bubble → asks one or two questions → sees Reese's
   voice in canned replies → hits Contact CTA.
3. Prospective client reviews portal demo → understands the Clockless
   experience → contacts the studio.

## Success metrics

- Portal demo engagement time (target: >90s median).
- Contact form fills (target: non-zero after launch; this is a demo so
  volume is not critical).

## Open questions

- TODO: Decide whether to wire in the real Clockless Studio Agent or keep
  the canned client-side chat for the demo.
- TODO: Decide whether to publish this publicly at `agency.clockless.ai` or
  keep the custom domain disabled and only share the pages.dev URL.

## References

- ray-website — the Ray template this fork derives from. Information
  architecture, route structure, and design tokens were preserved.
- Tide & Tonic's build data in `src/portal/Dashboard.tsx`.

## Notes

This is a demo client. Content here should never be taken as describing a
real agency. The design system derived from this site is a reference
implementation for other agency-vertical engagements.
