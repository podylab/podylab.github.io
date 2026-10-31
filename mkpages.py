import hashlib
import re
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))


def ver(name):
    """A mark of the file's content for its address: after a publish the browser takes the new file, not its cached one."""
    with open(name, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def land(en):
    """The PoDoo page body from podoo-land.tpl; the English page gets the data-en words in place."""
    s = open("podoo-land.tpl", encoding="utf-8").read().split("\n", 1)[1]
    s = s.replace("{REL}", "https://github.com/podylab/PoDoo-releases/releases/latest/download/")
    if en:
        s = re.sub(r'(<(\w+)\b[^>]*?\sdata-en="([^"]*)"[^>]*>)[^<]*(</\2>)', lambda m: m.group(1) + m.group(3) + m.group(4), s)
    return s


def head(title, desc, icon="podee-icon.svg"):
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="icon" href="media/{icon}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="style.css?v={ver("style.css")}" />
</head>
'''


tail = f'<script src="site.js?v={ver("site.js")}"></script>\n<script src="pody.js?v={ver("pody.js")}"></script>\n</body>\n</html>\n'

home = head("Pody Lab", "Pody Lab делает небольшие программы для Windows: PoDee, остров вверху экрана, и PoDoo, пульт для ПК из телефона.") + '''<body>
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="media/podee-icon.svg" alt="Облачко PoDy" />
    <h1>Ваш ПК, <em>только уютнее</em></h1>
    <p class="lead">Pody Lab делает программы для Windows, которые берут на себя мелочи: показать музыку и встречу, открыть нужное одной кнопкой, напомнить попить воды. Все они бесплатные.</p>
  </div>

  <section style="padding-top:24px">
    <div class="apps">
      <div class="card app">
        <img src="media/podee-icon.svg" alt="" />
        <div class="btns"><a class="btn main" data-podee href="https://github.com/podylab/PoDee-releases/releases/latest/download/PoDee_x64-setup.exe"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.6l7.4-1v7.6H3zM11.4 3.4L21 2v9.2h-9.6zM3 12.8h7.4v7.6L3 19.4zM11.4 12.8H21V22l-9.6-1.4z"/></svg>Скачать для Windows</a><a class="btn ghost" href="https://apps.microsoft.com/detail/9P3ZM16J8S2B?hl=ru-ru" target="_blank" rel="noopener"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6V5a4 4 0 0 1 8 0v1h4.2a.8.8 0 0 1 .8.8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.8a.8.8 0 0 1 .8-.8zm1.6 0h4.8V5a2.4 2.4 0 0 0-4.8 0zM7.5 10v3.4h4.1V10zm4.9 0v3.4h4.1V10zm-4.9 4.2v3.4h4.1v-3.4zm4.9 0v3.4h4.1v-3.4z" fill-rule="evenodd"/></svg>Microsoft Store</a></div>
        <h3><a class="stretch" href="podee.html">PoDee</a></h3>
        <p>Остров вверху экрана: часы, музыка, голос и ИИ-чат, календарь, Claude Code. Рядом живёт облачко PoDy.</p>
        <span class="more">Подробнее →</span>
      </div>
      <div class="card app">
        <img src="media/podoo-icon.svg" alt="" />
        <div class="btns"><a class="btn main" href="https://github.com/podylab/PoDoo-releases/releases/latest/download/PoDoo_x64-setup.exe"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.6l7.4-1v7.6H3zM11.4 3.4L21 2v9.2h-9.6zM3 12.8h7.4v7.6L3 19.4zM11.4 12.8H21V22l-9.6-1.4z"/></svg>Скачать для Windows</a><a class="btn ghost" href="https://github.com/podylab/PoDoo-releases/releases/latest/download/PoDoo.apk"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5h12V17a1.5 1.5 0 0 1-1.5 1.5H16V21a1.2 1.2 0 0 1-2.4 0v-2.5h-3.2V21A1.2 1.2 0 0 1 8 21v-2.5h-.5A1.5 1.5 0 0 1 6 17zM6.2 8.5a6 6 0 0 1 11.6 0zM9.5 5.8a.7.7 0 1 0 0 .01zM14.5 5.8a.7.7 0 1 0 0 .01zM8 3l1.4 2M16 3l-1.4 2"/></svg>Для Android</a></div>
        <p class="dl-alt">Версия 1.0.1 · Windows 10 и 11, Android 5 и новее</p>
        <h3><a class="stretch" href="podoo.html">PoDoo</a></h3>
        <p>Телефон или планшет у монитора становится пультом для ПК: программы, кнопки для OBS и Photoshop, музыка, тачпад. Подойдёт любой Android, даже старый из ящика.</p>
        <span class="more">Подробнее →</span>
      </div>
    </div>
  </section>

  <section>
    <div class="grid g2">
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.4A4 4 0 0 1 12 7.6a4 4 0 0 1 7 2.5c0 5.1-7 9.4-7 9.4z"/></svg></div><h3>Поддержать</h3><p>Программы бесплатные. Если они вам пригодились, можно отправить любую сумму картой, через Kaspi QR или криптой.</p><p style="margin-top:14px"><a class="btn main" href="support.html">Поддержать</a></p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5h3.8L18.6 9.2a2.2 2.2 0 0 0-3.1-3.1L5.2 16.4z"/><path d="M13.6 8l2.9 2.9"/><path d="M13 19.5h6.5"/></svg></div><h3>Сделать лучше вместе</h3><p>Напишите, чего не хватает в программах или какую сделать следующей. Платить для этого не нужно.</p><p style="margin-top:14px"><a class="btn main" href="support.html#wish">Написать пожелание</a></p></div>
    </div>
  </section>
</main>
''' + tail

podee = head("PoDee · Pody Lab", "PoDee: остров вверху экрана Windows с часами, музыкой, голосом, ИИ-чатом, календарём и облачком PoDy.") + '''<body>
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="media/podee-icon.svg" alt="Облачко PoDy" />
    <h1>Остров вверху экрана <em>для Windows</em></h1>
    <p class="lead">PoDee живёт у верхнего края экрана: показывает часы и музыку, слушает голос, отвечает в чате и подсказывает, что сейчас делает Claude Code. Рядом сидит облачко PoDy и следит глазами за мышкой.</p>
    <div class="btns">
      <a class="btn main" data-podee href="https://github.com/podylab/PoDee-releases/releases/latest/download/PoDee_x64-setup.exe"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.6l7.4-1v7.6H3zM11.4 3.4L21 2v9.2h-9.6zM3 12.8h7.4v7.6L3 19.4zM11.4 12.8H21V22l-9.6-1.4z"/></svg>Скачать для Windows</a><a class="btn ghost" href="https://apps.microsoft.com/detail/9P3ZM16J8S2B?hl=ru-ru" target="_blank" rel="noopener"><svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6V5a4 4 0 0 1 8 0v1h4.2a.8.8 0 0 1 .8.8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.8a.8.8 0 0 1 .8-.8zm1.6 0h4.8V5a2.4 2.4 0 0 0-4.8 0zM7.5 10v3.4h4.1V10zm4.9 0v3.4h4.1V10zm-4.9 4.2v3.4h4.1v-3.4zm4.9 0v3.4h4.1v-3.4z" fill-rule="evenodd"/></svg>Microsoft Store</a>
      <a class="btn ghost" href="support.html">Поддержать</a>
    </div>
    <div class="shot"><img src="media/real-island.gif" alt="PoDee на экране: остров с вкладками и облачком PoDy" /></div>
  </div>

  <section>
    <h2>Что умеет PoDee</h2>
    <p class="sub">Бесплатный для всех. Windows 10 и 11.</p>
    <div class="grid g3">
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 17.5V6.2l9-2v11.3"/><circle cx="7" cy="17.5" r="2.5"/><circle cx="16" cy="15.5" r="2.5"/><path d="M9.5 9.6l9-2"/></svg></div><h3>Музыка</h3><p>Обложка, кнопки и текст песни в такт, из любого плеера.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.8 11.2a6.2 6.2 0 0 0 12.4 0"/><path d="M12 17.4v3.1"/></svg></div><h3>Голос и чат</h3><p>Скажите «открой Телеграм», и он откроется. Остальное спросите у ИИ: Claude, ChatGPT, Gemini.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3.5"/><path d="M3.5 10h17"/><path d="M8 3.2v3.5M16 3.2v3.5"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg></div><h3>Календарь</h3><p>Google, Outlook или любая iCal-ссылка. Ближайшая встреча видна под часами.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3.5"/><path d="M7.5 10l3 2.5-3 2.5"/><path d="M13 15.2h3.5"/></svg></div><h3>Claude Code</h3><p>Что агент делает в терминале, его вопросы «разрешить?» и сколько осталось лимита.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6s6 6.3 6 10.4a6 6 0 0 1-12 0c0-4.1 6-10.4 6-10.4z"/><path d="M9.2 14.4a2.9 2.9 0 0 0 2.6 2.6"/></svg></div><h3>Здоровье</h3><p>Вода за день, отдых для глаз 20-20-20 и минута дыхания.</p></div>
      <div class="card"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><path d="M17 13.8v6.4M13.8 17h6.4"/></svg></div><h3>Виджеты и док</h3><p>Свой док с живыми превью окон и виджеты на рабочем столе.</p></div>
    </div>
  </section>

  <section>
    <div class="shot"><img src="media/tabs.png" alt="Вкладки PoDee: Главная, Календарь, Здоровье, Экранное время, Управление, Музыка" /></div>
  </section>
</main>
''' + tail

podoo = (head("PoDoo · Pody Lab", "PoDoo: телефон или планшет становится пультом для ПК, как Stream Deck. Программы, горячие клавиши, музыка и тачпад в одно касание.", "podoo-icon.svg")
         .replace("</head>", f'<link rel="stylesheet" href="podoo.css?v={ver("podoo.css")}" />\n</head>')
         + "<body>\n" + land(False) + "\n"
         + tail.replace("</body>", f'<script src="podoo.js?v={ver("podoo.js")}"></script>\n</body>'))

support = head("Поддержать · Pody Lab", "Поддержать Pody Lab любой суммой картой, через Kaspi QR или криптой и отправить пожелание к PoDee или PoDoo.") + '''<body>
<main class="wrap">
  <div class="hero" style="padding-bottom:0">
    <img class="cloud" src="media/podee-icon.svg" alt="Облачко PoDy" />
    <h1>Поддержать <em>Pody Lab</em></h1>
    <p class="lead">Программы Pody Lab бесплатные. Если они вам пригодились, можно отправить любую сумму. Деньги идут на новые функции и следующие программы.</p>
  </div>

  <section id="donate">
    <div class="card pay pay-bar">
      <div class="pay-head"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M3 10h18"/><path d="M7 14.6h3.5"/></svg></div><div><h3>Картой</h3><p>Банковская карта, сумму выбираете сами</p></div></div>
      <p class="pay-text">Откроется страница оплаты. Введите сумму и, если хотите, напишите пожелание в сообщении к платежу.</p>
      <a class="btn main" id="card" href="#" target="_blank" rel="noopener">Отправить картой</a>
    </div>
    <div class="grid g2 pay-pair">
      <div class="card pay" id="kaspi">
        <div class="pay-head"><div class="ic kaspi"><img src="media/kaspi-logo.png" width="34" height="35" alt=""></div><div><h3>Kaspi QR</h3><p>Для Казахстана</p></div></div>
        <div class="wallet">
          <div class="qr"><img src="kaspi-qr.png" width="132" height="132" alt="Kaspi QR для оплаты" loading="lazy"></div>
          <ol class="pay-steps"><li>Откройте приложение Kaspi.kz.</li><li>Нажмите «Kaspi QR» и наведите камеру на код.</li><li>Введите любую сумму и подтвердите.</li></ol>
        </div>
      </div>
      <div class="card pay">
        <div class="pay-head"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.4a2.9 2.9 0 0 0-2.6-1.4c-1.6 0-2.7.8-2.7 1.9s.9 1.6 2.7 1.9 2.7.9 2.7 2-1.1 2-2.7 2a3 3 0 0 1-2.7-1.5"/><path d="M12 6.3v1.7M12 16v1.7"/></svg></div><div><h3>Криптой</h3><p>USDT, TON, BTC, ETH, BNB, DOGE</p></div></div>
        <div class="coins" id="coins"></div>
        <div class="wallet">
          <div class="qr" id="qr"></div>
          <div>
            <div class="addr" id="addr"></div>
            <div class="net" id="net"></div>
            <button class="btn ghost copy" id="copy" type="button">Скопировать адрес</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="wish">
    <h2>Сделать программы лучше вместе</h2>
    <p class="sub">Платить для этого не нужно. Напишите, чего не хватает в PoDee или PoDoo или какую программу сделать следующей. Мы читаем каждое пожелание.</p>
    <div class="card">
      <form data-send="Спасибо, получили. Прочитаем.">
        <input type="hidden" name="about" value="Пожелание" />
        <div class="row2">
          <label>Программа <select name="app"><option>PoDee</option><option>PoDoo</option><option>Новая программа</option></select></label>
          <label>Почта, если ждёте ответа <input name="email" type="email" autocomplete="email" placeholder="you@mail.com" /></label>
        </div>
        <label>Что улучшить <textarea name="message" required placeholder="Например: хочу, чтобы остров показывал погоду"></textarea></label>
        <div class="btns" style="align-items:center"><button class="btn main" type="submit">Отправить пожелание</button><span class="sent"></span></div>
      </form>
      <p class="wish-also">Пожелание можно отправить и вместе с донатом: картой в сообщении к платежу, в TON в комментарии к переводу.</p>
    </div>
  </section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
''' + tail

privacy = head("Конфиденциальность PoDee · Pody Lab", "Какие данные PoDee хранит и куда отправляет. Privacy policy of PoDee.") + '''<body>
<main class="wrap legal">
  <section>
    <h1 class="legal-title">Политика конфиденциальности PoDee</h1>
    <p class="sub">Действует с 30 октября 2026 года. Pody Lab, podylab@gmail.com</p>

    <h2>Коротко</h2>
    <p>PoDee работает на вашем компьютере. У Pody Lab нет своего сервера: мы не собираем статистику, не следим за тем, как вы пользуетесь программой, и ничего о вас не получаем. Данные уходят в интернет только в сервисы, которые вы сами подключили в настройках.</p>

    <h2>Что хранится на компьютере</h2>
    <ul>
      <li>Настройки, задачи, заметки, буфер обмена, экранное время, история уведомлений: в папке PoDee в вашем профиле Windows.</li>
      <li>Ключи API для ИИ, ключи бирж и закрытые ссылки календарей: в диспетчере учётных данных Windows.</li>
      <li>Всё это остаётся у вас. Версия из Microsoft Store удаляет свои данные вместе с собой.</li>
    </ul>

    <h2>Микрофон</h2>
    <p>PoDee слушает микрофон, только пока вы держите или нажали кнопку голоса, и во время записи созвона, которую вы включили сами. Речь распознаётся на компьютере (Whisper) или в облачном сервисе, если вы выбрали его в настройках. Звук не сохраняется, остаётся только текст.</p>

    <h2>Куда PoDee обращается в интернете</h2>
    <ul>
      <li>ИИ-чат и распознавание речи: в выбранный вами сервис (Anthropic, OpenAI, Google Gemini, Groq, OpenRouter или свой адрес) уходят ваши вопросы. Данные обрабатываются по правилам этого сервиса.</li>
      <li>Календарь: по ссылкам Google, Outlook или iCal, которые вы добавили.</li>
      <li>Тексты песен: название и исполнитель трека уходят в LRCLIB (lrclib.net).</li>
      <li>Погода: город уходит в wttr.in. Если город не указан, wttr.in определяет его по IP-адресу.</li>
      <li>Портфель: запросы к Binance, Bybit, OKX по ключам только для чтения и к публичным узлам блокчейнов по адресам кошельков, которые вы добавили.</li>
      <li>Лимиты Claude: запрос к api.anthropic.com от имени вашей учётной записи Claude Code.</li>
      <li>Модели для распознавания речи скачиваются с huggingface.co, когда вы нажимаете «Скачать».</li>
    </ul>
    <p>Как при любом запросе в интернете, эти сервисы видят ваш IP-адрес. Агенты Claude Code передают события в PoDee только внутри компьютера (127.0.0.1), в интернет они не уходят.</p>

    <h2>Дети</h2>
    <p>PoDee не предназначен для детей до 13 лет и не собирает о них данные.</p>

    <h2>Изменения и связь</h2>
    <p>Если политика изменится, новая версия появится на этой странице. Вопросы: <a href="mailto:podylab@gmail.com">podylab@gmail.com</a>.</p>
  </section>

</main>
''' + tail

for n, c in [("index.html", home), ("podee.html", podee), ("podoo.html", podoo), ("support.html", support), ("privacy.html", privacy)]:
    # the icons carry a content mark too, so a new icon shows at once
    for icon in ("podee-icon.svg", "podoo-icon.svg"):
        c = c.replace(f"media/{icon}\"", f"media/{icon}?v={ver('media/' + icon)}\"")
    open(n, "w", encoding="utf-8").write(c)
print("ok")
