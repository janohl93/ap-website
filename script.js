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
if (footerPlaceholder) {
  fetch('partials/footer.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Footer request failed with status ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      footerPlaceholder.innerHTML = html;
      observeAnimatedElements(footerPlaceholder);
      setCurrentYear(footerPlaceholder);
    })
    .catch((error) => console.error('Failed to load footer', error));
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
