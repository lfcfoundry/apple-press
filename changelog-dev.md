# Apple Press developer changelog

What changed on each date, newest first, for developers, in three depths: **Quick** (what changed), **Details** (what each change did, with the test browsers named where measured) and **Deep** (the full entry: reasons, numbers, tests). People who just play read [changelog.md](changelog.md). The game's source is private; this file describes the shipped single file.

## 2026-10-31 · build 2026.10.31.1627

### Quick

`velvetPainter` drops its working pixel buffers (`img`, `core`, the worker job's `buf`) as soon as the painting is done; only the canvas is kept. Invisible.

### Details

- **Changed.** Two lines: when a half-curtain finishes (worker path and page path) `img`, `core` and `job.buf` are set to null. `step()` returns early once `done`, so nothing reads them afterwards; `mirrorCanvas` only uses the canvas.
- Heap snapshot, ungoogled Chromium 155.0.8059.39-1, 900x800, after 30 taps and 15 s: four 1,459,200-byte ArrayBuffers kept before, none after (about 8.3 MB at a real window size, per round 26).
- Curtain flow (1,100 presses to the stage change) in Chromium, Firefox 158.0 and WebKitGTK 2.52.6: the same canvases appear before and after, no page errors.
- Sizes: play 746,516 to 746,569 bytes, small 295,211 to 295,288, smallest 210,844 to 210,909.

### Deep

- Tried and dropped in the same round: caching the press handler's two `getBoundingClientRect()` reads (round 25): 88.8 vs 87.7 ms busy per press, noise; removing every style rule that matches nothing at start (604 of 1,076): 597 vs 668 ms layout plus style, no gain. The animation object in the orbit code was already cached.

## 2026-10-31 · build 2026.10.31.1550

### Quick

The apple rests too: the `data-rest` pause rule now also covers `.apple`, `.bob`, `.aura` and `.golden` (apple animations and golden sparkles). Same trigger and wake as before.

### Details

- **Changed.** One selector group added to the existing `data-rest` rule; no script change. Retro mode still excluded.
- Ungoogled Chromium 155.0.8059.39-1, built file, 1280x800, 5 s resting window, 3 runs each: busy ms/s 133, 118, 119 to 67, 62, 62 (injected rule), 67, 57, 63 (built file). Running animations while resting: aura, bob, wiggle, glint, blink or licklips to none.
- Firefox 158.0 and WebKitGTK 2.52.6: rest leaves zero running animations (14 to 20 running before); a real input wakes it (Chromium).
- Sizes: play 746,240 to 746,516 bytes, small 295,252 to 295,211, smallest 210,797 to 210,844.

### Deep

- Tried and dropped in the same round (no gain): `content-visibility:auto` on the footer and legal block (650 vs 664 ms layout plus style), `contain: layout style paint` on the scene (656), both (686); the hidden sections are already `display:none`. Scene-layer build split (PR 42) closed: no clear gain on the laptop.
- Gotcha: the first-time tour (a `dialog[open]`) opens by itself and keeps the page resting, so a wake test must close it first.

## 2026-10-31 · build 2026.10.31.1330

### Quick

Saves are crash-safe: save-kit 1.4.0 (lean build) with `durable: true` keeps each save in IndexedDB too; after `load()` the game calls `kit.recover()` and restarts once from a newer copy. Only happens after a crash or kill.

### Details

- **Changed.** Vendored save-kit 1.2.1 lean to 1.4.0 lean (same cut list, `durable` kept; 20,116 to 36,243 bytes before the build's squeeze). `recover()` runs right after the first `load()`. If it returns a save, saving is switched off, a one-time session flag is set and the page reloads, so every part of the game starts from the recovered save; the flag prevents any loop. Test and preview builds skip it.
- Hard-kill test (ungoogled Chromium 155.0.8059.39-1, 60 taps, count about 92.7): kill 3 s after: 16.10 to 92.75; kill 15 s after: 20.11 to 92.76 (kept).
- Sizes: play 739,263 to 746,240 bytes (+0.9%), small 292,404 to 295,252, smallest 209,035 to 210,797.

### Deep

- **Changed.** A bug found on the way: without switching saving off before the reload, the page closing (pagehide) wrote its older in-memory progress over the recovered save and the loss came back. Start-up in Chromium, 15 fresh loads each, noisy (spread about 100 ms): rest-only build 445 ms median, with the safety copy 451 ms (+1.5%, inside the noise). Firefox 158.0: inconclusive, because the old build also kept everything at a 3 s kill in that headless profile (round 18 saw losses only at 10 s). WebKitGTK 2.52.6: not run, its test sessions cannot keep a profile.

## 2026-10-31 · build 2026.10.31.0840

### Quick

The scene rests: `data-rest="on"` on the page pauses the scene, scene layers and petals after 30 s with no input or while any dialog is open. Any pointer, key, wheel or touch input wakes it (unless a dialog is open).

### Details

- **Changed.** One new style rule (same pause list as the slow-device rule, plus the petals) and a 30-line script: input listeners (passive) set a timestamp; a 1 s timer sets or clears the attribute. Retro mode is excluded as for the other holds.
- Chromium, 1280x800, busy main-thread ms per second: tour open, 4 s: 316 to 209; tour open after 38 s: 306 to 178; tour closed after 34 s with no input: 388 to 244 (style work 97 to 28). One mouse move wakes it (372, as before).
- Size: play +665 bytes, small +196, smallest +71.

### Deep

- **Changed.** Why a timer and not a per-frame check: the 1 s interval costs nothing measurable; a per-frame check would add an animation-frame callback, which is what the round-13 idle study tried to remove. Why dialogs count: the first-time tour and the Grown-ups door dim the whole scene, so nothing behind them is readable. The Chromium run used software drawing, so absolute numbers on a phone with a graphics chip will differ; the direction is the point. Checked in ungoogled Chromium 155.0.8059.39-1 (numbers above, rerun there: tour closed, no input 34 s, 359 to 271 ms busy per second, style 93 to 32), Firefox 158.0 (60 animations running awake, 7 resting, 4 with the tour open, all back to about 60 on a mouse move) and WebKitGTK 2.52.6 (the switch turns on and off correctly; its own slow-device guard had already paused the scene in that software-drawn run, so the animation counts match the build before). With the scene resting, what is left is the apple's own idle animations (20 running: bob, wiggle, glint, aura, spin, 8 sparkles) and drawing work, with 9 ms per second of script. It is a look change (a frozen scene while nobody plays), so it ships only on the owner's OK.

## 2026-10-29 · build 2026.10.29.2010

### Quick

Landing look merged (PR 36, merge 8d52366): README top and new about.html with title text, logo, phone-first screenshots (five new phone shots, one desktop), upgrade cards with the game's pointer and clock icons, six first-adventure stages  (+2 more changes)

### Details

- **Docs.** Landing look merged (PR 36, merge 8d52366): README top and new about.html with title text, logo, phone-first screenshots (five new phone shots, one desktop), upgrade cards with the game's pointer and clock icons, six first-adventure stages (hidden look not named), Safe, free and open list (no ads, accounts, data sent, microtransactions, install or admin rights; offline once open or saved; single player; open source; 
- **Fixed.** 1-pixel sideways scroll in WebKitGTK 2.52.6 at 768 px wide: the scene (scale 1.05 inside .scene, overflow hidden) still counted as 1 px of page overflow although body already had overflow-x: clip. Added `html { overflow-x: clip; }` (probe in WebKitGTK: only html, .apple-wrap, .layout and main clips fixed it; scene-only clips did not). Build 2026.10.29.2010.
- **Docs.** README facts corrected (PR 35): the Grown-ups door sentence no longer lists Save & load (open at once since 2026-10-23), the speed paragraph names the build it was measured on, and the shared-code list now includes the door, tour, hidden speed and error buttons and the slow-moment note. Game files unchanged.

### Deep

- **Docs.** Landing look merged (PR 36, merge 8d52366): README top and new about.html with title text, logo, phone-first screenshots (five new phone shots, one desktop), upgrade cards with the game's pointer and clock icons, six first-adventure stages (hidden look not named), Safe, free and open list (no ads, accounts, data sent, microtransactions, install or admin rights; offline once open or saved; single player; open source; most standard screens), no-sound and first-time-tour features, three bar charts with labels outside short bars. Checked in Chromium 155, Firefox 158.0 and WebKitGTK 2.52.6; images checked by eye for personal names (none).
- **Fixed.** 1-pixel sideways scroll in WebKitGTK 2.52.6 at 768 px wide: the scene (scale 1.05 inside .scene, overflow hidden) still counted as 1 px of page overflow although body already had overflow-x: clip. Added `html { overflow-x: clip; }` (probe in WebKitGTK: only html, .apple-wrap, .layout and main clips fixed it; scene-only clips did not). Build 2026.10.29.2010. Evidence: scrollWidth 769 of 768 before, 768 of 768 after; widths 412, 768, 1024, 1920 in all three browsers have no sideways scroll; picture check (check35, animation frozen, old-vs-old2 motion masked, 12 screens per browser) worst 99.949% Chromium, 99.955% Firefox, 99.955% WebKitGTK, all differing pixels are the footer version stamp; real scroll 400 frames (closed tour): Chromium 6,650 vs 6,650 ms, Firefox 6,650 vs 6,650, WebKitGTK 10,155 vs 10,001 (+1.5%); qa.sh smart 29 passed 0 failed in Chromium. Sizes: player 738,598 (was 738,577), small 292,208 (was 292,196), smallest 208,964 (was 208,945).
- **Docs.** README facts corrected (PR 35): the Grown-ups door sentence no longer lists Save & load (open at once since 2026-10-23), the speed paragraph names the build it was measured on, and the shared-code list now includes the door, tour, hidden speed and error buttons and the slow-moment note. Game files unchanged.

## 2026-10-24 · build 2026.10.23.2114

### Quick

The Grown-ups door and the first-time tour now run on the shared JS-modules code (grown-ups-door 1.0.0 and spotlight-tour 1.1.1) instead of the game's own copies; the look, texts, art, storage keys (apple-press-tour, apple-press-tourgift) a (+2 more changes)

### Details

- **Changed.** The Grown-ups door and the first-time tour now run on the shared JS-modules code (grown-ups-door 1.0.0 and spotlight-tour 1.1.1) instead of the game's own copies; the look, texts, art, storage keys (apple-press-tour, apple-press-tourgift) and the test ids (door, doorHold, doorPick, doorBask, tourNext and the rest) are kept, and a few rules restyle the modules to the game's own panel colors.
- **Checks.** New game-rule fuzz test (fuzz-kit 1.3.3 adapter, test copy only, nothing ships): 40 seeds x 700 random operations per browser (28,000), half the seeds leaving some operations out, in Firefox 158.0, ungoogled Chromium 155.0.8059.39-1 and WebKitGTK 2.52.6: 0 findings in all three (173, 124 and 361 s).
- **Changed.** On a slow device the background scene now holds still for good. When the frame-rate check (perfWatch, under 36 FPS for two 3-second windows) steps the effects down to Lite by itself, it also sets data-slow=on on the page, and a rule pauses the scene's animations (#sceneSvg and the scene-lift layers). Picking an Effects setting by hand removes it. Fast devices never set the flag, so they run exactly the old code.

### Deep

- **Changed.** The Grown-ups door and the first-time tour now run on the shared JS-modules code (grown-ups-door 1.0.0 and spotlight-tour 1.1.1) instead of the game's own copies; the look, texts, art, storage keys (apple-press-tour, apple-press-tourgift) and the test ids (door, doorHold, doorPick, doorBask, tourNext and the rest) are kept, and a few rules restyle the modules to the game's own panel colors. Start over and the links to other sites still ask for the hold and drag; Save & load still opens at once; the pass still lasts two minutes (the game never forgot it earlier, so no lock call was needed). The tour's bright window is kept on left/top so its edges land on the same pixels as before. Picture comparison against the previous build (29 screens per browser: all 19 tour steps, door at rest, held, picked up and passed for the Start over button and for a link; pixels within 8 of 255 counted as the same; live-motion areas masked): worst screen 99.52% in ungoogled Chromium 155.0.8059.39-1, 99.56% in Firefox 158.0, 99.57% in WebKitGTK 2.52.6 (WebKitGTK run with the scene's own animation frozen, because its moving background alone differs 5% between two runs of the same old build). Scrolling (420 frames, median of 5 loads; WebKitGTK 150 frames), tour closed: Chromium 6,783 ms against 6,850, Firefox 6,650 against 6,650, WebKitGTK 14,301 against 14,325; tour open: Chromium 7,050 against 6,933 (+1.7%), Firefox equal, WebKitGTK 26,980 against 30,345. Spotlight-tour 1.1.0 was tried first and ran its scroll handler even while closed (Chromium 139 ms against 82 ms per 20,000 scroll events); JS-modules fixed it in 1.1.1 on request. Full set (29 checks) passed in Chromium, third_a on its known retry. Player copy 738,577 bytes (was 728,225), small 292,196, smallest 208,945.
- **Checks.** New game-rule fuzz test (fuzz-kit 1.3.3 adapter, test copy only, nothing ships): 40 seeds x 700 random operations per browser (28,000), half the seeds leaving some operations out, in Firefox 158.0, ungoogled Chromium 155.0.8059.39-1 and WebKitGTK 2.52.6: 0 findings in all three (173, 124 and 361 s). Operations: tap, tap bursts, add apples, buy upgrades, jump and walk stages, let time pass, click buttons, keys, save-code round trip, give credits, restart from the ending (fresh or keep). Rules: no negative or non-finite numbers, apples in hand not above the lifetime total, stage not backward within a run, whole-number upgrade counts, save code round trip equal, restart rules (one more run, upgrades cleared, credits and keeps), no NaN text. Sensitivity: a planted upgrade-count bug was found in 5 of 10 seeds within 47 operations; a planted restart bug (credits surviving a fresh start) in 10 of 20. One false alarm in WebKitGTK (3 seeds) was my filter missing the ending's Start again buttons; rule fixed. Adapter and README in the public repo under tools/fuzz; the test page is built from the private source (mkfz2.py, in /mnt/project-files/apple-press/fuzz-test/).
- **Changed.** On a slow device the background scene now holds still for good. When the frame-rate check (perfWatch, under 36 FPS for two 3-second windows) steps the effects down to Lite by itself, it also sets data-slow=on on the page, and a rule pauses the scene's animations (#sceneSvg and the scene-lift layers). Picking an Effects setting by hand removes it. Fast devices never set the flag, so they run exactly the old code. Owner approved on a card (pause scene when slow). Measured with Chromium's processor slowed 4x (midrange-phone speed), tapping at stage 5M after a 9 s warm-up, higher FPS is better: 25.2 to 28.7 FPS (+14%), 26.2 to 28.6 in the first run (+9%). WebKitGTK (about 26 FPS here, so the check triggers): 26.1 to 26.5, no gain (its scene already holds still during a combo). Firefox (about 90 FPS, never triggers): 94.9 to 88.8 in one run, then 69.6 to 68.9 in a second, noise (identical code path). Chromium at full speed 119.8 to 120.2 FPS. Picture gate at full speed (old build 1554 vs new, 5 states x 2 views): 0 differing pixels outside the live counter in Firefox and WebKitGTK (100%); Chromium 0 in every state except 97 of 354,320 in one animation-paused view (99.97%). Full check set in Chromium: 29 passed, 0 failed. Sizes: regular 727,999 to 728,225 bytes (+226). Build 2026.10.23.2114. GNOME Web no longer tested (owner rule 2026-10-24).

## 2026-10-23 · build 2026.10.23.0741

### Quick

Hidden speed and error buttons (rule: every game has them), from the shared field-report 1.0.2 (JS-modules): five quick taps in the top-left corner open a small panel with Save speed report (start-up, FPS, slowest 1% of frames, slowest fram (+5 more changes)

### Details

- **Added.** Hidden speed and error buttons (rule: every game has them), from the shared field-report 1.0.2 (JS-modules): five quick taps in the top-left corner open a small panel with Save speed report (start-up, FPS, slowest 1% of frames, slowest frames, heavy tasks, plain verdict, with a mark for the first game frame) and Save error log (errors, rejected promises, files that failed to load, page-policy blocks, console errors a
- **Changed.** The title logo is on its own layer (`.logo{transform:translateZ(0)}`) so its stacked text shadows are no longer repainted on every tap. Found by taking each shadow area off one at a time in WebKitGTK; layering the header, HUD or shop gave nothing.
- **Fixed.** Fix for the WebKit outline change (PR 25): the build tool rewrote the WebKit-only test `-webkit-hyphens:none` into `hyphens:none`, which Chromium also passes, so Chromium drew the new one-stroke outline too (popup scene differed about 3% from before). The test is now `-webkit-line-box-contain:block`, which survives the build (true in WebKitGTK and GNOME Web only).
- **Checks.** extras (save-version tests) no longer flaky: the first game's saved game is read out and handed to the next pages by their own start-up script instead of travelling through the browser's storage between pages, plus a new check that the first game wrote a save (25 checks, was 24). Failed runs of the file alone: old 4 of 12, after the wait change 2 of 15, now 0 of 15.
- **Changed.** WebKit browsers (Safari, WebKitGTK, GNOME Web) now draw the floating +N numbers and combo words with one 4 px text outline instead of about ten stacked text shadows, the same look change the owner approved for Firefox in PR 11 (rule switch: @supports (-webkit-hyphens:none), true in WebKit only).
- **Checks.** Fixed waits turned into real conditions: extras (12 waits of 1.2 s after page load now wait for the first-game-frame signal) 18.5 to 9.0 s per run in Chromium (12 of 12 pass); rmotion (1.2 s load wait and two 2.5 s card waits now wait for the card to open/close) 10.2 to 6.6 s, output identical.

### Deep

- **Added.** Hidden speed and error buttons (rule: every game has them), from the shared field-report 1.0.2 (JS-modules): five quick taps in the top-left corner open a small panel with Save speed report (start-up, FPS, slowest 1% of frames, slowest frames, heavy tasks, plain verdict, with a mark for the first game frame) and Save error log (errors, rejected promises, files that failed to load, page-policy blocks, console errors and warnings), each saved as one small Markdown file on the device. Nothing is drawn until then, nothing is sent anywhere, and the page looks and plays the same. Our own slow-moment note (Save & load > Copy note) now runs on the shared slow-note 1.0.0 instead of its own copy of that code; same 30-note list, same storage key, same header text. Sizes: regular 713,305 to 727,999 bytes (+14,694, +2.1%), small 279,840 to 286,932 (+7,092, +2.5%), smallest 201,139 to 206,030 (+4,891, +2.4%). Picture gate (old 2026.10.23.0741 vs new, 5 states x 2 views): 0 differing pixels outside the live counter in Chromium, Firefox and WebKitGTK (100%), 7 to 11 of 678,366 in GNOME Web (99.998%). First game frame (median of 9, lower is better): Chromium 104.8 to 104.9 ms, Firefox 103 to 106, WebKitGTK 176 to 171 (GNOME Web run timed out; tapping test below). Tapping FPS at stage 5M (higher is better), alternating pages: Chromium 120.2 to 120.2, WebKitGTK 30.6 to 30.8, GNOME Web 27.5 to 27.1; Firefox is noisy (three 10-rep runs -3.3%, -6.4%, -0.5% and two 16-rep runs +5.4%, -1.1%; mean -1.2%, run-to-run swing about 3 points). Taking the frame watcher out (frames:false) gave no clearer result, so the full report is kept. New check frcheck.js (taps open the panel, both files save and hold the test error, note counts and clears) passes on all three page copies. Full check set in Chromium: 29 passed, 0 failed. Builds 2026.10.23.1554.
- **Changed.** The title logo is on its own layer (`.logo{transform:translateZ(0)}`) so its stacked text shadows are no longer repainted on every tap. Found by taking each shadow area off one at a time in WebKitGTK; layering the header, HUD or shop gave nothing. Tapping FPS at stage 5M, 5 alternating fresh pages (higher is better): WebKitGTK 2.52.6 16.0 to 22.0 (+37%), GNOME Web 46.5 12.6 to 18.6 (+48%), Firefox 158.0 64.9 to 67.5 (noise), Chromium 155 119.8 to 119.8. The earlier 8-page trial in the injected-style harness gave +58% and +66%. Picture gates (first screen and animations paused, 5 stages each): Firefox 0 pixels differ, WebKitGTK and GNOME Web 7 of 747,520 and 7 of 678,366 (99.999%), Chromium 0 except 88 and 101 of 354,320 once each (same as unchanged builds). Full checks 29 of 29. Build 2026.10.23.0741, player copy 713,305 bytes (+24).
- **Fixed.** Fix for the WebKit outline change (PR 25): the build tool rewrote the WebKit-only test `-webkit-hyphens:none` into `hyphens:none`, which Chromium also passes, so Chromium drew the new one-stroke outline too (popup scene differed about 3% from before). The test is now `-webkit-line-box-contain:block`, which survives the build (true in WebKitGTK and GNOME Web only). Checked with a probe in all four browsers: Chromium popups have 8 outline shadows again, Firefox, WebKitGTK and GNOME Web use the stroke. Chromium popup scene back to noise level (98.6% within 8/255, same as two identical runs); static and animation-paused gates 0 pixels differ except 88 of 354,320 once; full checks 29 of 29. Tapping FPS at stage 5M, 3 alternating fresh pages: WebKitGTK 18.7 to 21.0 (+12%), GNOME Web 16.0 to 17.2 (+7%, higher is better); the earlier 5-page run of PR 25 measured +17% and +18%. Lesson: always probe the built page, not the source, when a feature test is a prefixed property. Build 2026.10.23.0057, player copy 713,281 bytes.
- **Checks.** extras (save-version tests) no longer flaky: the first game's saved game is read out and handed to the next pages by their own start-up script instead of travelling through the browser's storage between pages, plus a new check that the first game wrote a save (25 checks, was 24). Failed runs of the file alone: old 4 of 12, after the wait change 2 of 15, now 0 of 15. A copy that hands over version 1 instead of 9 fails 'a save from a newer version still loads, keeps its version, and is flagged'. Golden log updated by that one added line. Full run 29 of 29 (117 s on the restarted machine). Not shipped in the player page.
- **Changed.** WebKit browsers (Safari, WebKitGTK, GNOME Web) now draw the floating +N numbers and combo words with one 4 px text outline instead of about ten stacked text shadows, the same look change the owner approved for Firefox in PR 11 (rule switch: @supports (-webkit-hyphens:none), true in WebKit only). Tapping FPS at stage 5M, median of 5 alternating fresh pages: WebKitGTK 2.52.6 20.9 to 24.4 (+17%, higher is better), GNOME Web 46.5 18.8 to 22.2 (+18%), Firefox 158.0 86.3 to 93.2 (same rules, noise), Chromium 155 120.2 to 120.2. Picture match: first-screen and animations-paused gates 0 pixels differ in all four browsers (5 stages each); a popup-heavy scene differs more in WebKit only (96% of pixels within 8/255 in WebKitGTK and GNOME Web, against about 98% between two identical runs) because the outline corners are smoother. Full checks 29 of 29. Build 2026.10.22.2336, player copy 713,263 bytes (+18).
- **Checks.** Fixed waits turned into real conditions: extras (12 waits of 1.2 s after page load now wait for the first-game-frame signal) 18.5 to 9.0 s per run in Chromium (12 of 12 pass); rmotion (1.2 s load wait and two 2.5 s card waits now wait for the card to open/close) 10.2 to 6.6 s, output identical. A copy of extras that expects a signal the page never gives fails on timeout, a copy expecting wrong panel text fails, and a copy of rmotion that presses 1 time instead of 14 reports 'promotion card opened: false'. Left alone on purpose: promo2 (the 4.5 s hammering window is the test; removing its two waits saved 0.5 s), jade (1.7 s waits sample a flight path over real time), r34 and retro2 (waits let animations and screenshots settle). Full run 29 of 29. extras was also flaky before this change (4 failed runs of 12 on the old file, 2 of 15 on the new one: the save-version tests sometimes start with no saved game); it now waits 150 ms after editing the save before closing the page. Wall time on the restarted machine was 124 s, not comparable with 106 s before (stable took 53.7 s against 33.8 s on a cold machine). Not shipped in the player page.

## 2026-10-22 · build 2026.10.22.2040

### Quick

The after-first-frame scene-layer build (liftBuild) no longer runs as one 12 to 14 ms task: it is three short tasks (size reads, then DOM build, then finish), reads batched before writes, each hidden until done and cancelled if the layers a (+6 more changes)

### Details

- **Changed.** The after-first-frame scene-layer build (liftBuild) no longer runs as one 12 to 14 ms task: it is three short tasks (size reads, then DOM build, then finish), reads batched before writes, each hidden until done and cancelled if the layers are torn down.
- **Changed.** Faster start-up: the first set-up of the curtain painting (update() calling curtainTick() before the first game frame) now waits until the first frame is on screen, in its own short task right after the scene layers.
- **Changed.** Firefox only: the Disco Fever light-beams picture is no longer stored in the file; Firefox now draws it itself, once, in a background worker right after the first game frame (the worker is made from the page's own text, a blob: address, which the page rules already allow).
- **Changed.** Smaller glow behind the combo counter (the "x12 ... HOT COMBO" number). The round glow behind it was drawn in a box about 205% wide and 190% tall of the counter; the box is now half as wide and half as tall (about 51% by 50%), centered on the same spot, so the browser has a quarter of the area to blend on every tap.
- **Changed.** The velvet stage curtains are now painted in a background worker (shared stage-curtains 1.3.0, JS-modules pull request 97) instead of on the page's main thread.
- **Changed.** Firefox only: the two big spinning light-beam layers of Disco Fever (the striped fan under a soft-edged mask) are now one picture made ahead of time and rotated, instead of Firefox redrawing the soft-edge mask on every frame.
- **Changed.** Fewer forced page re-layouts while tapping and moving the mouse.

### Deep

- **Changed.** The after-first-frame scene-layer build (liftBuild) no longer runs as one 12 to 14 ms task: it is three short tasks (size reads, then DOM build, then finish), reads batched before writes, each hidden until done and cancelled if the layers are torn down. Per-task median (max) in ms, 9 runs: Chromium 6.5 (9.0) / 4.4 / 3.5; Firefox 7.0 (10) / 4.0 / 4.0; WebKitGTK 7.0 (10) / 7.0 (13) / 5.0; GNOME Web 6.0 (14) / 6.0 (16) / 5.0 (20). Picture gate (animations off, 5 stages, 4 browsers): 0 pixels differ everywhere; animations paused: 0 except Chromium 91 and 87 of 354,320 (99.974%). Full checks 29/29, 106 s. Build 2026.10.22.2040 (tested as 2016, same code, restamped at the final build), player copy 713,245 bytes (+240).
- **Changed.** Faster start-up: the first set-up of the curtain painting (update() calling curtainTick() before the first game frame) now waits until the first frame is on screen, in its own short task right after the scene layers. Measured inside update() before the first frame in an instrumented copy of build 2026.10.22.1907 (median of 9 loads; time of the whole first update() call, then the curtain part of it, smaller is better): ungoogled Chromium 155.0.8059.39-1 4.0 ms (curtains 2.6), Firefox 158.0 5.0 (3.0), WebKitGTK 2.52.6 23 (18), GNOME Web 46.5 10 (6); the next biggest piece is the text fitting (flushFits) at 0.6, 2, 5 and 3 ms; the stage text, shop rows and the rest stay under 1 ms. WebKitGTK and GNOME Web were over the 8 ms rule before the first frame, Chromium and Firefox were under it. Nothing needs a curtain that early (the curtains are painted in idle moments after the first frame anyway). Time from page start to the first game frame (smaller is better; median of 15 loads, alternating, one browser at a time, build 2026.10.22.1907 against 2026.10.22.1937): Chromium 110.7 to 105.7 ms, Firefox 105 to 104, WebKitGTK 165 to 87, GNOME Web 178 to 93. The two WebKit browsers swing between about 80 and 190 ms from session to session whichever page they load (seen in earlier sessions), so their big drops are real in direction but not in size; the measured saving is 18 and 6 ms. First contentful paint Chromium 88 to 84, Firefox 142 to 140, WebKitGTK 83 to 82, GNOME Web 88 to 88; page fully loaded 141.3 to 139.0, 157 to 154, 166 to 157, 176 to 159 ms. Picture match, 5 game states (0, 20,000, 300,000, 5,000,000 and 2,000,000,000 apples), old against new, whole screen except the live counter: 0 differing pixels in all 20 comparisons (Chromium 354,320 pixels each, Firefox 387,000, WebKitGTK 747,520, GNOME Web 678,366): 100% identical. The full check set passes in Chromium 155.0.8059.39-1 (29 of 29, 105 seconds on 4 lanes; r15 on its automatic second try, as its history says it sometimes needs). Size (smaller is better): player copy 712,949 to 713,005 bytes (+56). After this change the first update() call should be under 8 ms in all four browsers (WebKitGTK 23 minus the 18 moved is about 5 ms, GNOME Web about 4; worked out from the parts, not measured again); the biggest piece left in it is the text fitting (0.6 to 5 ms). Not tested: a real phone.
- **Changed.** Firefox only: the Disco Fever light-beams picture is no longer stored in the file; Firefox now draws it itself, once, in a background worker right after the first game frame (the worker is made from the page's own text, a blob: address, which the page rules already allow). This is the "smaller way" the owner chose on the pull request 19 card after the 221 KB picture made WebKitGTK's first paint 54 ms later and Chromium's load about 3% later. The worker draws the same 1536 x 1536 picture with the same gradient code the research thread used to make the stored one, as a PNG, and hands it back as a data address; the page then uses it the same way as before (style rule with the picture, mask off, decoded once). Other browsers never run any of it (checked: the beams style rule exists in Firefox 158.0 and not in ungoogled Chromium 155.0.8059.39-1, WebKitGTK 2.52.6 or GNOME Web 46.5). Picture match: the worker's picture is pixel for pixel identical to the stored one (1536 x 1536, 0 differing pixels), so the look equals the one in the earlier Disco Fever entry (99.78% matching the old page, within 3 of 255, measured by the View improvements thread). FPS after a disco catch in Firefox 158.0 (higher is better; stage 8, 412 x 892 at scale 2, no taps, 4 s window starting 0.5 s after the catch; median of 3 alternating runs; this machine session ran faster than the earlier one, so use the three together only against each other): no fix 20.6 (worst frame gap 100 to 117 ms), stored picture 59.5 (33 ms), worker-drawn picture 58.7 (34 to 51 ms; about 1% under the stored picture, inside run-to-run spread). So Disco Fever stays about 2.8 times as fast as without any fix. Start-up, time from page start to the first game frame (smaller is better; median of 15 loads, one browser at a time, old build with no beams fix against new build with the worker code; WebKitGTK swings between 80 and 190 ms from session to session whichever page is loaded, so its direction flips between sessions): Chromium 105.8 to 106.4 ms, Firefox 102 to 94, WebKitGTK 160 to 104 (earlier sessions 190 to 183 and 80 to 165), GNOME Web 84 to 81: no consistent change. Stored picture against worker (median of 11 loads): first game frame Chromium 106.6 to 105.1 ms, Firefox 100 to 98, WebKitGTK 82 to 82, GNOME Web 86 to 91; first contentful paint Chromium 60 to 48, Firefox 137 to 128, WebKitGTK 85 to 75, GNOME Web 83 to 85; page fully loaded Chromium 137.6 to 138.0, Firefox 151 to 141, WebKitGTK 145 to 151, GNOME Web 156 to 152. Size (smaller is better, size ceilings are suspended): player copy 932,376 to 712,949 bytes (219,427 fewer; the worker code itself adds 1,654 bytes over no fix), small copy 487,244 to 279,752, smallest copy 360,312 to 201,176. The full check set passes in Chromium 155.0.8059.39-1 (29 of 29, 90 seconds on 4 lanes, first try; the privacy check allows a worker made only from the page's own text). Not tested: a real phone, Firefox on Android (whether it can draw in a worker there is unknown; if it cannot, it keeps the old slow beams, nothing breaks).
- **Changed.** Smaller glow behind the combo counter (the "x12 ... HOT COMBO" number). The round glow behind it was drawn in a box about 205% wide and 190% tall of the counter; the box is now half as wide and half as tall (about 51% by 50%), centered on the same spot, so the browser has a quarter of the area to blend on every tap. This changes the look on purpose, as the owner chose on a card: the orange halo is tighter and a little lighter, the counter, its outline, the word and the sparkle are unchanged (side-by-side crops are in /mnt/project-files/apple-press/glow-box/). Found by the research in this thread: in WebKitGTK and GNOME Web the glow box was about 45% of the time of a tap at deep stages. Frames per second while tapping at the 5,000,000 stage (higher is better; median of 5 alternating old/new runs of 6 seconds; old build 2026.10.22.1801 against new 2026.10.22.1836, unthrottled; this machine session ran faster than earlier ones, so use the pairs only against each other): Chromium 155.0.8059.39-1 120.2 to 120.2 (no change), Firefox 158.0 87.1 to 90.2 (about 4% more, within the run-to-run spread), WebKitGTK 2.52.6 15.6 to 21.0 (about 35% more; the slowest 5% of frames 149 to 129 ms, smaller is better), GNOME Web 46.5 13.6 to 17.1 (about 26% more; slowest 5% of frames 181 to 159 ms). No browser got slower. Picture match (the combo counter on screen at combo 12, 60 and 180, animations stopped at the same moment, whole screen, old against new; the glow box area is split from the rest): everything outside the glow area matches the old page as closely as the old page matches itself on a second run (Chromium 96.07% to 99.86% and Firefox 99.86% to 99.92% identical outside the glow area, with 96.04% to 99.88% and 99.87% to 99.87% for the old page against itself; WebKitGTK and GNOME Web are noisier, 95.4% to 99.7% outside against 95.7% to 99.1% old against itself). Inside the glow area the picture changes by design: the share of pixels within 3 of 255 is 57.9% to 65.4% in Chromium and Firefox (the old page matches itself 88.9% to 100% there; the WebKit browsers' glow area also differs between two runs of the old page, so their inside numbers are not meaningful). Whole screen with the counter showing, within 3 of 255, old against new: 95.3% to 98.8% across the four browsers, which is below the 99.5% pass line because the glow itself changed; this was flagged to the owner on the merge card. With the counter hidden, as in the earlier 5-state picture checks, the glow is not drawn, so those states are unaffected (not measured again). The full check set passes in Chromium 155.0.8059.39-1 (29 of 29, 98 seconds on 4 lanes, first try). Size (smaller is better): player copy 932,370 to 932,376 bytes (+6), small copy 487,300 to 487,244, smallest copy 360,231 to 360,312. Not tested: a real phone.
- **Changed.** The velvet stage curtains are now painted in a background worker (shared stage-curtains 1.3.0, JS-modules pull request 97) instead of on the page's main thread. Before, each curtain half was painted in 8 ms slices on the main thread, a few times per stage change; now the page hands the colors to a worker (made on the spot from the page's own text, a blob: address, which the page rules already allow since 'worker-src blob:' was added on 2026-10-19), the worker paints the half and sends the pixels back, and the page waits for them without doing the painting. If the worker cannot start the page paints the curtain itself as before. Proof the worker runs (Worker spy, real page): 1 worker made, 2 messages (one per curtain half), 0 errors, in ungoogled Chromium 155.0.8059.39-1, Firefox 158.0, WebKitGTK 2.52.6 and GNOME Web 46.5; the first picture arrives 208 to 618 ms after the stage starts depending on the browser (not a frame-rate cost; the old curtain also appeared in the idle moments after the first frame). Frames per second while tapping at the 5,000,000 stage (higher is better; alternating old build 2026.10.22.1733 against new 2026.10.22.1801, unthrottled so use the pairs only against each other): Chromium 155.0.8059.39-1 115.2 to 117.8, Firefox 158.0 49.2 to 50.7, WebKitGTK 2.52.6 8.7 to 9.1, GNOME Web 46.5 5.5 to 5.7; frames over the slow line (smaller is better) 0.3% to 0.1%, 27.1% to 25.9%, 49% to 49%, 48.3% to 48.3%. No browser got slower (the speed guard allows 5%). Honest summary: no visible frame-rate change, because tapping does not wait on the curtain painting; the gain is that no more curtain painting runs on the main thread, which matters most on slow phones (not measured on a real phone). Picture match: the curtain canvases that do not change by themselves, hashed pixel by pixel, are byte-identical old against new (the two 212-wide curtain halves and one 412-wide layer in Chromium; same in Firefox, WebKitGTK and GNOME Web at their own sizes): 6 of 7 canvases identical in Chromium 155.0.8059.39-1 and Firefox 158.0, 5 of 7 in WebKitGTK 2.52.6 and GNOME Web 46.5, and the remaining one or two are live effect layers that also differ between two runs of the same old build (so they cannot be compared). On a screenshot of the velvet area in Chromium the match is 99.903% (the same build against itself, two runs, gives 99.537% because of the live effects, so the new build is inside the noise); the 99.5% rule is met. The module's own test (252 cases, worker and main thread, 0 differing bytes) is in JS-modules. The full check set passes in Chromium 155.0.8059.39-1 (29 of 29; r15 and third_a on their automatic second try). The privacy check's rule 'no background worker' became 'a background worker, if any, is made only from the page's own text (blob:)' on purpose, and its saved result was updated. Size (smaller is better, size ceilings are suspended): player copy 930,132 to 932,370 bytes (+2,238), small copy 486,048 to 487,300, smallest copy 359,408 to 360,231. Not tested: a real phone.
- **Changed.** Firefox only: the two big spinning light-beam layers of Disco Fever (the striped fan under a soft-edged mask) are now one picture made ahead of time and rotated, instead of Firefox redrawing the soft-edge mask on every frame. After a player catches a Disco Fever apple, Firefox 158.0 ran at about 12 to 21 FPS for the whole show (Disco Fever x5 timer); switching the beams off gave 56.5 FPS and switching off only their mask 42.4, which is how the cause was found (research by the View improvements thread, files in /mnt/project-files/apple-press/profiling/disco-beams/). FPS after a disco catch (higher is better; stage 8, 412 x 892 at scale 2, no taps, 4 s window starting 0.5 s after the catch; median of 3 alternating old/new runs; old build 2026.10.22.1259 against new 2026.10.22.1733; this machine ran slower today than in the research runs, so use the pairs only against each other): Firefox 158.0 12.8 to 37.0 (about 2.9 times as fast; worst frame gap 150 to 67-83 ms, smaller is better); ungoogled Chromium 155.0.8059.39-1 59.8 to 59.3 (same page, within noise); WebKitGTK 2.52.6 and GNOME Web 46.5 run the old beams unchanged (the research found no gain there: 15.5 to 14.9 and 12.1 to 11.5 FPS), so they were not measured again. The picture is 1536 x 1536 pixels, 165 KB, made by experiments/make-beams-png.js from the exact gradient the game uses (rebuild it if the beam colors change). It sits in a text block after the game script (type text/plain, so no browser parses it as script and none waits for it) and only Firefox reads it, after the first frame, then decodes it once so the first show does not hitch; Firefox is detected with CSS.supports('-moz-appearance','none'), the same test as the Firefox text-outline change. No page-rule change (style-src 'unsafe-inline' and img-src data: already allow it). A first try that put the picture inside the game script made the first game frame 47% later in Chromium (176.8 to 259.1 ms, because every browser had to read the 221 KB string as script), so it was dropped. Start-up with the shipped delivery (time from page start to the first game frame, smaller is better; median of 9 loads, 15 for WebKitGTK; old against new): Chromium 202 to 179 ms, Firefox 154 to 137, WebKitGTK 316 to 207, GNOME Web 161 to 147; page fully loaded: Chromium 238 to 246 ms (about 3% later), Firefox 216 to 201, WebKitGTK 297 to 310, GNOME Web 280 to 260; first contentful paint (smaller is better): Chromium 104 to 100, Firefox 195 to 180, GNOME Web 131 to 131, WebKitGTK 128 to 182 ms (54 ms later; the one start-up number that got worse, repeated in two runs). Picture match: the 5 game states (0, 20,000, 300,000, 5,000,000 and 2,000,000,000 apples) show 0 differing pixels outside the live counter in all four browsers, in all 20 comparisons (100% identical; Disco Fever is not on screen in those states). During Disco Fever in Firefox the whole screen matches the old one 99.78% (share of color values within 3 of 255; the only differences are hair-thin softening along the beam edges), measured by the View improvements thread with the same picture on a frozen frame; the 99.5% rule is met. The full check set passes in Chromium 155.0.8059.39-1 (29 of 29; keep and third_a on their automatic second try, as their history says they sometimes need; 163 seconds on 4 lanes). Size (smaller is better, size ceilings are suspended): player copy 709,051 to 930,132 bytes (+221,081), small copy 277,611 to 486,048, smallest copy 199,926 to 359,408. Not tested: a real phone, Firefox on Android.
- **Changed.** Fewer forced page re-layouts while tapping and moving the mouse. Three places asked the browser for the size or position of something right after the page had changed, which makes the browser lay the whole page out on the spot instead of once per screen refresh: the eyes and the hover glow (the apple's box was read on every screen refresh while the mouse moved), and the embers that float off the combo number (the number's position was read on every press). The apple's box is now read at most every 120 ms and again after a scroll or resize, and the number's position is measured once per number length and after a resize; the eyes, the hover glow and the embers behave the same (clicks still read the apple's box fresh). Measured in ungoogled Chromium 155.0.8059.39-1 (profile of tapping 5 seconds at the 5,000,000 stage): time inside the embers' measuring went from 120 ms to 19 ms, inside the eyes' and hover glow's from 147 ms to 87 ms; the browser still has to lay the page out once per frame, so part of that time moved to the press itself (82 ms to 193 ms) and the sum of the three barely changed (349 ms to 299 ms). What did change is the number of layouts: fewer back-to-back layouts per press. Frames per second while tapping at the 5,000,000 stage (higher is better; median of 5 alternating old/new runs in Chromium, 3 in the others; old build 2026.10.18.2207 against new 2026.10.22.1259, unthrottled so use the pairs only against each other): Chromium 155.0.8059.39-1 71.0 to 79.2 (about 12% more; frames over 33.4 ms 10.2% to 7.3%, smaller is better), Firefox 158.0 57.5 to 56.3 (about 2% less, within the run-to-run spread), WebKitGTK 2.52.6 9.2 to 9.2 (no change), GNOME Web 46.5 5.4 to 5.4 (no change). Picture match, old against new build in all four browsers, 5 game states (0, 20,000, 300,000, 5,000,000 and 2,000,000,000 apples): 0 differing pixels outside the live counter in every one of the 20 comparisons (100% identical). The full check set passes in Chromium 155.0.8059.39-1 (29 of 29; jade, keep, r15 and third_a on their automatic second try, as their history says they sometimes need; 226 seconds on 4 lanes). Size (smaller is better): player copy 708,665 to 709,051 bytes (+386), small copy 277,408 to 277,611, smallest copy 199,833 to 199,926.

## 2026-10-19 · build 2026.10.18.2128

### Quick

Smoother tapping when many costume looks are on the screen: the rule that switched off the costume animations (dizzy eyes, stars, gleam, halo, lips, starfighter) said "every element inside any costume, whenever the apple's mood is not the o (+2 more changes)

### Details

- **Changed.** Smoother tapping when many costume looks are on the screen: the rule that switched off the costume animations (dizzy eyes, stars, gleam, halo, lips, starfighter) said "every element inside any costume, whenever the apple's mood is not the one that costume needs". Because that rule looked at the apple's mood setting, every mood change made the browser re-check all the elements under the apple.
- **Changed.** Faster start-up: the moving pieces of the scene (the scene layers, which lift each looping part of the picture onto its own layer so the browser's graphics chip moves it) are now put together right after the first game frame is on screen instead of before it; that work took about 20 ms in Chromium and 26 to 29 ms in WebKitGTK and GNOME Web at start-up.
- **Changed.** The game's own page rules (its Content-Security-Policy) gain 'worker-src blob:' right after the script-src part, in the game, the speed-test page, the other test pages and the smallest copy (the small copy carries the game's rules inside). Nothing else in the rules changed (still no network of any kind).

### Deep

- **Changed.** Smoother tapping when many costume looks are on the screen: the rule that switched off the costume animations (dizzy eyes, stars, gleam, halo, lips, starfighter) said "every element inside any costume, whenever the apple's mood is not the one that costume needs". Because that rule looked at the apple's mood setting, every mood change made the browser re-check all the elements under the apple. It is replaced by one rule per costume that turns that costume's animation on only while its own mood is active; the costumes look and move exactly the same. Measured in ungoogled Chromium 155.0.8059.39-1 (trace of the page's main thread, deep stage, tapping about 16 times a second): style re-checks that touched more than 400 elements went from 47 (485 ms in total) to 2 (99 ms); the middle re-check touched 56 elements and now touches 4. Frames per second while tapping at the 5,000,000 stage (higher is better; median of 3 alternating old/new runs of 6 seconds, build 2026.10.18.2128 against 2026.10.18.2207, unthrottled so use the pairs only against each other): Chromium 155.0.8059.39-1 51.3 to 56.3 (about 10% more); a second set of 5 alternating runs on a quieter machine gave 106.8 to 111.5 (about 4% more), slowest 5% of frames 33.3 to 16.8 ms, and frames over 33.4 ms 1.4% to 0.4%, Firefox 158.0 32.2 to 32.0 (no change), WebKitGTK 2.52.6 8.1 to 8.3 (no change worth noting), GNOME Web 46.5 4.5 to 4.7 (no change worth noting). The slowest 5% of frames (smaller is better) went from 83.3 to 66.7 ms in Chromium and 116.2 to 100.5 ms in Firefox, 277 to 272 ms in WebKitGTK and 556 to 549 ms in GNOME Web. Picture match, old against new build in all four browsers, 5 game states (0, 20,000, 300,000, 5,000,000 and 2,000,000,000 apples) each, in two ways: with every animation switched off, and with every animation stopped at the same moment (700 ms in); 39 of the 40 comparisons are 100% identical, and 1 (Chromium, 5,000,000, animations stopped) differs in 66 of 354,320 pixels (99.98% identical, above the 99.5% pass line). The list of running animations (name and element) is the same in old and new for every state in all four browsers. The full check set passes in Chromium 155.0.8059.39-1 (29 of 29; one check, third_a, passed on its automatic second try, as its history says it sometimes needs; 169 seconds on 4 lanes). Size (smaller is better): player copy 708,662 to 708,665 bytes, small copy 277,388 to 277,408, smallest copy 199,825 to 199,833.
- **Changed.** Faster start-up: the moving pieces of the scene (the scene layers, which lift each looping part of the picture onto its own layer so the browser's graphics chip moves it) are now put together right after the first game frame is on screen instead of before it; that work took about 20 ms in Chromium and 26 to 29 ms in WebKitGTK and GNOME Web at start-up. Time from page start to the first game frame (smaller is better; median of 7 loads, old build 2026.10.18.2050 against new 2026.10.18.2128 alternated, one browser at a time, the shipped player copy): ungoogled-chromium 155.0.8059.39-1 195 to 178 ms (17 ms less, about 9%), Firefox 158.0 180 to 146 ms (34 ms less, about 19%), WebKitGTK 2.52.6 356 to 143 ms (213 ms less, about 60%), GNOME Web 46.5 231 to 157 ms (74 ms less, about 32%). Page fully loaded: Chromium 236 to 222 ms, Firefox 234 to 217 ms, WebKitGTK 354 to 257 ms, GNOME Web 374 to 287 ms. The look is unchanged: after the layers are in place the same 32 lifted pieces and 35 layer parts exist as before in all four browsers, and a picture comparison of the whole screen (5 stages: 0, 20 thousand, 300 thousand, 5 million and 2 billion apples; seeded randomness, animations stopped, floating words hidden, the little Saved pill left out) finds 0 differing pixels out of 354,320 to 747,520 in each of Chromium, Firefox, WebKitGTK and GNOME Web. Checked in ungoogled Chromium 155: the full set, 29 of 29 checks pass (2 of them on the automatic second try, as before), 166 s on 4 lanes. Also looked at and not done: baking the curtains ahead (they are already painted in idle moments after the first frame, so it would not speed up the first screen), storing the compiled WebAssembly (compiling the 1,551-byte helper takes 1 ms or less in all four browsers, 0.3 ms in Chromium), and a SIMD build of the curtain loop (slower or no gain in all four browsers, so not used); a background-worker curtain painter is planned in the shared module. Sizes (smaller is better): player copy 708,596 to 708,662 bytes (+66), small copy 277,356 to 277,388 (+32), smallest copy 199,765 to 199,825 (+60). Build 2026.10.18.2128.
- **Changed.** The game's own page rules (its Content-Security-Policy) gain 'worker-src blob:' right after the script-src part, in the game, the speed-test page, the other test pages and the smallest copy (the small copy carries the game's rules inside). Nothing else in the rules changed (still no network of any kind). The game does not start any background worker yet; this only lets it do so later, as the owner allowed on 2026-10-19 for every page of ours. The privacy check's frozen text and its saved result were updated on purpose. Sizes: player copy 708,578 to 708,596 bytes (+18), smallest copy 199,733 to 199,765 (+32), small copy 277,360 to 277,356 (-4). Tested in ungoogled Chromium 155.0.8059.39-1: privacy, promo2 and r12 pass.

## 2026-10-18 · build 2026.10.17.1806

### Quick

The velvet stage curtains are painted by the shared stage-curtains module's painter (JS-modules stage-curtains 1.2.0, pull request 88) instead of the game's own copy: its per-pixel loop runs in a 1,551-byte WebAssembly helper, and plain Jav (+2 more changes)

### Details

- **Changed.** The velvet stage curtains are painted by the shared stage-curtains module's painter (JS-modules stage-curtains 1.2.0, pull request 88) instead of the game's own copy: its per-pixel loop runs in a 1,551-byte WebAssembly helper, and plain JavaScript paints where WebAssembly cannot start.
- **Changed.** The changelog in the repository is now a short list for players (one plain line per change, no tables), kept in changelog-simple.md in the private source. This full changelog stays here with the details, and is copied to /mnt/project-files/changelogs-full/apple-press/CHANGELOG-full.md by gh_pub2.py on every publish. README now points to the short list; the game itself is unchanged (same build 2026.10.17.1806).
- **Changed.** The documents now follow a new order: a few lines on what the thing is and how it works, then why it exists, then everything else, with credits and attributions in their own section. This covers the README (which gains a "Why it exists" part and a "Credits and attributions" part), the playtest card (gains a "Why it exists" line) and the house-rule hooks note. The game itself is unchanged (same build 2026.10.17.1806).

### Deep

- **Changed.** The velvet stage curtains are painted by the shared stage-curtains module's painter (JS-modules stage-curtains 1.2.0, pull request 88) instead of the game's own copy: its per-pixel loop runs in a 1,551-byte WebAssembly helper, and plain JavaScript paints where WebAssembly cannot start. The picture is exactly the same: 252 test cases (9 colors x 7 sizes x both looks x wasm on and off) differ by 0 bytes in Node, and one curtain half has the identical checksum in all four browsers. Time to paint one phone-size curtain half (295,475 pixels) on a freshly loaded page, 8 ms slices like the game, median of 7 loads, old painter then new (smaller is better): ungoogled Chromium 155.0.8059.39-1 26.1 to 16.4 ms (1.59 times faster); Firefox 158.0 26 to 17 ms (1.53x); WebKitGTK 2.52.6 26 to 20 ms (1.30x); GNOME Web 46.5 36 to 24 ms (1.50x). The slowest slice stays 8 to 10 ms in every browser, so frame rate does not change; the saving is about 10 to 20 ms of work per half, two halves per stage. Warm repeated paints show no gain (the audit is in /mnt/project-files/apple-press/wasm-audit/REPORT.md), and a real phone was not measured. In the real page one WebAssembly helper starts (counted: 1 in each of the four browsers, 0 in the published build). Sizes (bigger is worse): player copy 704,227 to 708,578 bytes (+4,351), small copy 274,352 to 277,360 (+3,008), smallest copy 197,840 to 199,733 (+1,893); opening times were not re-measured. The page rules already carried 'wasm-unsafe-eval'.
- **Changed.** The changelog in the repository is now a short list for players (one plain line per change, no tables), kept in changelog-simple.md in the private source. This full changelog stays here with the details, and is copied to /mnt/project-files/changelogs-full/apple-press/CHANGELOG-full.md by gh_pub2.py on every publish. README now points to the short list; the game itself is unchanged (same build 2026.10.17.1806).
- **Changed.** The documents now follow a new order: a few lines on what the thing is and how it works, then why it exists, then everything else, with credits and attributions in their own section. This covers the README (which gains a "Why it exists" part and a "Credits and attributions" part), the playtest card (gains a "Why it exists" line) and the house-rule hooks note. The game itself is unchanged (same build 2026.10.17.1806).

## 2026-10-17

### Quick

Firefox only: the floating "+N" numbers, combo words and the combo counter draw their outline as one 4 px text outline behind the letters instead of eight stacked text shadows plus the glow (the glow is kept). (+17 more changes)

### Details

- **Changed.** Firefox only: the floating "+N" numbers, combo words and the combo counter draw their outline as one 4 px text outline behind the letters instead of eight stacked text shadows plus the glow (the glow is kept). In Firefox 158.0 in the modern look at a deep stage (stage 8, tapping about 9 times a second, 412 x 892 window at screen scale 2) tapping runs about 1.1 to 1.2 times as fast, with fewer slow frames.
- **Changed.** Test tools only, the game is unchanged.
- **Changed.** Saving and loading now run on save-kit 1.2.1 (before: 1.2.0). The module used to read each field's rules again on every save and load; it now reads them once when the game starts.
- **Changed.** The game's own page rules (its Content-Security-Policy) gain the one word 'wasm-unsafe-eval' in script-src, because every page of ours carries it now; nothing else in the rules changed (still no network, no unsafe-eval), and the game does not use WebAssembly itself yet. The same page now carries it in the speed-test page and inside both small copies.
- **Added.** A second small copy of the game, apple-press-smallest.html, for sending the game to someone: the whole game packed with LZMA and unpacked by a 4,087-byte WebAssembly helper (the page's own security rules gain the one word 'wasm-unsafe-eval' so the helper may run; if a browser refuses it, a JavaScript unpacker in the same file takes over, checked by the packer's own test in four modes).
- **Changed.** Saving, the backup copy, the Save & load codes and loading a save now run on the shared save-kit module (version 1.2.0, cut down to the parts the game uses) instead of the game's own copy of that code, so later fixes to the module reach the game by swapping one block.
- **Changed.** The speed-test page (a test build, not the game) now keeps its own saved keys apart from your real saved game by using the shared test-isolation module (version 1.1.0) instead of its own copy of that code. Nothing you can see changes in the game or the test.
- **Changed.** The small apple's flight now runs on the shared fly-to-mini module (version 1.2.0) instead of the game's own copy of that code, so later fixes to the module reach the game by swapping one block.
- **Fixed.** On a phone, the counters bar slid up and away as you scrolled to the end of the upgrades, and slid back when you scrolled up again (the bar can only travel inside the box that holds it, and that box ended where the upgrades end).
- **Changed.** In the diagnostics copy, "Copy report" now copies a short report (at most about 160 lines): how each stage ran (seconds, average and lowest frames per second, seconds under 45, worst frame), then only the slow seconds and the noted moments. Holding the button for about 0.7 second before letting go still copies the full second-by-second list.
- **Fixed.** The stage curtains glitched in the early stages, most of all on slower phones.
- **Fixed.** Safari and other WebKit browsers (they have no "idle moment" signal) never painted the curtains ahead of time at all, so every promotion there painted them in one go. They now paint ahead like the other browsers (checked on WebKitGTK 2.52.6: ready ahead of time; before, still not ready after 6 seconds)
- **Fixed.** If a phone dropped or never finished the curtains' last zoom, a curtain half could stay over the promotion card. A timer now takes the curtains away 0.45 seconds after the planned end (2.0 seconds after the zoom starts), and a cancelled zoom takes them away at once
- **Fixed.** The small apple flew back and forth when a scroll wobbled right at the edge (any finger movement or bounce near that line sent it away and back). It now comes in when less than 50% of the big apple shows and only leaves when more than 65% shows, so a wobble of up to 15% of the big apple's height no longer starts a flight
- **Changed.** Turning Vibration on now sends a test buzz of 250 milliseconds in three pulses (90, pause 70, 90) instead of one pulse of 35 milliseconds, which was too faint to feel on some phones. If the browser refuses the buzz, the button says "Vibration: the browser refused" for 4 seconds, so you can tell a refusing browser from a quiet phone
- **Added.** The diagnostics copy (the test file with the recording button) now also writes down, in its report, each time the top bar's numbers move inside the bar by more than half a screen dot, each flight of the small apple, when the curtains appear and go, where the two curtain halves are every 0.2 seconds, and every buzz with the browser's answer. This is for finding what a real phone does that a computer test cannot show
- **Changed.** Save & load now opens with one tap. Before, it first asked you to hold a round button for 3 seconds and then drag an apple into a basket (the "grown-ups door"), which took at least 3 seconds plus a drag every time. Start over and the links to other websites still ask, because those can erase progress or leave the game.
- **Fixed.** If the phone stopped sending screen updates while the small apple was flying to the button (or back), the flight could freeze and leave the big apple invisible. Now the apple always lands by itself, at most 0.3 seconds after its planned landing (the flight takes 0.44 seconds down and 0.40 up, so 0.74 and 0.70 at the very most), and a flight that hits an error lands at once.

### Deep

- **Changed.** Firefox only: the floating "+N" numbers, combo words and the combo counter draw their outline as one 4 px text outline behind the letters instead of eight stacked text shadows plus the glow (the glow is kept). In Firefox 158.0 in the modern look at a deep stage (stage 8, tapping about 9 times a second, 412 x 892 window at screen scale 2) tapping runs about 1.1 to 1.2 times as fast, with fewer slow frames. Frames per second (higher is better; median of 5 alternating old/new pairs): 38.5 to 45.2 when tapping 10 seconds after a jump to stage 8 (1.17 times; slow frames in 5 seconds about 71 to 49, lower is better), 28.2 to 31.0 right after the jump (1.10 times), 22.1 to 25.4 with two special apples flying right after the jump (1.15 times). The old page itself swings between about 26 and 47 frames per second from run to run, so single runs land anywhere from 1.0 to 1.3 times (earlier runs gave 1.24 times on one setup and 1.03 times on another), which is why the gain is given as a range. Look: in Firefox the outline corners are slightly smoother and rounder (the earlier look check found 1.4 to 4.5 percent of the screen dots in the crops differ, an average of 1.0 to 3.6 out of 255); thickness, colors and glow are the same. The sugar-rush and disco-fever "+N" numbers, the unlockable mode and the "Juicy!" shine layers keep their own looks. Other browsers do not receive the rule, so they are unchanged: in Chromium 155.0.8059.39-1, WebKitGTK 2.52.6 and GNOME Web 46.5 the page reports no support for the rule and the computed text shadow and outline of the floating numbers, combo words and combo counter equal the old page (Chromium also had no changed screen dots in the earlier 10-crop check). Size (smaller is better): player copy 703,318 to 704,227 bytes (909 more, 0.13%), small copy 274,028 to 274,352, smallest copy 197,681 to 197,840, speed-test page 720,118 to 721,027. Checks: smoke, privacy, frozen saves, layers and the add-ons check pass in ungoogled Chromium 155.0.8059.39-1. *Tested: ungoogled Chromium 155.0.8059.39-1, Firefox 158.0 (reports 158.0b5), WebKitGTK 2.52.6 and GNOME Web 46.5, one at a time; not tested: Firefox on a phone, a real phone.*
- **Changed.** Test tools only, the game is unchanged. (1) The full check run takes 95 seconds instead of 119 to 121 (smaller is better; 4 lanes, ungoogled Chromium 155.0.8059.39-1): the promotion-card check (promo2) no longer fails when the computer is busy and then gets re-run alone, which used to add about 30 seconds together with the touch check; it now redoes only the one window size whose test clicks were more than 400 ms apart and waits until the card closes instead of a fixed 200 ms. Using more than 4 lanes made it slower (131 s, with 2 re-runs), and turning the graphics chip off in the browser changed nothing, so neither was kept. (2) The old-save comparison takes less time (smaller is better; seconds): Chromium 84 to 56, Firefox 79 to 53, WebKitGTK 94 to 71, GNOME Web 122 to 93, with the same answers in all four (66 identical, 7 expected differences): it waits until the answer message appears instead of a fixed half second for each of its 23 code cases, and puts the saved slots into the page it loads instead of visiting a blank page first. (3) The check runner prints the processor time of each check, can run just some checks (QA_ONLY="promo2 xs"), and keeps the log of a check's first failure when it is re-run. (4) The speed test and the old-save comparison give a browser that will not close 2 seconds and then stop it: the GNOME Web speed run went from 300 seconds (cut off) to 22.7. *Tested: ungoogled Chromium 155.0.8059.39-1 for the check run; Chromium, Firefox 158.0, WebKitGTK 2.52.6 and GNOME Web 46.5 for the old-save comparison.*
- **Changed.** Saving and loading now run on save-kit 1.2.1 (before: 1.2.0). The module used to read each field's rules again on every save and load; it now reads them once when the game starts. Nothing you see changes: the same saved text and the same loaded game (the old-save comparison, 73 cases against the 0246 build, again gives 66 identical results and the same 7 listed differences, in Chromium 155.0.8059.39, Firefox 158.0 WebKitGTK 2.52.6 and GNOME Web 46.5). Speed of one call, small saved game, 1.2.0 to 1.2.1 (microseconds; smaller is better, median of 5 page loads; 3 in GNOME Web): saving 22.2 to 19.0 in Chromium (17% faster), 7.5 to 5.0 in Firefox (50% faster), 12.5 to 7.5 in WebKitGTK (67% faster); loading 17.3 to 16.8, 20.0 to 10.0 (2x as fast) and 40.0 to 20.0 (2x as fast). A medium saved game (about 2.5 KB) loads 45.5 to 35.5 in Chromium, 50.0 to 35.0 in Firefox and 70.0 to 40.0 in WebKitGTK. Not faster: the large test save (about 25 KB, far beyond a real game) loads 647 to 587 in Chromium and 667 to 467 in Firefox but 1,067 to 1,400 in WebKitGTK (slower in that one browser, probably noise at 5 repeats, not re-measured), and GNOME Web's clock moves in steps too coarse to tell a difference at these sizes (small saved game 12.5 to 12.5, medium 25 to 40). Time from the start of the game script to the saved game loaded stays 1.6 to 3 ms in all four. Size (smaller is better): player copy 703,068 to 703,318 bytes (250 more, 0.04%), small copy 273,916 to 274,028, smallest copy 197,572 to 197,681, speed-test page 719,868 to 720,118. Checks: privacy 19 of 19, fixture 11 of 11, smart QA 29 of 29 (its saved privacy answer updated on purpose for the new page rules; the check on a save from a newer version failed once in 6 repeats on its own, as it also did once in the morning before this change) in ungoogled Chromium 155.0.8059.39-1; both small copies open in it. *Tested: ungoogled Chromium 155.0.8059.39-1, Firefox 158.0 (reports 158.0b5), WebKitGTK 2.52.6 and GNOME Web 46.5 for the old-save comparison and the speed numbers; not tested: a real phone. A second GNOME Web speed run gave different small-save numbers (save 20.0 to 10.0, load 42.5 to 17.5), so its clock is too coarse to trust here.*
- **Changed.** The game's own page rules (its Content-Security-Policy) gain the one word 'wasm-unsafe-eval' in script-src, because every page of ours carries it now; nothing else in the rules changed (still no network, no unsafe-eval), and the game does not use WebAssembly itself yet. The same page now carries it in the speed-test page and inside both small copies. Size (smaller is better): player copy 703,049 to 703,068 bytes (19 more), small copy 273,884 to 273,916, smallest copy 197,535 to 197,572, speed-test page 716,253 to 719,868. The privacy check's frozen rules were updated on purpose to the new text; it passes (19 of 19), and the opening times in the row above were measured on the page before this word was added, which is 19 bytes different
- **Added.** A second small copy of the game, apple-press-smallest.html, for sending the game to someone: the whole game packed with LZMA and unpacked by a 4,087-byte WebAssembly helper (the page's own security rules gain the one word 'wasm-unsafe-eval' so the helper may run; if a browser refuses it, a JavaScript unpacker in the same file takes over, checked by the packer's own test in four modes). The existing small copy, apple-press-small.html, stays. Sizes (smaller is better): player copy 703,049 bytes; small 273,884; smallest 197,535 (28% smaller than small, 72% smaller than the player copy). Opening time, from the start of the page to the game starting (smaller is better; median of 9 loads): small 56 ms in Chromium 155, 47 in Firefox 158, 38 in WebKitGTK 2.52.6 and 40 in GNOME Web 46.5; smallest 98, 97, 99 and 99 ms. So small opens about 1.8 to 2.6 times faster and smallest is 28% smaller. Without the WebAssembly helper the LZMA copy would be 191,502 bytes but open in 132, 117, 108 and 113 ms (the helper makes it 25%, 17%, 8% and 12% faster to open for 4,700 more bytes). The game inside is unchanged and plays the same in both copies (checked in all four browsers from a file address)
- **Changed.** Saving, the backup copy, the Save & load codes and loading a save now run on the shared save-kit module (version 1.2.0, cut down to the parts the game uses) instead of the game's own copy of that code, so later fixes to the module reach the game by swapping one block. Every old save and every old save code still opens: a comparison of this build with the previous one (2026.10.17.0246) ran 73 cases and 66 gave exactly the same result (the other 7 are the differences listed below, each checked for what it should do). The cases were 37 saves in storage (the 2 frozen example saves plus numbers over their limits, renamed upgrades, odd names, 1,500 names in a list, broken main or backup slots and more), 23 pasted codes or texts (old-style codes with check endings of 6 and 7 characters, plain and squeezed, with spaces and line breaks, damaged, cut off, or not a code at all), 12 checks of codes made by each build and opened by the other, and Put my old game back. All 73 gave the same answers in all three test browsers (Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6). The stored save has the same fields in the same order, and the codes this build makes still end in the old kind of check (without leading zeros), so older copies of the game can read them. Size (smaller is better): player copy 699,457 to 703,049 bytes (3,592 more, about 0.5%), small copy 271,776 to 273,884 (2,108 more), full copy 1,094,131 to 1,110,444 (16,313 more). Speed of saving and loading: not measured. Five small differences, all in odd cases (they make up the 7 cases above): (1) when one of the six main numbers (count, total, credits, caught, runs, seconds) is broken, for example text or negative, in a slot with no good backup, the game now keeps everything else; before, it threw the whole slot away and started a new game (2 cases); (2) if the main slot has a broken value inside one list and the backup is clean, the backup (up to a minute older) is now used (1 case); (3) a cut-off code now says "That code is not complete" where it used to say it is not a save code (2 cases); (4) words typed right after a code no longer stop it from opening (1 case); (5) a code that unpacks to more than 256 KB is refused as too big, where the two frozen example saves are 541 and 569 bytes (1 case, a 400 KB test save)
- **Changed.** The speed-test page (a test build, not the game) now keeps its own saved keys apart from your real saved game by using the shared test-isolation module (version 1.1.0) instead of its own copy of that code. Nothing you can see changes in the game or the test. What improves is the guard itself: the module answers property-style reads and writes, `in`, delete, `Object.keys` and `JSON.stringify` like a real storage (the old copy got 7 of 7 of those checks wrong), and its loops over saved keys no longer rescan everything (module test: 3,000 keys took 53.4 seconds in Firefox 158 before and 13 milliseconds now; the speed test itself only writes 2 to 3 keys, so for this page the difference is not measurable). Cost: the page grows from 715,282 to 716,253 bytes (+971 bytes, 0.14%; +559 bytes when compressed). Checked by running the whole fast speed test and looking at a pre-filled real save: it answered in 27.8 seconds in Chromium, 25.3 in Firefox and 25.8 in WebKitGTK, the real save stayed unchanged in all three and no key outside the test's own prefix was written
- **Changed.** The small apple's flight now runs on the shared fly-to-mini module (version 1.2.0) instead of the game's own copy of that code, so later fixes to the module reach the game by swapping one block. Nothing you can see changes: the flight still lasts 440 milliseconds down and 400 up, the small apple still comes in when less than half of the big one shows and goes away when more than 65% shows (measured: in at a scroll of 288 screen dots and out at 184, the same as before), and the alert pulse still lasts about 1.8 seconds. One small difference: the flying copy is now placed on the first frame it exists (before, it could sit in the top-left corner for one frame). The packed page is 2,516 bytes larger (269,260 to 271,776, about 0.9%). *Tested: ungoogled Chromium 155.0.8059.39-1, Firefox 158.0 (reports 158.0b5) and WebKitGTK 2.52.6 for the flying-apple checks; not tested: GNOME Web, a real phone.*
- **Fixed.** On a phone, the counters bar slid up and away as you scrolled to the end of the upgrades, and slid back when you scrolled up again (the bar can only travel inside the box that holds it, and that box ended where the upgrades end). In the test on a phone-size window the bar's top edge went from 0 to -56 and then -106 screen dots over the last 150 dots of scrolling; it now stays at 0 all the way to the bottom of the page, and the page is no longer (the recorded phone report showed the bar at -65 screen dots there)
- **Changed.** In the diagnostics copy, "Copy report" now copies a short report (at most about 160 lines): how each stage ran (seconds, average and lowest frames per second, seconds under 45, worst frame), then only the slow seconds and the noted moments. Holding the button for about 0.7 second before letting go still copies the full second-by-second list. The small apple's landing pop and alert pulse are no longer reported as the bar jumping
- **Fixed.** The stage curtains glitched in the early stages, most of all on slower phones. They are painted ahead of time while you play, but while you tapped steadily that painting almost never got a turn: in a test on a phone-speed setting (4 times slower than a computer) the first curtains were still not ready after 40 seconds, so they were painted all at once as they began to close, which froze the game for about 0.2 to 0.35 seconds and made the slide jump. Now the first three stages start painting at once, a busy phone gets a bigger turn every quarter second instead of every 0.8 seconds, and in the same test the first curtains are ready in about 4 seconds. If they are still not ready when a promotion arrives, the game waits up to 2.5 seconds and paints them a little each frame, instead of freezing
- **Fixed.** Safari and other WebKit browsers (they have no "idle moment" signal) never painted the curtains ahead of time at all, so every promotion there painted them in one go. They now paint ahead like the other browsers (checked on WebKitGTK 2.52.6: ready ahead of time; before, still not ready after 6 seconds)
- **Fixed.** If a phone dropped or never finished the curtains' last zoom, a curtain half could stay over the promotion card. A timer now takes the curtains away 0.45 seconds after the planned end (2.0 seconds after the zoom starts), and a cancelled zoom takes them away at once
- **Fixed.** The small apple flew back and forth when a scroll wobbled right at the edge (any finger movement or bounce near that line sent it away and back). It now comes in when less than 50% of the big apple shows and only leaves when more than 65% shows, so a wobble of up to 15% of the big apple's height no longer starts a flight
- **Changed.** Turning Vibration on now sends a test buzz of 250 milliseconds in three pulses (90, pause 70, 90) instead of one pulse of 35 milliseconds, which was too faint to feel on some phones. If the browser refuses the buzz, the button says "Vibration: the browser refused" for 4 seconds, so you can tell a refusing browser from a quiet phone
- **Added.** The diagnostics copy (the test file with the recording button) now also writes down, in its report, each time the top bar's numbers move inside the bar by more than half a screen dot, each flight of the small apple, when the curtains appear and go, where the two curtain halves are every 0.2 seconds, and every buzz with the browser's answer. This is for finding what a real phone does that a computer test cannot show
- **Changed.** Save & load now opens with one tap. Before, it first asked you to hold a round button for 3 seconds and then drag an apple into a basket (the "grown-ups door"), which took at least 3 seconds plus a drag every time. Start over and the links to other websites still ask, because those can erase progress or leave the game.
- **Fixed.** If the phone stopped sending screen updates while the small apple was flying to the button (or back), the flight could freeze and leave the big apple invisible. Now the apple always lands by itself, at most 0.3 seconds after its planned landing (the flight takes 0.44 seconds down and 0.40 up, so 0.74 and 0.70 at the very most), and a flight that hits an error lands at once. A normal flight looks and takes exactly the same as before.

## 2026-10-16

### Quick

A Rest button in the footer saves your game and shows a calm card. Helpers, boosts and special apples all wait behind it until you tap Keep playing, and it never closes by itself (+7 more changes)

### Details

- **Added.** A Rest button in the footer saves your game and shows a calm card. Helpers, boosts and special apples all wait behind it until you tap Keep playing, and it never closes by itself
- **Added.** On a computer, press B to buy the cheapest upgrade (as many copies as the Buy switch says). If you cannot pay yet, a small note says what it costs
- **Added.** A small Saved note shows at the bottom left now and then, after the game has really saved. It stays away when the browser refuses the save
- **Added.** A Vibration button in the footer (on phones that can buzz) turns the buzzing off. Calm still keeps it off
- **Added.** Save & load has a Share save code button where the browser offers a share sheet, so the code can go straight to a message or a note
- **Changed.** The welcome-back note now says that helpers work for up to 8 hours while you are away, when you were gone longer than that
- **Changed.** The footer link heading now says "More from LFC Foundry"
- **Fixed.** The footer links to the Fancy, the Banana game and to this game's source now go to their new home (lfcfoundry), because the old addresses no longer open.

### Deep

- **Added.** A Rest button in the footer saves your game and shows a calm card. Helpers, boosts and special apples all wait behind it until you tap Keep playing, and it never closes by itself
- **Added.** On a computer, press B to buy the cheapest upgrade (as many copies as the Buy switch says). If you cannot pay yet, a small note says what it costs
- **Added.** A small Saved note shows at the bottom left now and then, after the game has really saved. It stays away when the browser refuses the save
- **Added.** A Vibration button in the footer (on phones that can buzz) turns the buzzing off. Calm still keeps it off
- **Added.** Save & load has a Share save code button where the browser offers a share sheet, so the code can go straight to a message or a note
- **Changed.** The welcome-back note now says that helpers work for up to 8 hours while you are away, when you were gone longer than that
- **Changed.** The footer link heading now says "More from LFC Foundry"
- **Fixed.** The footer links to the Fancy, the Banana game and to this game's source now go to their new home (lfcfoundry), because the old addresses no longer open.

## 2026-10-15

### Quick

The "free game code (MIT)" link in the footer now goes to the code library's new home (lfcfoundry), because the old address no longer opens. (+1 more change)

### Details

- **Fixed.** The "free game code (MIT)" link in the footer now goes to the code library's new home (lfcfoundry), because the old address no longer opens.
- **Changed.** Apple Press now carries the LFC Foundry notice (MIT License with a branding notice) at the top of the game file, the speed-test page and the small copy, and a LICENSE file joins the project. The footer now reads "Copyright © 2026 LFC Foundry. MIT License." Gameplay is unchanged.

### Deep

- **Fixed.** The "free game code (MIT)" link in the footer now goes to the code library's new home (lfcfoundry), because the old address no longer opens.
- **Changed.** Apple Press now carries the LFC Foundry notice (MIT License with a branding notice) at the top of the game file, the speed-test page and the small copy, and a LICENSE file joins the project. The footer now reads "Copyright © 2026 LFC Foundry. MIT License." Gameplay is unchanged.

## 2026-10-14

### Quick

The shading, shine and soft shadows drawn on every hat, helmet and prop (221 small pieces) had stopped showing for several releases, because a style rule meant for the floating petals and stars hid them. (+18 more changes)

### Details

- **Fixed.** The shading, shine and soft shadows drawn on every hat, helmet and prop (221 small pieces) had stopped showing for several releases, because a style rule meant for the floating petals and stars hid them. They are back, a little stronger, and Lite effects now keep the shading too (only the blurred shadows go)
- **Changed.** The chef's hat, the medical mask and the viking helmet are redrawn in the glossy toy look: puffy shaded chef puffs and a pleated band, a pleated mask with a nose wire and shiny ear loops, and a chrome viking helmet with ringed horns and rivets. The chef's hat, the party hat and the flower also got their own gradients
- **Fixed.** Finishing the last stage with a special apple made the game stutter as the ending opened on phones. The ending now opens behind a dark screen and starts its show a moment later, its rays and edge glow are drawn ahead of time during the last stage, a special apple that carries you over the line gets 0.7 of a second for its own burst first, and the laser moon and basketball stop their tricks when the ending opens
- **Changed.** The apple now counts the moment a finger or mouse touches it, not when it lifts. If the finger then scrolls the page, that one press still counts. Keyboard and screen-reader presses work as before
- **Added.** If the device asks for reduced motion, a small bar offers "Switch to Calm?" with Switch to Calm and No thanks. The game never switches on its own, and remembers the answer
- **Added.** A Grown-ups door now stands in front of Start over, Save & load and the links to other JNFoo games: hold a round button for 3 seconds, then drag the apple into the basket (or tap the apple, then the basket). After that those three stay open for 2 minutes. Esc or Not now closes it
- **Added.** The footer now says: no money, no ads, no accounts, and nothing leaves your device
- **Added.** Save & load: a small dot shows on the button when there has never been a backup (or the last was over a week ago) and you have real progress. The panel says how old your last backup is, whether the browser has promised to keep your progress, and has a button to ask it to
- **Changed.** Saves now carry a version number, so a future change to what a saved number means can convert old saves. A save from a newer version still opens
- **Fixed.** On a computer, if the mouse button was let go outside the window while holding the apple, the apple kept pressing until the next click. It now stops when the mouse moves with no button down
- **Added.** For a brand-new player who goes quiet for 20 seconds in the first two stages, a small hand taps the big apple (or the first upgrade they can afford) three times, then goes away. Any touch sends it away; at most three times a visit
- **Added.** The FPS counter explains when a browser's privacy setting is holding the screen at 60 frames a second
- **Added.** The slow-moment note starts with a plain-words start-up timeline (when the page was read, the game began, the saved game was read, the first frame was drawn)
- **Added.** After you start over, an Undo note stays on screen for ten seconds. Tap it to get the progress you just erased back. A copy is also kept in this browser until your next save of a new game, so a mistaken reset can be repaired by a grown-up too
- **Fixed.** The Save & load text used to say that copies of the game opened from different folders keep separate saves. They actually share one save in the same browser, and the text now says so
- **Added.** If Apple Press is open in two tabs or windows of one browser, only one keeps saving. The other shows a note with a Play here instead button, so two copies can no longer save over each other
- **Added.** On a phone, the back swipe or back button now closes the top pop-up (help, the guide, the bonus shop, the promotion card, the book) instead of leaving the game
- **Fixed.** In high-contrast (forced colors) mode, buttons, the apple, the counters and the pop-ups now use the system's colors and stay readable
- **Changed.** The ending card now shows your best combo first among its facts, when it is 10 or more

### Deep

- **Fixed.** The shading, shine and soft shadows drawn on every hat, helmet and prop (221 small pieces) had stopped showing for several releases, because a style rule meant for the floating petals and stars hid them. They are back, a little stronger, and Lite effects now keep the shading too (only the blurred shadows go)
- **Changed.** The chef's hat, the medical mask and the viking helmet are redrawn in the glossy toy look: puffy shaded chef puffs and a pleated band, a pleated mask with a nose wire and shiny ear loops, and a chrome viking helmet with ringed horns and rivets. The chef's hat, the party hat and the flower also got their own gradients
- **Fixed.** Finishing the last stage with a special apple made the game stutter as the ending opened on phones. The ending now opens behind a dark screen and starts its show a moment later, its rays and edge glow are drawn ahead of time during the last stage, a special apple that carries you over the line gets 0.7 of a second for its own burst first, and the laser moon and basketball stop their tricks when the ending opens
- **Changed.** The apple now counts the moment a finger or mouse touches it, not when it lifts. If the finger then scrolls the page, that one press still counts. Keyboard and screen-reader presses work as before
- **Added.** If the device asks for reduced motion, a small bar offers "Switch to Calm?" with Switch to Calm and No thanks. The game never switches on its own, and remembers the answer
- **Added.** A Grown-ups door now stands in front of Start over, Save & load and the links to other JNFoo games: hold a round button for 3 seconds, then drag the apple into the basket (or tap the apple, then the basket). After that those three stay open for 2 minutes. Esc or Not now closes it
- **Added.** The footer now says: no money, no ads, no accounts, and nothing leaves your device
- **Added.** Save & load: a small dot shows on the button when there has never been a backup (or the last was over a week ago) and you have real progress. The panel says how old your last backup is, whether the browser has promised to keep your progress, and has a button to ask it to
- **Changed.** Saves now carry a version number, so a future change to what a saved number means can convert old saves. A save from a newer version still opens
- **Fixed.** On a computer, if the mouse button was let go outside the window while holding the apple, the apple kept pressing until the next click. It now stops when the mouse moves with no button down
- **Added.** For a brand-new player who goes quiet for 20 seconds in the first two stages, a small hand taps the big apple (or the first upgrade they can afford) three times, then goes away. Any touch sends it away; at most three times a visit
- **Added.** The FPS counter explains when a browser's privacy setting is holding the screen at 60 frames a second
- **Added.** The slow-moment note starts with a plain-words start-up timeline (when the page was read, the game began, the saved game was read, the first frame was drawn)
- **Added.** After you start over, an Undo note stays on screen for ten seconds. Tap it to get the progress you just erased back. A copy is also kept in this browser until your next save of a new game, so a mistaken reset can be repaired by a grown-up too
- **Fixed.** The Save & load text used to say that copies of the game opened from different folders keep separate saves. They actually share one save in the same browser, and the text now says so
- **Added.** If Apple Press is open in two tabs or windows of one browser, only one keeps saving. The other shows a note with a Play here instead button, so two copies can no longer save over each other
- **Added.** On a phone, the back swipe or back button now closes the top pop-up (help, the guide, the bonus shop, the promotion card, the book) instead of leaving the game
- **Fixed.** In high-contrast (forced colors) mode, buttons, the apple, the counters and the pop-ups now use the system's colors and stay readable
- **Changed.** The ending card now shows your best combo first among its facts, when it is 10 or more

## 2026-10-13

### Quick

The lighter special apple (while only part of the play area is on screen) also applies in the unlockable mode, where it keeps its own look (+4 more changes)

### Details

- **Changed.** The lighter special apple (while only part of the play area is on screen) also applies in the unlockable mode, where it keeps its own look
- **Fixed.** On a phone, the right curtain could jump a hair just before the curtains part for a promotion. The curtain pictures are now smooth when scaled, and a finished slide is no longer swapped for a still picture at that moment
- **Added.** When the small apple is showing in the top bar (you are looking through the upgrades) and a special apple flies into the play area, the small apple now glows and bounces twice so you know to look up
- **Changed.** Special apples are lighter to draw while only part of the play area is on screen (one small glow, and the twinkling holds still), which fixes the slowdown when one arrived while you were looking through the upgrades
- **Changed.** The promotion card's bonus shop is now folded away each time a card opens: tap "Bonus shop" to open it. The list of credits per special apple is only in How to play now

### Deep

- **Changed.** The lighter special apple (while only part of the play area is on screen) also applies in the unlockable mode, where it keeps its own look
- **Fixed.** On a phone, the right curtain could jump a hair just before the curtains part for a promotion. The curtain pictures are now smooth when scaled, and a finished slide is no longer swapped for a still picture at that moment
- **Added.** When the small apple is showing in the top bar (you are looking through the upgrades) and a special apple flies into the play area, the small apple now glows and bounces twice so you know to look up
- **Changed.** Special apples are lighter to draw while only part of the play area is on screen (one small glow, and the twinkling holds still), which fixes the slowdown when one arrived while you were looking through the upgrades
- **Changed.** The promotion card's bonus shop is now folded away each time a card opens: tap "Bonus shop" to open it. The list of credits per special apple is only in How to play now

## 2026-10-12

### Quick

The copyright holder is now JNFoo, and the page footer has a "More from JNFoo" line linking to Fancy Banana, the free (MIT) game code taken from this game, and the source (+6 more changes)

### Details

- **Changed.** The copyright holder is now JNFoo, and the page footer has a "More from JNFoo" line linking to Fancy Banana, the free (MIT) game code taken from this game, and the source
- **Fixed.** The stage curtains could stay shut for good (and earnings stop) if progress dropped, for example from a poison apple, while they were closing. They now open and the game carries on
- **Fixed.** On the last bonus stage, every press failed partway through (a confetti color was missing), which also stopped the game clock's later steps, such as boost timers and stickers, whenever autoclickers were owned
- **Fixed.** Autoclicker pop-up numbers were tripled or quintupled while a press boost was running, though what they earned was not
- **Changed.** Time a phone or hidden tab spends frozen now counts at the "away" rate (at most 8 hours), the same as reopening the game, instead of full speed
- **Fixed.** Starting a new run now clears special apples still flying from the old one, and a missing price can never turn bonus credits into a broken number
- **Fixed.** On a phone, the stage curtains could glitch: the right curtain stayed parked off to the side instead of closing in the middle with the left one. Each curtain now puts itself in its final place when it finishes sliding, and a timer finishes any curtain that is running late

### Deep

- **Changed.** The copyright holder is now JNFoo, and the page footer has a "More from JNFoo" line linking to Fancy Banana, the free (MIT) game code taken from this game, and the source
- **Fixed.** The stage curtains could stay shut for good (and earnings stop) if progress dropped, for example from a poison apple, while they were closing. They now open and the game carries on
- **Fixed.** On the last bonus stage, every press failed partway through (a confetti color was missing), which also stopped the game clock's later steps, such as boost timers and stickers, whenever autoclickers were owned
- **Fixed.** Autoclicker pop-up numbers were tripled or quintupled while a press boost was running, though what they earned was not
- **Changed.** Time a phone or hidden tab spends frozen now counts at the "away" rate (at most 8 hours), the same as reopening the game, instead of full speed
- **Fixed.** Starting a new run now clears special apples still flying from the old one, and a missing price can never turn bonus credits into a broken number
- **Fixed.** On a phone, the stage curtains could glitch: the right curtain stayed parked off to the side instead of closing in the middle with the left one. Each curtain now puts itself in its final place when it finishes sliding, and a timer finishes any curtain that is running late

## 2026-10-09

### Quick

The small logo by the stage bar is now a scaled-down copy of the title-screen logo (the same apple overlapping the red "Apple" and green "Press" pill, with the leaf), not a separate drawing

### Details

- **Changed.** The small logo by the stage bar is now a scaled-down copy of the title-screen logo (the same apple overlapping the red "Apple" and green "Press" pill, with the leaf), not a separate drawing

### Deep

- **Changed.** The small logo by the stage bar is now a scaled-down copy of the title-screen logo (the same apple overlapping the red "Apple" and green "Press" pill, with the leaf), not a separate drawing

## 2026-10-08

### Quick

The small logo now includes the words ("Apple" over "Press", from the Title setting), left of the stage bar (+32 more changes)

### Details

- **Added.** The small logo now includes the words ("Apple" over "Press", from the Title setting), left of the stage bar
- **Added.** When the big apple scrolls out of view on a narrow window or phone, it now shrinks into the small apple in the top bar (a flying copy, 0.4 s); scrolling back up grows it back out of the small apple into the big one. Skipped in Calm effects and with reduced motion
- **Added.** A version number (the build's date and time, USA Eastern, e.g. 2026.10.08.2323) shows at the bottom right of the title screen and above the font credits at the bottom of the page. Every new build gets a new one automatically
- **Added.** A small game logo (the title-screen apple, never dressed for a season) sits to the left of the stage bar at the top
- **Changed.** The fireworks over the city on the National Brand stage now show only on night (dark mode) scenes, not on daytime ones
- **Fixed.** The chimney on the Cider Mill background now sits properly on the roof
- **Fixed.** In the tour, the Click upgrades, Helper upgrades and Prices go up steps now light up one upgrade (or just its price) instead of the whole shop
- **Changed.** The first-time tour is rewritten for children about 6 years old: short sentences and simple words, split into 18 small steps (was 7), with separate steps for each number under the apple, click upgrades, helper upgrades, new stages, and the special apples, sticker book, save and help buttons
- **Changed.** The curtains' fly-through at the end of a promotion is lighter: it zooms to 1.5x instead of 1.9x and finishes 200 ms sooner, because a full-screen layer scaling while fading made the browser's compositor drop frames (profile of the hosted page showed long composites with texture-cache churn during that moment)
- **Changed.** The title screen no longer comes back after the game has been left untouched for an hour (it did not work well on the online versions)
- **Changed.** Smoother curtains and presses: the next stage's curtain is painted about five times faster (the same picture, checked to be identical), the falling-pieces layer no longer makes the browser do extra layout work on every press, and a press reads the page layout once instead of three times
- **Fixed.** A thin strip under the gold hem at the bottom of the closing curtains was see-through, so the busy game behind it showed (and seemed to flicker); it is now a solid dark stage floor, in both looks
- **Added.** Finishing the first-time tour (not skipping it) sends a golden apple floating across the scene as a gift, once per browser; it is bigger and slower than usual so a first-time player can catch it
- **Added.** First-time tour: right after the title screen a brand-new player gets a short guided look at the page (the story of the game, the big apple, the counters, upgrades, stage bar and bottom buttons), with Skip and Back; "Show me around" in How to play brings it back
- **Changed.** The font credits at the bottom and the How to play panel no longer name the hidden unlockable look until it has been unlocked
- **Fixed.** Stage 3 and stage 11 curtains showed up solid black in the shared (player) copy of the game, because its compressed style sheet writes those two colors as names (maroon, coral) that the curtain painter could not read; the browser now converts the color first
- **Changed.** The fiery ring and the dashed orbit ring now turn once per press-per-second shown on the counter (they used to turn twice)
- **Fixed.** Stage 3's curtains are no longer nearly black: the very dark maroon is brightened to a rich crimson velvet with softer shading, in both the modern and retro looks
- **Changed.** The first adventure is shorter: a brand-new game ends after stage 6 (National Brand) with "The Orchard Is Famous!". "Start again" then gives the full 13 stages; "Start over" begins a short first adventure again; saves already in the middle of a run keep all 13 stages
- **Changed.** Ending is gentler: the celebration card shows first with a "See my story" button; the Apple Story no longer pops up by itself and now opens with a "You did it!" cover page (a short first adventure ends it with "To be continued…")
- **Fixed.** Progress bars on stages 5, 6 and 9 are deeper (gold, amber, teal) so the growing part shows clearly
- **Changed.** Bonus shop: Auto Clicker now costs 35 credits (was 7) and Robot Arm 100 (was 16), and both sit at the end of the list
- **Fixed.** Stage 13's progress bar fill is a deeper periwinkle so it shows against the light bar
- **Changed.** Player copy 28 KB smaller: one flexible Figtree file instead of three, and the unused lighter Bricolage title weight removed; no visible change
- **Changed.** Background petals, fireflies and stars (modern look) are now small page pieces the browser moves itself, instead of a full-screen picture redrawn 60 times a second; retro look keeps the canvas, now at 30 times a second
- **Changed.** Self-extracting small copy added (`apple-press-small.html`, 266 KB instead of 647 KB): the game is squeezed inside and the browser unpacks it as the page opens; older browsers (before 2023) get a short message pointing to the regular file
- **Changed.** Player copy tidied: font layout features trimmed to the ones used (−6 KB), tags written more briefly (−15 KB raw)
- **Changed.** The fiery ring around the apple no longer shows on stages 7 to 12, which already have the orbit ring
- **Fixed.** Curtain colors checked on all 13 stages against their apples and backdrops: yellow (stage 5), lavender (stage 13) and magenta (stage 10) velvet now match their stage color more closely
- **Fixed.** Stage 11's curtains no longer look chocolate brown: orange and coral velvet is shaded less deeply in the folds
- **Changed.** During a promotion the background particles stop drawing until it closes, and the stage change is done in several small steps behind the shut curtains, to ease the stutter as the card appears
- **Changed.** Only the current stage's background picture is kept in the page (about 30% fewer page elements); the progress bar moves in finer-grained steps; about 3 KB of unused style rules removed
- **Fixed.** Stage 8 (World Apple Conglomerate): the backdrop behind the promotion card glowed sky blue while its curtains were purple; the glow is now violet to match (the other 12 stages were checked and already match)

### Deep

- **Added.** The small logo now includes the words ("Apple" over "Press", from the Title setting), left of the stage bar
- **Added.** When the big apple scrolls out of view on a narrow window or phone, it now shrinks into the small apple in the top bar (a flying copy, 0.4 s); scrolling back up grows it back out of the small apple into the big one. Skipped in Calm effects and with reduced motion
- **Added.** A version number (the build's date and time, USA Eastern, e.g. 2026.10.08.2323) shows at the bottom right of the title screen and above the font credits at the bottom of the page. Every new build gets a new one automatically
- **Added.** A small game logo (the title-screen apple, never dressed for a season) sits to the left of the stage bar at the top
- **Changed.** The fireworks over the city on the National Brand stage now show only on night (dark mode) scenes, not on daytime ones
- **Fixed.** The chimney on the Cider Mill background now sits properly on the roof
- **Fixed.** In the tour, the Click upgrades, Helper upgrades and Prices go up steps now light up one upgrade (or just its price) instead of the whole shop
- **Changed.** The first-time tour is rewritten for children about 6 years old: short sentences and simple words, split into 18 small steps (was 7), with separate steps for each number under the apple, click upgrades, helper upgrades, new stages, and the special apples, sticker book, save and help buttons
- **Changed.** The curtains' fly-through at the end of a promotion is lighter: it zooms to 1.5x instead of 1.9x and finishes 200 ms sooner, because a full-screen layer scaling while fading made the browser's compositor drop frames (profile of the hosted page showed long composites with texture-cache churn during that moment)
- **Changed.** The title screen no longer comes back after the game has been left untouched for an hour (it did not work well on the online versions)
- **Changed.** Smoother curtains and presses: the next stage's curtain is painted about five times faster (the same picture, checked to be identical), the falling-pieces layer no longer makes the browser do extra layout work on every press, and a press reads the page layout once instead of three times
- **Fixed.** A thin strip under the gold hem at the bottom of the closing curtains was see-through, so the busy game behind it showed (and seemed to flicker); it is now a solid dark stage floor, in both looks
- **Added.** Finishing the first-time tour (not skipping it) sends a golden apple floating across the scene as a gift, once per browser; it is bigger and slower than usual so a first-time player can catch it
- **Added.** First-time tour: right after the title screen a brand-new player gets a short guided look at the page (the story of the game, the big apple, the counters, upgrades, stage bar and bottom buttons), with Skip and Back; "Show me around" in How to play brings it back
- **Changed.** The font credits at the bottom and the How to play panel no longer name the hidden unlockable look until it has been unlocked
- **Fixed.** Stage 3 and stage 11 curtains showed up solid black in the shared (player) copy of the game, because its compressed style sheet writes those two colors as names (maroon, coral) that the curtain painter could not read; the browser now converts the color first
- **Changed.** The fiery ring and the dashed orbit ring now turn once per press-per-second shown on the counter (they used to turn twice)
- **Fixed.** Stage 3's curtains are no longer nearly black: the very dark maroon is brightened to a rich crimson velvet with softer shading, in both the modern and retro looks
- **Changed.** The first adventure is shorter: a brand-new game ends after stage 6 (National Brand) with "The Orchard Is Famous!". "Start again" then gives the full 13 stages; "Start over" begins a short first adventure again; saves already in the middle of a run keep all 13 stages
- **Changed.** Ending is gentler: the celebration card shows first with a "See my story" button; the Apple Story no longer pops up by itself and now opens with a "You did it!" cover page (a short first adventure ends it with "To be continued…")
- **Fixed.** Progress bars on stages 5, 6 and 9 are deeper (gold, amber, teal) so the growing part shows clearly
- **Changed.** Bonus shop: Auto Clicker now costs 35 credits (was 7) and Robot Arm 100 (was 16), and both sit at the end of the list
- **Fixed.** Stage 13's progress bar fill is a deeper periwinkle so it shows against the light bar
- **Changed.** Player copy 28 KB smaller: one flexible Figtree file instead of three, and the unused lighter Bricolage title weight removed; no visible change
- **Changed.** Background petals, fireflies and stars (modern look) are now small page pieces the browser moves itself, instead of a full-screen picture redrawn 60 times a second; retro look keeps the canvas, now at 30 times a second
- **Changed.** Self-extracting small copy added (`apple-press-small.html`, 266 KB instead of 647 KB): the game is squeezed inside and the browser unpacks it as the page opens; older browsers (before 2023) get a short message pointing to the regular file
- **Changed.** Player copy tidied: font layout features trimmed to the ones used (−6 KB), tags written more briefly (−15 KB raw)
- **Changed.** The fiery ring around the apple no longer shows on stages 7 to 12, which already have the orbit ring
- **Fixed.** Curtain colors checked on all 13 stages against their apples and backdrops: yellow (stage 5), lavender (stage 13) and magenta (stage 10) velvet now match their stage color more closely
- **Fixed.** Stage 11's curtains no longer look chocolate brown: orange and coral velvet is shaded less deeply in the folds
- **Changed.** During a promotion the background particles stop drawing until it closes, and the stage change is done in several small steps behind the shut curtains, to ease the stutter as the card appears
- **Changed.** Only the current stage's background picture is kept in the page (about 30% fewer page elements); the progress bar moves in finer-grained steps; about 3 KB of unused style rules removed
- **Fixed.** Stage 8 (World Apple Conglomerate): the backdrop behind the promotion card glowed sky blue while its curtains were purple; the glow is now violet to match (the other 12 stages were checked and already match)

## 2026-10-07

### Quick

The fiery ring around the apple now shows only while you press, on every stage, and spins at twice your clicks-per-second number; the dashed orbit ring is back to stages 7 to 12 only (+14 more changes)

### Details

- **Changed.** The fiery ring around the apple now shows only while you press, on every stage, and spins at twice your clicks-per-second number; the dashed orbit ring is back to stages 7 to 12 only
- **Changed.** The orbit ring now shows from the first stage (it still spins faster the faster you press); during a promotion everything behind the celebration is paused to ease the curtain and card stutter in Firefox
- **Changed.** Stage curtains are prepared in smaller, spaced-out slivers and wait a moment behind closed curtains before opening, to remove the curtain stutter in Firefox
- **Changed.** The player file is 16% smaller (fonts trimmed to the characters the game uses, pictures and script tightened) with no visible change
- **Added.** A Capture button in the seasons test that records where the screen, title and buttons are from the moment the page opens, to find the drift on Android; the title screen also locks the page behind it from scrolling
- **Fixed.** On Android phones the title screen no longer turns black in dark mode (it is always light), and zooming is turned off so the title screen and buttons cannot slide toward the bottom right
- **Changed.** Retro title screens redrawn as pixel-art sprites for every season and holiday, moving in step with the apple (new sandwiches, dove, groundhog, sundae, paw prints, chocolates, lanterns, bags, gifts and a Food Day plate)
- **Added.** A taco drawn as a golden shell on its side, and a sombrero, cactus and maracas for Cinco de Mayo on the modern look
- **Fixed.** Fireworks on the title screen are visible again (they used white, which vanished on a light screen) and are pixel bursts in retro
- **Fixed.** The title screen waits for its fonts before showing, so the logo and props no longer jump around on load
- **Fixed.** The retro title screen is always light, so dark theme no longer washes out its pixel art
- **Fixed.** Retro scenes and title props no longer turn into noise in browsers with strict privacy settings (such as Firefox with resist fingerprinting)
- **Added.** If the game is left running untouched for over an hour, the title screen comes back when you return
- **Fixed.** Tooltips no longer show through the title screen
- **Added.** Seasons test file: Back and Next buttons, a Modern/Retro switch and Play game, looping through all looks

### Deep

- **Changed.** The fiery ring around the apple now shows only while you press, on every stage, and spins at twice your clicks-per-second number; the dashed orbit ring is back to stages 7 to 12 only
- **Changed.** The orbit ring now shows from the first stage (it still spins faster the faster you press); during a promotion everything behind the celebration is paused to ease the curtain and card stutter in Firefox
- **Changed.** Stage curtains are prepared in smaller, spaced-out slivers and wait a moment behind closed curtains before opening, to remove the curtain stutter in Firefox
- **Changed.** The player file is 16% smaller (fonts trimmed to the characters the game uses, pictures and script tightened) with no visible change
- **Added.** A Capture button in the seasons test that records where the screen, title and buttons are from the moment the page opens, to find the drift on Android; the title screen also locks the page behind it from scrolling
- **Fixed.** On Android phones the title screen no longer turns black in dark mode (it is always light), and zooming is turned off so the title screen and buttons cannot slide toward the bottom right
- **Changed.** Retro title screens redrawn as pixel-art sprites for every season and holiday, moving in step with the apple (new sandwiches, dove, groundhog, sundae, paw prints, chocolates, lanterns, bags, gifts and a Food Day plate)
- **Added.** A taco drawn as a golden shell on its side, and a sombrero, cactus and maracas for Cinco de Mayo on the modern look
- **Fixed.** Fireworks on the title screen are visible again (they used white, which vanished on a light screen) and are pixel bursts in retro
- **Fixed.** The title screen waits for its fonts before showing, so the logo and props no longer jump around on load
- **Fixed.** The retro title screen is always light, so dark theme no longer washes out its pixel art
- **Fixed.** Retro scenes and title props no longer turn into noise in browsers with strict privacy settings (such as Firefox with resist fingerprinting)
- **Added.** If the game is left running untouched for over an hour, the title screen comes back when you return
- **Fixed.** Tooltips no longer show through the title screen
- **Added.** Seasons test file: Back and Next buttons, a Modern/Retro switch and Play game, looping through all looks

## 2026-10-06

### Quick

A "Hold to press" on/off switch at the bottom of the screen, for players who would rather tap (+1 more change)

### Details

- **Added.** A "Hold to press" on/off switch at the bottom of the screen, for players who would rather tap
- **Fixed.** Holding a finger on the apple now keeps pressing on Android phones, and the phone's long-press menu no longer pops up over the apple

### Deep

- **Added.** A "Hold to press" on/off switch at the bottom of the screen, for players who would rather tap
- **Fixed.** Holding a finger on the apple now keeps pressing on Android phones, and the phone's long-press menu no longer pops up over the apple

## 2026-10-05

### Quick

Hold your finger on the apple (or the small press button) to press it 5 times a second, with combos building as you hold (+18 more changes)

### Details

- **Added.** Hold your finger on the apple (or the small press button) to press it 5 times a second, with combos building as you hold
- **Added.** Save backup panel: copy a save code or download a save file, then load it on any device to keep your progress
- **Fixed.** Safer saving: the game never writes a broken save, keeps a backup copy, and saves whenever you switch away from it
- **Fixed.** The ending no longer has a bright white flash; its background and card now fade in gently
- **Changed.** Each of the 13 stages now has its own color, used for the apple, the curtains, the promotion glow and the buttons
- **Fixed.** The moving parts of the background now move separately, which ended the hitch at big combo milestones in the later stages
- **Changed.** The biggest combo milestone celebrations were toned down and spread out so they play smoothly
- **Fixed.** The background holds still while you tap fast and starts moving again when you stop, which removed stutter in the later stages
- **Added.** Velvet stage curtains in the new stage's color close and then part as you fly through to each promotion
- **Added.** Promotion celebrations with confetti cannons, sparkle bursts and turning sun rays
- **Changed.** The promotion card now drops in gently instead of the old oversized spinning, shaking slam
- **Fixed.** Promotions no longer stutter: the busy game is hidden behind the promotion screen, which shows a deep glow in the stage's color
- **Fixed.** Big combo counter announcements no longer stutter on phones
- **Fixed.** Phones in dark mode no longer darken the apple's shine and the special apples
- **Fixed.** The game no longer switches itself to lower effects by mistake after you switch to another app and come back
- **Fixed.** Smoother play in the retro look and with long shop lists, especially on phones
- **Changed.** The game file got about 5% smaller by tidying the artwork, with no change to how anything looks
- **Changed.** New costumes (a fishbowl space helmet, a "Rachel" hairdo, an emo look and a chinstrap beard) replaced the cowboy hat, fedora, towel and soul patch
- **Changed.** Hats and helmets got soft shading and shadows in the modern look, and they stay on correctly when the apple turns around

### Deep

- **Added.** Hold your finger on the apple (or the small press button) to press it 5 times a second, with combos building as you hold
- **Added.** Save backup panel: copy a save code or download a save file, then load it on any device to keep your progress
- **Fixed.** Safer saving: the game never writes a broken save, keeps a backup copy, and saves whenever you switch away from it
- **Fixed.** The ending no longer has a bright white flash; its background and card now fade in gently
- **Changed.** Each of the 13 stages now has its own color, used for the apple, the curtains, the promotion glow and the buttons
- **Fixed.** The moving parts of the background now move separately, which ended the hitch at big combo milestones in the later stages
- **Changed.** The biggest combo milestone celebrations were toned down and spread out so they play smoothly
- **Fixed.** The background holds still while you tap fast and starts moving again when you stop, which removed stutter in the later stages
- **Added.** Velvet stage curtains in the new stage's color close and then part as you fly through to each promotion
- **Added.** Promotion celebrations with confetti cannons, sparkle bursts and turning sun rays
- **Changed.** The promotion card now drops in gently instead of the old oversized spinning, shaking slam
- **Fixed.** Promotions no longer stutter: the busy game is hidden behind the promotion screen, which shows a deep glow in the stage's color
- **Fixed.** Big combo counter announcements no longer stutter on phones
- **Fixed.** Phones in dark mode no longer darken the apple's shine and the special apples
- **Fixed.** The game no longer switches itself to lower effects by mistake after you switch to another app and come back
- **Fixed.** Smoother play in the retro look and with long shop lists, especially on phones
- **Changed.** The game file got about 5% smaller by tidying the artwork, with no change to how anything looks
- **Changed.** New costumes (a fishbowl space helmet, a "Rachel" hairdo, an emo look and a chinstrap beard) replaced the cowboy hat, fedora, towel and soul patch
- **Changed.** Hats and helmets got soft shading and shadows in the modern look, and they stay on correctly when the apple turns around

## 2026-10-03

### Quick

One damaged number in a save no longer throws away all of your progress (+12 more changes)

### Details

- **Fixed.** One damaged number in a save no longer throws away all of your progress
- **Fixed.** Apples earned while the game was closed no longer get doubled by a Frenzy boost
- **Added.** Scenery pets and friends: a cat, a dog, a garden gnome, a friendly UFO and a nicer rainbow
- **Added.** A new bonus shop item that makes regular upgrades cost less
- **Added.** Apple Paradise: an optional bonus 14th stage with its own scene and congratulations screen
- **Added.** Many more costumes for the apple, including a starfighter helmet, chef, firefighter, secret agent, detective and halo
- **Added.** A Modern/Retro switch next to the counters, and a clicks-per-second readout
- **Added.** "Lucky presses" Extra: now and then a press counts ten times over
- **Added.** Extras: each time you start over and keep your bonus items, a new Extra opens (gold stars, hats, scenery, boosts, an apple almanac and a head start)
- **Added.** Boosts: Frenzy doubles every apple for 30 seconds, and Golden Hour brings special apples more often
- **Added.** The retro look gets pixel-art eyes, a pixel logo and pixel fonts
- **Added.** The game's logo shows as a splash screen when it opens
- **Added.** Retro pixel graphics: a switchable old-school video game look for the whole game

### Deep

- **Fixed.** One damaged number in a save no longer throws away all of your progress
- **Fixed.** Apples earned while the game was closed no longer get doubled by a Frenzy boost
- **Added.** Scenery pets and friends: a cat, a dog, a garden gnome, a friendly UFO and a nicer rainbow
- **Added.** A new bonus shop item that makes regular upgrades cost less
- **Added.** Apple Paradise: an optional bonus 14th stage with its own scene and congratulations screen
- **Added.** Many more costumes for the apple, including a starfighter helmet, chef, firefighter, secret agent, detective and halo
- **Added.** A Modern/Retro switch next to the counters, and a clicks-per-second readout
- **Added.** "Lucky presses" Extra: now and then a press counts ten times over
- **Added.** Extras: each time you start over and keep your bonus items, a new Extra opens (gold stars, hats, scenery, boosts, an apple almanac and a head start)
- **Added.** Boosts: Frenzy doubles every apple for 30 seconds, and Golden Hour brings special apples more often
- **Added.** The retro look gets pixel-art eyes, a pixel logo and pixel fonts
- **Added.** The game's logo shows as a splash screen when it opens
- **Added.** Retro pixel graphics: a switchable old-school video game look for the whole game

## 2026-10-02

### Quick

Jade special apple, an apple-shaped zeppelin, a sun (a moon in dark mode) and grass in the background (+14 more changes)

### Details

- **Added.** Jade special apple, an apple-shaped zeppelin, a sun (a moon in dark mode) and grass in the background
- **Added.** Several special apples can fly by at once, plus a mini press button and an optional frames-per-second counter
- **Added.** "Welcome back": helpers keep picking apples for up to 8 hours while the game is closed
- **Added.** Light and dark themes, and Full, Lite and Calm effect settings (Lite is chosen automatically on slow machines)
- **Changed.** The game only updates the screen when something actually changes, so it runs more smoothly on slower devices
- **Added.** Fonts are built into the file, so the game works fully offline
- **Fixed.** The game ignores damaged saved numbers instead of breaking
- **Added.** Stages 9 to 13 and an ending, with a choice to start again and keep your bonus items
- **Added.** Special apples, a combo counter that heats up as you tap fast, a help panel and an apple that spins to show off
- **Added.** Animated background scenes for every stage, with birds, trucks, ships, satellites and more
- **Added.** Bonus credits, a bonus shop and an autoclicker
- **Added.** Faces and costumes for the apple, and descriptions that pop up for upgrades
- **Added.** The apple's eyes follow your pointer and its face reacts, plus a golden apple to catch for a bonus
- **Added.** A scene behind the apple with drifting petals, fireflies and stars
- **Added.** First version: press the apple, buy upgrades across 8 stages, celebrate each promotion, and keep your progress saved

### Deep

- **Added.** Jade special apple, an apple-shaped zeppelin, a sun (a moon in dark mode) and grass in the background
- **Added.** Several special apples can fly by at once, plus a mini press button and an optional frames-per-second counter
- **Added.** "Welcome back": helpers keep picking apples for up to 8 hours while the game is closed
- **Added.** Light and dark themes, and Full, Lite and Calm effect settings (Lite is chosen automatically on slow machines)
- **Changed.** The game only updates the screen when something actually changes, so it runs more smoothly on slower devices
- **Added.** Fonts are built into the file, so the game works fully offline
- **Fixed.** The game ignores damaged saved numbers instead of breaking
- **Added.** Stages 9 to 13 and an ending, with a choice to start again and keep your bonus items
- **Added.** Special apples, a combo counter that heats up as you tap fast, a help panel and an apple that spins to show off
- **Added.** Animated background scenes for every stage, with birds, trucks, ships, satellites and more
- **Added.** Bonus credits, a bonus shop and an autoclicker
- **Added.** Faces and costumes for the apple, and descriptions that pop up for upgrades
- **Added.** The apple's eyes follow your pointer and its face reacts, plus a golden apple to catch for a bonus
- **Added.** A scene behind the apple with drifting petals, fireflies and stars
- **Added.** First version: press the apple, buy upgrades across 8 stages, celebrate each promotion, and keep your progress saved
