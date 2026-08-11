
  // Role filter with URL state
  const chips = document.querySelectorAll('.filter-chip');
  const rows  = document.querySelectorAll('#role-list .role-row');
  function applyFilter(f, push){
    chips.forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    let count = 0;
    rows.forEach(row => {
      const show = f === 'all' || row.dataset.cat === f;
      const li = row.closest('li');
      if (li) li.style.display = show ? '' : 'none';
      if (show) count++;
    });
    const note = document.querySelector('.roles-footer-note');
    if (note) {
      const total = { all: 12, eng: 6, product: 2, sales: 2, ops: 2 }[f] || count;
      note.textContent = f === 'all'
        ? 'Showing ' + count + ' of 12 roles currently open.'
        : 'Showing ' + count + ' of ' + total + ' ' + (f === 'eng' ? 'engineering' : f) + ' roles.';
    }
    if (push) {
      const url = new URL(window.location.href);
      if (f === 'all') url.searchParams.delete('team'); else url.searchParams.set('team', f);
      history.replaceState(null, '', url);
    }
  }
  chips.forEach(chip => chip.addEventListener('click', () => applyFilter(chip.dataset.filter, true)));
  const urlTeam = new URL(window.location.href).searchParams.get('team');
  if (urlTeam && ['eng','product','sales','ops'].includes(urlTeam)) applyFilter(urlTeam, false);

  // Slim nav on scroll
  const navEl = document.querySelector('nav');
  const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Count-up stats on viewport entry
  function animateNumber(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const useThousands = el.dataset.thousands === '1';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const supEl = el.querySelector('.sup');
    const supHTML = supEl ? supEl.outerHTML : '';
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = target * ease(t);
      let display;
      if (decimals > 0) display = v.toFixed(decimals);
      else if (useThousands) display = Math.round(v).toLocaleString();
      else display = Math.round(v).toString();
      el.innerHTML = prefix + display + suffix + supHTML;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateNumber(e.target); statObs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num[data-count]').forEach(el => statObs.observe(el));

  // CTA banner submission → Google Doc via Apps Script Web App
  const ctaForm = document.getElementById('cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submission = document.getElementById('cta-textarea').value;
      const submitBtn = ctaForm.querySelector('.cta-form-submit');
      submitBtn.disabled = true;

      fetch('https://script.google.com/a/macros/varsitytutors.com/s/AKfycbwveLC8WKIWjQwTMsbTk7zfIUTcEqR-V9Yzf0caqSpqzX6JsOT2_2FhwmthFqFxFnA3KA/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'submission=' + encodeURIComponent(submission)
      })
        .then(() => {
          ctaForm.style.display = 'none';
          document.getElementById('cta-success').style.display = 'block';
        })
        .catch(() => {
          submitBtn.disabled = false;
          alert("Something went wrong sending your submission — please email careers@nerdy.com directly.");
        });
    });
  }

