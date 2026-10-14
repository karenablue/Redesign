# SGRho National Website — Redesign

This repo holds two things side by side on purpose:

- **Repo root** (`index.html`, `about/`, `leadership/`, `membership/`, `images/`, …) —
  the original Figma Make export. It is **reference only**: existing content,
  copy, and images to pull from. Nothing in the rebuild imports it.
- **[`site/`](site/)** — the actual rebuild, in progress. An Astro project with
  a real component/design system, replacing the flat per-page HTML in the root.

**Work happens in `site/`.** See [`site/README.md`](site/README.md) for how to
run it, how it's organized, and how to port a page from the root reference into
the new system.

The source transfer, account setup, content approvals, and launch checks are
documented in [`site/HANDOFF.md`](site/HANDOFF.md).

When the rebuild is finished, the root reference pages get deleted and `site/`
is promoted to the repo root (see "When the rebuild is done" in
`site/README.md`).
