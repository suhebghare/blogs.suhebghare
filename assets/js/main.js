document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const theme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (theme === 'dark' || (!theme && prefersDark)) document.documentElement.classList.add('dark');

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const updateIcon = () => { themeBtn.innerHTML = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'; };
    updateIcon();
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      updateIcon();
    });
  }

  // 2. Reading Progress Bar
  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const percent = scrollTop / (scrollHeight - clientHeight) * 100;
    document.documentElement.style.setProperty('--scroll-progress', percent + '%');
  });

  // 3. Table of Contents
  const tocList = document.getElementById('toc-list');
  const postContent = document.querySelector('.post-content');
  if (tocList && postContent) {
    const headings = postContent.querySelectorAll('h2, h3');
    const slugify = (text) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');

    headings.forEach((h) => {
      if (!h.id) h.id = slugify(h.textContent);
      const li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-sub' : '';
      li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
      tocList.appendChild(li);
    });

    const tocLinks = tocList.querySelectorAll('a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('active'));
          const active = tocList.querySelector(`a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -60% 0px' });

    headings.forEach((h) => observer.observe(h));
  }

  // 4. Code Copy Buttons
  document.querySelectorAll('pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent);
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // 5 & 6. Search + Category Filter (combined)
  const searchInput = document.getElementById('search-input');
  const cards = document.querySelectorAll('.blog-card');
  let activeCategory = 'all';

  const filterCards = () => {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    let anyVisible = false;
    cards.forEach((card) => {
      const title = (card.querySelector('.card-title, h3')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.card-excerpt, p')?.textContent || '').toLowerCase();
      const matchesSearch = !query || title.includes(query) || excerpt.includes(query);
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const visible = matchesSearch && matchesCategory;
      card.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    });
    const noResults = document.querySelector('.no-results');
    if (noResults) noResults.classList.toggle('visible', !anyVisible);
  };

  if (searchInput) searchInput.addEventListener('keyup', filterCards);

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterCards();
    });
  });

  // 7. Blog Stats
  fetch('/blog-stats.json')
    .then((r) => r.json())
    .then((stats) => {
      document.querySelectorAll('[data-blog][data-stat]').forEach((el) => {
        const val = stats[el.dataset.blog]?.[el.dataset.stat];
        if (val !== undefined) el.textContent = val;
      });
    })
    .catch(() => {});

  // 8. Like/Dislike
  document.querySelectorAll('.like-btn, .dislike-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const blogId = btn.dataset.blog;
      const isLike = btn.classList.contains('like-btn');
      const statType = isLike ? 'likes' : 'dislikes';
      // Find count span in the same post-stats bar
      const statsBar = btn.closest('.post-stats');
      const countEl = statsBar?.querySelector(`[data-blog="${blogId}"][data-stat="${statType}"]`);
      if (countEl) countEl.textContent = parseInt(countEl.textContent || '0', 10) + 1;
      btn.classList.add(isLike ? 'liked' : 'disliked');
      btn.disabled = true;
      const sibling = statsBar?.querySelector(isLike ? '.dislike-btn' : '.like-btn');
      if (sibling) sibling.disabled = true;
    });
  });

  // 9. Back to Top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // 10. Mobile Menu
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // 11. Reading Time
  if (postContent) {
    const words = postContent.textContent.trim().split(/\s+/).length;
    const readingTimeEl = document.querySelector('.reading-time');
    if (readingTimeEl) readingTimeEl.textContent = `${Math.ceil(words / 200)} min read`;
  }

  // 12. Animate Cards on Scroll
  if (cards.length) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          cardObserver.unobserve(entry.target);
        }
      });
    });
    cards.forEach((card) => cardObserver.observe(card));
  }

  // 13. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
