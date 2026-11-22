# Apple Press source

This folder is the readable source of Apple Press. The game is three files, `wrap-head.html`, `head.html` and `rest.html` (page wrapper, page head and styles/markup/script, all with comments). The files in this folder turn them into the single-file game.

## Which version this is

**This is the source of the live build, 2026.10.31.2352.** It was re-created on 2026-11-22: the 2026.10.24.1419 source plus the Oct 25 to 31 changes (crash-safe saves with save-kit 1.4.0, the resting scene, the smaller curtain buffers, the split scene-layer build, the sticker-book copy trimming, the sideways-scroll fix and the plain-characters pass), checked against the live page.

A build from here is **not byte for byte** the live page: it is 5 bytes smaller (747,462 against 747,467), because the live page's sticker-book function was written with different short local names. Comparing the code structure of the two (every script token, with short names ignored) shows no other difference. Screenshots of the live page and a build from here match in Firefox 158.0, ungoogled Chromium 156 and WebKitGTK 2.52.6 (the sticker book 100%; the game screen within the live page's own run-to-run noise). Details: `RECOVERY.md`. The earlier private source (with the QA suites) is in the private knowledge base up to 2026.10.24.1419.

## Build

Needs Node 22 or newer, Python 3.9 or newer with `zopfli` (`pip install zopfli fonttools brotli`).

```
cd source
npm ci            # or: npm install
./build.sh     # stamps the build time (US Eastern); STAMP=2026.10.31.2352 ./build.sh only to compare with the live page
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
| `vendor/save-kit.js` | The save-kit 1.4.0 lean build that is pasted into `rest.html` (section on saving) |

The test suites and picture checks are not in this folder (they are in the private knowledge base at the 2026.10.24.1419 snapshot).

Copyright (c) 2026 LFC Foundry. MIT License (see `LICENSE` at the top of the repository).
