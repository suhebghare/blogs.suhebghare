document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Theme Toggle ────────────────────────────────────────────────────────
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

  // ── 2. Reading Progress Bar ────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = scrollTop / (scrollHeight - clientHeight) * 100;
    document.documentElement.style.setProperty('--scroll-progress', pct + '%');
  });

  // ── 3. Table of Contents ───────────────────────────────────────────────────
  const tocList = document.getElementById('toc-list');
  const postContent = document.querySelector('.post-content');
  if (tocList && postContent) {
    const slugify = (t) => t.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-');
    postContent.querySelectorAll('h2, h3').forEach((h) => {
      if (!h.id) h.id = slugify(h.textContent);
      const li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-sub' : '';
      li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
      tocList.appendChild(li);
    });
    const tocLinks = tocList.querySelectorAll('a');
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('active'));
          tocList.querySelector(`a[href="#${e.target.id}"]`)?.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -60% 0px' }).observe
    && postContent.querySelectorAll('h2, h3').forEach((h) => {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tocLinks.forEach((a) => a.classList.remove('active'));
            tocList.querySelector(`a[href="#${e.target.id}"]`)?.classList.add('active');
          }
        });
      }, { rootMargin: '0px 0px -60% 0px' }).observe(h);
    });
  }

  // ── 4. Code Copy Buttons ───────────────────────────────────────────────────
  document.querySelectorAll('pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.querySelector('code')?.textContent || pre.textContent);
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // ── 5 & 6. Search + Category Filter ───────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const cards = document.querySelectorAll('.blog-card');
  let activeCategory = 'all';

  const filterCards = () => {
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    let any = false;
    cards.forEach((card) => {
      const title = (card.querySelector('.card-title, h3')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.card-excerpt, p')?.textContent || '').toLowerCase();
      const show = (!q || title.includes(q) || excerpt.includes(q)) &&
                   (activeCategory === 'all' || card.dataset.category === activeCategory);
      card.style.display = show ? '' : 'none';
      if (show) any = true;
    });
    document.querySelector('.no-results')?.classList.toggle('visible', !any);
  };

  searchInput?.addEventListener('keyup', filterCards);
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterCards();
    });
  });

  // ── 7. Blog Stats ──────────────────────────────────────────────────────────
  // Inline fallback stats (always available, even without a server)
  const FALLBACK_STATS = {"reusable-cicd-templates":{"reads":780,"likes":294,"dislikes":26},"secrets-management-environments":{"reads":779,"likes":328,"dislikes":44},"argo-rollouts-canary-deployments":{"reads":875,"likes":221,"dislikes":32},"self-hosted-runners-eks":{"reads":789,"likes":389,"dislikes":40},"platform-engineering-vs-devops":{"reads":663,"likes":323,"dislikes":20},"building-internal-developer-platform":{"reads":855,"likes":414,"dislikes":40},"ai-reduce-alert-fatigue":{"reads":710,"likes":347,"dislikes":25},"llm-analyze-incident-logs":{"reads":609,"likes":138,"dislikes":27},"ai-aws-cost-anomaly-detection":{"reads":777,"likes":177,"dislikes":32},"can-ai-replace-oncall-engineers":{"reads":884,"likes":286,"dislikes":35},"building-ai-agent-infrastructure":{"reads":639,"likes":314,"dislikes":20},"mcp-servers-devops-automation":{"reads":744,"likes":175,"dislikes":37},"chatgpt-terraform-safety":{"reads":763,"likes":360,"dislikes":33},"waf-rules-bot-protection":{"reads":777,"likes":240,"dislikes":38},"geo-blocking-vs-rate-limiting":{"reads":624,"likes":254,"dislikes":18},"credential-stuffing-aws":{"reads":810,"likes":320,"dislikes":32},"secure-ecommerce-architecture":{"reads":809,"likes":359,"dislikes":24},"iso27001-devops-controls":{"reads":725,"likes":245,"dislikes":25},"cloudfront-waf-best-practices":{"reads":837,"likes":180,"dislikes":37},"api-abuse-prevention-kubernetes":{"reads":762,"likes":175,"dislikes":27},"black-friday-aws-cost-reduction":{"reads":850,"likes":355,"dislikes":26},"production-node-groups-strategy":{"reads":693,"likes":271,"dislikes":40},"pod-disruption-budgets-guide":{"reads":700,"likes":237,"dislikes":36},"statefulsets-production-lessons":{"reads":855,"likes":414,"dislikes":39},"karpenter-vs-cluster-autoscaler":{"reads":821,"likes":355,"dislikes":39},"multi-environment-eks":{"reads":621,"likes":233,"dislikes":26},"incident-response-postmortems":{"reads":819,"likes":327,"dislikes":28},"cloud-cost-optimization":{"reads":629,"likes":313,"dislikes":37},"devops-automation":{"reads":900,"likes":294,"dislikes":40},"security-best-practices":{"reads":827,"likes":217,"dislikes":46},"linux-server-management":{"reads":773,"likes":154,"dislikes":24},"infrastructure-as-code":{"reads":765,"likes":164,"dislikes":41},"kubernetes-guide":{"reads":615,"likes":250,"dislikes":21},"observability-monitoring":{"reads":820,"likes":202,"dislikes":47},"aws-serverless-architecture":{"reads":768,"likes":222,"dislikes":45},"aws-compute-types":{"reads":855,"likes":351,"dislikes":34},"aws-storage-types":{"reads":677,"likes":232,"dislikes":26},"zero-downtime-deployments":{"reads":920,"likes":387,"dislikes":28},"sre-error-budgets-slos":{"reads":845,"likes":362,"dislikes":22},"terraform-at-scale":{"reads":910,"likes":401,"dislikes":31},"on-call-runbook-design":{"reads":780,"likes":334,"dislikes":19},"gitops-with-argocd":{"reads":870,"likes":378,"dislikes":24},"prometheus-alerting-rules":{"reads":795,"likes":341,"dislikes":21},"database-migrations-zero-downtime":{"reads":860,"likes":372,"dislikes":29},"cost-allocation-tagging-strategy":{"reads":710,"likes":298,"dislikes":17},"chaos-engineering-production":{"reads":830,"likes":355,"dislikes":25},"eks-networking-deep-dive":{"reads":950,"likes":421,"dislikes":33},"llm-production-incident-mttr":{"reads":640,"likes":271,"dislikes":18},"llm-vs-mcp-complete-guide":{"reads":780,"likes":230,"dislikes":14},"ai-agents-infrastructure-mcp":{"reads":510,"likes":198,"dislikes":12},"llms-production-backend-systems":{"reads":490,"likes":187,"dislikes":11},"mcp-transform-devops-workflows":{"reads":475,"likes":182,"dislikes":10},"vector-databases-qdrant-ai-search":{"reads":460,"likes":175,"dislikes":9}};

  // Load persisted like/dislike counts from localStorage
  // Clear stale localStorage that has bad 0/1 values from old version
  let localStats = JSON.parse(localStorage.getItem('blog-stats') || '{}');
  const isStale = Object.values(localStats).some(v => (v.reads !== undefined && v.reads <= 1));
  if (isStale) { localStats = {}; localStorage.removeItem('blog-stats'); }

  const applyStats = (stats) => {
    document.querySelectorAll('[data-blog][data-stat]').forEach((el) => {
      const id = el.dataset.blog;
      const stat = el.dataset.stat;
      // Never use localStorage for reads — only for likes/dislikes (user interactions)
      const localVal = (stat === 'likes' || stat === 'dislikes') ? localStats[id]?.[stat] : undefined;
      const baseVal = stats[id]?.[stat];
      if (localVal !== undefined) el.textContent = localVal;
      else if (baseVal !== undefined) el.textContent = baseVal;
    });
  };

  // Try fetching live stats from S3; fall back to inline on any error
  const statsUrl = (location.hostname === 'localhost' || location.protocol === 'file:')
    ? null  // skip fetch when running locally
    : '/blog-stats.json';

  if (statsUrl) {
    fetch(statsUrl)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(applyStats)
      .catch(() => applyStats(FALLBACK_STATS));
  } else {
    applyStats(FALLBACK_STATS);
  }

  // ── 8. Like / Dislike (persisted in localStorage) ─────────────────────────
  document.querySelectorAll('.like-btn, .dislike-btn').forEach((btn) => {
    const blogId = btn.dataset.blog;
    const isLike = btn.classList.contains('like-btn');
    const statType = isLike ? 'likes' : 'dislikes';

    // Restore disabled state if already voted
    const voted = localStorage.getItem(`voted-${blogId}`);
    if (voted) {
      btn.disabled = true;
      if (voted === statType) btn.classList.add(isLike ? 'liked' : 'disliked');
    }

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const statsBar = btn.closest('.post-stats');
      const countEl = statsBar?.querySelector(`[data-blog="${blogId}"][data-stat="${statType}"]`);
      const newVal = parseInt(countEl?.textContent || '0', 10) + 1;
      if (countEl) countEl.textContent = newVal;

      // Persist the new count and the vote
      if (!localStats[blogId]) localStats[blogId] = {};
      localStats[blogId][statType] = newVal;
      localStorage.setItem('blog-stats', JSON.stringify(localStats));
      localStorage.setItem(`voted-${blogId}`, statType);

      btn.classList.add(isLike ? 'liked' : 'disliked');
      btn.disabled = true;
      const sibling = statsBar?.querySelector(isLike ? '.dislike-btn' : '.like-btn');
      if (sibling) sibling.disabled = true;
    });
  });

  // ── 9. Back to Top ─────────────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── 10. Mobile Menu ────────────────────────────────────────────────────────
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });

  // ── 11. Reading Time ───────────────────────────────────────────────────────
  if (postContent) {
    const words = postContent.textContent.trim().split(/\s+/).length;
    const el = document.querySelector('.reading-time');
    if (el) el.textContent = `${Math.ceil(words / 200)} min read`;
  }

  // ── 12. Animate Cards on Scroll ────────────────────────────────────────────
  if (cards.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); } });
    });
    cards.forEach((c) => obs.observe(c));
  }

  // ── 13. Smooth Scroll ──────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});
