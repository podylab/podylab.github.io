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
      <div class="card"><div class="ic">💚</div><h3>Support</h3><p>The apps are free. If they help you, send any amount by card or crypto.</p><p style="margin-top:14px"><a class="btn main" href="support.html">Support</a></p></div>
      <div class="card"><div class="ic">✍️</div><h3>Improve them together</h3><p>Support with a donation and say in the message what to improve or which app to make next.</p><p style="margin-top:14px"><a class="btn ghost" href="support.html#wish">How it works</a></p></div>
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
      <div class="card"><div class="ic">🎵</div><h3>Music</h3><p>Cover, controls and lyrics in time, from any player.</p></div>
      <div class="card"><div class="ic">🎙️</div><h3>Voice and chat</h3><p>Say «open Telegram» and it opens. Ask anything else of an AI: Claude, ChatGPT, Gemini.</p></div>
      <div class="card"><div class="ic">🗓️</div><h3>Calendar</h3><p>Google, Outlook or any iCal link. The next meeting shows under the clock.</p></div>
      <div class="card"><div class="ic">🤖</div><h3>Claude Code</h3><p>What the agent is doing in the terminal, its «allow?» questions and how much of the limit is left.</p></div>
      <div class="card"><div class="ic">💧</div><h3>Health</h3><p>Water for the day, 20-20-20 eye breaks and a minute of breathing.</p></div>
      <div class="card"><div class="ic">🧩</div><h3>Widgets and dock</h3><p>A dock with live window previews, and widgets on the desktop.</p></div>
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
      <div class="card"><div class="ic">🚀</div><h3>Quick launch</h3><p>Icons of your favourite apps, sites and folders are already there. Nothing to set up.</p></div>
      <div class="card"><div class="ic">🎛️</div><h3>Buttons for each app</h3><p>Photoshop is open, the phone shows its tools. OBS is open, it shows scenes, the mic and going live.</p></div>
      <div class="card"><div class="ic">🎵</div><h3>Music and touchpad</h3><p>Pause, volume, next track. Scroll through a film on the TV from the sofa.</p></div>
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

support = head("Support · Pody Lab", "Support Pody Lab with any amount by card or crypto and send a wish for PoDee or PoDoo.") + '''<body>
<main class="wrap">
  <div class="hero" style="padding-bottom:0">
    <img class="cloud" src="../media/podee-icon.svg" alt="PoDy the cloud" />
    <h1>Support <em>Pody Lab</em></h1>
    <p class="lead">Pody Lab's apps are free. If they help you, send any amount you like. The money goes into new features and the next apps.</p>
  </div>

  <section id="donate">
    <div class="grid g2">
      <div class="card pay">
        <div class="ic">💳</div>
        <h3>By card</h3>
        <p>You choose the amount. The payment page is in Russian; type the sum, a message if you like, and pay.</p>
        <a class="btn main" id="card" href="#" target="_blank" rel="noopener">Pay by card</a>
      </div>
      <div class="card pay">
        <div class="ic">🪙</div>
        <h3>In crypto</h3>
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
    <p class="sub">Donating is optional: the apps are free and work without it. If you'd like, a donation supports Pody Lab and lets you say what to improve, so the apps grow with the people who use them. Any amount.</p>
    <div class="grid g3">
      <div class="card"><div class="ic">1</div><h3>Send a donation</h3><p>By card or in TON. A USDT transfer can't carry a message, so it won't do for wishes.</p></div>
      <div class="card"><div class="ic">2</div><h3>Say what to improve</h3><p>In the payment message or the TON transfer comment: which app and what it's missing. Or write nothing and just support.</p></div>
      <div class="card"><div class="ic">3</div><h3>We read it</h3><p>We read every wish and take on the ones that fit the app.</p></div>
    </div>
  </section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
''' + tail

privacy = head("PoDee privacy policy · Pody Lab", "What PoDee keeps and where it sends it.") + '''<body>
<main class="wrap legal">
  <section>
    <h1 style="font-size:40px">PoDee privacy policy</h1>
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
