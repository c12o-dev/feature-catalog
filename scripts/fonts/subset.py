"""Step 2 of the font subsetting pipeline: build slices from glyphs.json.

Fontsource ships each Japanese face as ~120 unicode-range slices cut for general text, so a
page here pulled 40-60 of them (550-790 KB). This rebuilds each face from those slices and
re-slices it around this site's own text.

Only headings are self-hosted (Shippori Mincho) plus the mono index figures; body text is the
platform font, so the sets are small.

Mincho is cut per page group, and a group's file holds everything its pages need beyond the
common slice (characters may repeat across groups). Each group is its own font family —
"Shippori Mincho B1 c-forms" — and a page points `--font-serif` at its group's family first,
then the base family (src/lib/fonts.ts), so a page loads exactly: common + its group + mono.
  common   characters on >= 30% of pages, plus ASCII and basic punctuation   (base family)
  home     the home page                                                     (own family)
  hub      /categories, /goals, 404                                          (own family)
  g-<slug> each goal theme page                                              (own family)
  c-<slug> each category page with its /p/* pages                            (own family)
  rest     what only ⌘K / X-ray still need                                   (base family)
The mono face keeps exclusive slices (it is font-display: optional, so scatter costs nothing
visible).

Output (committed): assets/fonts/*.woff2, fonts.css, charset.json (per face), manifest.json (per slice)
Usage: python3 scripts/fonts/subset.py   (needs fonttools + brotli; run collect-glyphs.mjs first)
"""

import glob
import json
import os
import re
from collections import defaultdict

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "assets", "fonts")
NM = os.path.join(ROOT, "node_modules")

FACES = {
    # key in glyphs.json: (css family, weight, slice glob, font-display)
    # Both faces are font-display: optional, so nothing ever shifts after first paint; every page
    # preloads exactly the slices its headings need (src/lib/fonts.ts), so on all but the slowest
    # first visits they are in hand before render. The fallback face below carries Shippori's
    # vertical metrics for the case where the platform Mincho is used instead.
    "mincho-700": ("Shippori Mincho B1", "700", "@fontsource/shippori-mincho-b1/files/shippori-mincho-b1-*-700-normal.woff2", "optional"),
    # The shell uses mono at 400-600 only; the axis is narrowed to that range below.
    "mono": ("JetBrains Mono Variable", "400 600", "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "optional"),
}
# Local faces that stand in while Shippori loads, with its hhea metrics (1160 / -288 / 0 per 1000).
MINCHO_FALLBACK = (
    "@font-face{font-family:'Shippori Mincho B1 Fallback';"
    "src:local('Hiragino Mincho ProN W6'),local('Hiragino Mincho ProN'),local('Yu Mincho'),local('YuMincho'),"
    "local('Noto Serif CJK JP'),local('Noto Serif JP'),local('DejaVu Serif');"
    "ascent-override:116%;descent-override:28.8%;line-gap-override:0%}"
)
ALWAYS = "".join(chr(c) for c in range(0x20, 0x7F)) + "、。，．・：；？！ー〜「」『』（）［］【】〈〉《》…‥—–‐“”‘’§·→←↑↓×＋－／％　"
COMMON_SHARE = 0.3


def consumer_of(route, cats):
    if route == "/":
        return "home"
    m = re.match(r"^/c/([^/]+)$", route)
    if m:
        return f"c-{m.group(1)}"
    m = re.match(r"^/p/([^/]+)$", route)
    if m:
        return f"c-{cats[m.group(1)]}"
    m = re.match(r"^/g/([^/]+)$", route)
    if m:
        return f"g-{m.group(1)}"
    return "hub"


def plan_slices(real, extra, drawable, cats):
    """Fixed page-group slices, claimed in priority order; returns {slice name: chars}.

    A shared-slice optimiser (greedy merge on per-character usage signatures) did worse here:
    a category page's text spans many groups, so every page still pulled ~190 KB. Exact
    per-page subsets would meet the budget but need ~10 MB of generated fonts; see
    docs/qa/remaining.md.
    """
    n = max(1, len(real))
    freq = defaultdict(int)
    for chars in real.values():
        for ch in chars:
            freq[ch] += 1
    groups = defaultdict(set)
    taken = set()

    def claim(name, chars):
        new = set(chars) - taken
        groups[name] |= new
        taken.update(new)

    claim("common", ({c for c, k in freq.items() if k >= COMMON_SHARE * n} | set(ALWAYS)) & drawable)
    claim("home", real.get("/", set()))
    # what's left goes to the category whose pages use it most
    votes = defaultdict(lambda: defaultdict(int))
    for route, chars in real.items():
        c = consumer_of(route, cats)
        if c.startswith("c-"):
            for ch in chars - taken:
                votes[ch][c] += 1
    for ch, v in votes.items():
        claim(max(sorted(v), key=v.get), {ch})
    claim("rest", extra | set().union(*real.values()))
    return {k: v for k, v in groups.items() if v}


def plan_groups(real, extra, drawable, cats):
    """Mincho: one non-exclusive file per page group on top of a shared common slice."""
    n = max(1, len(real))
    freq = defaultdict(int)
    for chars in real.values():
        for ch in chars:
            freq[ch] += 1
    common = ({c for c, k in freq.items() if k >= COMMON_SHARE * n} | set(ALWAYS)) & drawable
    groups = defaultdict(set)
    for route, chars in real.items():
        c = consumer_of(route, cats)
        groups[c] |= chars - common
    rest = extra - common - set().union(*groups.values())
    out = {"common": common, **{k: v for k, v in groups.items() if v}}
    if rest:
        out["rest"] = rest
    return out


# Groups that are their own font family (see module docstring); the others join the base family.
def family_for(family, group):
    return family if group in ("common", "rest") else f"{family} {group}"


def pattern_categories():
    """slug → category slug, read from the category source file."""
    src = open(os.path.join(ROOT, "src", "data", "categories.ts"), encoding="utf8").read()
    out, current = {}, None
    for line in src.splitlines():
        m = re.search(r'^\s{4}slug: "([^"]+)"', line)
        if m:
            current = m.group(1)
        m = re.search(r'\{ slug: "([^"]+)", name:', line)
        if m and current:
            out[m.group(1)] = current
    return out


def load_face(pattern):
    """Returns a path to a single TTF holding the whole face (slices merged)."""
    files = sorted(glob.glob(os.path.join(NM, pattern)))
    path = os.path.join(OUT, ".tmp-face.ttf")
    if len(files) == 1:
        font = TTFont(files[0])
        if "fvar" in font:
            font = instancer.instantiateVariableFont(font, {"wght": (400, 600)})
        font.flavor = None
        font.save(path)
        return path
    tmp = []
    for i, f in enumerate(files):
        t = TTFont(f)
        t.flavor = None
        p = os.path.join(OUT, f".tmp-{i}.ttf")
        t.save(p)
        tmp.append(p)
    merged = Merger().merge(tmp)
    for p in tmp:
        os.remove(p)
    merged.save(path)
    return path


def cmap_chars(font):
    return {chr(cp) for cp in font.getBestCmap()}


def ranges(chars):
    cps = sorted(ord(c) for c in chars)
    out, start, prev = [], None, None
    for cp in cps + [None]:
        if start is None:
            start = prev = cp
        elif cp is not None and cp == prev + 1:
            prev = cp
        else:
            out.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
            start = prev = cp
    return ", ".join(out)


def og_text():
    """Every character an OG image can show: catalog names, descriptions, themes, plus fixed strings."""
    src = ""
    for name in ("categories.ts", "goals.ts"):
        src += open(os.path.join(ROOT, "src", "data", name), encoding="utf8").read()
    return set(src) | set(ALWAYS) | set("§·—Feature Catalog")


def build_og_fonts():
    """One woff per face for the build-time OG images (Satori can't read woff2 and handles one font
    per family best). Written to assets/fonts/og/, read by src/lib/og.tsx; not served."""
    og = os.path.join(OUT, "og")
    os.makedirs(og, exist_ok=True)
    text = "".join(sorted(og_text()))
    drawn = None
    for name, pattern in (
        ("shippori-700", "@fontsource/shippori-mincho-b1/files/shippori-mincho-b1-*-700-normal.woff2"),
        ("zen-400", "@fontsource/zen-kaku-gothic-new/files/zen-kaku-gothic-new-*-400-normal.woff2"),
    ):
        face_path = load_face(pattern)
        opts = subset.Options()
        opts.flavor = "woff"
        opts.layout_features = ["palt", "kern", "liga"]
        opts.name_IDs = ["*"]
        f = TTFont(face_path)
        sub = subset.Subsetter(opts)
        sub.populate(text=text)
        sub.subset(f)
        f.flavor = "woff"
        drawable = "".join(sorted(chr(cp) for cp in f.getBestCmap()))
        out = os.path.join(og, f"{name}.woff")
        f.save(out)
        os.remove(face_path)
        print(f"{'og/' + name + '.woff':52s} {os.path.getsize(out) / 1024:7.1f} KB")
        drawn = drawn & set(drawable) if drawn is not None else set(drawable)
    # characters both faces can draw; og.tsx swaps anything else for a middle dot
    json.dump("".join(sorted(drawn)), open(os.path.join(og, "charset.json"), "w", encoding="utf8"), ensure_ascii=False)


def main():
    os.makedirs(OUT, exist_ok=True)
    for f in glob.glob(os.path.join(OUT, "*")):
        if os.path.isfile(f):
            os.remove(f)
    glyphs = json.load(open(os.path.join(ROOT, "scripts", "fonts", "glyphs.json"), encoding="utf8"))
    cats = pattern_categories()
    css = ["/* generated by scripts/fonts/subset.py — do not edit */"]
    charset = {}
    manifest = {}  # slice file → its characters, for per-page <link rel=preload> (src/lib/fonts.ts)
    report = []

    css.append(MINCHO_FALLBACK)
    for key, (family, weight, pattern, display) in FACES.items():
        pages = glyphs.get(key, {})
        face_path = load_face(pattern)
        drawable = cmap_chars(TTFont(face_path))
        real = {r: set(t) & drawable for r, t in pages.items() if not r.startswith("@")}
        extra = set().union(*[set(t) for r, t in pages.items() if r.startswith("@")]) & drawable if pages else set()
        groups = plan_groups(real, extra, drawable, cats) if key.startswith("mincho") else plan_slices(real, extra, drawable, cats)
        taken = set().union(*groups.values())
        charset[key] = "".join(sorted(taken))

        base = family.lower().replace(" ", "-")
        for name, chars in sorted(groups.items()):
            if not chars:
                continue
            opts = subset.Options()
            opts.flavor = "woff2"
            opts.layout_features = ["palt", "kern", "liga", "calt"]
            opts.name_IDs = ["*"]
            opts.notdef_outline = True
            sub = subset.Subsetter(opts)
            f = TTFont(face_path)
            sub.populate(text="".join(chars))
            sub.subset(f)
            f.flavor = "woff2"
            fname = f"{base}-{name}.woff2"
            f.save(os.path.join(OUT, fname))
            size = os.path.getsize(os.path.join(OUT, fname))
            manifest[fname] = "".join(sorted(chars))
            report.append((fname, len(chars), size))
            css.append(
                "@font-face{"
                f"font-family:'{family_for(family, name) if key.startswith('mincho') else family}';font-style:normal;font-display:{display};font-weight:{weight};"
                f"src:url(/fonts/{fname}) format('woff2');unicode-range:{ranges(chars)}"
                "}"
            )
        os.remove(face_path)

    open(os.path.join(OUT, "fonts.css"), "w", encoding="utf8").write("\n".join(css) + "\n")
    build_og_fonts()
    json.dump(charset, open(os.path.join(OUT, "charset.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
    total = 0
    for fname, count, size in report:
        total += size
        print(f"{fname:52s} {count:5d} chars {size / 1024:7.1f} KB")
    print(f"total {total / 1024:.0f} KB in {len(report)} files")


if __name__ == "__main__":
    main()
