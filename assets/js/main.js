/* Top of Mind | main.js
   Progressive enhancement only: every page is complete without this file.
   1. Mobile menu  2. Cookie consent */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  /* 1. Mobile menu --------------------------------------------------- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    // Without JS the toggle is a link to #site-nav (opened by :target); here it becomes a button.
    toggle.setAttribute("role", "button");
    toggle.setAttribute("aria-expanded", "false");
    var setMenu = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (!open && returnFocus) toggle.focus();
    };
    var flip = function (e) {
      e.preventDefault();
      setMenu(toggle.getAttribute("aria-expanded") !== "true", false);
    };
    toggle.addEventListener("click", flip);
    toggle.addEventListener("keydown", function (e) {
      if (e.key === " ") flip(e);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false, false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    doc.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-header")) setMenu(false, false);
    });
  }

  /* 2. Cookie consent ------------------------------------------------ */
  // Tools that need consent, listed by category. Bump VERSION whenever this list changes,
  // so every visitor is asked again. Load such tools as
  // <script type="text/plain" data-consent="analytics" src="..."></script>
  var TOOLS = { analytics: [], marketing: [] };
  var VERSION = 1;
  var KEY = "tom_consent";
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var DELAY = 1500;
  var inUse = TOOLS.analytics.length + TOOLS.marketing.length > 0;
  var barMode = doc.body.getAttribute("data-consent-mode") === "bar";
  var dialog = null;
  var overlay = null;
  var lastFocus = null;
  var scrollY = 0;

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSION && Date.now() - Date.parse(c.ts) < MAX_AGE) return c;
    } catch (e) { /* storage blocked or corrupt */ }
    return null;
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function apply(c) {
    if (inUse) {
      var g = function (ok) { return ok ? "granted" : "denied"; };
      gtag("consent", "update", {
        analytics_storage: g(c.analytics),
        ad_storage: g(c.marketing),
        ad_user_data: g(c.marketing),
        ad_personalization: g(c.marketing)
      });
    }
    doc.querySelectorAll('script[type="text/plain"][data-consent]').forEach(function (old) {
      if (!c[old.getAttribute("data-consent")] || old.hasAttribute("data-consent-loaded")) return;
      var s = doc.createElement("script");
      for (var i = 0; i < old.attributes.length; i++) {
        var a = old.attributes[i];
        if (a.name !== "type" && a.name !== "data-consent") s.setAttribute(a.name, a.value);
      }
      old.setAttribute("data-consent-loaded", "");
      old.after(s);
    });
  }

  function save(analytics, marketing) {
    var c = { v: VERSION, necessary: true, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* choice lasts for this page view */ }
    apply(c);
    doc.dispatchEvent(new CustomEvent("tom:consent", { detail: c }));
    close();
  }

  function option(name, title, text, checked, disabled) {
    return '<label class="consent__option"><input type="checkbox" name="' + name + '"' +
      (checked ? " checked" : "") + (disabled ? " disabled" : "") + "><span><strong>" + title +
      "</strong><span>" + text + "</span></span></label>";
  }

  function build(current) {
    var intro = inUse
      ? "We use strictly necessary storage to run this site and, only if you agree, the analytics and marketing tools listed under Customize. You can change your choice at any time from Cookie settings in the footer."
      : "This site only uses strictly necessary storage: one entry in your browser that remembers this choice. We don't run analytics or marketing tools. If we add any, we will ask you first.";
    var html = '<h2 class="consent__title" id="consent-title">Cookies on this site</h2>' +
      '<p id="consent-text">' + intro + ' <a href="privacy-policy.html#cookies">Read the cookie section of our Privacy Policy</a>.</p>' +
      '<fieldset class="consent__panel" id="consent-panel" hidden><legend class="visually-hidden">Choose categories</legend>' +
      option("necessary", "Strictly necessary", "Remembers your cookie choice. Always on.", true, true);
    if (TOOLS.analytics.length) html += option("analytics", "Analytics", "Used by: " + TOOLS.analytics.join(", ") + ".", current && current.analytics, false);
    if (TOOLS.marketing.length) html += option("marketing", "Marketing", "Used by: " + TOOLS.marketing.join(", ") + ".", current && current.marketing, false);
    html += '<button type="button" class="btn" data-action="save">Save choices</button></fieldset>' +
      '<div class="consent__actions">' +
      '<button type="button" class="btn" data-action="accept">Accept all</button>' +
      '<button type="button" class="btn" data-action="reject">Reject all</button>' +
      '<button type="button" class="btn btn--secondary" data-action="customize" aria-expanded="false" aria-controls="consent-panel">Customize</button>' +
      "</div>";

    dialog = doc.createElement("div");
    dialog.id = "cookie-consent";
    dialog.className = "consent";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", barMode ? "false" : "true");
    dialog.setAttribute("aria-labelledby", "consent-title");
    dialog.setAttribute("aria-describedby", "consent-text");
    dialog.tabIndex = -1;
    dialog.innerHTML = html;
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("keydown", onKey);
  }

  function onClick(e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    if (action === "accept") save(true, true);
    else if (action === "reject") save(false, false);
    else if (action === "customize") setPanel(dialog.querySelector("#consent-panel").hidden);
    else if (action === "save") {
      var a = dialog.querySelector('input[name="analytics"]');
      var m = dialog.querySelector('input[name="marketing"]');
      save(a && a.checked, m && m.checked);
    }
  }

  function setPanel(open) {
    var panel = dialog.querySelector("#consent-panel");
    var btn = dialog.querySelector('[data-action="customize"]');
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    if (!open) btn.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") {
      if (!dialog.querySelector("#consent-panel").hidden) setPanel(false);
      return;
    }
    if (e.key !== "Tab" || barMode) return;
    var items = [].filter.call(dialog.querySelectorAll("a[href], button, input:not([disabled])"), function (el) {
      return el.offsetParent !== null;
    });
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || doc.activeElement === dialog)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && doc.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setPageInert(on) {
    doc.querySelectorAll("body > header, body > main, body > footer, body > .skip-link").forEach(function (el) {
      el.inert = on;
    });
  }

  function open(byUser) {
    if (dialog) return;
    lastFocus = doc.activeElement;
    build(read());
    var skip = doc.querySelector(".skip-link");
    if (skip) skip.after(dialog); else doc.body.prepend(dialog);
    if (!barMode) {
      overlay = doc.createElement("div");
      overlay.className = "consent-overlay";
      dialog.before(overlay);
      scrollY = window.scrollY;
      root.classList.add("consent-lock");
      doc.body.style.top = -scrollY + "px";
      setPageInert(true);
    }
    if (!barMode || byUser === true) dialog.focus();
    requestAnimationFrame(function () {
      dialog.classList.add("is-visible");
      if (overlay) overlay.classList.add("is-visible");
    });
  }

  function close() {
    if (!dialog) return;
    var wasModal = !!overlay;
    dialog.remove();
    if (overlay) overlay.remove();
    dialog = overlay = null;
    if (wasModal) {
      setPageInert(false);
      root.classList.remove("consent-lock");
      doc.body.style.top = "";
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = "";
    }
    if (lastFocus && lastFocus.focus && lastFocus !== doc.body) lastFocus.focus();
  }

  window.tomConsent = { get: read, open: open };

  doc.querySelectorAll("[data-consent-open]").forEach(function (btn) {
    btn.addEventListener("click", function () { open(true); });
  });

  var stored = read();
  if (inUse) {
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }
  if (stored) {
    apply(stored);
  } else {
    var later = function () { setTimeout(function () { if (!read()) open(); }, DELAY); };
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", later);
    else later();
  }
})();
