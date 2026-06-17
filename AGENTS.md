# Nerdy-Careers-Site

## Cursor Cloud specific instructions

This repository is a single self-contained static webpage — there is no build system, package manager, backend, or dependencies.

- Main app: `Nerdy_Careers_Page.html` (inline CSS, vanilla JS, and an inline React/Babel "tweaks" widget). Image assets are the `team-photo-*.jpeg` files.
- Run it in development by serving the repo root with any static HTTP server and opening the page, e.g.:
  - `python3 -m http.server 8000` then visit `http://localhost:8000/Nerdy_Careers_Page.html`
  - Serving (not opening the file via `file://`) keeps relative asset paths working.
- There is nothing to install, lint, build, or unit-test — there are no lint/test/build configs in the repo.
- The page references some external fonts/JS bundles (Google Fonts + opaque-UUID asset URLs that are not in the repo). These only affect fonts and the React "tweaks" widget styling; the core page and vanilla-JS interactions (role filter chips, scroll nav, stat count-ups, CTA form success state) work without outbound internet.
- The CTA form is intercepted client-side (`event.preventDefault()`) and shows a success message; it does not post to any backend.
