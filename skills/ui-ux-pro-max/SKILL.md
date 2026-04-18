---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Use when Codex needs to plan, design, build, review, refactor, or improve interfaces such as websites, landing pages, dashboards, admin panels, e-commerce flows, SaaS apps, portfolios, blogs, and mobile apps. Covers component design, accessibility, responsive layout, typography, color systems, animation, interaction states, charts, and visual consistency across stacks including React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS."
---

# UI/UX Pro Max

Apply this skill whenever the task changes how a feature looks, feels, moves, or is interacted with.

## Priorities

Check the work in this order:

1. Accessibility: preserve focus visibility, contrast, labels, keyboard support, reduced motion, and screen reader clarity.
2. Touch and interaction: keep targets at least 44x44, provide press and loading feedback, and avoid hover-only interactions.
3. Performance: prevent layout shift, lazy-load non-critical assets, optimize images/fonts, and avoid heavy animation or reflow.
4. Style fit: match the visual language to the product type and keep iconography, elevation, radius, and states consistent.
5. Responsive layout: design mobile-first, avoid horizontal scroll, respect safe areas, and maintain readable spacing and line length.
6. Typography and color: use semantic tokens, strong contrast, consistent type scale, and readable body sizing.
7. Motion: use purposeful, interruptible animation with transform/opacity and durations around 150-300ms.
8. Forms and feedback: keep labels visible, errors local and actionable, and destructive actions clearly separated.
9. Navigation: make hierarchy obvious, keep back behavior predictable, and preserve state when navigating.
10. Charts and data: pick the right chart type, avoid color-only encoding, and provide readable labels or accessible alternatives.

## Apply It

Use this skill for:

- Designing new pages or app screens
- Creating or refactoring components like buttons, modals, forms, cards, tables, nav, and charts
- Choosing palettes, type systems, spacing, hierarchy, or motion
- Reviewing UI code for usability, accessibility, responsiveness, or polish
- Fixing interfaces that feel inconsistent, unprofessional, cramped, or unclear

Skip this skill for backend-only, API-only, infra, or non-visual automation work.

## Core Rules

### Accessibility

- Keep text contrast at least 4.5:1 for normal text.
- Never remove focus indication without a stronger replacement.
- Add labels to icon-only controls and form fields.
- Avoid relying on color alone to convey state.
- Respect reduced-motion and dynamic text scaling.

### Interaction

- Keep touch targets at least 44x44.
- Show visible pressed, loading, success, and error states.
- Avoid hover-only interactions for primary actions.
- Do not block user input during animation.

### Layout

- Build mobile-first and test narrow screens first.
- Prevent horizontal scrolling.
- Use consistent spacing tokens and safe-area-aware fixed elements.
- Keep long text readable and avoid edge-to-edge paragraphs on large layouts.

### Visual System

- Use one icon family and one coherent elevation/radius system.
- Prefer semantic design tokens over hardcoded values.
- Pair light and dark themes intentionally instead of inverting colors.
- Avoid emoji as structural UI icons.

### Motion

- Use motion only when it clarifies cause and effect.
- Prefer transform and opacity to width, height, top, or left animation.
- Keep micro-interactions short and responsive.

### Forms

- Keep labels visible, helper text persistent when useful, and errors near the field.
- Focus the first invalid field after submit.
- Confirm destructive actions and offer undo when possible.

## Review Checklist

- Check contrast, focus states, labels, and keyboard/screen-reader support.
- Check touch target size, feedback states, and disabled-state clarity.
- Check responsive behavior on small screens and landscape.
- Check that spacing, type scale, icons, and shadows are consistent.
- Check that motion is subtle, purposeful, and respects reduced motion.
- Check that forms, errors, and empty states are understandable and recoverable.

## Notes

- The original source for this skill references extra search scripts and datasets. Those resources were not included in your message, so this installed version focuses on the guidance layer in `SKILL.md`.
- If you send the companion `scripts/` or reference files later, I can expand this into the full searchable version.
