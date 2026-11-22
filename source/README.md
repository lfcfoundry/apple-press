# Apple Press source

This folder is the readable source of Apple Press. The game is three files, `wrap-head.html`, `head.html` and `rest.html` (page wrapper, page head and styles/markup/script, all with comments). The files in this folder turn them into the single-file game.

## Which version this is

**This is the 2026.10.24.1419 source snapshot.** The live game (`play/index.html`) is build 2026.10.31.2352. The source files for the last week of changes (Oct 25 to 31) were lost in a shared-folder cleanup and are being re-created from the live page; until that lands, a build from this folder does **not** match the live file byte for byte. See `RECOVERY.md`. For reading the newest logic in the meantime, `live-2026.10.31.2352.formatted.txt` is the live page run through a formatter (shortened variable names, no comments; read-only, not a build input; made by `format-live.js`).

## Build

Needs Node 22 or newer, Python 3.9 or newer with `zopfli` (`pip install zopfli fonttools brotli`).

```
cd source
npm ci            # or: npm install
STAMP=2026.10.24.1419 ./build.sh     # leave STAMP out to stamp the current US Eastern time
```

Output goes to `source/out/`: `apple-press.html` (player copy), `apple-press-small.html` (gzip self-extracting copy), `apple-press-full.html` (readable, unminified) and `version.txt`. Set `LZMA=1` to also build `apple-press-smallest.html` (needs the lzma-pack tool from [JS-modules](https://github.com/lfcfoundry/JS-modules) `tools/lzma-pack/`; the copy bundled here is newer than the one used for the live page, so the output may differ).

Edit only `wrap-head.html`, `head.html` and `rest.html`, never the built files. The three files are kept Latin-1 only (no characters above U+00FF), as the pre-commit hook requires.

## What is here

| File | What it does |
|---|---|
| `wrap-head.html`, `head.html`, `rest.html` | The game |
| `build.sh` | Joins the three, stamps the version, minifies, packs |
| `slim.js`, `optfonts.py`, `optsvg.js` | Minify page, trim fonts to the characters used, tighten inline SVG |
| `lfc_inject.py`, `lfc-header.txt` | Put the LFC Foundry notice back after minifying |
| `latin1.py` | Copy of JS-modules `single-file-tools/latin1.py` |
| `pack.py`, `pack_lzma.py`, `vendor/lzma-pack/` | The two self-extracting small copies |
| `check.js` | Syntax check of the page scripts |

The test suites and picture checks are not in this folder yet (they were part of the lost working folder; the 2026.10.24.1419 snapshot of them is in the private knowledge base).

Copyright (c) 2026 LFC Foundry. MIT License (see `LICENSE` at the top of the repository).
