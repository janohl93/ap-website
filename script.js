// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
// ...existing code...
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
// ...existing code...
