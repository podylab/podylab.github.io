// Pody Lab site: everything to fill in sits in CONFIG; the header, the footer,
// the crypto wallets and the wish form are built here for every page.
const CONFIG = {
  podee: "https://github.com/podylab/PoDee-releases/releases/latest/download/", // + PoDee_x64-setup.exe or PoDee_x86-setup.exe
  podeeVersion: "1.3.5", // shown until GitHub answers with the latest release; update it with every release
  releases: "https://github.com/podylab/PoDee-releases/releases",
  card: "https://www.donationalerts.com/r/polab", // the DonationAlerts page, e.g. https://www.donationalerts.com/r/name
  form: "https://formspree.io/f/xwllnbpp", // Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
  mail: "podylab@gmail.com", // without Formspree, the form opens a letter to this address
  wallets: [
    { coin: "USDT", net: "js.net_usdt", address: "TWoqgVrM1kEFTNZnZzkmJYT2uTYx5Yh58E" },
    { coin: "TON", net: "js.net_ton", address: "UQBBy_XIcwbK0A04cF81YYehXb24dbEczQlWIqpyE05nnsIi" },
    { coin: "BTC", net: "js.net_btc", address: "bc1qdus0f49gu3qupe9et8all9mt90fyaph74qv884" },
    { coin: "ETH", net: "js.net_eth", address: "0x5685fd91Db09F496a4d09EF4343aFb8Fcb1fbA47" },
    { coin: "BNB", net: "js.net_bnb", address: "0x5685fd91Db09F496a4d09EF4343aFb8Fcb1fbA47" },
    { coin: "DOGE", net: "js.net_doge", address: "D6C7TCRabX6jr8x6c9qoZUGB7evSUsf727" },
  ],
};

// the page's language: build.py writes PODY into every page (its words, the languages, this page's folder)
const LANG = document.documentElement.lang;
const WORDS = window.PODY?.words || {};
// W("js.key", { name: value }) gives this page's words with {name} filled in
const W = (k, vars = {}) => (WORDS[k] ?? k).replace(/\{(\w+)\}/g, (m, v) => vars[v] ?? m);
// P(n, "js.downloads") picks the plural this language needs for n: js.downloads.one, .few, .many or .other
const P = (n, k) => WORDS[`${k}.${new Intl.PluralRules(LANG).select(n)}`] ?? WORDS[`${k}.other`] ?? "";
// the path to the site root: build.py writes it into the page (en/, preview/ and the like are one folder down)
const up = document.querySelector('meta[name="root"]')?.content ?? "";
// the way to the Russian pages of this build (the site, or its preview): every language's folder starts there
const HOME = window.PODY?.home ?? up;

const $ = (id) => document.getElementById(id);
const page = location.pathname.split("/").pop() || "index.html";

// the home page at the root opens in the browser's language, once; a choice in the menu is remembered
const LANGS = window.PODY?.langs || [];
const LANG_KEY = "podylab.lang";
const chosen = (() => { try { return localStorage.getItem(LANG_KEY); } catch { return null; } })();
const pick = () => {
  for (const want of navigator.languages || [navigator.language || ""]) {
    const w = want.toLowerCase();
    if (/^(ru|be|kk)/.test(w)) return "ru";
    const hit = LANGS.find(([code]) => w === code.toLowerCase()) || LANGS.find(([code]) => w.split("-")[0] === code.split("-")[0].toLowerCase());
    if (hit) return hit[0];
  }
  return "en";
};
if (LANG === "ru" && !HOME && page === "index.html" && !chosen) {
  const to = LANGS.find(([code]) => code === pick());
  if (to && to[1]) location.replace(to[1] + page);
}

// ---- header and footer ----
const links = [
  ["podee.html", "PoDee"],
  ["podoo.html", "PoDoo"],
  ["support.html", W("js.support")],
];
const here = LANGS.find(([code]) => code === LANG);
document.body.insertAdjacentHTML(
  "afterbegin",
  `<header><div class="wrap">
    <a class="brand" href="index.html"><img src="${up}media/podee-icon.svg" alt="" /> Pody Lab</a>
    <nav>${links.map(([href, name]) => `<a href="${href}"${href === page ? ' aria-current="page"' : ""}>${name}</a>`).join("")}
      <details class="langs" id="langs"><summary aria-label="${W("js.language")}">${(here?.[0] || LANG).split("-")[0].toUpperCase()}</summary>
        <div class="langs-list">${LANGS.map(([code, folder, name]) => `<a href="${HOME}${folder}${page}${location.hash}" lang="${code}" hreflang="${code}" data-lang="${code}"${code === LANG ? ' aria-current="true"' : ""}>${name}</a>`).join("")}</div>
      </details></nav>
  </div></header>`,
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer><div class="wrap">
    <span>© 2026 Pody Lab</span>
    <a href="${CONFIG.releases}">${W("js.all_podee_versions")}</a>
    <a href="support.html#wish">${W("js.improve_together")}</a>
    <a href="privacy.html">${W("js.privacy")}</a>
    <span>${W("js.made_with_pody_the")}</span>
  </div></footer>`,
);
document.querySelectorAll("#langs a").forEach((a) =>
  a.addEventListener("click", () => {
    try { localStorage.setItem(LANG_KEY, a.dataset.lang); } catch {}
  }),
);
// the menu closes on a click anywhere else
document.addEventListener("click", (e) => { if (!e.target.closest("#langs")) $("langs")?.removeAttribute("open"); });
// ---- download: the setup itself, for this Windows (64- or 32-bit) ----
// Chrome and Edge always say «Win64» in the user agent, so the real bitness is asked separately
async function windowsBits() {
  try {
    const h = await navigator.userAgentData?.getHighEntropyValues(["bitness"]);
    if (h?.bitness) return h.bitness === "32" ? 32 : 64;
  } catch {}
  const ua = navigator.userAgent;
  return !/Windows/.test(ua) || /Win64|WOW64|x64|amd64|arm64/i.test(ua) ? 64 : 32;
}
const setup = (bits) => `${CONFIG.podee}PoDee_${bits === 32 ? "x86" : "x64"}-setup.exe`;
const podee = [...document.querySelectorAll("[data-podee]")];
podee.forEach((a) => (a.href = setup(64)));
windowsBits().then((bits) => {
  for (const a of podee) {
    a.href = setup(bits);
    const other = bits === 32 ? 64 : 32;
    a.closest(".btns")?.insertAdjacentHTML(
      "afterend",
      `<p class="dl-alt">${W("js.version_line", { v: `<span data-podee-version>${CONFIG.podeeVersion}</span>`, bits, other, link: setup(other) })}</p>`,
    );
  }
  // the number of the release the button actually downloads
  fetch("https://api.github.com/repos/podylab/PoDee-releases/releases/latest")
    .then((r) => (r.ok ? r.json() : null))
    .then((r) => r?.tag_name && document.querySelectorAll("[data-podee-version]").forEach((s) => (s.textContent = r.tag_name.replace(/^v/, ""))))
    .catch(() => {});
});

// ---- downloads: GitHub counts every installer taken from the releases (updates too) ----
// one request per repo, kept for an hour so the GitHub limit of 60 an hour is never reached
async function downloads(repo) {
  const key = "dl:" + repo;
  try {
    const c = JSON.parse(localStorage.getItem(key));
    if (c && Date.now() - c.t < 3600e3) return c.n;
  } catch {}
  const r = await fetch(`https://api.github.com/repos/podylab/${repo}/releases?per_page=100`);
  if (!r.ok) return null;
  const n = (await r.json()).flatMap((rel) => rel.assets).filter((a) => /\.(exe|apk)$/.test(a.name)).reduce((s, a) => s + a.download_count, 0);
  try {
    localStorage.setItem(key, JSON.stringify({ n, t: Date.now() }));
  } catch {}
  return n;
}
document.querySelectorAll("[data-downloads]").forEach(async (el) => {
  const n = await downloads(el.dataset.downloads).catch(() => null);
  if (!n) return;
  el.innerHTML = `<i class="live-dot" aria-hidden="true"></i><b>${n.toLocaleString(LANG)}</b> ${P(n, "js.downloads")}`;
  el.hidden = false;
});

// ---- card: the DonationAlerts page ----
const card = $("card");
if (card) {
  if (CONFIG.card) card.href = CONFIG.card;
  else {
    card.removeAttribute("href");
    card.textContent = W("js.soon");
    card.style.opacity = 0.5;
  }
}

// ---- crypto: one wallet at a time, its QR drawn here ----
if ($("coins")) {
  const wallets = CONFIG.wallets;
  let shown = 0;
  const show = (i) => {
    shown = i;
    const w = wallets[i];
    [...$("coins").children].forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
    $("addr").textContent = w.address || W("js.the_address_is_coming");
    // the new address and its QR fade in instead of popping
    for (const el of [$("addr"), $("qr"), $("net")]) el.animate?.([{ opacity: 0.2 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    $("net").textContent = W(w.net);
    $("copy").disabled = !w.address;
    if (w.address && window.qrcode) {
      const q = qrcode(0, "M");
      q.addData(w.address);
      q.make();
      $("qr").innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } else $("qr").innerHTML = '<span style="color:#456;font-weight:800">QR</span>';
  };
  wallets.forEach((w, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "coin";
    b.textContent = w.coin;
    b.onclick = () => show(i);
    $("coins").append(b);
  });
  show(0);
  $("copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(wallets[shown].address);
      $("copy").textContent = W("js.copied");
    } catch {
      $("copy").textContent = W("js.couldn_t_copy_select");
    }
    setTimeout(() => ($("copy").textContent = W("js.copy_address")), 1800);
  };
}

// ---- forms (wishes, «tell me when PoDoo is out»): to Formspree, or a letter ----
document.querySelectorAll("form[data-send]").forEach((form) => {
  const done = form.querySelector(".sent");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (CONFIG.form) {
      const r = await fetch(CONFIG.form, { method: "POST", body: data, headers: { Accept: "application/json" } }).catch(() => null);
      if (r && r.ok) {
        form.reset();
        done.textContent = form.dataset.send;
        done.style.display = "inline";
        return;
      }
    }
    if (CONFIG.mail) {
      const text = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${CONFIG.mail}?subject=${encodeURIComponent("Pody Lab: " + (data.get("about") || W("js.message")))}&body=${encodeURIComponent(text)}`;
    } else {
      done.textContent = W("js.the_form_will_work");
      done.style.display = "inline";
    }
  };
});
// support.html?app=PoDoo picks the app in the wish form
const app = new URLSearchParams(location.search).get("app");
if (app && $("about")) $("about").value = app;

// ---- PoDee drawn in code: the island shows the tab of the card under the mouse; nothing moves on its own ----
const desks = document.querySelectorAll(".desk");
if (desks.length) {
  const now = new Date();
  const lang = document.documentElement.lang;
  document.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = now.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })));
  document.querySelectorAll("[data-today]").forEach((el) => (el.textContent = now.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" })));
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  document.querySelectorAll("[data-week]").forEach((el) => {
    el.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const today = d.toDateString() === now.toDateString();
      return `<span${today ? ' class="today"' : ""}>${d.toLocaleDateString(lang, { weekday: "short" }).replace(".", "")}<b>${d.getDate()}</b></span>`;
    }).join("");
  });
  const drop = '<svg viewBox="0 0 20 26"><path d="M10 2s7 7.6 7 12.6a7 7 0 0 1-14 0C3 9.6 10 2 10 2z"/></svg>';
  document.querySelectorAll("[data-drops]").forEach((el) => (el.innerHTML = Array.from({ length: 8 }, (_, i) => `<span${i < 5 ? ' class="full"' : ""}>${drop}</span>`).join("")));
}
const isl = $("isl");
if (isl && $("feats")) {
  const cards = [...document.querySelectorAll("#feats [data-tab]")];
  const open = (tab) => {
    isl.dataset.tab = tab;
    cards.forEach((c) => c.classList.toggle("on", c.dataset.tab === tab));
  };
  cards.forEach((c) => {
    c.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && open(c.dataset.tab));
    c.addEventListener("click", () => open(c.dataset.tab));
    c.addEventListener("focus", () => open(c.dataset.tab));
  });
  $("feats").addEventListener("pointerleave", (e) => e.pointerType === "mouse" && open("home"));
}
// ---- island, dock, widgets: each switch shows or hides its part of the picture ----
const mods = $("mods");
if (mods) {
  const parts = ["island", "dock", "widgets"];
  const show = () => {
    const on = parts.map((p) => $("mod-" + p).getAttribute("aria-pressed") === "true");
    parts.forEach((p, i) => (mods.querySelector(`[data-part="${p}"]`).hidden = !on[i]));
    $("mods-note").textContent = $("mods-note").dataset["n" + on.map(Number).join("")];
  };
  parts.forEach((p) => {
    $("mod-" + p).onclick = (e) => {
      e.currentTarget.setAttribute("aria-pressed", String(e.currentTarget.getAttribute("aria-pressed") !== "true"));
      show();
    };
  });
  show();
}
// the tab icons on the island itself open their tab, like in the app
document.querySelectorAll(".isl-tabs span[data-t]").forEach((t) => {
  t.addEventListener("click", () => {
    const desk = t.closest(".desk");
    desk.dataset.tab = t.dataset.t;
    document.querySelectorAll("#feats [data-tab]").forEach((c) => c.classList.toggle("on", c.dataset.tab === t.dataset.t));
  });
});
