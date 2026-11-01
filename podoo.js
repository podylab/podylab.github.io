// PoDoo page: the live scene, the story that scrolls through four tools, the demo dock.
// Built from the old PoDo landing. Wrapped so its names don't clash with site.js.
(() => {
const root = document.documentElement;
root.classList.add('js');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// every page is built in its own language already; the words this script fills in come from W() in site.js

// ---------- Hero: появление ----------
$$('h1 .line > span').forEach((s, i) => s.style.setProperty('--n', i));
[['.status', 0], ['.lede', 520], ['.cta', 640], ['.stores', 760], ['.scene-hint', 1600]].forEach(([sel, d]) => { $(sel)?.style.setProperty('--d', d + 'ms'); });
(document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => root.classList.add('go')));
setTimeout(() => root.classList.add('go'), 1800); // запасной путь, если шрифты зависли

// ---------- Hero: сцена «касание на телефоне → результат на мониторе» ----------
const scene = $('#scene');
if (scene) {
  const screen = $('.mon-screen', scene);
  const phoneScreen = $('.phone-screen', scene);
  const finger = $('.finger', scene);
  const packet = $('.packet', scene);
  const cursor = $('.cursor', scene);
  const trail = $('.trail', scene);
  const pk = Object.fromEntries($$('.pk', scene).map(b => [b.dataset.act, b]));
  const targets = { editor: '.win-editor', music: '.win-player', vol: '.hud', save: '.pc-toast', rec: '.rec', touch: '.mon-screen' };
  const center = (el, base = scene) => {
    const r = el.getBoundingClientRect(), b = base.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
  };
  const moveCursor = (fx, fy) => {
    cursor.style.setProperty('--cx', fx * screen.clientWidth + 'px');
    cursor.style.setProperty('--cy', fy * screen.clientHeight + 'px');
  };
  moveCursor(.62, .5);

  let vol = 40, busy = false, hudTimer, toastTimer2;
  const flag = (name, on) => { if (on) scene.dataset[name] = ''; else delete scene.dataset[name]; };

  function fly(from, to) {
    if (reduced || !packet.animate) return;
    const a = center(from), b = center(to);
    const mid = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 40 };
    packet.animate([
      { transform: `translate(${a.x}px, ${a.y}px) scale(.6)`, opacity: 0 },
      { transform: `translate(${a.x}px, ${a.y}px) scale(1)`, opacity: 1, offset: .1 },
      { transform: `translate(${mid.x}px, ${mid.y}px) scale(1.2)`, opacity: 1, offset: .55 },
      { transform: `translate(${b.x}px, ${b.y}px) scale(.4)`, opacity: 0 },
    ], { duration: 520, easing: 'cubic-bezier(.4, 0, .2, 1)' });
  }

  function touchpad() {
    busy = true;
    flag('touch', true);
    const start = performance.now(), dur = reduced ? 0 : 3000;
    const step = now => {
      const t = Math.min(1, (now - start) / (dur || 1));
      const fx = .5 + .32 * Math.sin(t * Math.PI * 2.6), fy = .5 + .26 * Math.sin(t * Math.PI * 4 + 1);
      trail.style.setProperty('--tx2', fx * phoneScreen.clientWidth + 'px');
      trail.style.setProperty('--ty2', fy * phoneScreen.clientHeight + 'px');
      moveCursor(fx, fy);
      if (t < 1) requestAnimationFrame(step);
      else { flag('touch', false); busy = false; pk.touch.classList.remove('on'); }
    };
    pk.touch.classList.add('on');
    requestAnimationFrame(step);
  }

  function act(name) {
    if (busy) return;
    const key = pk[name];
    key.classList.add('hit');
    setTimeout(() => key.classList.remove('hit'), 220);
    const target = $(targets[name], scene);
    if (name !== 'touch') fly(key, name === 'vol' || name === 'save' || name === 'rec' ? screen : target);
    setTimeout(() => {
      if (name === 'touch') return touchpad();
      if (name === 'editor' || name === 'music' || name === 'rec') {
        const on = !(name in scene.dataset);
        flag(name, on);
        key.classList.toggle('on', on);
        if (on && name !== 'rec') { const c = center(target, screen); moveCursor(c.x / screen.clientWidth, Math.min(.85, c.y / screen.clientHeight + .1)); }
      }
      if (name === 'vol') {
        vol = vol >= 85 ? 25 : vol + 15;
        scene.style.setProperty('--vol', vol / 100);
        flag('hud', true); clearTimeout(hudTimer); hudTimer = setTimeout(() => flag('hud', false), 1500);
      }
      if (name === 'save') { flag('toast', true); clearTimeout(toastTimer2); toastTimer2 = setTimeout(() => flag('toast', false), 1700); }
    }, reduced ? 0 : 380);
  }

  // Автопоказ: «палец» сам нажимает клавиши, пока посетитель не начал сам.
  const plan = ['editor', 'music', 'vol', 'save', 'touch', 'vol', 'rec', 'editor', 'save', 'rec', 'music'];
  let step = 0, pausedUntil = 0, visible = false, timer;
  function tick() {
    clearTimeout(timer);
    if (!visible || document.hidden || performance.now() < pausedUntil || busy) { timer = setTimeout(tick, 600); return; }
    const name = plan[step++ % plan.length];
    const c = center(pk[name]);
    finger.style.setProperty('--fx', c.x + 'px');
    finger.style.setProperty('--fy', c.y + 'px');
    finger.classList.add('show');
    setTimeout(() => {
      if (performance.now() < pausedUntil) return;
      finger.classList.remove('tap'); void finger.offsetWidth; finger.classList.add('tap');
      act(name);
      if (name === 'touch') finger.classList.remove('show');
    }, 650);
    timer = setTimeout(tick, name === 'touch' ? 4000 : 2100);
  }
  for (const b of Object.values(pk)) {
    b.addEventListener('click', e => {
      if (e.isTrusted) { pausedUntil = performance.now() + 9000; finger.classList.remove('show'); }
      act(b.dataset.act);
    });
  }
  if (!reduced) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .3 }).observe(scene);
    setTimeout(tick, 1900);
  }
}

// ---------- Прокрутка: шапка, прогресс, story ----------
const story = $('#story');
const sstrip = $('#sstrip');
const spages = $$('.spage');
const ssteps = $$('.story-steps li');
const sdots = $$('.story-dots i');
const sphone = $('.sphone');
spages.forEach(p => $$('.sk, .hk', p).forEach((k, i) => k.style.setProperty('--k', i)));
$$('.pad-kb i').forEach((k, i) => k.style.setProperty('--k', i));
let lastPage = -1, scrollQueued = false;
function onScroll() {
  scrollQueued = false;
  const y = scrollY;
  if (story) {
    const p = Math.min(1, Math.max(0, (y - story.offsetTop) / Math.max(1, story.offsetHeight - innerHeight)));
    const page = Math.min(3, Math.floor(p * 4));
    ssteps.forEach((li, i) => li.style.setProperty('--fill', String(Math.min(1, Math.max(0, p * 4 - i)))));
    sphone?.style.setProperty('--sp-local', String(p));
    if (page !== lastPage) {
      lastPage = page;
      sstrip.style.setProperty('--page', page);
      spages.forEach((s, i) => s.classList.toggle('on', i === page));
      ssteps.forEach((s, i) => s.classList.toggle('on', i === page));
      sdots.forEach((s, i) => s.classList.toggle('on', i === page));
    }
  }
}
// Колесо мыши в story: одно движение — один экран, без долгой прокрутки.
// Тачпады шлют поток событий с инерцией, поэтому шаг держим, пока поток не стихнет.
let wheelLock = 0;
if (story) addEventListener('wheel', e => {
  if (e.ctrlKey || Math.abs(e.deltaY) < 4) return;
  const span = story.offsetHeight - innerHeight;
  const y = scrollY, top = story.offsetTop;
  if (y < top - 2 || y > top + span + 2) return;
  const now = performance.now();
  if (now < wheelLock) { wheelLock = Math.max(wheelLock, now + 160); e.preventDefault(); return; }
  const next = Math.max(lastPage, 0) + (e.deltaY > 0 ? 1 : -1);
  if (next < 0 || next > 3) return; // за краями — обычная прокрутка страницы
  e.preventDefault();
  wheelLock = now + 750;
  scrollTo({ top: top + span * (next + .5) / 4, behavior: reduced ? 'auto' : 'smooth' });
}, { passive: false });
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();
const navLinks = $$('.bar-nav a');
const sectionsObs = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => sectionsObs.observe(s));

// ---------- Клавиши возможностей встают на место ----------
$$('.cap').forEach(c => c.style.setProperty('--i', c.dataset.drop || 0));
const board = $('.board');
if (board) {
  if (!('IntersectionObserver' in window) || reduced) board.classList.add('in');
  else new IntersectionObserver(([e], o) => { if (e.isIntersecting) { board.classList.add('in'); o.disconnect(); } }, { threshold: 0.12 }).observe(board);
}

// ---------- «Попробуйте»: упрощённый док ----------
const stage = $('#stage');
// на узком экране телефон стоит вертикально: так клавиши крупнее
if (stage && matchMedia('(max-width: 720px)').matches) stage.dataset.orient = 'port';
$('#rotate')?.addEventListener('click', () => {
  if (stage.classList.contains('turning')) return;
  const next = stage.dataset.orient === 'land' ? 'port' : 'land';
  if (reduced) { stage.dataset.orient = next; return; }
  stage.classList.add('turning');
  setTimeout(() => { stage.dataset.orient = next; stage.classList.remove('turning'); }, 280);
});
const device = $('#device');
if (device && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  stage.addEventListener('pointermove', e => {
    if (mockDragging) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    device.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
  });
  stage.addEventListener('pointerleave', () => { device.style.transform = ''; });
}

let mockDragging = false;
const mock = $('#mock');
if (mock) {
  const view = $('#m-viewport'), pagesEl = $('#m-pages'), pageEls = $$('.m-page', mock), dots = $$('#m-dots i');
  const name = $('#m-name'), toastEl = $('#m-toast'), sheet = $('#m-sheet'), pad = $('#m-pad'), padDot = $('#m-pad-dot');
  const kb = $('#m-kb'), kbIn = $('#m-kb-in'), vol = $('#m-vol'), volOut = $('#m-vol-out'), prog = $('#m-prog');
  let page = 0, toastT;
  const say = (text) => {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 1600);
  };
  const goPage = p => {
    page = Math.max(0, Math.min(pageEls.length - 1, p));
    pagesEl.style.setProperty('--page', page);
    dots.forEach((d, i) => d.classList.toggle('on', i === page));
    const el = pageEls[page];
    name.textContent = el.dataset.name;
  };
  mock.addEventListener('mock-lang', () => goPage(page));

  // свайп вбок — страницы; короткое касание — нажатие клавиши
  let sx = 0, sy = 0, dx = 0, pid = null, moved = false;
  view.addEventListener('pointerdown', e => { pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0; moved = false; });
  view.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { moved = true; mockDragging = true; view.classList.add('dragging'); view.setPointerCapture(pid); }
    if (moved) {
      const edge = (page === 0 && dx > 0) || (page === pageEls.length - 1 && dx < 0);
      pagesEl.style.setProperty('--drag', (edge ? dx / 3 : dx) + 'px');
    }
  });
  const end = e => {
    if (e.pointerId !== pid) return;
    pid = null;
    if (moved) {
      const w = view.clientWidth;
      if (dx < -w * .15) goPage(page + 1); else if (dx > w * .15) goPage(page - 1);
      // не даём «клику» после свайпа нажать клавишу
      setTimeout(() => { moved = false; }, 0);
    }
    mockDragging = false;
    view.classList.remove('dragging');
    pagesEl.style.setProperty('--drag', '0px');
  };
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);
  $$('#m-dots i').forEach((d, i) => d.addEventListener('click', () => goPage(i)));

  for (const k of $$('.mk', mock)) {
    k.addEventListener('click', e => {
      if (moved) { e.preventDefault(); return; }
      k.classList.add('hit'); setTimeout(() => k.classList.remove('hit'), 160);
      say(k.dataset.say);
    });
  }

  // плеер
  let playing = true, pos = 0.32;
  const tracks = ["js.track_1", "js.track_2", "js.track_3"];
  let track = 0;
  const setTrack = () => {
    const b = $('.m-meta b', mock);
    b.textContent = W(tracks[track]);
  };
  for (const b of $$('[data-media]', mock)) {
    b.addEventListener('click', () => {
      const a = b.dataset.media;
      if (a === 'play') { playing = !playing; mock.classList.toggle('paused', !playing); say(W(playing ? "js.playing" : "js.paused")); }
      else { track = (track + (a === 'next' ? 1 : tracks.length - 1)) % tracks.length; pos = 0; setTrack(); say(W(a === "next" ? "js.next_track" : "js.previous_track")); }
    });
  }
  setInterval(() => { if (playing && !document.hidden) { pos = (pos + .004) % 1; prog.style.transform = `scaleX(${pos})`; } }, 100);

  // нижняя панель
  const openSheet = on => { mock.classList.toggle('sheet-open', on); sheet.setAttribute('aria-hidden', String(!on)); if (!on) { kb.hidden = true; $('[data-tool="kb"]', mock).classList.remove('on'); } };
  $('#m-handle').addEventListener('click', () => openSheet(!mock.classList.contains('sheet-open')));
  let hy = null;
  $('#m-handle').addEventListener('pointerdown', e => { hy = e.clientY; });
  $('#m-handle').addEventListener('pointerup', e => { if (hy !== null && hy - e.clientY > 20) openSheet(true); hy = null; });
  let volT;
  vol.addEventListener('input', () => {
    volOut.textContent = vol.value;
    clearTimeout(volT); volT = setTimeout(() => say(W("js.volume_n", { n: vol.value })), 120);
  });
  let muted = false;
  for (const t of $$('.m-tool', mock)) {
    t.addEventListener('click', () => {
      const a = t.dataset.tool;
      if (a === 'close') openSheet(false);
      if (a === 'mute') { muted = !muted; t.classList.toggle('on', muted); say(W(muted ? "js.sound_off" : "js.sound_on")); }
      if (a === 'kb') { kb.hidden = !kb.hidden; t.classList.toggle('on', !kb.hidden); if (!kb.hidden) kbIn.focus({ preventScroll: true }); }
      if (a === 'pad') { pad.hidden = false; openSheet(false); }
    });
  }
  kb.addEventListener('submit', e => {
    e.preventDefault();
    const v = kbIn.value.trim();
    if (!v) return;
    say(W("js.typed_text", { text: v }));
    kbIn.value = '';
  });

  // тачпад: светящаяся точка идёт за пальцем
  const padMove = e => {
    const r = pad.getBoundingClientRect();
    padDot.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
  };
  pad.addEventListener('pointerdown', e => { pad.classList.add('active'); padMove(e); });
  pad.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) { pad.classList.add('active'); padMove(e); } });
  pad.addEventListener('pointerleave', () => pad.classList.remove('active'));
  pad.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') pad.classList.remove('active'); say(W("js.click")); });
  $('#m-pad-done').addEventListener('pointerup', e => e.stopPropagation());
  $('#m-pad-done').addEventListener('click', e => { e.stopPropagation(); pad.hidden = true; pad.classList.remove('active'); });

  goPage(0);
}

// ---------- Заголовки по словам ----------
function splitWords() {
  for (const h of $$('[data-split]')) {
    const words = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    words.forEach((w, i) => {
      const outer = document.createElement('span');
      outer.className = 'split-w';
      const inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--w', i);
      outer.append(inner);
      h.append(outer, i < words.length - 1 ? ' ' : '');
    });
  }
}
const splitObs = 'IntersectionObserver' in window && !reduced
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); splitObs.unobserve(e.target); } }), { threshold: .4 })
  : null;
$$('[data-split]').forEach(h => splitObs ? splitObs.observe(h) : h.classList.add('in'));

// ---------- Бегущая строка: скорость и направление от прокрутки ----------
const track = $('.ticker-track');
if (track && !reduced) {
  let x = 0, lastY = scrollY, vel = 0, dir = -1;
  const loop = () => {
    const dy = scrollY - lastY; lastY = scrollY;
    if (dy) dir = dy > 0 ? -1 : 1;
    vel += (Math.abs(dy) * .35 - vel) * .1;
    x += dir * (.6 + vel);
    const half = track.scrollWidth / 2 + 7;
    if (x < -half) x += half; if (x > 0) x -= half;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// ---------- Кнопки тянутся к курсору, клавиши подсвечиваются, карточки наклоняются ----------
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduced) {
  for (const m of $$('.magnet')) {
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect();
      m.style.setProperty('--tx', (e.clientX - r.left - r.width / 2) * .22 + 'px');
      m.style.setProperty('--ty', (e.clientY - r.top - r.height / 2) * .3 + 'px');
    });
    m.addEventListener('pointerleave', () => { m.style.setProperty('--tx', '0px'); m.style.setProperty('--ty', '0px'); });
  }
  for (const c of $$('.cap')) {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  }
  for (const d of $$('.dl')) {
    d.classList.add('tilt');
    d.addEventListener('pointermove', e => {
      const r = d.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      d.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    d.addEventListener('pointerleave', () => { d.style.transform = ''; });
  }
}

// ---- PoDoo + PoDee: a tap on the phone's PoDee page changes the island on the screen ----
const pp = $('.pp');
if (pp) {
  const reply = pp.querySelector('[data-pp-reply]');
  let wait;
  pp.querySelectorAll('[data-pp]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.pp;
    clearTimeout(wait);
    reply.classList.remove('on');
    // "open" and "away" toggle, like the real buttons
    pp.dataset.state = (k === 'open' || k === 'away') && pp.dataset.state === k ? '' : k;
    if (k === 'ask') wait = setTimeout(() => { pp.dataset.state = 'open'; reply.classList.add('on'); }, reduced ? 0 : 1400);
  }));
}

splitWords();
$('#mock')?.dispatchEvent(new Event('mock-lang'));
})();
