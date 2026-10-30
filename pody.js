// PoDy on the site: the same cloud as in PoDee, in the corner of every page. His eyes follow
// the mouse, he blinks and breathes; a click pets him (hearts and his happy chirp), poking
// too often makes him dizzy. A little chat answers a few words, now and then he asks to
// support Pody Lab. Also here: the «back to top» button and the page's soft effects.
// Needs site.js first (T, EN, up).
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
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="pody-dock">
      <button class="to-top" id="to-top" type="button" aria-label="${T("Наверх", "Back to top")}" title="${T("Наверх", "Back to top")}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>
      </button>
      <div class="pody-talk" id="pody-talk" hidden>
        <button class="pody-close" id="pody-close" type="button" aria-label="${T("Закрыть", "Close")}">×</button>
        <p id="pody-say"></p>
        <form id="pody-form" autocomplete="off"><input id="pody-input" maxlength="120" placeholder="${T("Напишите PoDy…", "Write to PoDy…")}" aria-label="${T("Сообщение для PoDy", "A message for PoDy")}" /></form>
      </div>
      <div class="pody-wrap">
        <button class="pody-sound" id="pody-sound" type="button"></button>
        <button class="pody" id="pody" type="button" aria-label="${T("Облачко PoDy: погладить и поговорить", "PoDy the cloud: pet him and talk")}">
          <svg viewBox="214 236 632 512" aria-hidden="true">
            <defs>
              <radialGradient id="pody-body" cx="0.36" cy="0.26" r="0.85"><stop offset="0" stop-color="#fff"/><stop offset="0.6" stop-color="#f6fbfa"/><stop offset="1" stop-color="#d5ebe6"/></radialGradient>
              <clipPath id="pody-clip"><circle cx="372" cy="520" r="138"/><circle cx="530" cy="430" r="182"/><circle cx="690" cy="530" r="132"/><rect x="238" y="500" width="590" height="228" rx="114"/></clipPath>
            </defs>
            <g class="pody-body">
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
  const input = document.getElementById("pody-input");
  const soundBtn = document.getElementById("pody-sound");

  const SOUND_ICONS = {
    on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path class="wave" d="M15.5 9a4 4 0 0 1 0 6M18 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>',
    off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path class="wave" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  };
  const showSound = () => {
    soundBtn.innerHTML = soundOn ? SOUND_ICONS.on : SOUND_ICONS.off;
    soundBtn.title = soundOn ? T("Выключить звуки PoDy", "Mute PoDy") : T("Включить звуки PoDy", "Unmute PoDy");
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
  addEventListener("pointermove", (e) => {
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
  /** PoDy says something; `link` adds a button under the words, `chat` keeps the box open to answer. */
  function speak(text, { link = null, ms = 6500, chat = false } = {}) {
    say.textContent = text;
    if (link) say.insertAdjacentHTML("beforeend", ` <a class="pody-link" href="${link[1]}">${link[0]}</a>`);
    talk.hidden = false;
    talk.classList.toggle("chat", chat);
    talk.animate?.([{ opacity: 0, transform: "translateY(6px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out" });
    clearTimeout(hideTimer);
    if (!chat) hideTimer = setTimeout(() => (talk.hidden = true), ms);
  }
  const support = [T("Поддержать", "Support"), `${up}support.html`];
  const podeePage = [T("Подробнее", "Learn more"), "podee.html"];

  // a few words he understands
  const REPLIES = [
    [/привет|здрав|хай|hi\b|hello|hey/i, () => [T("Привет! Рад, что вы зашли", "Hi! Glad you came by")]],
    [/скача|загруз|установ|download|install|get/i, () => [T("Кнопка «Скачать PoDee» есть на главной и на странице PoDee", "The «Download PoDee» button is on the home page and on PoDee's page"), podeePage]],
    [/подд|донат|задонат|деньг|оплат|support|donat|money|tip/i, () => [T("Спасибо! Вот страница поддержки", "Thank you! Here's the support page"), support]],
    [/podoo|подо|пульт|телефон|phone|remote/i, () => [T("PoDoo скоро выйдет. Старый телефон станет пультом для ПК", "PoDoo is coming soon. An old phone becomes a remote for your PC"), [T("О PoDoo", "About PoDoo"), "podoo.html"]]],
    [/умеешь|можешь|кто ты|что ты|what.*(do|can)|who are/i, () => [T("Живу у верхнего края экрана: показываю музыку и время. Со мной можно поговорить голосом", "I live at the top of your screen and show the music and the time. You can talk to me, too"), podeePage]],
    [/как дела|как ты|how are/i, () => [T("Хорошо. Особенно когда меня гладят", "Good. Even better when someone pets me")]],
    [/люблю|нравишься|милый|милаш|love|cute|♥|❤/i, () => { hearts(5); return [T("И вы мне нравитесь", "I like you too")]; }],
  ];
  document.getElementById("pody-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    mood("talking", 700);
    setTimeout(() => {
      const hit = REPLIES.find(([re]) => re.test(text));
      const [words, link] = hit ? hit[1]() : [T("Я знаю пока немного слов. Спросите, что я умею", "I only know a few words so far. Ask me what I can do")];
      speak(words, { link, chat: true });
      mood("petted", 1200);
      chirp("answer");
      hop(6);
    }, 450);
  });
  document.getElementById("pody-close").addEventListener("click", () => (talk.hidden = true));

  // a click pets him and opens the chat; too many quick clicks make him dizzy
  let pokes = [];
  pody.addEventListener("click", () => {
    const now = Date.now();
    pokes = pokes.filter((t) => now - t < 2200).concat(now);
    if (pokes.length >= 6) {
      mood("dizzy", 2600);
      chirp("dizzy");
      speak(T("Голова кружится…", "I'm dizzy…"), { ms: 2600 });
      if (!still) pody.animate([{ rotate: "0deg" }, { rotate: "-8deg" }, { rotate: "7deg" }, { rotate: "-4deg" }, { rotate: "0deg" }], { duration: 900 });
      pokes = [];
      return;
    }
    if (pokes.length >= 4) {
      mood("poked", 900);
      chirp("poke");
      speak(T("Щекотно!", "That tickles!"), { ms: 1800 });
      hop(5);
      return;
    }
    mood("petted", 1400);
    chirp("happy");
    hearts();
    hop();
    if (talk.hidden || !talk.classList.contains("chat")) {
      speak(page === "support.html" ? T("Спасибо, что заглянули. Любая сумма помогает", "Thanks for stopping by. Any amount helps") : T("Привет, я PoDy. Можно меня погладить", "Hi, I'm PoDy. You can pet me"), { chat: true });
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    }
  });

  // he greets once per visit, then now and then asks to support the project
  if (!session.get("pody.hi")) {
    session.set("pody.hi", "1");
    setTimeout(() => {
      if (!talk.hidden) return;
      speak(T("Привет, я PoDy. Можно меня погладить", "Hi, I'm PoDy. You can pet me"));
      hop(8);
    }, 2500);
  }
  let asked = 0;
  setInterval(() => {
    if (document.hidden || !talk.hidden || asked >= 2 || page === "support.html") return;
    asked++;
    speak(T("Если PoDee пригодился, проект можно поддержать", "If PoDee helps you, you can support the project"), { link: support, ms: 8000 });
    mood("petted", 1200);
    hop(6);
  }, 45000);
  // the download button: he wants to move in
  document.querySelectorAll("[data-podee]").forEach((a) =>
    a.addEventListener("mouseenter", () => {
      if (!talk.hidden && talk.classList.contains("chat")) return;
      speak(T("Скачайте PoDee, и я поселюсь у вас наверху экрана", "Download PoDee and I'll move into the top of your screen"), { ms: 4000 });
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

  document.querySelectorAll(".card").forEach((c) =>
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    }),
  );

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
