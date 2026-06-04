/* =====================================================================
   Creative Cornerstone - shared interactions (Flask build)
   ===================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const THEME_KEY = "cc-theme";
  const ACCENT_KEY = "cc-accent";

  function getStored(k, f) { try { return localStorage.getItem(k) || f; } catch (e) { return f; } }
  function setStored(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  root.setAttribute("data-theme", getStored(THEME_KEY, "dark"));
  root.setAttribute("data-accent", getStored(ACCENT_KEY, "aurora"));

  function initThemeControls() {
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        setStored(THEME_KEY, next);
      });
    }
    const palBtn = document.getElementById("paletteToggle");
    const palMenu = document.getElementById("paletteMenu");
    if (palBtn && palMenu) {
      palBtn.addEventListener("click", function (e) { e.stopPropagation(); palMenu.classList.toggle("open"); });
      palMenu.querySelectorAll(".swatch").forEach(function (s) {
        s.addEventListener("click", function () {
          root.setAttribute("data-accent", s.getAttribute("data-set"));
          setStored(ACCENT_KEY, s.getAttribute("data-set"));
          palMenu.classList.remove("open");
        });
      });
      document.addEventListener("click", function () { palMenu.classList.remove("open"); });
    }
  }

  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ham = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    if (ham && links) {
      ham.addEventListener("click", function (e) { e.stopPropagation(); links.classList.toggle("mobile-open"); });
      links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("mobile-open"); }); });
    }
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(function () { el.classList.add("in"); }, el.getAttribute("data-delay") || 0);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    let phrases;
    try { phrases = JSON.parse(el.getAttribute("data-phrases")); } catch (e) { phrases = []; }
    if (!phrases || !phrases.length) return;
    let pi = 0, ci = 0, deleting = false;
    function tick() {
      const current = phrases[pi];
      el.textContent = current.substring(0, deleting ? ci - 1 : ci + 1);
      ci += deleting ? -1 : 1;
      let delay = deleting ? 45 : 95;
      if (!deleting && ci === current.length) { deleting = true; delay = 1800; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 450; }
      setTimeout(tick, delay);
    }
    tick();
  }

  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1300, start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  // Game modal (games page)
  window.openGameModal = function (title, desc, embed, link) {
    var ov = document.getElementById("gameModal");
    if (!ov) return;
    document.getElementById("gameTitle").textContent = title;
    document.getElementById("gameDesc").textContent = desc || "";
    var body = document.getElementById("gameBody");
    if (embed) {
      body.innerHTML = '<iframe style="width:100%;height:60vh;border:0;border-radius:14px;background:#000;" srcdoc="' + embed.replace(/"/g, "&quot;") + '"></iframe>';
    } else if (link) {
      body.innerHTML = '<i data-lucide="external-link" class="big-ic"></i><p style="margin-bottom:22px;color:var(--muted);">This game opens in a new tab.</p><a href="' + link + '" target="_blank" class="btn btn-primary" style="display:inline-flex;">Play Game</a>';
    } else {
      body.innerHTML = '<i data-lucide="gamepad-2" class="big-ic"></i><p style="color:var(--muted);">No playable link yet.</p>';
    }
    ov.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  };
  window.closeGameModal = function () {
    var ov = document.getElementById("gameModal");
    if (ov) { ov.classList.remove("open"); var b = document.getElementById("gameBody"); if (b) b.innerHTML = ""; }
  };

  document.addEventListener("DOMContentLoaded", function () {
    initThemeControls();
    initNav();
    initReveal();
    initTypewriter();
    initCounters();
    var ov = document.getElementById("gameModal");
    if (ov) {
      ov.addEventListener("click", function (e) { if (e.target === ov) window.closeGameModal(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") window.closeGameModal(); });
    }
    if (window.lucide) window.lucide.createIcons();
  });
})();
