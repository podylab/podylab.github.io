// Pody Lab site: everything to fill in sits in CONFIG; the header, the footer,
// the crypto wallets and the wish form are built here for every page.
const CONFIG = {
  podee: "https://github.com/Zametki1Cnika/PoDe-releases/releases/latest",
  releases: "https://github.com/Zametki1Cnika/PoDe-releases/releases",
  card: "https://www.donationalerts.com/r/polab", // the DonationAlerts page, e.g. https://www.donationalerts.com/r/name
  form: "https://formspree.io/f/xwllnbpp", // Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
  mail: "podylab@gmail.com", // without Formspree, the form opens a letter to this address
  wallets: [
    { coin: "USDT", net: "Сеть TRC-20 (Tron). Другие сети не подойдут.", address: "" },
    { coin: "TON", net: "Сеть TON. В комментарии к переводу можно написать пожелание.", address: "" },
  ],
};

const $ = (id) => document.getElementById(id);
const page = location.pathname.split("/").pop() || "index.html";

// ---- header and footer ----
const links = [
  ["podee.html", "PoDee"],
  ["podoo.html", "PoDoo"],
  ["support.html", "Поддержать"],
];
document.body.insertAdjacentHTML(
  "afterbegin",
  `<header><div class="wrap">
    <a class="brand" href="index.html"><img src="media/podee-icon.svg" alt="" /> Pody Lab</a>
    <nav>${links.map(([href, name]) => `<a href="${href}"${href === page ? ' aria-current="page"' : ""}>${name}</a>`).join("")}</nav>
  </div></header>`,
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer><div class="wrap">
    <span>© 2026 Pody Lab</span>
    <a href="${CONFIG.releases}">Все версии PoDee</a>
    <a href="support.html#wish">Улучшить вместе</a>
    <span>Сделано с облачком PoDy</span>
  </div></footer>`,
);
document.querySelectorAll("[data-podee]").forEach((a) => (a.href = CONFIG.podee));

// ---- card: the DonationAlerts page ----
const card = $("card");
if (card) {
  if (CONFIG.card) card.href = CONFIG.card;
  else {
    card.removeAttribute("href");
    card.textContent = "Скоро";
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
    $("addr").textContent = w.address || "Адрес появится скоро";
    $("net").textContent = w.net;
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
      $("copy").textContent = "Скопировано";
    } catch {
      $("copy").textContent = "Не вышло, выделите адрес";
    }
    setTimeout(() => ($("copy").textContent = "Скопировать адрес"), 1800);
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
      location.href = `mailto:${CONFIG.mail}?subject=${encodeURIComponent("Pody Lab: " + (data.get("about") || "сообщение"))}&body=${encodeURIComponent(text)}`;
    } else {
      done.textContent = "Форма заработает совсем скоро";
      done.style.display = "inline";
    }
  };
});
// support.html?app=PoDoo picks the app in the wish form
const app = new URLSearchParams(location.search).get("app");
if (app && $("about")) $("about").value = app;
