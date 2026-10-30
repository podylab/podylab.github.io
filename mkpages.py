import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))


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
<link rel="stylesheet" href="style.css" />
</head>
'''


tail = '<script src="site.js"></script>\n</body>\n</html>\n'

home = head("Pody Lab", "Pody Lab делает небольшие программы для Windows: PoDee, остров вверху экрана, и PoDoo, пульт для ПК из старого телефона.") + '''<body>
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="media/podee-icon.svg" alt="Облачко PoDy" />
    <h1>Небольшие программы <em>для Windows</em></h1>
    <p class="lead">Pody Lab делает программы, которые берут на себя мелочи: показать музыку и встречу, открыть нужное одной кнопкой, напомнить попить воды. Все они бесплатные.</p>
    <div class="btns">
      <a class="btn main big" data-podee href="#">Скачать PoDee</a>
      <a class="btn ghost" href="podee.html">Что умеет PoDee</a>
    </div>
  </div>

  <section style="padding-top:24px">
    <div class="apps">
      <a class="card app" href="podee.html">
        <img src="media/podee-icon.svg" alt="" />
        <span class="tag">Можно скачать</span>
        <h3>PoDee</h3>
        <p>Остров вверху экрана: часы, музыка, голос и ИИ-чат, календарь, Claude Code. Рядом живёт облачко PoDy.</p>
        <span class="more">Подробнее →</span>
      </a>
      <a class="card app" href="podoo.html">
        <img src="media/podoo-icon.svg" alt="" />
        <span class="tag soon">Скоро</span>
        <h3>PoDoo</h3>
        <p>Старый телефон или планшет у монитора становится пультом для ПК: программы, кнопки для OBS и Photoshop, музыка, тачпад.</p>
        <span class="more" style="color:#f2a074">Подробнее →</span>
      </a>
    </div>
  </section>

  <section>
    <div class="grid g2">
      <div class="card"><div class="ic">💚</div><h3>Поддержать</h3><p>Программы бесплатные. Если они вам пригодились, можно отправить любую сумму картой или криптой.</p><p style="margin-top:14px"><a class="btn main" href="support.html">Поддержать</a></p></div>
      <div class="card"><div class="ic">✍️</div><h3>Сделать лучше вместе</h3><p>Поддержите донатом и напишите в сообщении, что улучшить или какую программу сделать следующей.</p><p style="margin-top:14px"><a class="btn ghost" href="support.html#wish">Как это работает</a></p></div>
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
      <a class="btn main" data-podee href="#">Скачать PoDee</a>
      <a class="btn ghost" href="support.html">Поддержать</a>
    </div>
    <div class="shot"><img src="media/real-island.gif" alt="PoDee на экране: остров с вкладками и облачком PoDy" /></div>
  </div>

  <section>
    <h2>Что умеет PoDee</h2>
    <p class="sub">Бесплатный для всех. Windows 10 и 11.</p>
    <div class="grid g3">
      <div class="card"><div class="ic">🎵</div><h3>Музыка</h3><p>Обложка, кнопки и текст песни в такт, из любого плеера.</p></div>
      <div class="card"><div class="ic">🎙️</div><h3>Голос и чат</h3><p>Скажите «открой Телеграм», и он откроется. Остальное спросите у ИИ: Claude, ChatGPT, Gemini.</p></div>
      <div class="card"><div class="ic">🗓️</div><h3>Календарь</h3><p>Google, Outlook или любая iCal-ссылка. Ближайшая встреча видна под часами.</p></div>
      <div class="card"><div class="ic">🤖</div><h3>Claude Code</h3><p>Что агент делает в терминале, его вопросы «разрешить?» и сколько осталось лимита.</p></div>
      <div class="card"><div class="ic">💧</div><h3>Здоровье</h3><p>Вода за день, отдых для глаз 20-20-20 и минута дыхания.</p></div>
      <div class="card"><div class="ic">🧩</div><h3>Виджеты и док</h3><p>Свой док с живыми превью окон и виджеты на рабочем столе.</p></div>
    </div>
  </section>

  <section>
    <div class="shot"><img src="media/tabs.png" alt="Вкладки PoDee: Главная, Календарь, Здоровье, Экранное время, Управление, Музыка" /></div>
  </section>
</main>
''' + tail

podoo = head("PoDoo · Pody Lab", "PoDoo: старый телефон или планшет становится пультом для ПК, как Stream Deck. Скоро.", "podoo-icon.svg") + '''<body class="orange">
<main class="wrap">
  <div class="hero">
    <img class="cloud" src="media/podoo-icon.svg" alt="" style="filter:drop-shadow(0 18px 30px rgb(207 70 25 / .35))" />
    <span class="tag soon" style="justify-self:center;margin-top:18px">В разработке</span>
    <h1>Пульт для ПК <em>из старого телефона</em></h1>
    <p class="lead">Поставьте телефон или планшет у монитора, и на нём появятся иконки ваших программ. Одно нажатие, и Photoshop, Telegram или папка проекта открыты. Отдельный Stream Deck покупать не нужно.</p>
    <div class="btns"><a class="btn main" href="#notify">Сообщить, когда выйдет</a></div>
  </div>

  <section>
    <h2>Что будет в PoDoo</h2>
    <p class="sub">Телефон на Android и компьютер с Windows. Подключение по Wi-Fi, кабелю или Bluetooth.</p>
    <div class="grid g3">
      <div class="card"><div class="ic">🚀</div><h3>Быстрый запуск</h3><p>Иконки любимых программ, сайтов и папок уже на месте, настраивать ничего не нужно.</p></div>
      <div class="card"><div class="ic">🎛️</div><h3>Кнопки под программу</h3><p>Открыт Photoshop, на телефоне инструменты. Открыт OBS, на нём сцены, микрофон и эфир.</p></div>
      <div class="card"><div class="ic">🎵</div><h3>Музыка и тачпад</h3><p>Пауза, громкость, следующий трек. Фильм на телевизоре можно листать с дивана.</p></div>
    </div>
  </section>

  <section id="notify">
    <h2>Сообщить, когда выйдет</h2>
    <p class="sub">Оставьте почту, и мы напишем один раз, когда PoDoo можно будет скачать.</p>
    <div class="card">
      <form data-send="Записали. Напишем, когда PoDoo выйдет.">
        <input type="hidden" name="about" value="PoDoo: сообщить о выходе" />
        <div class="row2">
          <label>Почта <input name="email" type="email" required autocomplete="email" placeholder="you@mail.com" /></label>
          <label>Что хотите делать с PoDoo <input name="message" placeholder="Можно не писать" /></label>
        </div>
        <div class="btns" style="align-items:center"><button class="btn main" type="submit">Сообщить мне</button><span class="sent"></span></div>
      </form>
    </div>
  </section>
</main>
''' + tail

support = head("Поддержать · Pody Lab", "Поддержать Pody Lab любой суммой картой или криптой и отправить пожелание к PoDee или PoDoo.") + '''<body>
<main class="wrap">
  <div class="hero" style="padding-bottom:0">
    <img class="cloud" src="media/podee-icon.svg" alt="Облачко PoDy" />
    <h1>Поддержать <em>Pody Lab</em></h1>
    <p class="lead">Программы Pody Lab бесплатные. Если они вам пригодились, можно отправить любую сумму. Деньги идут на новые функции и следующие программы.</p>
  </div>

  <section id="donate">
    <div class="grid g2">
      <div class="card pay">
        <div class="ic">💳</div>
        <h3>Картой</h3>
        <p>Сумму выбираете сами. В сообщении к платежу можно написать пожелание.</p>
        <a class="btn main" id="card" href="#" target="_blank" rel="noopener">Отправить картой</a>
      </div>
      <div class="card pay">
        <div class="ic">🪙</div>
        <h3>Криптой</h3>
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
    <h2>Сделать программу лучше вместе</h2>
    <p class="sub">Донат необязателен: программы бесплатные и работают без него. Если хотите, донатом можно поддержать Pody Lab и заодно сказать, что улучшить. Так программы растут вместе с теми, кто ими пользуется. Сумма любая.</p>
    <div class="grid g3">
      <div class="card"><div class="ic">1</div><h3>Отправьте донат</h3><p>Картой или в TON. В USDT к переводу нельзя приложить текст, поэтому для пожеланий он не подходит.</p></div>
      <div class="card"><div class="ic">2</div><h3>Напишите, что улучшить</h3><p>В сообщении к платежу или в комментарии к переводу TON: какая программа и чего в ней не хватает. Можно ничего не писать, просто поддержать.</p></div>
      <div class="card"><div class="ic">3</div><h3>Мы прочитаем</h3><p>Читаем каждое пожелание и берём в работу то, что подходит программе.</p></div>
    </div>
  </section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
''' + tail

privacy = head("Конфиденциальность PoDee · Pody Lab", "Какие данные PoDee хранит и куда отправляет. Privacy policy of PoDee.") + '''<body>
<main class="wrap legal">
  <section>
    <h1 style="font-size:40px">Политика конфиденциальности PoDee</h1>
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
    open(n, "w", encoding="utf-8").write(c)
print("ok")
