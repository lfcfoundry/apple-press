# Game-rule fuzz test

`ap-adapter.js` is a [fuzz-kit](https://github.com/lfcfoundry/js-modules/tree/main/tools/fuzz-kit) adapter (1.3.3) that plays Apple Press at random and checks the game's own rules after every operation. It is used while building the game; the game itself never ships any test code.

**Operations:** tap the apple, tap bursts, add apples (small and big), buy upgrades, jump or walk through the stages, let time pass, click a visible button, press a key, make a save code and read it back, give bonus credits, and restart from the ending (fresh start or keeping the bonus items).

**Rules checked:** no negative or non-finite number in the saved progress; apples in hand never above the lifetime total; rates finite and not negative; the stage never goes backward within a run; upgrade counts are whole numbers; a save code read back gives the same apples, total, credits, taps and upgrade counts; a restart adds one run, clears the upgrades and keeps credits and bonus items only when asked; no NaN, undefined or [object ...] text on screen.

**What it needs:** a test copy of the game with a small test handle called `window.__apt` (state, upgrade list and costs, buy, add apples, jump stage, time passing, rates, stage index, save code make and read, restart, finale open, add credits). That copy is built from the game's source, which is not in this repository, so the test runs where the source is.

**Run it** (from a js-modules clone):
`CHROME=<chromium> node tools/fuzz-kit/runner/fuzz_puppeteer.mjs file://<test copy>.html#nosplash tools/fuzz/ap-adapter.js --browser chrome --seeds 1-40 --ops 700 --viewport 412x892 --swarm 0.3 --ignore-console "fonts|ERR_FAILED|net::" --shrink --bundle <dir>`
Use `--browser firefox` (with `FIREFOX=<path>`) or `--browser webkitgtk` for the other two test browsers.

**Last run (build 2026.10.23.2114):** 40 seeds of 700 operations in Firefox 158.0, ungoogled Chromium 155.0.8059.39-1 and WebKitGTK 2.52.6: no findings, 28,000 operations each. A planted bug (credits surviving a fresh start; upgrade counts off by a half) was found in about half of the seeds.
