/* ============================================================================
   theme.js  —  shared light / dark mode for the plain pages (archive, work)
   ----------------------------------------------------------------------------
   - Uses the same two palettes as the home page.
   - Remembers your choice across pages (localStorage), and silently does
     nothing if storage is blocked, so it never breaks.
   - Applies the theme to <html> immediately on load (no flash of the wrong
     theme), and exposes DTTheme.mountToggle(button) to wire up a toggle.
   You shouldn't need to edit this file.
   ========================================================================== */
(function () {
  var KEY = 'dt-theme';
  var LIGHT = { '--paper': '#ececea', '--ink': '#0a0a0a', '--signal': '#1d2dff' };
  var DARK  = { '--paper': '#0e0e10', '--ink': '#ededeb', '--signal': '#ed3a13' };

  var SUN  = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="3"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3" y1="3" x2="4.3" y2="4.3"/><line x1="11.7" y1="11.7" x2="13" y2="13"/><line x1="13" y1="3" x2="11.7" y2="4.3"/><line x1="4.3" y1="11.7" x2="3" y2="13"/></svg>';
  var MOON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 9.5 A 5.5 5.5 0 1 1 6.5 3 A 4 4 0 0 0 13 9.5 Z" fill="currentColor" stroke="none"/></svg>';

  function read()  { try { return localStorage.getItem(KEY) || 'light'; } catch (e) { return 'light'; } }
  function write(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }

  function apply(mode) {
    var t = (mode === 'dark') ? DARK : LIGHT, r = document.documentElement;
    for (var k in t) r.style.setProperty(k, t[k]);
    r.setAttribute('data-theme', mode);
  }

  function toggle() { var n = (read() === 'dark') ? 'light' : 'dark'; write(n); apply(n); return n; }

  apply(read()); // run as early as possible

  window.DTTheme = {
    current: read,
    apply: apply,
    toggle: toggle,
    // Fill a button with the right icon and make it flip the theme.
    mountToggle: function (btn) {
      if (!btn) return;
      function paint() {
        var dark = (read() === 'dark');
        btn.innerHTML = dark ? SUN : MOON;
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      }
      paint();
      btn.addEventListener('click', function () { toggle(); paint(); });
    }
  };
})();
