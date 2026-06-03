"""Convert the brand font weights actually used by the site to WOFF2.
Run from react-site/:  python scripts/fonts-to-woff2.py
"""
import os
from fontTools.ttLib import TTFont

FONTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'fonts')

# (source .otf, output .woff2) for the faces referenced in index.css
TARGETS = [
    'CocomatPro-Regular',
    'CocomatPro-Medium',
    'CocomatPro-Bold',
    'CocomatPro-Heavy',
    'CocomatPro-Black',
    'TT-Commons-Pro-Expanded-Regular',
    'TT-Commons-Pro-Expanded-Bold',
]

for base in TARGETS:
    src = os.path.join(FONTS_DIR, base + '.otf')
    dst = os.path.join(FONTS_DIR, base + '.woff2')
    f = TTFont(src)
    f.flavor = 'woff2'
    f.save(dst)
    print(f"{base}.otf -> {base}.woff2  ({os.path.getsize(src)//1024}KB -> {os.path.getsize(dst)//1024}KB)")

print("Done.")
