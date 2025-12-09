# ap-website
Website for AP Power

## Overview

This repository contains a static site built from hand-authored HTML pages and shared assets. Dynamic portions of the site—such as navigation, the footer, and structured content for projects and insights—are assembled at runtime in the browser via `script.js`. There is no build step or external dependencies; running a simple HTTP server from the repository root is sufficient to preview or publish the site.

## Shared footer

- The footer is defined once in `partials/footer.html` and injected into each page at runtime.
- Each HTML file ends with a `<div id="footer-placeholder"></div>`; `script.js` fetches the shared footer and inserts it into that placeholder.
- The year in the footer is populated automatically by `script.js` after the footer is injected.
- To update the footer for all pages, edit `partials/footer.html` and keep the placeholder plus `script.js` include at the end of every HTML document.

## Structured content workflow

Projects and insights are now sourced from JSON in `/data`, and rendered into both listing and detail pages by `script.js`.

1. **Add or edit entries**
   - Insights live in `data/insights.json`; projects live in `data/projects.json`.
   - Each entry expects a `slug` (matching its HTML filename), `title`, `summary`, `lead`, `heroAlt`, and a `sections` array with `heading` and `body` text (body is an array of paragraphs).
   - Include metadata fields: for insights use `date` and `topic`; for projects use `location`, `year`, and optional `tags`.
   - Cross-links come from `relatedProjects` (on insights) or `relatedInsights` (on projects). Use slugs from the same data files to keep related cards in sync.
2. **Preview the site**
   - Content is injected at runtime. Run a simple server (for example `python -m http.server 8000`) from the repository root and open `http://localhost:8000` in your browser.
   - The listing pages (`projects.html`, `insights.html`) and all detail pages will rebuild from the JSON on refresh—no additional build step is required.

## Editing and content updates

- Keep HTML pages lean and defer repeated elements to partials where possible. Use consistent `<div id="footer-placeholder"></div>` and script includes to ensure shared assets load on every page.
- When adding a new project or insight, create a corresponding HTML detail page named after the `slug` in `data/projects.json` or `data/insights.json`. Use existing pages as templates for structure and metadata tags.
- Use descriptive `alt` text for images and keep headings nested logically (`h1` → `h2` → `h3`) to maintain accessibility.
- Update `styles.css` sparingly and prefer class-based selectors over IDs for reusable styling.

## Local development

1. Start a simple server from the repository root:
   ```bash
   python -m http.server 8000
   ```
2. Visit `http://localhost:8000` to browse the site. Content changes in `/data` or edits to HTML/JS/CSS are reflected on refresh without additional tooling.
3. If working on `script.js`, test both listing pages and a sampling of detail pages to ensure data-driven rendering still functions.

## Maintenance checklist

- **Content accuracy:** Review `data/insights.json` and `data/projects.json` quarterly to retire outdated entries and add new work.
- **Link health:** Validate that `relatedProjects` and `relatedInsights` slugs resolve to existing entries; broken slugs silently drop cards.
- **Footer and navigation:** Confirm the shared footer loads on each page after major edits to `partials/footer.html` or `script.js`.
- **Accessibility:** Ensure new imagery includes `heroAlt` text and headings remain sequential.
- **Performance:** Because the site is static, keep asset sizes small and reuse images across pages when possible.

## Deployment

The site is static and can be served by any HTTP host (object storage, CDN, or a simple web server). Deploy by uploading the repository contents, including the `data` and `partials` directories. No build pipeline is required.

## How to contribute

1. Branch from the main development branch.
2. Make focused changes and update tests or content files where relevant.
3. Preview locally using the steps above.
4. Submit a pull request describing the change and any manual verification performed.

## Updating dependencies

This project has no runtime package dependencies beyond the browser. If you add tooling (for example, a formatter or linter), document the commands in this README and keep configuration files committed so others can reproduce your workflow.
