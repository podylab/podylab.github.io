// Pody Lab site: everything to fill in sits in CONFIG; the header, the footer,
// the crypto wallets and the wish form are built here for every page.
const CONFIG = {
  podee: "https://github.com/podylab/PoDee-releases/releases/latest/download/", // + PoDee_x64-setup.exe or PoDee_x86-setup.exe
  podeeVersion: "1.3.4", // shown until GitHub answers with the latest release; update it with every release
  releases: "https://github.com/podylab/PoDee-releases/releases",
  card: "https://www.donationalerts.com/r/polab", // the DonationAlerts page, e.g. https://www.donationalerts.com/r/name
  form: "https://formspree.io/f/xwllnbpp", // Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
  mail: "podylab@gmail.com", // without Formspree, the form opens a letter to this address
  wallets: [
    { coin: "USDT", net: ["Сеть TRC-20 (Tron). Другие сети не подойдут.", "TRC-20 (Tron) network only."], address: "TWoqgVrM1kEFTNZnZzkmJYT2uTYx5Yh58E" },
    { coin: "TON", net: ["Сеть TON: Toncoin и USDT в сети TON. В комментарии к переводу можно написать пожелание.", "TON network: Toncoin, or USDT on TON. The transfer comment can carry a wish."], address: "UQBBy_XIcwbK0A04cF81YYehXb24dbEczQlWIqpyE05nnsIi" },
    { coin: "BTC", net: ["Сеть Bitcoin.", "Bitcoin network."], address: "bc1qdus0f49gu3qupe9et8all9mt90fyaph74qv884" },
    { coin: "ETH", net: ["Сеть Ethereum (ERC-20): ETH и USDT в этой сети.", "Ethereum network (ERC-20): ETH, or USDT on it."], address: "0x5685fd91Db09F496a4d09EF4343aFb8Fcb1fbA47" },
    { coin: "BNB", net: ["Сеть BNB Smart Chain (BEP-20): BNB и USDT в этой сети.", "BNB Smart Chain (BEP-20): BNB, or USDT on it."], address: "0x5685fd91Db09F496a4d09EF4343aFb8Fcb1fbA47" },
    { coin: "DOGE", net: ["Сеть Dogecoin.", "Dogecoin network."], address: "D6C7TCRabX6jr8x6c9qoZUGB7evSUsf727" },
  ],
};

// the English pages live in en/; T picks a page's words: T("русский", "English")
const EN = document.documentElement.lang === "en";
const T = (ru, en) => (EN ? en : ru);
const up = EN ? "../" : "";

const $ = (id) => document.getElementById(id);
const page = location.pathname.split("/").pop() || "index.html";

// the home page sends visitors whose browser isn't Russian-speaking to English, once;
// the RU / EN switch remembers their own choice
const LANG_KEY = "podylab.lang";
const chosen = (() => { try { return localStorage.getItem(LANG_KEY); } catch { return null; } })();
if (!EN && page === "index.html" && !chosen && !/^(ru|uk|be|kk)/i.test(navigator.language || "")) location.replace("en/");

// ---- header and footer ----
const links = [
  ["podee.html", "PoDee"],
  ["podoo.html", "PoDoo"],
  ["support.html", T("Поддержать", "Support")],
];
document.body.insertAdjacentHTML(
  "afterbegin",
  `<header><div class="wrap">
    <a class="brand" href="index.html"><img src="${up}media/podee-icon.svg" alt="" /> Pody Lab</a>
    <nav>${links.map(([href, name]) => `<a href="${href}"${href === page ? ' aria-current="page"' : ""}>${name}</a>`).join("")}<a class="lang" id="lang" href="${EN ? "../" : "en/"}${page}${location.hash}" lang="${EN ? "ru" : "en"}">${EN ? "RU" : "EN"}</a></nav>
  </div></header>`,
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer><div class="wrap">
    <span>© 2026 Pody Lab</span>
    <a href="${CONFIG.releases}">${T("Все версии PoDee", "All PoDee versions")}</a>
    <a href="support.html#wish">${T("Улучшить вместе", "Improve together")}</a>
    <a href="privacy.html">${T("Конфиденциальность", "Privacy")}</a>
    <span>${T("Сделано с облачком PoDy", "Made with PoDy the cloud")}</span>
  </div></footer>`,
);
$("lang").addEventListener("click", () => {
  try { localStorage.setItem(LANG_KEY, EN ? "ru" : "en"); } catch {}
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
      `<p class="dl-alt">${T(`Версия <span data-podee-version>${CONFIG.podeeVersion}</span> для ${bits}-битной Windows · <a href="${setup(other)}">нужна ${other}-битная</a>`, `Version <span data-podee-version>${CONFIG.podeeVersion}</span> for ${bits}-bit Windows · <a href="${setup(other)}">need ${other}-bit?</a>`)}</p>`,
    );
  }
  // the number of the release the button actually downloads
  fetch("https://api.github.com/repos/podylab/PoDee-releases/releases/latest")
    .then((r) => (r.ok ? r.json() : null))
    .then((r) => r?.tag_name && document.querySelectorAll("[data-podee-version]").forEach((s) => (s.textContent = r.tag_name.replace(/^v/, ""))))
    .catch(() => {});
});

// ---- card: the DonationAlerts page ----
const card = $("card");
if (card) {
  if (CONFIG.card) card.href = CONFIG.card;
  else {
    card.removeAttribute("href");
    card.textContent = T("Скоро", "Soon");
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
    $("addr").textContent = w.address || T("Адрес появится скоро", "The address is coming soon");
    $("net").textContent = w.net[EN ? 1 : 0];
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
      $("copy").textContent = T("Скопировано", "Copied");
    } catch {
      $("copy").textContent = T("Не вышло, выделите адрес", "Couldn't copy, select the address");
    }
    setTimeout(() => ($("copy").textContent = T("Скопировать адрес", "Copy address")), 1800);
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
      location.href = `mailto:${CONFIG.mail}?subject=${encodeURIComponent("Pody Lab: " + (data.get("about") || T("сообщение", "message")))}&body=${encodeURIComponent(text)}`;
    } else {
      done.textContent = T("Форма заработает совсем скоро", "The form will work very soon");
      done.style.display = "inline";
    }
  };
});
// support.html?app=PoDoo picks the app in the wish form
const app = new URLSearchParams(location.search).get("app");
if (app && $("about")) $("about").value = app;
