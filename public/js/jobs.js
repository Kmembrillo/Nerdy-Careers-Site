(() => {
  'use strict';

  const FUNCTION_URL = '/.netlify/functions/jobs';
  const DEPARTMENTS = ['Engineering', 'Product', 'Sales', 'Operations'];
  const FILTER_ALIASES = { eng: 'Engineering', engineering: 'Engineering', product: 'Product', sales: 'Sales', ops: 'Operations', operations: 'Operations' };
  const NEW_WINDOW_DAYS = 7;
  const CAREERS_EMAIL = 'careers@nerdy.com';

  const MOCK_JOBS = false;

  const state = {
    jobs: [],
    activeFilter: 'all',
  };

  const mockDescriptions = {
    Engineering: 'Build production AI systems that support live learning sessions, model orchestration, evaluation loops, and fast human-in-the-loop workflows.',
    Product: 'Shape the Live + AI learning experience with tight user feedback loops, prompt-and-eval thinking, and measurable learner outcomes.',
    Operations: 'Run the systems, tools, and support operations that keep Nerdy moving quickly with AI-augmented workflows across the company.',
    Sales: 'Partner with schools and districts using a modern GTM motion backed by AI agents, sharp customer insight, and strong execution.'
  };

  function getMockJobs() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return [
      mockJob('mock-1', 'Staff Engineer AI-Native', 'Engineering', 'Platform', 'Full-time contractor', 'Remote · Global', now - day),
      mockJob('mock-2', 'Senior Engineer AI-Native', 'Engineering', 'Live+AI', 'Full-time contractor', 'Remote · LATAM', now - (2 * day)),
      mockJob('mock-3', 'Senior Engineer AI-Native', 'Engineering', 'Learner Platform', 'Full-time contractor', 'Hyderabad, India', now - (3 * day)),
      mockJob('mock-4', 'Senior PM Live+AI', 'Product', 'Learning Experience', 'Full-time', 'Remote · US', now - (9 * day)),
      mockJob('mock-5', 'IT Operations Specialist', 'Operations', 'IT', 'Full-time', 'Remote · US', now - (5 * day)),
      mockJob('mock-6', 'Educational Sales Rep', 'Sales', 'GTM', 'Full-time', 'Remote · US', now - (8 * day)),
    ];
  }

  function mockJob(id, title, department, team, type, location, timestamp) {
    const postedDate = new Date(timestamp).toISOString();
    return {
      id,
      title,
      department,
      team,
      type,
      location,
      hook: mockDescriptions[department],
      applyUrl: 'https://careers.nerdy.com/jobs',
      postedDate,
      isNew: isWithinDays(postedDate, NEW_WINDOW_DAYS),
    };
  }

  async function fetchJobs() {
    const response = await fetch(FUNCTION_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      throw new Error('Jobs request failed with status ' + response.status);
    }
    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload.jobs || [];
  }

  function normalizeJob(job) {
    const department = normalizeDepartment(job.department || job.dept || job.category);
    const postedDate = job.postedDate || job.datePosted || job.createdAt || '';
    return {
      id: job.id || job.jobId || job.applyUrl || job.title,
      title: job.title || 'Open role',
      department,
      team: job.team || department,
      type: job.type || job.employmentType || 'Full-time',
      location: job.location || 'Remote',
      hook: plainText(job.hook || job.description || '').slice(0, 120),
      applyUrl: job.applyUrl || job.url || 'https://careers.nerdy.com/jobs',
      postedDate,
      isNew: Boolean(job.isNew) || isWithinDays(postedDate, NEW_WINDOW_DAYS),
    };
  }

  function normalizeDepartment(value) {
    if (!value) return 'Operations';
    const trimmed = String(value).trim();
    const direct = DEPARTMENTS.find((dept) => dept.toLowerCase() === trimmed.toLowerCase());
    if (direct) return direct;
    const lower = trimmed.toLowerCase();
    if (lower.includes('engineer') || lower.includes('technology')) return 'Engineering';
    if (lower.includes('product')) return 'Product';
    if (lower.includes('sales') || lower.includes('gtm') || lower.includes('business development')) return 'Sales';
    return 'Operations';
  }

  function plainText(value) {
    const div = document.createElement('div');
    div.innerHTML = String(value || '');
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function isWithinDays(value, days) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const age = Date.now() - date.getTime();
    return age >= 0 && age < days * 24 * 60 * 60 * 1000;
  }

  function formatPostedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Recently posted';
    const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000)));
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 14) return 'Posted ' + diffDays + ' days ago';
    if (diffDays < 60) return 'Posted ' + Math.floor(diffDays / 7) + ' weeks ago';
    return 'Posted ' + date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[char]);
  }

  function renderJobs(jobs) {
    const list = document.getElementById('role-list');
    if (!list) return;
    if (!jobs.length) {
      list.innerHTML = '<li id="roles-loading">No open roles found.</li>';
      return;
    }
    list.innerHTML = jobs.map((job) => `
      <li><a class="role-row" data-cat="${escapeHtml(job.department)}" href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noopener">
        <div>
          <div class="role-name">${escapeHtml(job.title)}${job.isNew ? '<span class="role-new">New</span>' : ''}</div>
          <div class="role-team">${escapeHtml(job.department)} · ${escapeHtml(job.team)} · ${escapeHtml(job.type)}</div>
          <div class="role-hook">${escapeHtml(job.hook)}</div>
        </div>
        <div class="role-comp"><span class="posted">${escapeHtml(formatPostedDate(job.postedDate))}</span></div>
        <div class="role-category">${escapeHtml(job.department)}</div>
        <div class="role-location"><span class="dot"></span>${escapeHtml(job.location)}</div>
        <div class="role-arrow">→</div>
      </a></li>`).join('');
  }

  function updateCounts(jobs) {
    const counts = Object.fromEntries(DEPARTMENTS.map((dept) => [dept, 0]));
    jobs.forEach((job) => {
      if (counts[job.department] !== undefined) counts[job.department] += 1;
    });
    setCount('count-all', jobs.length);
    DEPARTMENTS.forEach((dept) => setCount('count-' + dept, counts[dept]));
  }

  function setCount(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  }

  function normalizeFilter(value) {
    if (!value || value === 'all') return 'all';
    return FILTER_ALIASES[String(value).toLowerCase()] || value;
  }

  function applyFilter(filter, pushState) {
    const normalized = normalizeFilter(filter);
    state.activeFilter = normalized;
    const rows = document.querySelectorAll('#role-list .role-row');
    let visible = 0;
    rows.forEach((row) => {
      const show = normalized === 'all' || row.dataset.cat === normalized;
      const li = row.closest('li');
      if (li) li.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.classList.toggle('active', normalizeFilter(chip.dataset.filter) === normalized);
    });
    const note = document.getElementById('roles-footer-note') || document.querySelector('.roles-footer-note');
    if (note) note.textContent = 'Showing ' + visible + ' of ' + state.jobs.length + ' roles';
    if (pushState) {
      const url = new URL(window.location.href);
      if (normalized === 'all') url.searchParams.delete('team');
      else url.searchParams.set('team', normalized);
      history.replaceState(null, '', url);
    }
  }

  function bindFilters() {
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter, true));
    });
  }

  function currentUrlFilter() {
    return normalizeFilter(new URL(window.location.href).searchParams.get('team'));
  }

  function bindCta() {
    const form = document.getElementById('cta-form');
    if (!form) return;
    const textarea = form.querySelector('textarea');
    const success = document.getElementById('cta-success');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const body = textarea ? textarea.value.trim() : '';
      const subject = 'Nerdy careers intro';
      window.location.href = 'mailto:' + CAREERS_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    });
  }

  async function initJobs() {
    try {
      const jobs = MOCK_JOBS ? getMockJobs() : await fetchJobs();
      state.jobs = jobs.map(normalizeJob);
      updateCounts(state.jobs);
      renderJobs(state.jobs);
      applyFilter(currentUrlFilter(), false);
    } catch (error) {
      const list = document.getElementById('role-list');
      if (list) list.innerHTML = '<li id="roles-loading">Unable to load roles. Please visit careers.nerdy.com/jobs.</li>';
      const note = document.getElementById('roles-footer-note') || document.querySelector('.roles-footer-note');
      if (note) note.textContent = 'Showing 0 of 0 roles';
      console.error(error);
    }
  }

  bindFilters();
  bindCta();
  initJobs();
})();
