# Cuts each embedded font down to the characters the game can show: every character in the text of the file (typed
# directly, written as \uXXXX / \xNN, or as an &entity;) plus all of plain ASCII and a few spaces and quotes.
# Layout features: only the ones the game uses are kept (see FEATURES). Usage: optfonts.py in.html out.html [report]
import re, sys, io, base64, html
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
src, dst = sys.argv[1], sys.argv[2]
# only the layout features the browser turns on by itself (kerning, ligatures, accents, required forms) plus tabular digits, which the game asks for (CSS tabular-nums / "tnum"); fractions, small-cap-style numerals and proportional digits are never asked for
FEATURES = ['ccmp', 'locl', 'mark', 'mkmk', 'kern', 'liga', 'clig', 'calt', 'rlig', 'rclt', 'rvrn', 'curs', 'tnum']
s = open(src, encoding='utf-8').read()
need = set(range(0x20, 0x7f))
need |= {ord(c) for c in s if ord(c) > 127}
need |= {int(m, 16) for m in re.findall(r'\\u([0-9a-fA-F]{4})', s)}
need |= {int(m, 16) for m in re.findall(r'\\u\{([0-9a-fA-F]+)\}', s)}
need |= {int(m, 16) for m in re.findall(r'\\x([0-9a-fA-F]{2})', s)}
for e in set(re.findall(r'&#?\w+;', s)):
    u = html.unescape(e)
    need |= {ord(c) for c in u}
need |= {0xa0, 0xad, 0x2009, 0x202f, 0x2212, 0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2022, 0x2026}
before = after = 0
rep = []
def sub(m):
    global before, after
    b = m.group(1)
    fam = re.search(r"font-family:\s*'([^']+)'", b).group(1); w = re.search(r'font-weight:\s*(\d+)', b).group(1)
    raw = base64.b64decode(re.search(r'base64,([A-Za-z0-9+/=]+)', m.group(0)).group(1))
    f = TTFont(io.BytesIO(raw), recalcTimestamp=False); cm = f.getBestCmap()
    keep = sorted(u for u in need if u in cm)
    opts = Options(); opts.flavor = 'woff2'; opts.layout_features = FEATURES; opts.notdef_outline = True
    opts.name_IDs = [1, 2]; opts.hinting = False; opts.glyph_names = False; opts.legacy_kern = True; opts.drop_tables += ['DSIG']
    sb = Subsetter(opts); sb.populate(unicodes=keep); sb.subset(f)
    out = io.BytesIO(); f.flavor = 'woff2'; f.save(out); nb = out.getvalue()
    before += len(raw); after += len(nb)
    rep.append('%s %s: %d -> %d bytes, %d characters kept (of %d in the font)' % (fam, w, len(raw), len(nb), len(keep), len(cm)))
    return m.group(0).replace(re.search(r'base64,([A-Za-z0-9+/=]+)', m.group(0)).group(1), base64.b64encode(nb).decode())
s2 = re.sub(r'@font-face\s*\{(.*?)\}', sub, s, flags=re.S)
open(dst, 'w', encoding='utf-8').write(s2)
print('fonts: %d -> %d bytes of font data (file %d -> %d)' % (before, after, len(s), len(s2)))
if len(sys.argv) > 3: print('\n'.join(rep))
open('/tmp/claude-0/fontneed.txt', 'w').write(' '.join('%04X' % u for u in sorted(need)))
