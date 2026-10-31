# The English site in en/: the same pages as mkpages.py, with paths one folder up.
import hashlib
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs("en", exist_ok=True)


def ver(name):
    """A mark of the file's content for its address: after a publish the browser takes the new file, not its cached one."""
    with open(name, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def head(title, desc, icon="podee-icon.svg"):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="icon" href="../media/{icon}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../style.css?v={ver("style.css")}" />
</head>
'''


tail = f'<script src="../site.js?v={ver("site.js")}"></script>\n<script src="../pody.js?v={ver("pody.js")}"></script>\n</body>\n</html>\n'

home = head("Pody Lab", "Pody Lab makes small Windows apps: PoDee, an island at the top of the screen, and PoDoo, which turns an old phone into a remote for your PC.") + '''<body>
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="../media/podee-icon.svg" alt="PoDy the cloud" />
    <h1>Your PC, <em>only cosier</em></h1>
    <p class="lead">Pody Lab makes Windows apps that take care of the little things: show the music and the next meeting, open what you need with one tap, remind you to drink water. They're all free.</p>
  </div>

  <section style="padding-top:24px">
    <div class="apps">
      <div class="card app">
        <img src="../media/podee-icon.svg" alt="" />
        <div class="btns"><a class="btn main" data-podee href="https://github.com/podylab/PoDee-releases/releases/latest/download/PoDee_x64-setup.exe"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.6l7.4-1v7.6H3zM11.4 3.4L21 2v9.2h-9.6zM3 12.8h7.4v7.6L3 19.4zM11.4 12.8H21V22l-9.6-1.4z"/></svg>Download for Windows</a><a class="btn ghost" href="https://apps.microsoft.com/detail/9P3ZM16J8S2B?hl=en-us" target="_blank" rel="noopener"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6V5a4 4 0 0 1 8 0v1h4.2a.8.8 0 0 1 .8.8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.8a.8.8 0 0 1 .8-.8zm1.6 0h4.8V5a2.4 2.4 0 0 0-4.8 0zM7.5 10v3.4h4.1V10zm4.9 0v3.4h4.1V10zm-4.9 4.2v3.4h4.1v-3.4zm4.9 0v3.4h4.1v-3.4z" fill-rule="evenodd"/></svg>Microsoft Store</a></div>
        <h3><a class="stretch" href="podee.html">PoDee</a></h3>
        <p>An island at the top of the screen: clock, music, voice and AI chat, calendar, Claude Code. PoDy the cloud lives next to it.</p>
        <span class="more">Learn more →</span>
      </div>
      <a class="card app" href="podoo.html">
        <img src="../media/podoo-icon.svg" alt="" />
        <span class="tag soon">Coming soon</span>
        <h3>PoDoo</h3>
        <p>An old phone or tablet by your monitor becomes a remote for your PC: apps, buttons for OBS and Photoshop, music, a touchpad.</p>
        <span class="more" style="color:#f2a074">Learn more →</span>
      </a>
    </div>
  </section>

  <section>
    <div class="grid g2">
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.4A4 4 0 0 1 12 7.6a4 4 0 0 1 7 2.5c0 5.1-7 9.4-7 9.4z"/></svg></div><h3>Support</h3><p>The apps are free. If they help you, send any amount by card, Kaspi QR or crypto.</p><p style="margin-top:14px"><a class="btn main" href="support.html">Support</a></p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5h3.8L18.6 9.2a2.2 2.2 0 0 0-3.1-3.1L5.2 16.4z"/><path d="M13.6 8l2.9 2.9"/><path d="M13 19.5h6.5"/></svg></div><h3>Improve them together</h3><p>Tell us what the apps are missing or which one to make next. No payment needed.</p><p style="margin-top:14px"><a class="btn ghost" href="support.html#wish">Send a wish</a></p></div>
    </div>
  </section>
</main>
''' + tail

podee = head("PoDee · Pody Lab", "PoDee: an island at the top of the Windows screen with a clock, music, voice, AI chat, calendar and PoDy the cloud.") + '''<body>
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="../media/podee-icon.svg" alt="PoDy the cloud" />
    <h1>An island at the top <em>of your Windows screen</em></h1>
    <p class="lead">PoDee sits at the top edge of the screen. It shows the time and your music, listens to your voice, answers in a chat and tells you what Claude Code is up to. PoDy the cloud sits next to it and follows your mouse with its eyes.</p>
    <div class="btns">
      <a class="btn main" data-podee href="https://github.com/podylab/PoDee-releases/releases/latest/download/PoDee_x64-setup.exe"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.6l7.4-1v7.6H3zM11.4 3.4L21 2v9.2h-9.6zM3 12.8h7.4v7.6L3 19.4zM11.4 12.8H21V22l-9.6-1.4z"/></svg>Download for Windows</a><a class="btn ghost" href="https://apps.microsoft.com/detail/9P3ZM16J8S2B?hl=en-us" target="_blank" rel="noopener"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6V5a4 4 0 0 1 8 0v1h4.2a.8.8 0 0 1 .8.8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.8a.8.8 0 0 1 .8-.8zm1.6 0h4.8V5a2.4 2.4 0 0 0-4.8 0zM7.5 10v3.4h4.1V10zm4.9 0v3.4h4.1V10zm-4.9 4.2v3.4h4.1v-3.4zm4.9 0v3.4h4.1v-3.4z" fill-rule="evenodd"/></svg>Microsoft Store</a>
      <a class="btn ghost" href="support.html">Support</a>
    </div>
    <div class="shot"><img src="../media/real-island.gif" alt="PoDee on screen: the island with its tabs and PoDy the cloud" /></div>
  </div>

  <section>
    <h2>What PoDee does</h2>
    <p class="sub">Free for everyone. Windows 10 and 11. The app speaks Russian and English.</p>
    <div class="grid g3">
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 17.5V6.2l9-2v11.3"/><circle cx="7" cy="17.5" r="2.5"/><circle cx="16" cy="15.5" r="2.5"/><path d="M9.5 9.6l9-2"/></svg></div><h3>Music</h3><p>Cover, controls and lyrics in time, from any player.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.8 11.2a6.2 6.2 0 0 0 12.4 0"/><path d="M12 17.4v3.1"/></svg></div><h3>Voice and chat</h3><p>Say «open Telegram» and it opens. Ask anything else of an AI: Claude, ChatGPT, Gemini.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3.5"/><path d="M3.5 10h17"/><path d="M8 3.2v3.5M16 3.2v3.5"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg></div><h3>Calendar</h3><p>Google, Outlook or any iCal link. The next meeting shows under the clock.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3.5"/><path d="M7.5 10l3 2.5-3 2.5"/><path d="M13 15.2h3.5"/></svg></div><h3>Claude Code</h3><p>What the agent is doing in the terminal, its «allow?» questions and how much of the limit is left.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6s6 6.3 6 10.4a6 6 0 0 1-12 0c0-4.1 6-10.4 6-10.4z"/><path d="M9.2 14.4a2.9 2.9 0 0 0 2.6 2.6"/></svg></div><h3>Health</h3><p>Water for the day, 20-20-20 eye breaks and a minute of breathing.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><path d="M17 13.8v6.4M13.8 17h6.4"/></svg></div><h3>Widgets and dock</h3><p>A dock with live window previews, and widgets on the desktop.</p></div>
    </div>
  </section>

  <section>
    <div class="shot"><img src="../media/tabs.png" alt="PoDee's tabs: Home, Calendar, Health, Screen time, Controls, Music" /></div>
  </section>
</main>
''' + tail

podoo = head("PoDoo · Pody Lab", "PoDoo: an old phone or tablet becomes a remote for your PC, like a Stream Deck. Coming soon.", "podoo-icon.svg") + '''<body class="orange">
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="../media/podoo-icon.svg" alt="" style="filter:drop-shadow(0 18px 30px rgb(207 70 25 / .35))" />
    <span class="tag soon" style="justify-self:center;margin-top:18px">In the works</span>
    <h1>A remote for your PC <em>from an old phone</em></h1>
    <p class="lead">Stand a phone or tablet by your monitor and it shows the icons of your apps. One tap and Photoshop, Telegram or your project folder is open. No need to buy a Stream Deck.</p>
    <div class="btns"><a class="btn main" href="#notify">Tell me when it's out</a></div>
  </div>

  <section>
    <h2>What PoDoo will do</h2>
    <p class="sub">An Android phone and a Windows PC, connected over Wi-Fi, cable or Bluetooth.</p>
    <div class="grid g3">
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 3L5.5 13.4h6l-1 7.6 8-10.6h-6z"/></svg></div><h3>Quick launch</h3><p>Icons of your favourite apps, sites and folders are already there. Nothing to set up.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v16M12 4v16M19 4v16"/><circle cx="5" cy="9" r="2" class="f"/><circle cx="12" cy="15" r="2" class="f"/><circle cx="19" cy="8" r="2" class="f"/></svg></div><h3>Buttons for each app</h3><p>Photoshop is open, the phone shows its tools. OBS is open, it shows scenes, the mic and going live.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 17.5V6.2l9-2v11.3"/><circle cx="7" cy="17.5" r="2.5"/><circle cx="16" cy="15.5" r="2.5"/><path d="M9.5 9.6l9-2"/></svg></div><h3>Music and touchpad</h3><p>Pause, volume, next track. Scroll through a film on the TV from the sofa.</p></div>
    </div>
  </section>

  <section id="notify">
    <h2>Tell me when it's out</h2>
    <p class="sub">Leave your email and we'll write once, when PoDoo can be downloaded.</p>
    <div class="card">
      <form data-send="Got it. We'll write when PoDoo is out.">
        <input type="hidden" name="about" value="PoDoo: tell me when it's out (en)" />
        <div class="row2">
          <label>Email <input name="email" type="email" required autocomplete="email" placeholder="you@mail.com" /></label>
          <label>What you'd do with PoDoo <input name="message" placeholder="Optional" /></label>
        </div>
        <div class="btns" style="align-items:center"><button class="btn main" type="submit">Tell me</button><span class="sent"></span></div>
      </form>
    </div>
  </section>
</main>
''' + tail

support = head("Support · Pody Lab", "Support Pody Lab with any amount by card, Kaspi QR or crypto and send a wish for PoDee or PoDoo.") + '''<body>
<main class="wrap">
  <div class="hero" style="padding-bottom:0">
    <img class="cloud" src="../media/podee-icon.svg" alt="PoDy the cloud" />
    <h1>Support <em>Pody Lab</em></h1>
    <p class="lead">Pody Lab's apps are free. If they help you, send any amount you like. The money goes into new features and the next apps.</p>
  </div>

  <section id="donate">
    <div class="card pay pay-bar">
      <div class="pay-head"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M3 10h18"/><path d="M7 14.6h3.5"/></svg></div><div><h3>By card</h3><p>Any bank card, any amount</p></div></div>
      <p class="pay-text">A payment page opens (it's in Russian). Type the sum and, if you like, a wish in the payment message.</p>
      <a class="btn main" id="card" href="#" target="_blank" rel="noopener">Pay by card</a>
    </div>
    <div class="grid g2 pay-pair">
      <div class="card pay" id="kaspi">
        <div class="pay-head"><div class="ic kaspi"><img src="../media/kaspi-logo.png" width="34" height="35" alt=""></div><div><h3>Kaspi QR</h3><p>For Kazakhstan</p></div></div>
        <div class="wallet">
          <div class="qr"><img src="../kaspi-qr.png" width="132" height="132" alt="Kaspi QR for payment" loading="lazy"></div>
          <ol class="pay-steps"><li>Open the Kaspi.kz app.</li><li>Tap «Kaspi QR» and point the camera at the code.</li><li>Type any amount and confirm.</li></ol>
        </div>
      </div>
      <div class="card pay">
        <div class="pay-head"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.4a2.9 2.9 0 0 0-2.6-1.4c-1.6 0-2.7.8-2.7 1.9s.9 1.6 2.7 1.9 2.7.9 2.7 2-1.1 2-2.7 2a3 3 0 0 1-2.7-1.5"/><path d="M12 6.3v1.7M12 16v1.7"/></svg></div><div><h3>In crypto</h3><p>USDT, TON, BTC, ETH, BNB, DOGE</p></div></div>
        <div class="coins" id="coins"></div>
        <div class="wallet">
          <div class="qr" id="qr"></div>
          <div>
            <div class="addr" id="addr"></div>
            <div class="net" id="net"></div>
            <button class="btn ghost copy" id="copy" type="button">Copy address</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="wish">
    <h2>Make the apps better together</h2>
    <p class="sub">No payment needed for this. Tell us what PoDee or PoDoo is missing, or which app to make next. We read every wish.</p>
    <div class="card">
      <form data-send="Thanks, got it. We'll read it.">
        <input type="hidden" name="about" value="Wish" />
        <div class="row2">
          <label>App <select name="app"><option>PoDee</option><option>PoDoo</option><option>A new app</option></select></label>
          <label>Email, if you'd like a reply <input name="email" type="email" autocomplete="email" placeholder="you@mail.com" /></label>
        </div>
        <label>What to improve <textarea name="message" required placeholder="For example: show the weather on the island"></textarea></label>
        <div class="btns" style="align-items:center"><button class="btn main" type="submit">Send the wish</button><span class="sent"></span></div>
      </form>
      <p class="wish-also">You can also send a wish with a donation: in the payment message by card, or in the transfer comment in TON.</p>
    </div>
  </section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
''' + tail

privacy = head("PoDee privacy policy · Pody Lab", "What PoDee keeps and where it sends it.") + '''<body>
<main class="wrap legal">
  <section>
    <h1 class="legal-title">PoDee privacy policy</h1>
    <p class="sub">Effective October 30, 2026. Pody Lab, podylab@gmail.com</p>

    <h2>In short</h2>
    <p>PoDee runs on your computer. Pody Lab has no server of its own: we collect no analytics, don't track how you use the app and receive nothing about you. Data goes online only to the services you connect in the settings yourself.</p>

    <h2>What stays on your computer</h2>
    <ul>
      <li>Settings, tasks, notes, clipboard history, screen time and notification history: in PoDee's folder in your Windows profile.</li>
      <li>AI API keys, exchange keys and private calendar links: in Windows Credential Manager.</li>
      <li>All of it stays with you. The Microsoft Store version removes its data when uninstalled.</li>
    </ul>

    <h2>Microphone</h2>
    <p>PoDee listens only while you hold or press the voice button, and during a call recording you start yourself. Speech is recognised on your computer (Whisper) or by a cloud service if you choose one. Audio is not kept, only the text.</p>

    <h2>Where PoDee connects</h2>
    <ul>
      <li>AI chat and speech recognition: your questions go to the service you pick (Anthropic, OpenAI, Google Gemini, Groq, OpenRouter or your own address), under that service's terms.</li>
      <li>Calendar: the Google, Outlook or iCal links you add.</li>
      <li>Lyrics: the track's title and artist go to LRCLIB (lrclib.net).</li>
      <li>Weather: the city goes to wttr.in. With no city set, wttr.in finds it from your IP address.</li>
      <li>Portfolio: Binance, Bybit and OKX with read-only keys, and public blockchain nodes for the wallet addresses you add.</li>
      <li>Claude limits: a request to api.anthropic.com as your Claude Code account.</li>
      <li>Speech models download from huggingface.co when you press «Download».</li>
    </ul>
    <p>As with any request online, these services see your IP address. Claude Code agents send their events to PoDee only inside your computer (127.0.0.1); nothing goes online.</p>

    <h2>Children</h2>
    <p>PoDee is not meant for children under 13 and collects no data about them.</p>

    <h2>Changes and contact</h2>
    <p>If this policy changes, the new version will be on this page. Questions: <a href="mailto:podylab@gmail.com">podylab@gmail.com</a>.</p>
  </section>
</main>
''' + tail

for n, c in [("index.html", home), ("podee.html", podee), ("podoo.html", podoo), ("support.html", support), ("privacy.html", privacy)]:
    open(os.path.join("en", n), "w", encoding="utf-8").write(c)
print("ok")
