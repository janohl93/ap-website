# ap-website
Website for AP Power

## Shared footer

- The footer is defined once in `partials/footer.html` and injected into each page at runtime.
- Each HTML file ends with a `<div id="footer-placeholder"></div>`; `script.js` fetches the shared footer and inserts it into that placeholder.
- The year in the footer is populated automatically by `script.js` after the footer is injected.
- To update the footer for all pages, edit `partials/footer.html` and keep the placeholder plus `script.js` include at the end of every HTML document.
