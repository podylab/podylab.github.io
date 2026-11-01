# The free wallpapers on the PoDee page, drawn in code: a soft sky of blurred clouds in each palette.
# python -X utf8 media/wallpapers/make.py  ->  <name>.jpg (3840x2160) and <name>-small.jpg (960x540)
import os
import numpy as np
from PIL import Image

os.chdir(os.path.dirname(os.path.abspath(__file__)))
W, H = 3840, 2160
# name: top of the sky, bottom of the sky, the clouds' colours
WALLS = {
    "mint": ("#d6f2e9", "#5fa896", ["#ffffff", "#b7e6d8", "#8fd3bf"]),
    "sky": ("#e3eef4", "#7fb0c8", ["#ffffff", "#f4f8fa", "#b9d6e4"]),
    "peach": ("#ffe6cf", "#e2846e", ["#fff4e6", "#ffd0b0", "#f2a48c"]),
    "lavender": ("#ece6fa", "#7f72bd", ["#ffffff", "#d6ccf3", "#a99be0"]),
    "night": ("#0a1216", "#1b3438", ["#5c9f92", "#1f4f52", "#27445e"]),
    "sand": ("#f6ecd8", "#bfa47a", ["#fffaf0", "#eedcb8", "#d9c095"]),
}


def rgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def sky(top, bottom, clouds, seed, stars=False):
    rnd = np.random.default_rng(seed)
    w, h = 960, 540  # drawn at a quarter size, then enlarged: every edge stays soft
    y, x = np.mgrid[0:h, 0:w] / h
    t = (y ** 1.3)[..., None]
    img = rgb(top) * (1 - t) + rgb(bottom) * t
    # each cloud is a cluster of round puffs; their summed density, cut softly, gives a puffy edge
    for _ in range(rnd.integers(6, 10)):
        cx, cy = rnd.uniform(-.1, w / h + .1), rnd.uniform(.3, 1.0)  # the top stays clear for the island
        size = rnd.uniform(.05, .11) * (0.7 + cy * .6)
        d = np.zeros((h, w))
        for _ in range(rnd.integers(6, 12)):
            px, py = cx + rnd.uniform(-2.6, 2.6) * size, cy - abs(rnd.normal(0, size * .6))
            r = size * rnd.uniform(.7, 1.5)
            d += np.exp(-(((x - px) ** 2 + (y - py) ** 2) / r ** 2))
        d *= np.clip((cy + size * .5 - y) / (size * .6), 0, 1)  # a flat belly, like a real cumulus
        a = np.clip((d - .35) / .6, 0, 1)
        a = (a * a * (3 - 2 * a))[..., None] * rnd.uniform(.55, .9)
        col = rgb(clouds[0])
        shade = rgb(clouds[rnd.integers(1, len(clouds))])
        # the cloud's belly is in shade, its top in the light
        k = np.clip((y - cy + size) / (size * 2.2), 0, 1)[..., None]
        img = img * (1 - a) + (col * (1 - k) + shade * k) * a
    if stars:
        sy, sx = rnd.uniform(0, .55, 160), rnd.uniform(0, w / h, 160)
        for px, py, b in zip(sx, sy, rnd.uniform(.3, 1, 160)):
            img += (b * 200 * np.exp(-(((x - px) ** 2 + (y - py) ** 2) / .0012 ** 2)))[..., None] * (1 - t)
    big = np.asarray(Image.fromarray(img.clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), float)
    # a whisper of noise keeps the gradients from banding
    big += np.random.default_rng(seed + 1).normal(0, 1.2, big.shape)
    return Image.fromarray(big.clip(0, 255).astype(np.uint8))


for i, (name, (top, bottom, clouds)) in enumerate(WALLS.items()):
    im = sky(top, bottom, clouds, 7 + i * 13, stars=name == "night")
    im.save(f"{name}.jpg", quality=90, optimize=True, progressive=True)
    im.resize((960, 540), Image.LANCZOS).save(f"{name}-small.jpg", quality=84, optimize=True, progressive=True)
    print(name, os.path.getsize(f"{name}.jpg") // 1024, "KB")
