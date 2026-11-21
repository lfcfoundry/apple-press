<!-- Copyright (c) 2026 LFC Foundry. MIT License. -->
# Apple Press distribution and first-use qualification

**Baseline:** public distribution repository main `5fcfd20` (2026-10-31). Read `README.md`, `PLAYTEST-CARD.md`, `speedtest.html`, and `tools/check_play.py` before work.

## Scope and limits

This checkout contains the shipped HTML files and a few checks, not the readable game source or the owner’s full QA harness. Treat this as a black-box distribution and first-use study. Do not edit generated HTML, reverse-engineer hidden game content, or propose a source change from this repository alone. If a measured problem needs a code fix, obtain the authorized source/QA workspace first.

## Test matrix

Compare `index.html`, `apple-press-small.html`, and `apple-press-smallest.html`. Record byte size, cold open, time until the first usable screen, and time until the first tap response. Keep network transfer, decompression, script evaluation, first draw, and interaction separate where the supplied harness can observe them.

| Dimension | Cases |
|---|---|
| Browser state | Fresh profile, warm cache, offline after the file is available, hosted HTTPS, and local file open. Record origin and cache state. |
| Device | Narrow phone, large phone/tablet, desktop; record browser version, viewport, DPR, OS, and input method. Do not pool devices. |
| Copy | Full, small, smallest. Verify all are the same game state and controls before comparing startup. |
| Save state | Empty, ordinary synthetic progress, older documented save, exported save code round trip, and storage denied/quota failure if supported by the existing check page. Never use a child’s real save. |
| First session | Cold open, first tap, open/close a public panel, return to play, reload and restore. Record errors and long tasks. |
| Repeat session | Warm reload, idle after opening, and a bounded play interval. Compare memory before/after without turning one sample into a leak claim. |

Use the existing playtest card for observed child usability; do not collect names, faces, story answers, or unnecessary personal details. Keep those observations separate from timing results.

## Assertions and decision

All three copies must open offline, accept the same supported save, and preserve progress through reload. A blocked-storage message must be clear and must not imply that progress was saved. Public copy, features, calm/no-pressure rules, and privacy behavior are fixed controls. Report raw timings and p50/p90 per browser/device. Do not recommend a copy as universally fastest from one machine.

The result should be one of: no issue reproduced; a specific distribution copy is measurably slow; or source-level diagnosis is blocked because this checkout lacks source and QA scripts. List exact commands, files, browser versions, and evidence. No release or player-facing copy change is authorized by this test design.
