# 🍎 Apple Press

**▶ Play it here: https://lfcfoundry.github.io/apple-press/**

<p align="center"><img src="images/play-desktop.jpg" alt="Apple Press on a computer: a big smiling apple on a scene, with upgrades on the right" width="860"></p>

Apple Press is a free clicker game for kids in a single web page. Tap a big cartoon apple to pick apples, buy upgrades, and grow a little backyard orchard into something far, far bigger.

It works by putting the whole game, with its scenes, fonts and code, inside one HTML file written in plain JavaScript. Your browser runs that file by itself, with no server and no download, and keeps your progress in its own storage on your device, so after it loads once the game needs no internet.

<p align="center"><img src="images/special-apples.jpg" alt="Special apples that fly across the scene: golden, crystal, jade, rainbow, comet, cosmic and poison" width="760"></p>

## 🌱 Why it exists

Apple Press is meant to be a gentle clicker for children and the grown-ups who sit with them: free, with no ads, purchases or accounts, no sounds, no timers or streaks, and nothing to trade. It is also a test of how much game fits in one small file that anyone can save, send to a friend and open offline. Pieces of its code that proved useful were cut out and shared as the free [JS-modules](https://github.com/lfcfoundry/JS-modules).

## 🚧 Status

> **BETA: for testers only.** This is a work-in-progress version of the game that friends and family are helping to test. Things will change, and some things may be rough. Your progress is saved in your own browser, and a new update could occasionally change how the game plays.

## ✅ At a glance

- **For children and families.** No ads, no purchases, no accounts.
- **Works offline.** After it loads once, no internet is needed. Open it in any modern browser on a phone, tablet or computer.

## 📦 Sending the game to a friend

The whole game is one file, and there are two smaller copies of the same game for sending by message or email. Both open by double-click and work offline, with no internet needed.

| Copy | Size (smaller is better) | Opens in (smaller is better) |
|---|---|---|
| [apple-press-small.html](https://lfcfoundry.github.io/apple-press/apple-press-small.html) | 279,760 bytes | about 40 to 56 ms |
| [apple-press-smallest.html](https://lfcfoundry.github.io/apple-press/apple-press-smallest.html) | 201,175 bytes (28% smaller) | about 97 to 99 ms |

The regular page is 713,005 bytes. Opening times were measured on an earlier build (before the Firefox-only Disco Fever picture was added) on one test computer in four browsers; a phone may take longer.

## 🎮 How it plays

Each press earns apples. Upgrades add apples per press and per second. Every stage brings a promotion party, a new animated scene, a new apple color and new upgrades. A first adventure ends after six stages; after that, the full 13-stage journey opens up, and the most dedicated players may find there is more to discover.

<p align="center"><img src="images/promotion.jpg" alt="The promotion party: confetti, a new stage name and new upgrades unlocked" width="860"></p>

## 🧒 Testing with a child?

There is a one-page [playtest card](PLAYTEST-CARD.md) for a grown-up who sits with a child while they try the game.

## ⭐ What's in the game

- **A lively apple:** about 22 moods, eyes that follow your finger, and a spin now and then to show off. 
- **Upgrades that double:** own 10, 25 or 50 of the same upgrade and every copy gets twice as strong.
- **Combos:** press quickly to build a combo and watch the counter heat up from ember red to white-hot.
- **Special apples:** golden, crystal, jade, rainbow, comet, cosmic and a few secret kinds fly across the scene. Catch them for bursts of apples and bonus credits. In the later stages, watch out for the poison apple!
- **Shops and collectibles:** a bonus shop, Extras that open as you play again, hats and costumes, scenery friends (a cat, a dog, a garden gnome, a friendly UFO and more), and a sticker book with 49 stickers to earn.
- **Your own story:** the ending opens a picture storybook of your game.
- **Looks and settings:** light and dark modes, Full, Lite and Calm effects (picked automatically on slower devices), a title screen that dresses up for the seasons and more than 40 holidays, and an unlockable mode for players who go the distance.
- **Safe saving:** progress autosaves in your browser, keeps a backup copy, and can be copied or downloaded to move to another device.
- **A quick tour:** new players get a friendly guided look at the page the first time they play, in short steps with simple words that young children can follow. It can be skipped, and opened again from the How to play button.
- **Built for kids:** big tap targets, no timers or streaks, and nothing to trade.

<table>
<tr>
<td align="center" valign="top"><img src="images/play-phone.jpg" alt="Apple Press on a phone held upright" width="300"><br><sub>On a phone</sub></td>
<td align="center" valign="top"><img src="images/sticker-book.jpg" alt="The sticker book with nine apple faces to collect" width="340"><br><sub>The sticker book: 49 to collect</sub></td>
</tr>
</table>

<p align="center"><img src="images/play-dark.jpg" alt="Apple Press in dark mode at night" width="760"><br><sub>Dark mode, with a night scene</sub></p>

## ♿ Accessibility

- **No noise.** There are no sounds or music, so there is no volume to manage. That suits kids with sensory challenges, and parents who have heard enough beeping for one day.
- **Flash-safe celebrations.** The promotion celebrations are checked against flash-safety limits.
- **Hold to press.** Hold the apple down and it keeps pressing for you, which helps tired hands and younger players who find rapid tapping hard. It can be switched off in the footer.
- **Gentler effects.** The Calm effects setting tones down motion, and the game picks a lighter setting by itself on slower devices.
- **Calm on request.** If your device asks for reduced motion, the game offers a one-tap switch to Calm and remembers your answer. It never switches on its own.
- **Presses at once.** The apple counts the moment it is touched, not when the finger lifts.
- **A Grown-ups door.** Start over, Save & load and the links to other games sit behind a hold-then-drag door that young children are unlikely to pass. It is a speed bump for small hands, not a lock.

## 💡 Playing tips

- Phones play best held upright. Tablets can be played sideways.
- If the game feels slow on an older device, try the Lite or Calm effects setting.
- Clearing your browser's site data erases your saved progress, so use the save backup first if you want to keep it.

## 🧪 Testing and feedback

Please tell JNFoo what you find: anything confusing, anything too hard or too slow, anything that looks or runs badly, and which device and browser you used. If you have a GitHub account you can also open an issue on this page.

The latest release was tested in Firefox 158.0, ungoogled Chromium 155.0.8059.39-1, WebKitGTK 2.52.6 and GNOME Web 46.5, one at a time (listed at the top of [changelog.md](changelog.md)). Every test from 2026-10-17 on covers these four browsers.

## 🆕 What's new

See [changelog.md](changelog.md) for a short, plain list of what changed, newest first.

## More from LFC Foundry

- [Fancy Banana](https://github.com/lfcfoundry/fancy-banana): a one-tap flying-banana arcade game ([play](https://lfcfoundry.github.io/fancy-banana/))
- [Pineapple Defense](https://github.com/lfcfoundry/pineapple-defense): a flick-to-throw pineapples-at-penguins game ([play](https://lfcfoundry.github.io/pineapple-defense/))
- [JS-modules](https://github.com/lfcfoundry/JS-modules): free (MIT) code pieces taken from this game ([demos](https://lfcfoundry.github.io/JS-modules/))

## 🙏 Credits and attributions

- **Fonts.** Bricolage Grotesque (Copyright 2022 The Bricolage Grotesque Project Authors) and Figtree (Copyright 2022 The Figtree Project Authors), plus a few more listed in the notice inside the game file. All are used under the SIL Open Font License 1.1, and the full license text is included inside the game file.
- **Shared code.** Several parts of the game (saving and loading, the small apple's flight, the curtain painter, test isolation) come from [JS-modules](https://github.com/lfcfoundry/JS-modules), which is MIT-licensed.
- **Smallest copy.** [apple-press-smallest.html](https://lfcfoundry.github.io/apple-press/apple-press-smallest.html) is packed with LZMA, the compression method of the 7-Zip program by Igor Pavlov, and unpacked by a 4,087-byte WebAssembly helper from JS-modules.

## © Ownership

Copyright (c) 2026 LFC Foundry. Apple Press is open under the MIT License (see `LICENSE`), with a branding notice: the name "LFC Foundry" and its project identities are reserved, so a fork, a significant modification or a commercial redistribution must change the public product name and branding. The fonts are used under the SIL Open Font License.
