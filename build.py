import hashlib
import json
import os
import re
import shutil
import sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# The site in every language: pages come from templates/*.html, words from i18n/<lang>.json.
# Russian sits at the root, every other language in its own folder (en/, de/, ...).
# A template says {{key}} where a word goes and {{up}} before a path to a file at the site's root.
# A key missing from a language falls back to English and is reported.
# i18n/langs.json lists every language: its code, its folder, its name in itself.
LANGS = [l for l in json.load(open("i18n/langs.json", encoding="utf-8")) if os.path.exists(f"i18n/{l[0]}.json")]
PAGES = ["index", "podee", "podoo", "support", "privacy", "guides", "fixes", "report", "podoo-guides", "podoo-fixes", "podoo-privacy"]
SITE = "https://podylab.github.io/"


def ver(name):
    """A mark of the file's content for its address: after a publish the browser takes the new file, not its cached one."""
    with open(name, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def words(lang):
    return json.load(open(f"i18n/{lang}.json", encoding="utf-8"))


EN = words("en")
missing = {}


def fill(s, lang, d, up):
    # {{>name}} puts in a shared piece from templates/_name.html; a piece may hold pieces of its own
    while "{{>" in s:
        s = re.sub(r"\{\{>(\w+)\}\}", lambda m: open(f"templates/_{m.group(1)}.html", encoding="utf-8").read(), s)

    def key(m):
        k = m.group(1)
        if k == "up":
            return up
        if k in d:
            return d[k]
        missing.setdefault(lang, set()).add(k)
        return EN[k]
    return re.sub(r"\{\{([\w.]+)\}\}", key, s)


def alternates(page):
    """Tells search engines where the page lives in every language."""
    name = "" if page == "index" else page + ".html"
    s = "".join(f'<link rel="alternate" hreflang="{code}" href="{SITE}{folder}{name}" />\n' for code, folder, _ in LANGS)
    return s + f'<link rel="alternate" hreflang="x-default" href="{SITE}en/{name}" />\n'


def head(lang, page, up, code, preview):
    icon = "podoo-icon.svg" if page.startswith("podoo") else "podee-icon.svg"
    extra = f'<link rel="stylesheet" href="{code}podoo.css?v={ver("podoo.css")}" />\n' if page == "podoo" else ""
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="root" content="{up}" />
<script>try{{var t=localStorage.getItem("podylab.theme")}}catch(e){{}}document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")</script>
<title>{{{{{page.replace("-", "_")}.title}}}}</title>
<meta name="description" content="{{{{{page.replace("-", "_")}.desc}}}}" />
<link rel="icon" href="{up}media/{icon}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&family=Press+Start+2P&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="{code}style.css?v={ver("style.css")}" />
{extra}{"" if preview else alternates(page)}</head>
'''


def pody(lang, d, home):
    """What the scripts need: the words they show (English where a language has none yet), the languages, the way to this build's root."""
    js = {k: d.get(k, v) for k, v in EN.items() if k.startswith("js.")}
    for k in EN:
        if k.startswith("js.") and k not in d:
            missing.setdefault(lang, set()).add(k)
    data = json.dumps({"words": js, "langs": LANGS, "home": home}, ensure_ascii=False)
    return "<script>window.PODY = " + data.replace("</", "<\\/") + ";</script>\n"


def tail(page, code):
    s = f'<script src="{code}site.js?v={ver("site.js")}"></script>\n<script src="{code}pody.js?v={ver("pody.js")}"></script>\n'
    if page == "podoo":
        s += f'<script src="{code}podoo.js?v={ver("podoo.js")}"></script>\n'
    return s + "</body>\n</html>\n"


# `python build.py preview` builds the same site into preview/, to show before a publish
preview = sys.argv[1:] == ["preview"]
base = "preview/" if preview else ""
if preview:
    # a preview carries its own copy of the styles and scripts, so showing it never changes the live site
    os.makedirs(base, exist_ok=True)
    for f in ("style.css", "site.js", "pody.js", "podoo.css", "podoo.js"):
        shutil.copyfile(f, base + f)
for lang, sub, _ in LANGS:
    d = words(lang)
    folder = base + sub
    up = "../" * folder.count("/")  # to the site root, where media/ lives
    home = "../" * sub.count("/")  # to the root of this build: the Russian pages
    code = home if preview else up
    if folder:
        os.makedirs(folder, exist_ok=True)
    for page in PAGES:
        body = open(f"templates/{page}.html", encoding="utf-8").read()
        c = fill(head(lang, page, up, code, preview) + "<body>\n" + body + pody(lang, d, home) + tail(page, code), lang, d, up)
        # the icons carry a content mark too, so a new icon shows at once
        for icon in ("podee-icon.svg", "podoo-icon.svg"):
            c = c.replace(f"media/{icon}\"", f"media/{icon}?v={ver('media/' + icon)}\"")
        open(folder + page + ".html", "w", encoding="utf-8").write(c)

for lang, keys in missing.items():
    print(f"{lang}: {len(keys)} words missing, English is shown", file=sys.stderr)
print("ok")
