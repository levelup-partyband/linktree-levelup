from PIL import Image, ImageDraw
import os

def make_gradient_png(path, w, h, color1, color2, label=None, label2=None):
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    for y in range(h):
        t = y / h
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    if label:
        draw.rectangle([(w//2-60, h//2-30), (w//2+60, h//2+30)], fill=(0,0,0,80))
        draw.text((w//2, h//2 - (15 if label2 else 0)), label, fill=(255,255,255), anchor="mm")
    if label2:
        draw.text((w//2, h//2 + 15), label2, fill=(255,255,255), anchor="mm")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")
    print(f"OK {path}")

base = "react-site/public/assets/img"

# Band members (300x400 portrait)
members = [
    ("andrea-giardina",   "AG",  (93, 37, 224),  (236, 18, 137)),
    ("sergio-grandoni",   "SG",  (100, 20, 200),  (200, 10, 150)),
    ("andrea-de-blasi",   "ADB", (50, 50, 200),   (236, 18, 137)),
    ("paulina-pieprzka",  "PP",  (150, 20, 220),  (236, 18, 137)),
    ("giorgio-massi",     "GM",  (70, 30, 180),   (180, 10, 120)),
    ("stefano-proietti",  "SP",  (90, 20, 210),   (220, 15, 130)),
]
for name, initials, c1, c2 in members:
    make_gradient_png(f"{base}/band/{name}.png", 300, 400, c1, c2, initials, name.replace("-", " ").title())

# Live photos (400x400 square)
live_colors = [
    ((93, 37, 224),  (236, 18, 137)),
    ((236, 18, 137), (255, 100, 100)),
    ((0, 180, 220),  (0, 100, 200)),
    ((0, 200, 100),  (0, 180, 220)),
    ((200, 0, 200),  (236, 18, 137)),
    ((220, 140, 0),  (220, 80, 0)),
    ((0, 180, 220),  (0, 80, 200)),
    ((220, 0, 80),   (180, 0, 140)),
]
for i, (c1, c2) in enumerate(live_colors, 1):
    make_gradient_png(f"{base}/live/live-{i:02d}.png", 400, 400, c1, c2, f"LIVE {i:02d}")

# Service configs (400x250 landscape)
service_colors = [
    ("CONFIG.01", (93, 37, 224),  (236, 18, 137)),
    ("CONFIG.02", (236, 18, 137), (255, 100, 100)),
    ("CONFIG.03", (0, 180, 220),  (0, 100, 200)),
    ("CONFIG.04", (220, 140, 0),  (220, 80, 0)),
]
for code, c1, c2 in service_colors:
    fname = code.lower().replace(".", "-")
    make_gradient_png(f"{base}/service/{fname}.png", 400, 250, c1, c2, code)

print("\nDone! Tutti i PNG generati.")
