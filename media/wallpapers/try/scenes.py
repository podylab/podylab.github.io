# Trial wallpapers for PoDee, drawn as vector scenes and rendered by Chrome at 3840x2160.
# The top of each picture stays calm: the island lives there.
# python -X utf8 scenes.py  ->  <name>.jpg and <name>-small.jpg next to this file
import math, os, random, subprocess
from PIL import Image

W, H = 1920, 1080
HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def smooth(pts):
    """a Catmull-Rom curve through the points, as cubic Béziers"""
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, len(pts) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d


def ridge(base, amp, seed, n=10, freq=1.0):
    r = random.Random(seed)
    ph = [r.uniform(0, 6.3) for _ in range(3)]
    pts = []
    for i in range(n + 1):
        x = -100 + i * (W + 200) / n
        u = x / W * freq
        y = base - amp * (0.6 * math.sin(u * 3.1 + ph[0]) + 0.3 * math.sin(u * 7.3 + ph[1]) + 0.12 * math.sin(u * 13 + ph[2]))
        pts.append((x, y))
    return smooth(pts) + f"L{W + 100},{H + 10}L-100,{H + 10}Z"


def sky(top, bottom, extra=""):
    return f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient>{extra}</defs><rect width="{W}" height="{H}" fill="url(#sky)"/>'


def glow(cx, cy, r, color, halo, op=0.55):
    return (f'<defs><radialGradient id="g{cx}"><stop offset="0" stop-color="{halo}" stop-opacity="{op}"/><stop offset="1" stop-color="{halo}" stop-opacity="0"/></radialGradient></defs>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * 4}" fill="url(#g{cx})"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>')


def stars(seed, n, color, top=0, bottom=700, square=False):
    r = random.Random(seed)
    out = ""
    for _ in range(n):
        x, y, s, o = r.uniform(0, W), r.uniform(top, bottom), r.choice([1.2, 1.6, 2.2, 3]), r.uniform(0.35, 0.95)
        out += (f'<rect x="{x:.0f}" y="{y:.0f}" width="{s * 2:.0f}" height="{s * 2:.0f}" fill="{color}" opacity="{o:.2f}"/>' if square
                else f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{s:.1f}" fill="{color}" opacity="{o:.2f}"/>')
    return out


# a quiet film grain so the big gradients never band
GRAIN = ('<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .5 0"/></filter>'
         f'<rect width="{W}" height="{H}" filter="url(#grain)" opacity=".07"/>')


# ---------- 1. Valleys: hills in layers, lighter in the distance ----------
def valleys(top, bottom, sun, halo, layers, seed, night=False):
    s = sky(top, bottom)
    if night:
        s += stars(seed, 160, "#ffffff", 0, 640)
    s += glow(1380, 560 if not night else 330, 70 if not night else 46, sun, halo, 0.6 if not night else 0.35)
    n = len(layers)
    for k, c in enumerate(layers):
        s += f'<path d="{ridge(600 + k * 105, 95 - k * 10, seed + k, freq=1 + k * 0.25)}" fill="{c}"/>'
    return s


# ---------- 2. Clouds, drawn like PoDy: round puffs on a flat base, a flat shade under each ----------
def cloud(x, y, s, fill, shade, op=1.0):
    body = (f'<circle cx="{x - 60 * s}" cy="{y - 6 * s}" r="{42 * s}"/><circle cx="{x}" cy="{y - 34 * s}" r="{58 * s}"/>'
            f'<circle cx="{x + 64 * s}" cy="{y - 2 * s}" r="{38 * s}"/><rect x="{x - 108 * s}" y="{y - 12 * s}" width="{212 * s}" height="{56 * s}" rx="{28 * s}"/>')
    return (f'<g opacity="{op}"><g fill="{shade}" transform="translate(0 {10 * s})">{body}</g><g fill="{fill}">{body}</g></g>')


def clouds(top, bottom, fill, shade, back, seed, night=False, moon=None):
    s = sky(top, bottom)
    if night:
        s += stars(seed, 140, "#ffffff", 0, 600)
    if moon:
        s += glow(1500, 210, 44, moon, moon, 0.25)
    r = random.Random(seed)
    # three depths: far and pale, middle, near and large
    for depth, (count, y0, y1, sc, op) in enumerate([(7, 380, 560, 0.55, 0.55), (6, 520, 760, 0.85, 0.85), (5, 760, 980, 1.35, 1)]):
        for i in range(count):
            x = (i + r.uniform(0.1, 0.9)) * W / count
            s += cloud(x, r.uniform(y0, y1), sc * r.uniform(0.85, 1.15), back if depth == 0 else fill, shade, op)
    # a bank of cloud along the bottom
    bank = "".join(f'<circle cx="{x}" cy="{1060 + r.uniform(-20, 30):.0f}" r="{r.uniform(110, 170):.0f}"/>' for x in range(-60, W + 160, 170))
    s += f'<g fill="{shade}" transform="translate(0 14)">{bank}</g><g fill="{fill}">{bank}</g>'
    return s


# ---------- 3. Dunes / waves: soft bands rolling in ----------
def dunes(top, bottom, sun, halo, bands, seed, sun_y=520):
    s = sky(top, bottom) + glow(560, sun_y, 80, sun, halo, 0.5)
    for k, c in enumerate(bands):
        s += f'<path d="{ridge(560 + k * 92, 46 + k * 6, seed + 3 * k, n=7, freq=0.8)}" fill="{c}"/>'
    return s


# ---------- 4. Glow: big soft colour fields, like a lit screen ----------
def aurora(base, blobs, seed, op=0.9):
    r = random.Random(seed)
    s = f'<rect width="{W}" height="{H}" fill="{base}"/>'
    defs = ""
    for i, c in enumerate(blobs):
        defs += f'<radialGradient id="b{i}"><stop offset="0" stop-color="{c}" stop-opacity="{op}"/><stop offset=".55" stop-color="{c}" stop-opacity="{op * 0.45}"/><stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>'
        s += f'<ellipse cx="{r.uniform(-100, W + 100):.0f}" cy="{r.uniform(420, 1150):.0f}" rx="{r.uniform(600, 950):.0f}" ry="{r.uniform(380, 560):.0f}" fill="url(#b{i})"/>'
    return f"<defs>{defs}</defs>" + s


# ---------- 5. Blocks: Minecraft-style worlds for the «Пиксели» theme ----------
B = 24  # one block


def block(x, y, palette, r):
    return f'<rect x="{x * B}" y="{y * B}" width="{B}" height="{B}" fill="{r.choice(palette)}"/>'


def heights(seed, base, amp, cols):
    r = random.Random(seed)
    ph = [r.uniform(0, 6.3) for _ in range(3)]
    return [round(base - amp * (0.6 * math.sin(c / cols * 6 + ph[0]) + 0.35 * math.sin(c / cols * 15 + ph[1]))) for c in range(cols)]


def end_world(seed):
    global B
    B = 40
    r = random.Random(seed)
    cols, rows = W // B, H // B
    s = sky("#07050c", "#1d1431") + stars(seed, 120, "#e8dcff", 0, 760, square=True)
    stone = ["#dcdca0", "#d2d293", "#e4e4ad", "#c9c98a"]
    obs = ["#0e0a16", "#170f24", "#221836", "#33264d"]
    # the obsidian pillars stand on the ground
    ground = heights(seed, rows - 5, 1.5, cols)
    for px, ph in [(4, 11), (13, 8), (31, 12), (41, 9)]:
        for x in range(px, px + 3):
            for y in range(ground[x] - ph, ground[x]):
                s += block(x, y, obs, r)
        s += f'<rect x="{px * B + 30}" y="{(ground[px] - ph) * B - 30}" width="60" height="30" fill="#ff9be8" opacity=".85"/>'
    # a floating island far off
    for x in range(20, 27):
        for y in range(rows - 15, rows - 15 + max(1, 3 - abs(x - 23) // 2)):
            s += block(x, y, stone, r)
    for x in range(cols):
        for y in range(ground[x], rows):
            s += block(x, y, stone, r)
    return s


def snow_world(seed):
    global B
    B = 40
    r = random.Random(seed)
    cols, rows = W // B, H // B
    s = sky("#bcdcec", "#eef6fa") + glow(1420, 360, 54, "#fffdf6", "#ffffff", 0.5)
    far = heights(seed, rows - 10, 2.5, cols)
    for x in range(cols):
        for y in range(far[x], rows):
            s += block(x, y, ["#d8e6ee", "#d2e1ea", "#dde9f0"], r)
    near = heights(seed + 9, rows - 5, 1.5, cols)
    trees = [4, 13, 22, 35, 43]
    for t in trees:
        g = near[t]
        for y in range(g - 3, g):
            s += block(t, y, ["#5a3d22", "#4e341d"], r)
        for i, w in enumerate([1, 1, 2, 2, 3]):
            y = g - 8 + i
            for x in range(t - w + 1, t + w):
                s += block(x, y, ["#f4f9fb", "#edf4f7"] if i in (0, 2) else ["#2f4a3a", "#2a4334", "#365541"], r)
    for x in range(cols):
        for y in range(near[x], rows):
            s += block(x, y, ["#f4f9fb", "#edf4f7", "#e6eff3", "#fbfdfe"] if y < near[x] + 2 else ["#8a8f93", "#7d8286", "#969b9f"], r)
    return s


SCENES = {
    "valley-day": valleys("#d9f0ee", "#fdeedd", "#fff8ea", "#ffe2b8", ["#cde4dc", "#a6cfc1", "#7cb7a4", "#559a86", "#387a69"], 11),
    "valley-night": valleys("#081019", "#1a2c3e", "#f3efe2", "#cfe0ff", ["#2f5566", "#25485a", "#1c3a4a", "#142c3a", "#0d1f2a"], 21, night=True),
    "clouds-day": clouds("#8ccbea", "#e6f5fc", "#ffffff", "#cfe4f0", "#f2f9fd", 5),
    "clouds-dusk": clouds("#16142f", "#4a3a6c", "#6f5f98", "#4e4275", "#5a4c84", 8, night=True, moon="#f6f0dc"),
    "dunes-day": dunes("#fdf1e2", "#f7d9b9", "#fff6e6", "#ffd9a8", ["#f2c99a", "#e9b483", "#dd9e6d", "#cb8458", "#b26b45", "#905236"], 3),
    "dunes-night": dunes("#06161d", "#0f3440", "#e9f4f0", "#9fe3d0", ["#124654", "#0f3c48", "#0c323d", "#092832", "#071f28", "#04151b"], 7, sun_y=420),
    "glow-light": aurora("#f5f0ea", ["#7fdcbc", "#ffc29a", "#ff9c97", "#b3a3f0", "#86cdea", "#a3e0ae"], 2, 1),
    "glow-dark": aurora("#060a12", ["#1d7a64", "#3d2c84", "#0f557a", "#6c2b6e", "#22906f", "#2b3f8f"], 6, 0.75),
    "blocks-end": end_world(4),
    "blocks-snow": snow_world(12),
}

for name, body in SCENES.items():
    svg = os.path.join(HERE, f"{name}.svg")
    with open(svg, "w", encoding="utf8") as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{body}{GRAIN}</svg>')
    png = os.path.join(HERE, f"{name}.png")
    subprocess.run([CHROME, "--headless=new", "--hide-scrollbars", f"--window-size={W},{H}", "--force-device-scale-factor=2",
                    f"--screenshot={png}", "file:///" + svg.replace("\\", "/")], capture_output=True)
    im = Image.open(png).convert("RGB")
    im.save(os.path.join(HERE, f"{name}.jpg"), quality=90, optimize=True, progressive=True)
    im.resize((640, 360), Image.LANCZOS).save(os.path.join(HERE, f"{name}-small.jpg"), quality=86)
    os.remove(png)
    os.remove(svg)
    print(name, im.size, os.path.getsize(os.path.join(HERE, f"{name}.jpg")) // 1024, "KB")
