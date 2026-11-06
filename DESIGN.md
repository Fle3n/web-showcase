---
name: Fle3n — Three Working Worlds
description: Scoped visual systems for Тихо, Линия and Поток; extracted from the shipped build.
colors:
  shared-surface: '#fff'
  shared-error: '#a32e26'
  coffee-ground: '#fafaf7'
  coffee-ink: '#242922'
  coffee-accent: '#25342a'
  coffee-hover: '#415443'
  coffee-line: '#d9ddd5'
  coffee-muted: '#5b6359'
  coffee-focus: '#6c823a'
  coffee-selection: '#eceebd'
  coffee-selection-hover: '#e3e8a8'
  coffee-detail: '#eef0e6'
  clinic-ground: '#f6f7f2'
  clinic-ink: '#233e31'
  clinic-accent: '#244a38'
  clinic-hover: '#376749'
  clinic-line: '#d7dfd1'
  clinic-muted: '#596a59'
  clinic-focus: '#859f5c'
  clinic-message: '#eef2e9'
  clinic-forest: '#203e32'
  clinic-hero-text: '#f6f5e8'
  clinic-chat: '#e9eee2'
  flow-ground: '#f5f6fa'
  flow-ink: '#20283d'
  flow-muted: '#5c6579'
  flow-accent: '#244bce'
  flow-hover: '#1d3eae'
  flow-line: '#dce1eb'
  flow-tint: '#edf1fc'
  flow-message: '#f0f2f7'
  flow-row-selected: '#edf2ff'
  flow-row-hover: '#f7f9ff'
  flow-new-ink: '#8a4d10'
  flow-new-bg: '#fff1db'
  flow-work-bg: '#e8edff'
  flow-done-ink: '#286446'
  flow-done-bg: '#e8f4eb'
typography:
  coffee-display:
    fontFamily: Golos, Arial, sans-serif
    fontSize: clamp(46px, 5.4vw, 76px)
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.04em
  clinic-display:
    fontFamily: Prata, Georgia, serif
    fontSize: clamp(40px, 3.6vw, 56px)
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.035em
  clinic-title:
    fontFamily: Prata, Georgia, serif
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: -0.03em
  flow-headline:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 31px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.03em
  shared-headline:
    fontFamily: Golos, Arial, sans-serif
    fontSize: clamp(30px, 3.5vw, 48px)
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.035em
  shared-title:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 23px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.035em
  shared-body:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  flow-body:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  shared-button:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
  shared-field:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  flow-label:
    fontFamily: Golos, Arial, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
rounded:
  compact: 4px
  state: 5px
  suggestion: 6px
  time: 7px
  control: 8px
  photo: 10px
  panel: 12px
  chat: 14px
  dialog: 16px
spacing:
  inline: 8px
  control-gap: 12px
  mobile-gutter: 16px
  field-gap: 18px
  compact-panel: 20px
  panel: 24px
  dialog-mobile: 24px
  section-title: 32px
  dialog: 32px
  section-gap-mobile: 64px
  section-gap: 96px
components:
  coffee-button-primary:
    backgroundColor: '{colors.coffee-accent}'
    textColor: '{colors.shared-surface}'
    typography: '{typography.shared-button}'
    rounded: '{rounded.control}'
    padding: 13px 22px
  coffee-button-primary-hover:
    backgroundColor: '{colors.coffee-hover}'
  clinic-button-primary:
    backgroundColor: '{colors.clinic-accent}'
    textColor: '{colors.shared-surface}'
    typography: '{typography.shared-button}'
    rounded: '{rounded.control}'
    padding: 13px 22px
  clinic-button-primary-hover:
    backgroundColor: '{colors.clinic-hover}'
  flow-button-primary:
    backgroundColor: '{colors.flow-accent}'
    textColor: '{colors.shared-surface}'
    typography: '{typography.shared-button}'
    rounded: '{rounded.control}'
    padding: 13px 22px
  flow-button-primary-hover:
    backgroundColor: '{colors.flow-hover}'
  shared-button-secondary:
    backgroundColor: transparent
    rounded: '{rounded.control}'
    padding: 13px 22px
    typography: '{typography.shared-button}'
  shared-field:
    backgroundColor: '{colors.shared-surface}'
    rounded: '{rounded.control}'
    padding: 13px 14px
    typography: '{typography.shared-field}'
  coffee-segment:
    backgroundColor: '{colors.coffee-accent}'
    textColor: '{colors.shared-surface}'
    rounded: '{rounded.control}'
    padding: 13px 12px
  clinic-time:
    backgroundColor: '{colors.clinic-accent}'
    textColor: '{colors.shared-surface}'
    rounded: '{rounded.time}'
    padding: 10px 4px
  flow-state-new:
    backgroundColor: '{colors.flow-new-bg}'
    textColor: '{colors.flow-new-ink}'
    rounded: '{rounded.state}'
    padding: 4px 7px
    typography: '{typography.flow-label}'
  flow-request-row:
    backgroundColor: '{colors.shared-surface}'
    padding: 19px 20px
  flow-navigation:
    backgroundColor: '{colors.flow-accent}'
    textColor: '{colors.shared-surface}'
    rounded: '{rounded.control}'
    padding: 13px 12px
---

# Design System: Fle3n — Three Working Worlds

## Overview

**Creative North Star: "Three Working Worlds"**

Three working worlds share a quiet control language, while their palettes, type hierarchy and spatial density remain explicitly scoped. Тихо is a photographic product index on chalk white with pale yellow assistance. Линия is a forest and limestone appointment desk with Prata headings. Поток is a cobalt operations journal with compact Golos text and status-driven color.

This record describes the finished HTML/CSS, not a universal theme to apply across all three sites. The interfaces expose local demonstrations with visible limitations. Photography provenance remains in assets/v3-image-provenance.json; this document does not replace that record.

**Key Characteristics:**
- Three scoped palettes; one shared form and focus vocabulary.
- Photography carries the coffee and clinic atmosphere; tables and state carry the workspace.
- Flat panels, restrained borders and functional motion.
- Local demonstration disclosures remain close to their actions.

## Colors

The frontmatter is normative. Prefixes define ownership, not interchangeable theme variants; shared white and error red serve all three surfaces.

### Primary

- **Coffee charcoal-green:** coffee-accent drives order actions and selected options; coffee-hover gives action feedback.
- **Clinic forest:** clinic-accent drives appointment controls; clinic-forest is the architectural hero field and clinic-hero-text its contrasting type.
- **Workspace cobalt:** flow-accent drives rail navigation, actions and the in-progress state; flow-hover darkens buttons.

### Secondary

- **Coffee pale yellow:** coffee-selection connects the barista invitation and assistant section; coffee-detail is the quieter configurator ground.
- **Clinic pale stone and leaf:** clinic-chat and clinic-message distinguish coordinator containers and assistant replies without competing with the appointment.
- **Workspace state pairs:** flow-new-* is amber, flow-work-bg pairs with cobalt, and flow-done-* is green. The label and dot repeat each state.

### Neutral

Each scope supplies ground, ink, muted and line tokens. shared-surface is the white control/panel ground. Coffee is chalk and olive charcoal; clinic is limestone and forest; flow is cool white and blue charcoal. The focus tokens follow each scope; flow uses its cobalt accent as focus. shared-error is used for validation text.

**The Scoped World Rule.** Use coffee, clinic or flow tokens only inside their corresponding surface. Shared controls inherit that surface’s CSS custom properties.

**The Status Meaning Rule.** In Поток, amber means new, cobalt means in progress and green means complete; always retain the written status.

## Typography

**Body Font:** Golos with Arial and sans-serif fallbacks. Local faces provide weights (400, 600, 700) and use font-display: swap.

**Clinic Display Font:** Prata with Georgia and serif fallbacks, weight (400).

The coffee hierarchy is broad and plain. Clinic display text adds a composed serif rhythm while controls stay sans-serif. Workspace headings remain compact enough to keep operational content prominent.

### Hierarchy

The frontmatter records the desktop base roles; media-query overrides below remain part of the system.

- **Coffee display:** coffee-display; at widths up to (1100px) it becomes (58px), up to (800px) (50px), and up to (600px) clamp(39px, 10vw, 56px) with line-height (1.08).
- **Clinic display:** clinic-display; intermediate widths use explicit (43px) and (51px) sizes. At widths up to (720px), the final override is clamp(39px, 9vw, 55px). Appointment title uses clinic-title; on mobile the final size is clamp(23px, 6.5vw, 29px).
- **Workspace headline:** flow-headline; (29px) up to (760px), (27px) up to (370px). Detail headings use (22px), line-height (1.35); mobile uses (23px).
- **Shared headline/title:** shared-headline and shared-title are defaults, not replacements for explicit local headings. The browser default bold heading weight remains (700) where no local weight overrides it.
- **Body:** shared-body for coffee/clinic and flow-body for the journal. Supporting text spans (12–16px) according to density; flow detail copy uses line-height (1.8). Long clinic explanatory copy is constrained by component widths (390–450px), not a universal character count.
- **Controls:** shared-button and shared-field; clinic appointment fields are (13px) on large desktop, (15px) at intermediate layouts and (16px) in the final mobile rule. Chat entry becomes (16px) up to (720px).
- **Labels:** flow-label records the compact status scale. Prices, counts, history times and calculator figures use tabular numerals.

**The Display Scope Rule.** Prata belongs to Линия’s identity and principal headings. Coffee and workspace headings use Golos.

## Layout

Source ownership: assets/site.css supplies controls, navigation, dialog, chat and common spacing; coffee/style.css, clinic/style.css and flow/style.css own their surfaces. Each index.html loads the shared stylesheet before its local stylesheet.

- **Shared public-site container:** max (1320px), total horizontal inset (80px); up to (1000px) inset (48px); up to (720px) inset (32px). Sections step from (96px) top margin to (64px). Sticky headers step through heights (88px, 78px, 72px).
- **Coffee:** asymmetrical title (1.6fr / 1fr), photographic showcase (1.7fr / 1fr), catalog/configurator (1.5fr / 1fr). Catalog becomes one column up to (800px), showcase up to (600px). The pastry and invitation remain a two-column pair until (370px). The configurator is sticky at (113px), then static at the catalog collapse.
- **Clinic:** hero max (1432px), total inset (40px), padding (36px), three columns (.94fr / .94fr / 1fr). At (1000px) it becomes two columns with the appointment spanning both; at (720px) the order is introduction, appointment, photograph in one column. At (1700px) and above, max hero width is (1480px).
- **Workspace:** rail (220px), expanding to (240px) from (1600px) and shrinking to (190px) up to (1200px). Main content max (1540px), padding (35px 38px 20px). Up to (1000px) the rail becomes a horizontal header; up to (760px) navigation is a row of icon/text tasks and request/detail panels stack. The desktop request/detail split is (1.6fr / 1fr) with a (290px) detail minimum. Channel columns hide at the (1200px) breakpoint. Brief/calculation/workflow grids become one column at (760px).

Use the frontmatter spacing entries as observed steps, not a claim that every declaration follows a single mathematical scale. Maintain min-width: 0 in nested grids and allow user content to wrap.

## Elevation & Depth

Resting content is flat: white or tinted panels and one-pixel borders define depth. Coffee photography is clipped within its frame, clinic photography sits inside the forest composition, and the workspace uses selected-row tone rather than card lift.

### Shadow Vocabulary

- **Dialog:** box-shadow (0 24px 90px #1e2a2530); backdrop (#17251f99).
- **Toast:** box-shadow (0 12px 35px #17251f20), anchored above the lower viewport edge.

**The Flat Surface Rule.** Resting content panels rely on background and borders. Reserve the observed shadows for the dialog and toast.

## Shapes

Controls use rounded.control; compact suggestion buttons use rounded.suggestion. Panels and product-photo frames use rounded.panel; clinic photos use rounded.photo. The larger clinic hero and dialog use rounded.dialog, while assistant containers use rounded.chat in the clinic and coffee sections. Workspace status chips use rounded.state, appointment time choices rounded.time. Circles are reserved for small dots, quantity/count marks, and photo actions. Message bubbles use an asymmetric (4px 14px 14px 14px) silhouette, reversed for user replies.

## Components

### Buttons

Quiet, legible actions. The shared primary control is at least (48px) high with a one-pixel transparent border. Each surface supplies accent, hover, ink, line and focus via body custom properties. Secondary controls are transparent with the local line border and ink; hover uses the local tint or shared fallback (#f0f2ec). Mobile public-site buttons use (13px) type and (13px 17px) padding. Clinic appointment and workspace detail actions have their own denser sizes. Icon buttons are (44px) square by default. Active enabled buttons translate down (1px).

### Inputs / Fields

White surfaces, local ink, one-pixel local line, control radius and shared-field typography. Labels sit above at an (8px) gap. Textareas have minimum height (110px) and resize vertically. Focus changes the border and applies the shared visible outline (3px, offset 4px). Errors are adjacent shared-error text; disabled buttons lower opacity (.45). Clinic disabled time choices use opacity (.35).

### Navigation

Coffee and clinic use a sticky horizontal header with underlined text hover. Up to (720px) it becomes a labeled menu button and expandable vertical navigation. Workspace navigation is a cobalt rail with white labels; current page uses a white background and cobalt text. At mobile width it becomes horizontal tasks with icons and text. Preserve aria-current and aria-expanded state rather than styling alone.

### Chips / Segments

Coffee category tabs use a bottom rule and weight change; size/milk radio segments fill with the accent when checked. Clinic time radios use the same filled selection idea and a visible focus outline on the label surface. Workspace status chips combine words, tinted background, ink color and a currentColor dot. Filters use aria-pressed plus a bottom border.

### Cards / Containers

Coffee panels are functional: a yellow assistant invitation, a soft configurator and photography frames. Clinic appointment is a white inset panel with compact fields. Workspace board and detail are white panels with local borders, panel radius and (24px) detail padding. Request rows use (19px 20px) padding and a bottom rule, with distinct hover and selected backgrounds. No resting card shadow is introduced.

### Dialog and Assistant

The cart uses native dialog, max width (580px), max height calc(100dvh - 40px), internal scrolling and (32px) body padding, reduced to (24px) on mobile. Chat uses a scrollable transcript, distinct assistant/user bubbles, suggestion buttons and a persistent entry row. Captions describe actual local behavior; these examples do not establish a live LLM, real booking, payment or CRM service.

### Motion and Accessibility

State feedback uses (0.2s) transitions, workspace rows/navigation (0.18s). Shared panel entry uses cubic-bezier(.16, 1, .3, 1), vertical travel (9px) and partial initial opacity (.8). Coffee images gently scale to (1.035) over (0.6s), and their plus action rotates (90deg). Clinic visit review uses a (0.4s) clipping reveal; processed workflow uses (0.5s); workspace view changes use (0.22s) and (5px) travel. Content exists before these effects. The reduced-motion media query removes all animations/transitions and smooth scrolling.

Retain skip links, meaningful image alt text, native form elements, legend/label relationships, keyboard focus, aria-pressed/current/expanded, role=status and alert feedback. Segmented and time radio inputs remain keyboard reachable although visually hidden. Local assistant messages wrap arbitrary text. Sidecar snippets are visual examples, not replacements for the working components’ event handlers.

## Do's and Don'ts

### Do:
- **Do** preserve the three surface scopes and shared control inheritance.
- **Do** retain visible keyboard focus, semantic labels, status text and reduced-motion handling.
- **Do** use actual photographic assets for the coffee and clinic surfaces and retain their provenance record.
- **Do** keep demonstration limitations beside ordering, visit planning and request actions.

### Don't:
- **Don't** migrate clinic display typography or workspace status colors into the other identities.
- **Don't** replace the coffee photography with CSS food illustrations or add a ticker.
- **Don't** remove text from status chips or make color the only selected-state cue.
- **Don't** describe local assistant, cart or visit actions as live external services.

Not canonized or repaired: no material visual defects were identified by the finish reviewer. One-off decorative values and implementation-specific content are not promoted to shared tokens; documenting the system does not repair or broaden UI scope.
