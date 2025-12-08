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

// Placeholder images
const placeholderDefaults = {
  size: '1200x800',
  bg: 'e5e7eb',
  fg: '1f3a5f',
  text: 'APA Image Placeholder',
  // new: local fallback inside your repo
  local: 'assets/images/placeholder.jpg'
};

document.querySelectorAll('img[data-placeholder]').forEach((img) => {
  const size = img.dataset.placeholder || placeholderDefaults.size;
  const { bg, fg, text, local } = placeholderDefaults;
  const remoteUrl = `https://placehold.co/${size}/${bg}/${fg}?text=${encodeURIComponent(text)}`;

  if (local) {
    // try local image first; if it 404s, fall back to remote placeholder
    img.src = local;
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = remoteUrl;
    });
  } else {
    img.src = remoteUrl;
  }

  if (!img.hasAttribute('loading')) {
    img.loading = 'lazy';
  }

  img.classList.add('placeholder-img');
});
