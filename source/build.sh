#!/bin/bash
# Builds the three downloadable copies of Apple Press into ./out
#   out/apple-press.html           the player copy (same as play/index.html)
#   out/apple-press-small.html     gzip self-extracting copy
#   out/apple-press-smallest.html  LZMA self-extracting copy
# Needs: node 22+, npm install (here), python3 with zopfli.   Usage: [STAMP=2026.10.31.2352] ./build.sh
cd "$(dirname "$0")"
mkdir -p out
APV=${STAMP:-$(TZ=America/New_York date +%Y.%m.%d.%H%M)}   # version stamp: build time in US Eastern
echo "$APV" > out/version.txt
{ cat wrap-head.html head.html rest.html; printf '\n</body>\n</html>\n'; } | sed "s/__APV__/$APV/g" > out/apple-press-full.html   # readable copy
node slim.js out/apple-press-full.html out/apple-press.html     # minify
python3 lfc_inject.py out/apple-press.html head                  # put the LFC Foundry notice back
python3 latin1.py out/apple-press.html out/apple-press.html      # Latin-1 only (see tools/hooks)
python3 pack.py out/apple-press.html out/apple-press-small.html
[ -n "$LZMA" ] && python3 pack_lzma.py out/apple-press.html out/apple-press-smallest.html   # optional, see README
ls -l out
