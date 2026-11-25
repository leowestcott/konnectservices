/* Konnect Services — site behaviour. Vanilla JS, no dependencies. */
(() => {
  "use strict";

  const doc = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------
     In-page navigation: render all sections before jumping so
     content-visibility size estimates can't shift the target
     ------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.pathname !== location.pathname || a.origin !== location.origin || !a.hash) return;
    doc.classList.add("cv-off");
  }, true);

  /* ------------------------------------------------------------
     Header: transparent over the hero, solid once scrolled
     ------------------------------------------------------------ */
  const header = $(".site-header");
  const sentinel = $("#top-sentinel");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle("is-scrolled", !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* ------------------------------------------------------------
     Mobile menu (focus management, Esc, inert background)
     ------------------------------------------------------------ */
  const toggle = $(".menu-toggle");
  const menu = $("#mobile-menu");
  if (toggle && menu) {
    const background = $$("main, .site-footer, .skip-link");
    const setOpen = (open, { returnFocus = true } = {}) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".menu-toggle__text").textContent = open ? "Close" : "Menu";
      menu.classList.toggle("is-open", open);
      menu.toggleAttribute("inert", !open);
      menu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
      background.forEach((el) => el.toggleAttribute("inert", open));
      header.classList.toggle("is-solid", open);
      if (open) {
        const first = menu.querySelector("a");
        setTimeout(() => first && first.focus({ preventScroll: true }), 250);
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false, { returnFocus: false });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
    });
    // Trap focus between the toggle (in the header) and the menu
    menu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusables = [toggle, ...$$("a, button", menu)];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === menu.querySelector("a")) {
        e.preventDefault(); first.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", (mq) => {
      if (mq.matches && menu.classList.contains("is-open")) setOpen(false, { returnFocus: false });
    });
  }

  /* ------------------------------------------------------------
     Desktop "Services" disclosure menu
     ------------------------------------------------------------ */
  $$(".nav__item--menu").forEach((item) => {
    const btn = item.querySelector("button");
    let timer;
    const open = (state) => {
      clearTimeout(timer);
      item.classList.toggle("is-open", state);
      btn.setAttribute("aria-expanded", String(state));
    };
    btn.addEventListener("click", () => open(btn.getAttribute("aria-expanded") !== "true"));
    if (window.matchMedia("(hover: hover)").matches) {
      item.addEventListener("mouseenter", () => open(true));
      item.addEventListener("mouseleave", () => { timer = setTimeout(() => open(false), 180); });
    }
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) open(false); });
    item.addEventListener("keydown", (e) => { if (e.key === "Escape") { open(false); btn.focus(); } });
    item.addEventListener("click", (e) => { if (e.target.closest(".nav__menu a")) open(false); });
  });

  /* ------------------------------------------------------------
     Scroll reveals
     ------------------------------------------------------------ */
  const revealTargets = $$("[data-reveal], .schematic, .network");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ------------------------------------------------------------
     Scrollspy for header nav + discipline switcher
     ------------------------------------------------------------ */
  const spyLinks = $$('[data-spy-nav] a[href*="#"]');
  const spySections = [...new Set(spyLinks.map((a) => a.hash.slice(1)))]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (spySections.length && "IntersectionObserver" in window) {
    const visible = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = null, bestRatio = 0;
      visible.forEach((ratio, id) => { if (ratio > bestRatio) { best = id; bestRatio = ratio; } });
      spyLinks.forEach((a) => {
        const on = a.hash.slice(1) === best;
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.5, 1] });
    spySections.forEach((s) => spy.observe(s));
  }

  // Progress underline in the discipline switcher
  const discLinks = $$(".disc-nav a");
  if (discLinks.length) {
    const targets = discLinks.map((a) => document.getElementById(a.hash.slice(1)));
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      targets.forEach((sec, i) => {
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / r.height));
        discLinks[i].style.setProperty("--p", p.toFixed(3));
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    requestAnimationFrame(update);
  }

  /* ------------------------------------------------------------
     Service list: expandable descriptions
     ------------------------------------------------------------ */
  const setSvc = (svc, open) => {
    svc.classList.toggle("is-open", open);
    const btn = svc.querySelector(".svc__toggle");
    if (btn) btn.setAttribute("aria-expanded", String(open));
  };
  $$(".svc").forEach((svc) => {
    const head = svc.querySelector(".svc__head");
    head.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      setSvc(svc, !svc.classList.contains("is-open"));
    });
  });
  $$(".svc-list__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = btn.closest(".svc-list");
      const items = $$(".svc", list);
      const openAll = btn.getAttribute("aria-expanded") !== "true";
      items.forEach((s) => setSvc(s, openAll));
      btn.setAttribute("aria-expanded", String(openAll));
      btn.querySelector("span").textContent = openAll ? "Collapse all" : "Expand all";
    });
  });
  const openFromHash = () => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains("svc")) setSvc(target, true);
  };
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  /* ------------------------------------------------------------
     Hero: subtle pointer parallax on the dot matrix
     ------------------------------------------------------------ */
  const matrix = $(".hero .dotmatrix");
  if (matrix && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
    let raf = 0, tx = 0, ty = 0;
    $(".hero").addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 14;
      ty = (e.clientY / window.innerHeight - 0.5) * 14;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; matrix.style.translate = `${tx}px ${ty}px`; });
    });
  }

  /* ------------------------------------------------------------
     Enquiry form (Formspree, progressive enhancement)
     ------------------------------------------------------------ */
  const form = $("#enquiry-form");
  if (form) {
    const status = $(".form__status", form);
    const submit = $('button[type="submit"]', form);
    const messages = {
      valueMissing: (label) => `Please enter your ${label.toLowerCase()}.`,
      typeMismatch: (label) => label.toLowerCase().includes("email") ? "Please enter a valid email address, e.g. name@company.co.uk." : `Please check your ${label.toLowerCase()}.`,
      patternMismatch: () => "Please enter a valid UK telephone number.",
      tooShort: () => "Please add a little more detail (at least 10 characters).",
    };
    let attempted = false;
    const fieldOf = (input) => input.closest(".field");
    const validate = (input) => {
      const field = fieldOf(input);
      if (!field) return true;
      const err = field.querySelector(".field__error");
      const label = input.dataset.label || field.querySelector("label").firstChild.textContent.replace("*", "").trim();
      let msg = "";
      if (input.validity.valueMissing) msg = input.tagName === "SELECT" ? "Please choose the type of enquiry." : messages.valueMissing(label);
      else if (input.validity.typeMismatch) msg = messages.typeMismatch(label);
      else if (input.validity.patternMismatch) msg = messages.patternMismatch(label);
      else if (input.validity.tooShort) msg = messages.tooShort(label);
      if (err) err.textContent = msg;
      if (msg) { field.setAttribute("data-invalid", ""); input.setAttribute("aria-invalid", "true"); }
      else { field.removeAttribute("data-invalid"); input.removeAttribute("aria-invalid"); }
      return !msg;
    };
    const inputs = $$("input:not([type=hidden]):not([name=_gotcha]), select, textarea", form);
    inputs.forEach((input) => {
      input.addEventListener("blur", () => { if (attempted || input.value) validate(input); });
      input.addEventListener("input", () => { if (fieldOf(input)?.hasAttribute("data-invalid")) validate(input); });
    });
    const setStatus = (state, html) => {
      status.dataset.state = state;
      status.innerHTML = html;
    };
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      attempted = true;
      const invalid = inputs.filter((i) => !validate(i));
      if (invalid.length) {
        setStatus("error", `<span>Please correct the ${invalid.length === 1 ? "highlighted field" : invalid.length + " highlighted fields"} and try again.</span>`);
        invalid[0].focus();
        return;
      }
      submit.setAttribute("aria-busy", "true");
      setStatus("pending", "<span>Sending your enquiry…</span>");
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.classList.add("is-sent");
          setStatus("success", "<span><strong>Thank you — your enquiry has been sent.</strong><br>A member of the Konnect team will be in touch. For anything urgent, call <a class=\"text-link\" href=\"tel:+441707651550\">01707\u00a0651550</a>.</span>");
          form.reset();
          status.focus();
        } else {
          let detail = "";
          try { const data = await res.json(); detail = (data.errors || []).map((x) => x.message).join(" "); } catch (_) {}
          throw new Error(detail || "Request failed");
        }
      } catch (err) {
        setStatus("error", "<span><strong>Sorry, your enquiry could not be sent.</strong><br>Please try again, or contact us directly on <a class=\"text-link\" href=\"tel:+441707651550\">01707\u00a0651550</a> or <a class=\"text-link\" href=\"mailto:contact@konnectservices.com\">contact@konnectservices.com</a>.</span>");
      } finally {
        submit.removeAttribute("aria-busy");
      }
    });
  }

  /* ------------------------------------------------------------
     Project gallery lightbox (native <dialog>)
     ------------------------------------------------------------ */
  const lightbox = $("#lightbox");
  const galleryItems = $$("[data-lightbox]");
  if (lightbox && galleryItems.length && typeof lightbox.showModal === "function") {
    const img = $("img", lightbox);
    const srcAvif = $('source[type="image/avif"]', lightbox);
    const caption = $(".lightbox__caption", lightbox);
    const count = $(".lightbox__count", lightbox);
    let index = 0, opener = null;
    const show = (i) => {
      index = (i + galleryItems.length) % galleryItems.length;
      const a = galleryItems[index];
      srcAvif.srcset = a.dataset.avif;
      img.src = a.href;
      img.alt = a.querySelector("img")?.alt || "";
      caption.textContent = a.dataset.caption || img.alt;
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
      [index + 1, index - 1].forEach((n) => {
        const next = galleryItems[(n + galleryItems.length) % galleryItems.length];
        const pre = new Image(); pre.src = next.href;
      });
    };
    galleryItems.forEach((a, i) => a.addEventListener("click", (e) => {
      e.preventDefault(); opener = a; show(i); lightbox.showModal();
    }));
    $("[data-lb-prev]", lightbox).addEventListener("click", () => show(index - 1));
    $("[data-lb-next]", lightbox).addEventListener("click", () => show(index + 1));
    $("[data-lb-close]", lightbox).addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target.classList.contains("lightbox__stage")) lightbox.close(); });
    lightbox.addEventListener("close", () => opener && opener.focus({ preventScroll: true }));
    let startX = null;
    lightbox.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    lightbox.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });
  }

  /* ------------------------------------------------------------
     Misc
     ------------------------------------------------------------ */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
