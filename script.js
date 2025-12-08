// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Reveal on scroll
const animatedSelector = '[data-animate]';
const animatedObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animatedObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    )
  : null;

const observeAnimatedElements = (scope = document) => {
  if (!animatedObserver) return;
  scope.querySelectorAll(animatedSelector).forEach((el) => animatedObserver.observe(el));
};

observeAnimatedElements();

// Year in footer
const setCurrentYear = (scope = document) => {
  const yearEl = scope.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// Shared footer loader
const footerPlaceholder = document.getElementById('footer-placeholder');
const inlineFooterMarkup = `
  <footer class="site-footer" data-animate>
    <div class="container footer-inner">
      <div class="footer-columns">
        <div class="footer-summary">
          <p class="footer-small">Africa Power Advisory is a specialist practice within Multiconsult Norge AS focused on market, policy, regulatory and project advisory in African power sectors.</p>
          <p class="footer-disclaimer">Information provided is for general guidance and does not constitute investment advice or a solicitation.</p>
          <p class="footer-small footer-year">© <span id="year"></span> Africa Power Advisory</p>
        </div>
        <div class="footer-contact">
          <p class="footer-small"><strong>Multiconsult Norge AS</strong><br />Drammensveien 260, 0283 Oslo, Norway</p>
          <p class="footer-small">Oslo · Dar Es Salaam · Lusaka · Maputo</p>
          <div class="footer-links">
            <a href="mailto:contact@africapoweradvisory.com">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h18v11H3z"/><path d="M3 7l9 6 9-6"/></svg>
              contact@africapoweradvisory.com
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h3v9H6z"/><circle cx="7.5" cy="6.5" r="1.5"/><path d="M11 9h3v1.8a3 3 0 0 1 5 2.4V18h-3v-4.2a1.3 1.3 0 0 0-2.6 0V18H11z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
`;

const renderFooter = (html, scope = footerPlaceholder) => {
  if (!scope) return;
  scope.innerHTML = html;
  observeAnimatedElements(scope);
  setCurrentYear(scope);
};

if (footerPlaceholder) {
  const footerUrl = new URL('partials/footer.html', window.location.href).toString();

  fetch(footerUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Footer request failed with status ${response.status}`);
      }
      return response.text();
    })
    .then((html) => renderFooter(html))
    .catch((error) => {
      console.error('Failed to load footer, using inline fallback', error);
      renderFooter(inlineFooterMarkup);
    });
} else {
  setCurrentYear();
}

// Placeholder images
const placeholderDefaults = {
  size: '1200x800',
  bg: 'e5e7eb',
  fg: '1f3a5f',
  text: 'APA Image Placeholder'
};

document.querySelectorAll('img[data-placeholder]').forEach((img) => {
  const size = img.dataset.placeholder || placeholderDefaults.size;
  const { bg, fg, text } = placeholderDefaults;
  const remoteUrl = `https://placehold.co/${size}/${bg}/${fg}?text=${encodeURIComponent(text)}`;

  // try size-specific local, then generic local, then remote
  const sizedLocal = `assets/images/placeholder-${size}.jpg`; // e.g. placeholder-1200x800.jpg
  const genericLocal = `assets/images/placeholder.jpg`;
  const sources = [sizedLocal, genericLocal, remoteUrl];

  let idx = 0;
  function tryNextSource() {
    img.src = sources[idx++];
  }

  function onError() {
    if (idx < sources.length) {
      tryNextSource();
    } else {
      img.removeEventListener('error', onError);
    }
  }

  img.addEventListener('error', onError);
  tryNextSource();

  if (!img.hasAttribute('loading')) {
    img.loading = 'lazy';
  }

  img.classList.add('placeholder-img');
});
