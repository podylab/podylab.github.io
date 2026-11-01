# PoDee's free wallpapers: soft blended gradients, 3840x2160, drawn in code.
# Each palette goes with one island and companion on the site (light ones with glass and PoDy,
# dark ones with the black island and the cat, violet with the Enderman, icy with the Ghast).
# python -X utf8 make.py  ->  <name>.jpg and <name>-small.jpg
import os
import numpy as np
from PIL import Image

W, H = 3840, 2160
HERE = os.path.dirname(os.path.abspath(__file__))

WALLS = {
    "mint": ("#e8f5ef", ["#7fd6b9", "#bfeee0", "#9ccfe8", "#f8e2c4", "#5ec2a2", "#e3f6d8"]),
    "night": ("#05090b", ["#0f4a44", "#1a2a5c", "#062022", "#331f5c", "#127056", "#0a1430"]),
    "sand": ("#f7ead8", ["#efc391", "#fbe7cc", "#e4ac86", "#fff4e6", "#f2cfa0", "#e9b8a4"]),
    "peach": ("#ffe9dc", ["#ffb08f", "#ffd7bd", "#f48f86", "#ffe7c8", "#f7a3b5", "#ffc6a0"]),
    "sky": ("#e6f1f8", ["#8fc4ea", "#d4ebf8", "#9fb4ee", "#eef7fc", "#7db7e3", "#bfe1f2"]),
    "lavender": ("#efeafb", ["#b9a6f0", "#e6defb", "#9f93e6", "#f6cfe6", "#cdb9f6", "#a8c0f0"]),
    "end": ("#09060f", ["#3a1d72", "#140a2a", "#5b2a9a", "#0b0718", "#7a3fb0", "#24124a"]),
    "snow": ("#f2f7fa", ["#cfe3f0", "#ffffff", "#b9d3e5", "#eef5fa", "#d5ddf2", "#f7fbfd"]),
    "moss": ("#0a120e", ["#24502f", "#0d2016", "#356a42", "#0a1610", "#2f5c3a", "#16341f"]),
}


def lin(hexc):
    c = np.array([int(hexc[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def srgb(l):
    return np.where(l <= 0.0031308, l * 12.92, 1.055 * np.clip(l, 0, 1) ** (1 / 2.4) - 0.055)


ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
xs /= W
ys /= W  # the same scale on both axes, so the blobs stay round

for i, (name, (base, colors)) in enumerate(WALLS.items()):
    rng = np.random.default_rng(17 + i * 31)
    # the blend is done in linear light, so the mixes stay clean instead of going muddy
    acc = lin(base)[None, None, :] * 0.12
    total = np.full((H, W), 0.12, dtype=np.float32)
    for c in colors:
        cx, cy = rng.uniform(-0.05, 1.05), rng.uniform(-0.02, 0.6)
        r = rng.uniform(0.15, 0.27)
        w = np.exp(-((xs - cx) ** 2 + (ys - cy) ** 2) / (2 * r * r)).astype(np.float32)
        acc = acc + w[..., None] * lin(c)[None, None, :]
        total += w
    img = srgb(acc / total[..., None]) * 255
    # a little grain hides the banding a smooth gradient gets in 8 bits
    img += rng.normal(0, 1.1, img.shape).astype(np.float32)
    im = Image.fromarray(np.clip(img + 0.5, 0, 255).astype(np.uint8))
    im.save(os.path.join(HERE, f"{name}.jpg"), quality=92, optimize=True, progressive=True)
    im.resize((640, 360), Image.LANCZOS).save(os.path.join(HERE, f"{name}-small.jpg"), quality=88)
    print(name, os.path.getsize(os.path.join(HERE, f"{name}.jpg")) // 1024, "KB")
