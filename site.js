// Pody Lab site: everything to fill in sits in CONFIG; the header, the footer,
// the crypto wallets and the wish form are built here for every page.
const CONFIG = {
  podee: "https://github.com/podylab/PoDee-releases/releases/latest/download/", // + PoDee_x64-setup.exe or PoDee_x86-setup.exe
  podeeVersion: "1.6.0", // shown until GitHub answers with the latest release; update it with every release
  releases: "https://github.com/podylab/PoDee-releases/releases",
  card: "https://www.donationalerts.com/r/polab", // the DonationAlerts page, e.g. https://www.donationalerts.com/r/name
  form: "https://formspree.io/f/xwllnbpp", // Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
  gplay: "", // PoDoo on Google Play, e.g. https://play.google.com/store/apps/details?id=…; empty: «coming soon»
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

// ---- PoDee's companions, drawn as in the app: <i class="char" data-c="cat" data-t="dark"> ----
// the body is the island's colour; data-t="light" is the glass variant (light body, dark eyes).
// data-c="auto" follows the site's theme: PoDy on the light one, the cat on the dark one, as in PoDee
const TONES = { dark: { body: "#050708", eye: "#f6f3ea", pupil: "#0b0d0e" }, inside: { body: "#23272b", eye: "#f6f3ea", pupil: "#0b0d0e" }, light: { body: "#f6f8f7", eye: "#172024", pupil: "#172024" } };
const shinyEye = (cx, cy, rx, ry, t) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${t.eye}"/><ellipse cx="${cx}" cy="${cy + 0.3}" rx="${rx * 0.6}" ry="${ry * 0.65}" fill="${t.pupil}"/><circle cx="${cx + rx * 0.3}" cy="${cy - ry * 0.05}" r="${rx * 0.25}" fill="#fff"/><circle cx="${cx - rx * 0.2}" cy="${cy + ry * 0.4}" r="${rx * 0.11}" fill="#fff"/>`;
const pixels = (rows, pal) =>
  rows.map((row, y) => [...row].map((ch, x) => (pal[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[ch]}"/>` : "")).join("")).join("");
const CHARS = {
  cloud: (t) => `<svg viewBox="0 0 38 27"><g fill="${t.body}"><circle cx="10.06" cy="15.3" r="7.76"/><circle cx="18.95" cy="10.24" r="10.24"/><circle cx="27.95" cy="15.86" r="7.43"/><rect x="2.53" y="14.18" width="33.19" height="12.83" rx="6.41"/></g>
    <path d="M4.23 13.18a6.2 6.2 0 0 1 3.21-3.5M11.5 5.94a8.6 8.6 0 0 1 4.51-3.78" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.3" stroke-linecap="round"/>
    <g transform="translate(3 4)">${shinyEye(11.2, 11.4, 2.9, 3.3, t)}${shinyEye(20.8, 11.4, 2.9, 3.3, t)}<ellipse cx="7" cy="15.6" rx="2.3" ry="1.3" fill="#ff9fb2" opacity=".55"/><ellipse cx="25" cy="15.6" rx="2.3" ry="1.3" fill="#ff9fb2" opacity=".55"/><path d="M14.4 15.8q.8 1 1.6 0q.8 1 1.6 0" fill="none" stroke="${t.eye}" stroke-width="1.1" stroke-linecap="round"/></g></svg>`,
  cat: (t) => `<svg viewBox="0 0 32 30"><path class="cat-tail" fill="none" stroke="${t.body}" stroke-width="2.3" stroke-linecap="round" d="M24.2 26.4C28.6 26.2 30.8 22.6 30.1 18.4C29.9 17.3 29.1 16.9 28.5 17.4"/><path fill="${t.body}" d="M10.2 1.6L13.4 6.4Q17 5.8 20.6 6.2L23.6 3.2Q24.4 7.6 24.6 10.4C26.6 13.6 27.6 18.6 26.8 22.4C26 27 21.4 29.2 16 29.2C9.6 29.2 4.4 26.6 4.4 21.4C4.4 16.8 6.4 13.4 8.4 11.4C8.2 8 8.8 4.4 10.2 1.6Z"/>
    ${[[12.6, 11.4], [20.2, 11.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${t.eye}"/><circle cx="${x}" cy="${y}" r="2.6" fill="${t.body}"/><circle cx="${x - 0.9}" cy="${y - 0.9}" r=".8" fill="${t.eye}"/>`).join("")}</svg>`,
  blob: (t) => `<svg viewBox="0 0 34 30"><path fill="${t.body}" d="M3 17C3 11 7 7.4 12.6 7.8C14.6 5.6 18.4 5.2 20.6 7.2C25.8 6.4 31 9.6 31.2 14.6C33.4 16.4 33.2 20.2 31 21.6C30.6 26.2 25.6 28.6 20.4 27.4C17.6 29.4 13 29.2 11 27.2C6.4 27.6 2.6 25 3.4 21.4C2 20.2 2.2 18 3 17Z"/>
    <ellipse cx="8.4" cy="21.4" rx="1.8" ry="1" fill="#ff9fb2" opacity=".55"/><ellipse cx="25.6" cy="21.4" rx="1.8" ry="1" fill="#ff9fb2" opacity=".55"/>${shinyEye(12.8, 16.8, 2.5, 2.9, t)}${shinyEye(21.2, 16.8, 2.5, 2.9, t)}<path d="M16 21.2q1 .9 2 0" fill="none" stroke="${t.eye}" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  // «Кружок»: a small dot by the island; it lights up with the music
  dot: () => `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.6" fill="#7ed6be"/></svg>`,
  // «Кружок» with its highlight: the dot sits in a round body of the island's colour
  dotb: (t) => `<svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="${t.body}"/><circle cx="7" cy="7" r="2.6" fill="#7ed6be"/></svg>`,
  // the «Пиксели» dot, «квадратик»: a square in a stone frame with a black edge
  square: () => `<svg viewBox="0 0 28 29" shape-rendering="crispEdges"><rect x="3" y="4" width="25" height="25" fill="#000" opacity=".25"/><rect width="25" height="25" fill="#000"/><rect x="2" y="2" width="21" height="21" fill="#7d7d7d"/><rect x="7" y="7" width="11" height="11" fill="#2a2a2a"/><rect x="9" y="9" width="7" height="7" fill="#7ed6be"/></svg>`,
  // the «Пиксели» theme: the Enderman's block head with violet eyes, and the Ghast with closed, crying eyes
  shade: () => `<svg viewBox="-.5 -.5 9 9" shape-rendering="crispEdges"><rect x="-.5" y="-.5" width="9" height="9" fill="#050505"/>${pixels(
      ["abcadbca", "cadbcabd", "bdacbdac", "acbdacbd", "aGEbdEGc", "dbcadbca", "cadbcabd", "bdacdbac"],
      { a: "#141317", b: "#19181d", c: "#1e1c23", d: "#111014", G: "#b77cff", E: "#ecdcff" },
    )}</svg>`,
  ghast: () => `<svg viewBox="-.5 -.5 17 23" shape-rendering="crispEdges"><rect x="-.5" y="-.5" width="17" height="17" fill="#9a9a9a"/>${pixels(
      ["abacabcaabcabaca", "cabacaabcabacabc", "bacabcacabcacaba", "acbacabcacbacbac", "cabcacabcabcacab", "abacabcaabcabaca",
       "aaKKKKacabKKKKbc", "caaLabcacabcLacb", "bacLcabcacabLcab", "acbLacbacabcLbac", "cabcacKKKKbcacab", "abacabKKKKcabaca",
       "cabacaabcabacabc", "bacabcacabcacaba", "acbacabcacbacbac", "cabcacabcabcacab"],
      { a: "#f2f2f2", b: "#ececec", c: "#e4e4e4", K: "#3b3b3b", L: "#a9a9a9" },
    )}${[2, 7, 12].map((x, i) => `<rect x="${x - 0.5}" y="15.5" width="3" height="${i === 1 ? 7 : 5.5}" fill="#9a9a9a"/><rect x="${x}" y="16" width="2" height="${i === 1 ? 6 : 4.5}" fill="#e9e9e9"/>`).join("")}</svg>`,
};
const drawChar = (c, tone = "dark") => (c === "auto" ? `<span class="c-light">${CHARS.cloud(TONES.light)}</span><span class="c-dark">${CHARS.cat(TONES.dark)}</span>` : CHARS[c]?.(TONES[tone] || TONES.dark) || "");
const fillChars = (root = document) => root.querySelectorAll("i.char[data-c]").forEach((el) => (el.innerHTML = drawChar(el.dataset.c, el.dataset.t)));

// ---- header and footer ----
// a country's flag beside each language, drawn here: Windows shows emoji flags as two letters
const star = (cx, cy, r, turn = 0) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2 + turn, k = i % 2 ? r * 0.4 : r;
    return `${(cx + k * Math.cos(a)).toFixed(2)},${(cy + k * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
const bands = (cs, v) => cs.map((c, i) => (v ? `<rect x="${(i * 30) / cs.length}" width="${30 / cs.length + 0.1}" height="20" fill="${c}"/>` : `<rect y="${(i * 20) / cs.length}" width="30" height="${20 / cs.length + 0.1}" fill="${c}"/>`)).join("");
const FLAGS = {
  ru: bands(["#fff", "#1c57a7", "#d52b1e"]),
  en: `<rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.6"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.4"/>`,
  es: `<rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/>`,
  "pt-BR": `<rect width="30" height="20" fill="#229e45"/><path d="M15 2.5L27 10 15 17.5 3 10z" fill="#f8e509"/><circle cx="15" cy="10" r="4.6" fill="#2b49a3"/>`,
  de: bands(["#000", "#dd0000", "#ffce00"]),
  fr: bands(["#0055a4", "#fff", "#ef4135"], 1),
  it: bands(["#009246", "#fff", "#ce2b37"], 1),
  tr: `<rect width="30" height="20" fill="#e30a17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.3" cy="10" r="4" fill="#e30a17"/><polygon points="${star(17.6, 10, 2.4, -Math.PI / 2)}" fill="#fff"/>`,
  pl: bands(["#fff", "#dc143c"]),
  uk: bands(["#0057b7", "#ffd700"]),
  id: bands(["#ce1126", "#fff"]),
  vi: `<rect width="30" height="20" fill="#da251d"/><polygon points="${star(15, 10.4, 6)}" fill="#ff0"/>`,
  ja: `<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>`,
  ko: `<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#0047a0"/><path d="M10 10a5 5 0 0 1 10 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 0-5 0z" fill="#cd2e3a"/><path d="M5 4.5l2.6-1.7M5.8 5.7l2.6-1.7M22.4 2.8l2.6 1.7M21.6 4l2.6 1.7M5 15.5l2.6 1.7M5.8 14.3l2.6 1.7M22.4 17.2l2.6-1.7M21.6 16l2.6-1.7" stroke="#000" stroke-width=".9"/>`,
  "zh-CN": `<rect width="30" height="20" fill="#de2910"/><polygon points="${star(6, 6, 3.4)}" fill="#ffde00"/>${[[11, 2.2], [13, 4.4], [13, 7.4], [11, 9.6]].map(([x, y]) => `<polygon points="${star(x, y, 1.1)}" fill="#ffde00"/>`).join("")}`,
  hi: `${bands(["#ff9933", "#fff", "#138808"])}<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".8"/>`,
};
const flag = (code) => `<svg class="flag" viewBox="0 0 30 20" aria-hidden="true">${FLAGS[code] || ""}</svg>`;
// the header belongs to the page's app: its guides, its fixes, its download. Pages of no app (home, support,
// report) have only the common links and no download; the apps themselves are listed on the home page
const APPS = [
  { pages: ["podee.html", "guides.html", "fixes.html", "privacy.html"], links: [["guides.html", W("js.guides")], ["fixes.html", W("js.fixes")]], dl: `data-podee href="${CONFIG.podee}PoDee_x64-setup.exe"` },
  { pages: ["podoo.html", "podoo-guides.html", "podoo-fixes.html"], links: [["podoo-guides.html", W("js.guides")], ["podoo-fixes.html", W("js.fixes")]], dl: 'href="https://github.com/podylab/PoDoo-releases/releases/latest/download/PoDoo_x64-setup.exe"' },
];
const pageApp = APPS.find((a) => a.pages.includes(page));
const links = [...(pageApp?.links || []), ["support.html", W("js.support")], ...(pageApp ? [] : [["report.html", W("js.report")]])];
// the phone's menu also has the pages the footer keeps on a wide screen
const all = [...links, ...[["report.html", W("js.report")], ["privacy.html", W("js.privacy")]].filter(([h]) => !links.some(([l]) => l === h))];
const navLink = ([href, name]) => `<a href="${href}"${href === page ? ' aria-current="page"' : ""}>${name}</a>`;
const here = LANGS.find(([code]) => code === LANG);
const THEME_KEY = "podylab.theme";
const themeIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><g class="sun"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g><path class="moon" d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>`;
document.body.insertAdjacentHTML(
  "afterbegin",
  `<header><div class="wrap">
    <a class="brand" href="index.html"><img src="${up}media/podee-icon.svg" alt="" /> <span>Pody Lab</span></a>
    <div class="hdr-mid">
      <nav class="hdr-isl" aria-label="Pody Lab">${links.map(navLink).join("")}</nav>
      <i class="char hdr-char" data-c="auto" aria-hidden="true"></i>
    </div>
    ${pageApp ? `<a class="btn main hdr-dl" ${pageApp.dl}><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14"/></svg><span>${W("js.download")}</span></a>` : ""}
    <button class="theme-btn" type="button" data-theme-toggle aria-label="${W("js.theme")}" title="${W("js.theme")}">${themeIcon}</button>
    <details class="langs" id="langs"><summary aria-label="${W("js.language")}">${flag(here?.[0] || LANG)}<span>${(here?.[0] || LANG).split("-")[0].toUpperCase()}</span></summary>
      <div class="langs-list">${LANGS.map(([code, folder, name]) => `<a href="${HOME}${folder}${page}${location.hash}" lang="${code}" hreflang="${code}" data-lang="${code}"${code === LANG ? ' aria-current="true"' : ""}>${flag(code)}${name}</a>`).join("")}</div>
    </details>
    <details class="menu" id="menu"><summary aria-label="${W("js.menu")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary>
      <div class="menu-list">${all.map(navLink).join("")}<button type="button" data-theme-toggle>${themeIcon}${W("js.theme")}</button></div>
    </details>
  </div></header>`,
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer><div class="wrap">
    <span>© 2026 Pody Lab</span>
    ${(pageApp?.links || []).map(([href, name]) => `<a href="${href}">${name}</a>`).join("")}
    <a href="report.html">${W("js.report")}</a>
    <a href="support.html#wish">${W("js.improve_together")}</a>
    <a href="privacy.html">${W("js.privacy")}</a>
    <span>${W("js.made_with_pody_the")}</span>
  </div></footer>`,
);
fillChars();
// the theme: a choice in the header is remembered; without one the site follows Windows
const setTheme = (t) => (document.documentElement.dataset.theme = t);
document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
  b.addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  }),
);
matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch {}
  if (!saved) setTheme(e.matches ? "light" : "dark");
});
document.querySelectorAll("#langs a").forEach((a) =>
  a.addEventListener("click", () => {
    try { localStorage.setItem(LANG_KEY, a.dataset.lang); } catch {}
  }),
);
// the menus close on a click anywhere else, and one closes the other
document.addEventListener("click", (e) => {
  for (const id of ["langs", "menu"]) if (!e.target.closest("#" + id)) $(id)?.removeAttribute("open");
});
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

// ---- the hero's monitor: the notch opens into the island, shows a tab, closes, and opens the next ----
// only a class changes; the styles move it with transform and opacity
const demo = $("demo");
if (demo) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) demo.classList.add("open");
  else {
    const tabs = ["home", "music", "cal", "chat", "code"];
    let n = 0;
    const cycle = () => {
      demo.classList.add("open");
      setTimeout(() => {
        demo.classList.remove("open");
        setTimeout(() => {
          demo.dataset.tab = tabs[++n % tabs.length];
          cycle();
        }, 1800);
      }, 4200);
    };
    setTimeout(cycle, 900);
  }
}

// ---- guides: one topic at a time, picked by its tab or the address (#calendar) ----
const guides = [...document.querySelectorAll(".guide")];
if (guides.length) {
  const show = (id) => {
    const want = guides.some((g) => g.id === id) ? id : guides[0].id;
    guides.forEach((g) => (g.hidden = g.id !== want));
    document.querySelectorAll(".gtabs a").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.g === want)));
  };
  document.querySelectorAll(".gtabs a").forEach((t) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      history.replaceState(null, "", "#" + t.dataset.g);
      show(t.dataset.g);
    }),
  );
  addEventListener("hashchange", () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
}

// ---- report: how many characters are left ----
document.querySelectorAll("textarea[data-count]").forEach((t) => {
  const left = t.form.querySelector("[data-left]");
  const count = () => (left.textContent = (t.maxLength - t.value.length).toLocaleString(LANG));
  t.addEventListener("input", count);
  t.form.addEventListener("reset", () => setTimeout(count));
  count();
});

// ---- the dates of releases, in the page's language ----
document.querySelectorAll("time[data-date]").forEach((el) => {
  el.textContent = new Date(el.dateTime + "T12:00:00").toLocaleDateString(LANG, { day: "numeric", month: "long", year: "numeric" });
});

// ---- Google Play: links appear once CONFIG.gplay is filled; until then the card says «coming soon» ----
document.querySelectorAll("[data-gplay]").forEach((el) => {
  if (CONFIG.gplay) {
    el.href = CONFIG.gplay;
    el.hidden = false;
  } else if (el.dataset.soon) {
    el.textContent = el.dataset.soon;
    el.removeAttribute("href");
    el.classList.add("soon");
  }
});
