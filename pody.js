// PoDy on the site: the same cloud as in PoDee, in the corner of every page. His eyes follow
// the mouse, he blinks and breathes; a click pets him (hearts and his happy chirp), poking
// too often makes him dizzy. Now and then he says a word or asks to
// support Pody Lab. Also here: the «back to top» button and the page's soft effects.
// Needs site.js first (W, up).
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SOUND_KEY = "podylab.sound";
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  const session = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} },
  };
  const page = location.pathname.split("/").pop() || "index.html";

  // ---------- his voice: the chirps from PoDee, played live ----------

  // one tone: from f gliding to `to` Hz, starting `at` s in, lasting d s
  const CUES = {
    happy: [{ f: 900, to: 1250, at: 0, d: 0.2, wobble: 26 }, { f: 1250, to: 1050, at: 0.18, d: 0.24, wobble: 26 }],
    answer: [{ f: 659, at: 0, d: 0.15 }, { f: 880, at: 0.1, d: 0.15 }, { f: 1319, at: 0.2, d: 0.34 }],
    note: [{ f: 784, at: 0, d: 0.18 }, { f: 1175, at: 0.12, d: 0.3 }],
    poke: [{ f: 990, to: 560, at: 0, d: 0.2 }],
    dizzy: [{ f: 520, to: 390, at: 0, d: 0.22 }, { f: 440, to: 330, at: 0.22, d: 0.3 }],
  };
  let audio = null;
  let soundOn = store.get(SOUND_KEY) !== "off";
  function chirp(cue) {
    if (!soundOn) return;
    try {
      audio ||= new AudioContext();
      const a = audio;
      const t0 = a.currentTime + 0.02;
      const out = a.createGain();
      out.gain.value = 0.16;
      const soft = a.createBiquadFilter();
      soft.type = "lowpass";
      soft.frequency.value = 3400;
      soft.connect(out).connect(a.destination);
      for (const t of CUES[cue]) {
        const start = t0 + t.at;
        const end = start + t.d;
        const env = a.createGain();
        env.gain.setValueAtTime(0, start);
        env.gain.linearRampToValueAtTime(1, start + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, end);
        env.connect(soft);
        for (const [mul, level] of [[1, 1], [2, 0.18]]) {
          const o = a.createOscillator();
          o.frequency.setValueAtTime(t.f * mul, start);
          if (t.to) o.frequency.exponentialRampToValueAtTime(t.to * mul, end);
          if (t.wobble) {
            const lfo = a.createOscillator();
            const depth = a.createGain();
            lfo.frequency.value = t.wobble;
            depth.gain.value = t.f * mul * 0.03;
            lfo.connect(depth).connect(o.frequency);
            lfo.start(start);
            lfo.stop(end);
          }
          const g = a.createGain();
          g.gain.value = level;
          o.connect(g).connect(env);
          o.start(start);
          o.stop(end + 0.02);
        }
      }
    } catch {
      // no sound in this browser: PoDy stays quiet
    }
  }

  // ---------- PoDy himself ----------

  const eye = (cx) => `<g class="eye"><g class="lid"><ellipse class="white" cx="${cx}" cy="11.4" rx="2.9" ry="3.3"/><g class="pupil"><ellipse cx="${cx}" cy="11.7" rx="1.75" ry="2.15"/><circle class="sparkle" cx="${cx + 0.9}" cy="10.6" r="0.73"/><circle class="sparkle" cx="${cx - 0.6}" cy="12.9" r="0.31"/></g></g></g>`;
  const face = `
    ${eye(11.2)}${eye(20.8)}
    <path class="happy" d="M8.4 12.2q2.8-3.4 5.6 0M18 12.2q2.8-3.4 5.6 0"/>
    <path class="cross" d="M9.4 9.6l3 1.9-3 1.9M22.6 9.6l-3 1.9 3 1.9"/>
    <path class="dizzy" d="M11.2 11.4a0.45 0.45 0 0 1 0.9 0a0.9 0.9 0 0 1-1.8 0a1.35 1.35 0 0 1 2.7 0a1.8 1.8 0 0 1-3.6 0a2.25 2.25 0 0 1 4.5 0M20.8 11.4a0.45 0.45 0 0 1 0.9 0a0.9 0.9 0 0 1-1.8 0a1.35 1.35 0 0 1 2.7 0a1.8 1.8 0 0 1-3.6 0a2.25 2.25 0 0 1 4.5 0"/>
    <ellipse class="blush" cx="7" cy="15.6" rx="2.3" ry="1.3"/>
    <ellipse class="blush" cx="25" cy="15.6" rx="2.3" ry="1.3"/>
    <path class="mouth" d="M14.4 15.8q0.8 1 1.6 0q0.8 1 1.6 0"/>
    <ellipse class="o-mouth" cx="16" cy="16.3" rx="1.3" ry="1.5"/>`;
  // the cat for the dark theme: the island-black head from PoDee, eyes as light rings with a shine
  const catEye = (cx, cy) => `<g class="eye"><g class="lid"><circle class="ring" cx="${cx}" cy="${cy}" r="3.5"/><g class="pupil"><circle class="core" cx="${cx}" cy="${cy}" r="2.6"/><circle class="glint" cx="${cx - 0.9}" cy="${cy - 0.9}" r="0.8"/></g></g></g>`;
  const catFace = `
    ${catEye(12.6, 11.4)}${catEye(20.2, 11.8)}
    <path class="happy" d="M9.6 12.4q3-3.6 6 0M17.2 12.8q3-3.6 6 0"/>
    <path class="cross" d="M10.6 9.8l3 1.9-3 1.9M22.2 10.2l-3 1.9 3 1.9"/>
    <path class="dizzy" d="M12.6 11.4a0.4 0.4 0 0 1 0.8 0a0.8 0.8 0 0 1-1.6 0a1.2 1.2 0 0 1 2.4 0a1.6 1.6 0 0 1-3.2 0a2 2 0 0 1 4 0M20.2 11.8a0.4 0.4 0 0 1 0.8 0a0.8 0.8 0 0 1-1.6 0a1.2 1.2 0 0 1 2.4 0a1.6 1.6 0 0 1-3.2 0a2 2 0 0 1 4 0"/>
    <path class="mouth" d="M14.8 17q.8 1 1.6 0q.8 1 1.6 0"/>
    <ellipse class="o-mouth" cx="16.4" cy="17.6" rx="1.3" ry="1.4"/>`;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="pody-dock">
      <button class="to-top" id="to-top" type="button" aria-label="${W("js.back_to_top")}" title="${W("js.back_to_top")}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>
      </button>
      <div class="pody-talk" id="pody-talk" hidden>
        <button class="pody-close" id="pody-close" type="button" aria-label="${W("js.close")}">×</button>
        <p id="pody-say"></p>
      </div>
      <div class="pody-wrap">
        <button class="pody-sound" id="pody-sound" type="button"></button>
        <button class="pody" id="pody" type="button" aria-label="${W("js.pody_the_cloud_pet")}">
          <svg viewBox="214 236 632 512" aria-hidden="true">
            <defs>
              <radialGradient id="pody-body" cx="0.36" cy="0.26" r="0.85"><stop offset="0" stop-color="#fff"/><stop offset="0.6" stop-color="#f6fbfa"/><stop offset="1" stop-color="#d5ebe6"/></radialGradient>
              <radialGradient id="pody-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
              <clipPath id="pody-clip"><circle cx="372" cy="520" r="138"/><circle cx="530" cy="430" r="182"/><circle cx="690" cy="530" r="132"/><rect x="238" y="500" width="590" height="228" rx="114"/></clipPath>
            </defs>
            <ellipse cx="532" cy="742" rx="290" ry="34" fill="url(#pody-shadow)"/>
            <g class="pody-body pb-cat">
              <path transform="translate(274 262) scale(16)" class="cat-head" d="M10.2 1.6L13.4 6.4Q17 5.8 20.6 6.2L23.6 3.2Q24.4 7.6 24.6 10.4C26.6 13.6 27.6 18.6 26.8 22.4C26 27 21.4 29.2 16 29.2C9.6 29.2 4.4 26.6 4.4 21.4C4.4 16.8 6.4 13.4 8.4 11.4C8.2 8 8.8 4.4 10.2 1.6ZM26.2 23.4C28.4 22.6 29.2 20.4 29 18.6C28.9 17.4 30.5 17 30.8 18.4C31.3 21.4 29.7 24.8 26.6 25.6Z"/>
              <g class="pody-face cat-face" transform="translate(274 262) scale(16)">${catFace}</g>
            </g>
            <g class="pody-body pb-cloud">
              <g clip-path="url(#pody-clip)"><rect x="200" y="230" width="660" height="520" fill="url(#pody-body)"/><ellipse cx="532" cy="770" rx="300" ry="70" fill="#8fd0c2" opacity="0.35"/></g>
              <g class="pody-face" transform="translate(338 400) scale(12)">${face}</g>
            </g>
          </svg>
        </button>
      </div>
    </div>`,
  );
  const pody = document.getElementById("pody");
  const talk = document.getElementById("pody-talk");
  const say = document.getElementById("pody-say");
  const soundBtn = document.getElementById("pody-sound");

  const SOUND_ICONS = {
    on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path class="wave" d="M15.5 9a4 4 0 0 1 0 6M18 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>',
    off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path class="wave" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  };
  const showSound = () => {
    soundBtn.innerHTML = soundOn ? SOUND_ICONS.on : SOUND_ICONS.off;
    soundBtn.title = soundOn ? W("js.mute_pody") : W("js.unmute_pody");
    soundBtn.setAttribute("aria-label", soundBtn.title);
  };
  showSound();
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    store.set(SOUND_KEY, soundOn ? "on" : "off");
    showSound();
    chirp("note");
  });

  // moods: petted (^ ^), poked (> <), dizzy (spirals), talking (an O mouth)
  let moodTimer = 0;
  function mood(name, ms) {
    pody.dataset.mood = name;
    clearTimeout(moodTimer);
    moodTimer = setTimeout(() => delete pody.dataset.mood, ms);
  }
  function hop(px = 10) {
    if (still) return;
    pody.animate([{ translate: "0 0" }, { translate: `0 -${px}px`, scale: "0.96 1.06" }, { translate: "0 0", scale: "1.06 0.94" }, { translate: "0 0", scale: "1 1" }], { duration: 560, easing: "ease-out" });
  }
  function hearts(n = 3) {
    const r = pody.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "pody-heart";
      h.textContent = "♥";
      h.style.left = `${r.left + r.width / 2 + (i - (n - 1) / 2) * 16}px`;
      h.style.top = `${r.top + 6}px`;
      document.body.append(h);
      const dx = (Math.random() - 0.5) * 40;
      h.animate(
        [
          { transform: "translate(-50%, 0) scale(0.6)", opacity: 0 },
          { transform: `translate(calc(-50% + ${dx * 0.4}px), -24px) scale(1.1)`, opacity: 1, offset: 0.25 },
          { transform: `translate(calc(-50% + ${dx}px), -80px) scale(0.9)`, opacity: 0 },
        ],
        { duration: 1300 + Math.random() * 400, delay: i * 110, easing: "ease-out", fill: "backwards" },
      ).finished.then(() => h.remove());
    }
  }

  // eyes follow the mouse
  const pupils = [...pody.querySelectorAll(".pupil")];
  let look = 0;
  addEventListener("pointermove", (e) => {
    if (look) return;
    look = requestAnimationFrame(() => (look = 0));
    const r = pody.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height * 0.55);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 260);
    pupils.forEach((p) => (p.style.transform = `translate(${((dx / d) * 0.9 * k).toFixed(2)}px, ${((dy / d) * 0.8 * k).toFixed(2)}px)`));
  });
  // and blink now and then
  (function blink() {
    setTimeout(() => {
      if (!pody.dataset.mood) {
        pody.classList.add("blink");
        setTimeout(() => pody.classList.remove("blink"), 150);
      }
      blink();
    }, 2600 + Math.random() * 3800);
  })();

  // ---------- what he says ----------

  let hideTimer = 0;
  /** PoDy says something; `link` adds a button under the words. */
  function speak(text, { link = null, ms = 6500 } = {}) {
    say.textContent = text;
    if (link) say.insertAdjacentHTML("beforeend", ` <a class="pody-link" href="${link[1]}">${link[0]}</a>`);
    talk.hidden = false;
    talk.animate?.([{ opacity: 0, transform: "translateY(6px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out" });
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => (talk.hidden = true), ms);
  }
  const support = [W("js.support"), "support.html"];

  document.getElementById("pody-close").addEventListener("click", () => (talk.hidden = true));

  // a click pets him; too many quick clicks make him dizzy
  let pokes = [];
  pody.addEventListener("click", () => {
    const now = Date.now();
    pokes = pokes.filter((t) => now - t < 2200).concat(now);
    if (pokes.length >= 6) {
      mood("dizzy", 2600);
      chirp("dizzy");
      speak(W("js.i_m_dizzy"), { ms: 2600 });
      if (!still) pody.animate([{ rotate: "0deg" }, { rotate: "-8deg" }, { rotate: "7deg" }, { rotate: "-4deg" }, { rotate: "0deg" }], { duration: 900 });
      pokes = [];
      return;
    }
    if (pokes.length >= 4) {
      mood("poked", 900);
      chirp("poke");
      speak(W("js.that_tickles"), { ms: 1800 });
      hop(5);
      return;
    }
    mood("petted", 1400);
    chirp("happy");
    hearts();
    hop();
    if (talk.hidden) speak(page === "support.html" ? W("js.thanks_for_stopping_by") : W("js.hi_i_m_pody"), { ms: 3500 });
  });

  // he greets once per visit, then now and then asks to support the project
  if (!session.get("pody.hi")) {
    session.set("pody.hi", "1");
    setTimeout(() => {
      if (!talk.hidden) return;
      speak(W("js.hi_i_m_pody"));
      hop(8);
    }, 2500);
  }
  let asked = 0;
  setInterval(() => {
    if (document.hidden || !talk.hidden || asked >= 2 || page === "support.html") return;
    asked++;
    speak(W("js.if_podee_helps_you"), { link: support, ms: 8000 });
    mood("petted", 1200);
    hop(6);
  }, 45000);
  // the download button: he wants to move in
  document.querySelectorAll("[data-podee]").forEach((a) =>
    a.addEventListener("mouseenter", () => {
      if (!talk.hidden) return;
      speak(W("js.download_podee_and_i"), { ms: 4000 });
      mood("petted", 1000);
    }),
  );

  // ---------- back to top ----------

  const toTop = document.getElementById("to-top");
  const onScroll = () => toTop.classList.toggle("show", scrollY > 500);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }));

  // ---------- soft effects: light under the mouse on cards, drifting clouds, blocks rising into view ----------

  document.querySelectorAll(".card").forEach((c) => {
    let frame = 0;
    c.addEventListener("pointermove", (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${e.clientX - r.left}px`);
        c.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  });

  if (still) return;
  document.body.insertAdjacentHTML("afterbegin", '<div class="sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>');
  document.documentElement.classList.add("fx");
  const rise = document.querySelectorAll("section h2, .card, .shot, .hero > *:not(.cloud), .page-head");
  const seen = new IntersectionObserver(
    (list) => list.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      seen.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  rise.forEach((el, i) => {
    el.classList.add("rise");
    el.style.setProperty("--d", `${(i % 4) * 70}ms`);
    seen.observe(el);
  });
})();
