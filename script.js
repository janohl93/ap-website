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

// Content data rendering
const dataSources = {
  insights: 'data/insights.json',
  projects: 'data/projects.json'
};

const dataBase = (() => {
  const baseUrl = new URL(window.location.href);
  baseUrl.pathname = baseUrl.pathname.replace(/[^/]*$/, '');
  return baseUrl;
})();

const dataCache = {};

const fetchData = (type) => {
  if (!dataSources[type]) return Promise.resolve({ items: [], ok: false });
  if (dataCache[type]) return Promise.resolve({ items: dataCache[type], ok: true });

  const url = new URL(dataSources[type], dataBase).toString();

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request for ${type} failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      dataCache[type] = json;
      return { items: json, ok: true };
    })
    .catch((error) => {
      console.error(`Unable to load ${type} data`, error);
      return { items: [], ok: false };
    });
};

const buildMetaText = (entry, type) => {
  const values = type === 'insight' ? [entry.date, entry.topic] : [entry.location, entry.year];
  return values.filter(Boolean).join(' · ');
};

const createTagList = (tags = []) => {
  const list = document.createElement('ul');
  list.className = 'project-tags';
  tags.forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = tag;
    list.appendChild(item);
  });
  return list;
};

const renderInsightList = async () => {
  const container = document.getElementById('insight-feed');
  if (!container) return;

  const { items: insights, ok } = await fetchData('insights');

  if (!ok) {
    container.innerHTML = '<p class="loading-copy">Unable to load this page right now.</p>';
    return;
  }

  if (!insights.length) {
    container.innerHTML = '<p class="loading-copy">No insights available right now.</p>';
    return;
  }

  container.innerHTML = '';
  insights.forEach((entry) => {
    const article = document.createElement('article');
    article.className = 'insight-article';
    article.id = entry.slug;

    article.innerHTML = `
      <header>
        <p class="card-meta">${buildMetaText(entry, 'insight')}</p>
        <h2>${entry.title}</h2>
      </header>
      <p>${entry.summary}</p>
      <a class="text-link" href="${entry.slug}.html">Read full article</a>
    `;

    container.appendChild(article);
  });

  observeAnimatedElements(container);
};

const renderProjectList = async () => {
  const container = document.getElementById('project-list');
  if (!container) return;

  const { items: projects, ok } = await fetchData('projects');

  if (!ok) {
    container.innerHTML = '<p class="loading-copy">Unable to load this page right now.</p>';
    return;
  }

  if (!projects.length) {
    container.innerHTML = '<p class="loading-copy">No project references available right now.</p>';
    return;
  }

  container.innerHTML = '';
  projects.forEach((entry) => {
    const article = document.createElement('article');
    article.className = 'project-entry';
    article.id = entry.slug;

    const meta = buildMetaText(entry, 'project');

    article.innerHTML = `
      <div class="entry-header">
        <p class="project-meta">${meta}</p>
        <h2>${entry.title}</h2>
      </div>
      <p class="entry-summary">${entry.summary}</p>
      <div class="entry-actions">
        <a class="text-link" href="${entry.slug}.html">View full reference</a>
      </div>
    `;

    if (entry.tags && entry.tags.length) {
      const tags = createTagList(entry.tags);
      article.insertBefore(tags, article.querySelector('.entry-summary'));
    }
    container.appendChild(article);
  });

  observeAnimatedElements(container);
};

const renderKeyFacts = (entry) => {
  if (!entry.location && !entry.year) return null;

  const facts = document.createElement('div');
  facts.className = 'key-facts';
  const rows = document.createElement('div');
  rows.className = 'key-fact-rows';

  if (entry.location) {
    const row = document.createElement('div');
    row.className = 'fact-row';
    row.innerHTML = `<span class="fact-value">${entry.location}</span><span class="fact-label">Country</span>`;
    rows.appendChild(row);
  }

  if (entry.year) {
    const row = document.createElement('div');
    row.className = 'fact-row';
    row.innerHTML = `<span class="fact-value">${entry.year}</span><span class="fact-label">Year</span>`;
    rows.appendChild(row);
  }

  facts.appendChild(rows);
  return facts;
};

const renderSections = (target, sections = []) => {
  sections.forEach((section) => {
    if (!section.heading && !(section.body && section.body.length)) return;
    if (section.heading) {
      const heading = document.createElement('h3');
      heading.textContent = section.heading;
      target.appendChild(heading);
    }

    (section.body || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      target.appendChild(p);
    });
  });
};

const renderRelatedLinks = async (type, entry) => {
  const container = document.getElementById('related-links');
  if (!container) return;

  const relatedSlugs = type === 'insight' ? entry.relatedProjects : entry.relatedInsights;
  if (!relatedSlugs || !relatedSlugs.length) {
    container.innerHTML = '';
    return;
  }

  const targetType = type === 'insight' ? 'projects' : 'insights';
  const { items: targetEntries, ok } = await fetchData(targetType);

  if (!ok) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = '';
  relatedSlugs.forEach((slug) => {
    const relatedEntry = targetEntries.find((item) => item.slug === slug);
    if (!relatedEntry) return;

    const card = document.createElement('a');
    card.className = 'related-card';
    card.href = `${relatedEntry.slug}.html`;

    const content = document.createElement('div');
    content.className = 'related-card-content';
    const label = document.createElement('span');
    label.textContent = type === 'insight' ? 'Related project reference' : 'Related insight';
    const title = document.createElement('strong');
    title.textContent = relatedEntry.title;

    content.append(label, title);
    card.append(content);

    const arrow = document.createElement('span');
    arrow.className = 'related-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    card.append(arrow);

    container.append(card);
  });
};

const renderDetailPage = async () => {
  const detailType = document.body.dataset.entryType;
  const slug = document.body.dataset.entrySlug;
  if (!detailType || !slug) return;

  const sourceType = detailType === 'insight' ? 'insights' : 'projects';
  const { items: entries, ok } = await fetchData(sourceType);
  const entry = entries.find((item) => item.slug === slug);

  const bodyContainer = document.getElementById('detail-body');
  if (!bodyContainer || !ok || !entry) {
    if (bodyContainer) {
      bodyContainer.innerHTML = '<p class="loading-copy">Unable to load this page right now.</p>';
    }
    return;
  }

  document.title = `${entry.title} | Africa Power Advisory`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', entry.lead || entry.summary || descriptionMeta.getAttribute('content'));
  }

  const titleEl = document.getElementById('detail-title');
  const metaEl = document.getElementById('detail-meta');
  const leadEl = document.getElementById('detail-lead');
  const typeEl = document.getElementById('detail-type');
  const heroImg = document.getElementById('detail-hero');

  if (titleEl) titleEl.textContent = entry.title;
  if (metaEl) metaEl.textContent = buildMetaText(entry, detailType);
  if (leadEl) leadEl.textContent = entry.lead || entry.summary || '';
  if (typeEl) typeEl.textContent = detailType === 'insight' ? 'Insight' : 'Project reference';
  if (heroImg) heroImg.alt = entry.heroAlt || entry.title || '';

  bodyContainer.innerHTML = '';

  if (detailType === 'project') {
    const facts = renderKeyFacts(entry);
    if (facts) bodyContainer.appendChild(facts);
    if (entry.tags && entry.tags.length) {
      bodyContainer.appendChild(createTagList(entry.tags));
    }
  }

  renderSections(bodyContainer, entry.sections);
  observeAnimatedElements(bodyContainer);

  renderRelatedLinks(detailType, entry);
};

renderInsightList();
renderProjectList();
renderDetailPage();
