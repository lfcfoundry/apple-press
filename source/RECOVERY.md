# Where the Oct 25 to 31 source went, and how it came back

On 2026-11-21 a shared-folder cleanup deleted the newest private source zips (2026.10.29.2010 and the 2026.10.31 builds). They had not been copied to GitHub. The newest surviving source was the 2026.10.24.1419 snapshot.

On 2026-11-22 the source for the live build (2026.10.31.2352) was re-created from that snapshot and the live page:
1. Built the Oct 24 source with the same tools and compared it with the live page by script structure (every token, short names ignored): 33 differing places, all of them the Oct 25 to 31 changes.
2. Re-wrote each one in readable form: save-kit 1.4.0 lean with `durable: true` and `recover()` (`vendor/save-kit.js`), the 30-second resting scene (script and styles), freeing the curtain buffers, splitting the scene-layer build into two tasks, the sticker-book copy trimming, `html { overflow-x: clip; }`, and the plain-characters pass (`latin1.py`, notice without emoji).
3. Compared again: the only differences left are the local names inside the sticker-book function (the live page's are not the tool's usual short names), 5 bytes in all.

Checks run: Firefox 158.0, ungoogled Chromium 156.0.8078.79 and WebKitGTK 2.52.6, phone-size window, animations switched off, the game screen and the opened sticker book. Sticker book: identical in all three. Game screen: the live page differs from itself between runs by up to 0.85% in Chromium (3 runs), and the rebuilt page sits in the same range (99.14% to 99.90% against live; live against live 99.15% to 99.88%). Not run: a real phone, the full game test suite, the smallest (LZMA) copy.

Prevention: source goes to GitHub the same hour it is built; a shared folder is never the only copy.
