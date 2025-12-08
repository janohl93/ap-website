# ap-website
Website for AP Power

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
