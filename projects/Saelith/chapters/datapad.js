/* ================================================================
   STILLNESS — Datapad Reader JS
   Include after </main> in chapter HTML files.
   ================================================================ */

(function() {
  const root = document.documentElement;
  const body = document.body;
  const stage = document.getElementById('stage');
  const datapad = document.getElementById('datapad');
  const railLeft = datapad.querySelector('.rail-left');
  const railRight = datapad.querySelector('.rail-right');
  const directory = document.getElementById('directory');
  const dirToggle = document.getElementById('dirToggle');
  const screenContent = document.getElementById('screenContent');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const gaugeProg = document.getElementById('gaugeProg');
  const gaugePct = document.getElementById('gaugePct');
  const spineFill = document.getElementById('spineFill');
  const btnFontUp = document.getElementById('btnFontUp');
  const btnFontDown = document.getElementById('btnFontDown');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const focusBtn = document.getElementById('focusBtn');
  const boot = document.getElementById('bootOverlay');
  const readMeta = document.getElementById('readMeta');
  const prose = document.getElementById('prose');
  const params = new URLSearchParams(location.search);
  /* preview mode: when the page is driven by query params (e.g. an embedded
     comparison frame), read only from params and never touch localStorage,
     so multiple frames on one canvas stay isolated. */
  const previewMode = params.has('chassis') || params.has('ambiance') || params.has('screen') || params.has('focus');
  const recall = (k) => previewMode ? null : localStorage.getItem(k);
  const store  = (k, v) => { if (!previewMode) localStorage.setItem(k, v); };

  /* ── CHASSIS — locked to Sentinel (symmetric rails). ── */
  const CHASSIS = {
    sentinel:  { l: 0.140, r: 0.140 },
    fieldpack: { l: 0.158, r: 0.108 },
    holoslate: { l: 0.030, r: 0.030 }
  };
  let chassis = params.get('chassis') || 'sentinel';
  if (!CHASSIS[chassis]) chassis = 'sentinel';
  datapad.dataset.chassis = chassis;

  /* ── MODE — Jedi (day) / Sith (night). Drives room hue AND screen brightness.
     Device chassis stays gunmetal either way. ── */
  let ambiance = (root.getAttribute('data-ambiance') === 'jedi') ? 'jedi' : 'sith';
  function applyAmbiance() {
    root.setAttribute('data-ambiance', ambiance);
    store('dp-ambiance', ambiance);
    document.querySelectorAll('.ambiance-seg .opt').forEach(o =>
      o.classList.toggle('active', o.dataset.ambianceSet === ambiance));
  }
  applyAmbiance();

  document.querySelectorAll('.ambiance-seg .opt').forEach(opt => {
    opt.addEventListener('click', () => { ambiance = opt.dataset.ambianceSet; applyAmbiance(); });
  });

  /* ── FOCUS / read-only mode ── */
  function setFocus(on) {
    body.classList.toggle('focus-mode', on);
    focusBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    focusBtn.querySelector('.fb-label').textContent = on ? 'Exit' : 'Focus';
    store('dp-focus', on ? '1' : '0');
    if (!on) { sizeDatapad(); requestAnimationFrame(sizeDatapad); setTimeout(sizeDatapad, 60); }
  }
  focusBtn.addEventListener('click', () => setFocus(!body.classList.contains('focus-mode')));
  if (params.get('focus') === '1' || recall('dp-focus') === '1') setFocus(true);

  /* ── DATAPAD SIZING — always portrait; rails flank, never steal screen ── */
  function sizeDatapad() {
    if (body.classList.contains('focus-mode')) return;   // CSS owns focus layout
    const sr = stage.getBoundingClientRect();
    const cs = getComputedStyle(stage);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const wide = matchMedia('(min-width: 1100px)').matches;
    const veryWide = matchMedia('(min-width: 1300px)').matches;
    let sidebars = 0;
    if (veryWide) sidebars = 280 + 300 + 24 * 2;
    else if (wide) sidebars = 280 + 16;
    const availW = Math.max(180, sr.width - padX - sidebars);
    const availH = Math.max(220, sr.height - padY);

    const railsHidden = window.innerWidth <= 640;
    const f = CHASSIS[chassis];
    const rl = railsHidden ? 0 : f.l;
    const rr = railsHidden ? 0 : f.r;
    const coreAspect = 0.62;            // core width / device height
    const denom = coreAspect + rl + rr; // total device width / height

    let h = Math.min(availH, 900);
    let w = h * denom;
    if (w > availW) { w = availW; h = w / denom; }
    if (h > availH) { h = availH; w = h * denom; }

    datapad.style.width = w + 'px';
    datapad.style.height = h + 'px';
    railLeft.style.width = (h * rl) + 'px';
    railRight.style.width = (h * rr) + 'px';
  }

  /* ── READING METADATA — word count + est. time ── */
  (function computeReadMeta() {
    const text = prose.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    const wDisplay = words >= 1000 ? (words / 1000).toFixed(1) + 'K' : String(words);
    readMeta.textContent = `${wDisplay} W // ${minutes} MIN`;
  })();

  /* ── PROGRESS + SCANNER GAUGE ── */
  const GAUGE_C = 2 * Math.PI * 18; // r = 18
  gaugeProg.style.strokeDasharray = GAUGE_C.toFixed(2);
  gaugeProg.style.strokeDashoffset = GAUGE_C.toFixed(2);
  function updateProgress() {
    const max = screenContent.scrollHeight - screenContent.clientHeight;
    const pct = max > 0 ? Math.round((screenContent.scrollTop / max) * 100) : 0;
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '%';
    gaugeProg.style.strokeDashoffset = (GAUGE_C * (1 - pct / 100)).toFixed(2);
    gaugePct.textContent = pct;
    if (spineFill) spineFill.style.height = pct + '%';
    sessionStorage.setItem('dp-scroll-ch01', screenContent.scrollTop);
  }
  screenContent.addEventListener('scroll', updateProgress, { passive: true });

  /* ── FONT SIZE ── */
  let fontStep = parseFloat(localStorage.getItem('dp-fontstep') || '0');
  function applyFont() {
    const size = (0.98 + fontStep * 0.08).toFixed(3);
    prose.style.setProperty('--read-size', size + 'rem');
    localStorage.setItem('dp-fontstep', fontStep);
  }
  applyFont();
  btnFontUp.addEventListener('click',   () => { if (fontStep < 4)  { fontStep++; applyFont(); } });
  btnFontDown.addEventListener('click', () => { if (fontStep > -2) { fontStep--; applyFont(); } });

  /* ── DIRECTORY DRAWER ── */
  dirToggle.addEventListener('click', e => {
    e.stopPropagation();
    directory.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (directory.classList.contains('open') &&
        !directory.contains(e.target) && e.target !== dirToggle) {
      directory.classList.remove('open');
    }
  });
  document.querySelectorAll('.dir-item:not(.locked)').forEach(item => {
    item.addEventListener('click', () => {
      const href = item.dataset.href;
      if (href && href !== window.location.pathname.split('/').pop()) {
        window.location.href = href;
      }
    });
  });

  /* ── MOUSE PARALLAX ── */
  if (matchMedia('(hover: hover)').matches) {
    stage.addEventListener('mousemove', e => {
      if (body.classList.contains('focus-mode')) return;
      const rect = datapad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const tiltY = Math.max(-1, Math.min(1, dx)) * 4;
      const tiltX = Math.max(-1, Math.min(1, dy)) * -3;
      datapad.style.setProperty('--tilt-y', tiltY + 'deg');
      datapad.style.setProperty('--tilt-x', tiltX + 'deg');
    });
    stage.addEventListener('mouseleave', () => {
      datapad.style.setProperty('--tilt-y', '0deg');
      datapad.style.setProperty('--tilt-x', '0deg');
    });
  }

  /* ── KEYBOARD ── */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' && !btnPrev.disabled)  btnPrev.click();
    if (e.key === 'ArrowRight' && !btnNext.disabled) btnNext.click();
    if (e.key === 'Escape' && body.classList.contains('focus-mode')) setFocus(false);
    if (e.key.toLowerCase() === 'f') setFocus(!body.classList.contains('focus-mode'));
    if (e.key.toLowerCase() === 't') {
      ambiance = ambiance === 'sith' ? 'jedi' : 'sith';
      applyAmbiance();
    }
  });

  /* ── RESIZE ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeDatapad, 110);
  });

  /* ── BOOT ── */
  if (sessionStorage.getItem('dp-booted')) boot.style.display = 'none';
  else sessionStorage.setItem('dp-booted', '1');

  /* ── INIT — call synchronously + retry frames (robust to hidden tabs) ── */
  function init() {
    sizeDatapad();
    const savedScroll = sessionStorage.getItem('dp-scroll-ch01');
    if (savedScroll) screenContent.scrollTop = parseInt(savedScroll, 10);
    updateProgress();
  }
  init();
  requestAnimationFrame(init);
  setTimeout(init, 80);
  setTimeout(init, 300);
  window.addEventListener('load', init);
})();
