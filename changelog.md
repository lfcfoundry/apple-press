# What's new in Apple Press

The newest changes are first. The version number is at the bottom of the page. The full, detailed list of changes and tests is kept separately by the people who build the game.

**Tested in:** Firefox 158.0, ungoogled Chromium 155.0.8059.39-1, WebKitGTK 2.52.6 and GNOME Web 46.5, one at a time (the newest build, 2026.10.18.2207, passed the full check set in Chromium and a screen-picture comparison in all four).

## October 19

- Tapping is smoother in Chromium: about 4% to 10% more frames per second at a deep stage (higher is better; 51 to 56 FPS in one test, 107 to 112 FPS in another), and far fewer slow frames (1.4% of frames to 0.4% in the second test). Firefox, WebKitGTK and GNOME Web run the same as before. Nothing looks different: the screen matches the old one in all four browsers (39 of 40 comparisons exactly, the last 99.98%).
- The first screen shows sooner. The first game picture now appears 17 to 213 ms earlier depending on the browser (about 9% to 60% sooner: Chromium 195 to 178 ms, Firefox 180 to 146 ms, WebKitGTK 356 to 143 ms, GNOME Web 231 to 157 ms). The moving scene pieces are put together just after it. Nothing looks different: the whole screen matches the old one exactly in all four browsers.
- The game's page rules now also allow small background helpers made on the spot. Nothing in the game uses them yet and nothing can reach the internet; this only makes room for later speed-ups.

## October 18

- The velvet stage curtains are prepared about 1.3 to 1.6 times faster (one curtain half takes 16 to 24 ms instead of 26 to 36 ms), with exactly the same picture. The game uses a small speed-up helper (WebAssembly) for this, and paints the old way where the helper cannot run. The game file is about 4 KB bigger.
- This list is now short and plain.

## October 17

- Floating numbers and combo words run about 1.1 to 1.2 times faster in Firefox, with fewer choppy moments. Other browsers look and run the same.
- Save & load now opens with one tap. Before, it needed a 3-second hold and a drag.
- A new smallest copy of the game is available for sending to a friend: 197,840 bytes, about 28% smaller than the small copy.
- The curtains between stages are smoother in the early stages, most of all on slower phones, and a curtain can no longer get stuck over the promotion card.
- Safari and other WebKit browsers now get the smoother curtains too.
- On a phone, the top bar with your counters no longer slides away when you scroll to the end of the upgrades.
- The small apple in the top bar no longer flies back and forth when you scroll right at the edge, and it can no longer freeze mid-flight.
- Turning Vibration on gives a stronger test buzz that is easy to feel.
- Saving and loading got a little faster, with the same saves as before.

## October 16

- New Rest button: saves your game and shows a calm card while everything waits until you tap Keep playing.
- On a computer, press B to buy the cheapest upgrade.
- A small "Saved" note appears now and then after the game really saves.
- A Vibration button in the footer turns buzzing off on phones that can buzz.
- Save & load has a Share save code button where your device offers sharing.
- The welcome-back note now tells you when helpers worked the full 8 hours while you were away.
- The footer links to our other games and to the source now open the right pages.

## October 15

- The game now shows our LFC Foundry license notice, and the footer link to the free game code works again.

## October 14

- The apple counts the moment you touch it, not when you lift your finger.
- If your device asks for less motion, a small bar offers to switch to Calm. The game never switches by itself.
- Start over, Save & load and the links to other games now sit behind a hold-then-drag door for grown-ups.
- A new player who goes quiet for 20 seconds gets a small hand that shows where to tap.
- After you start over, an Undo note stays for ten seconds so a mistake can be taken back.
- A dot shows on Save & load when you have no recent backup, and the panel says how old your last backup is.
- If the game is open in two tabs, only one saves, so they can no longer overwrite each other.
- On a phone, the back swipe closes the top pop-up instead of leaving the game.
- Buttons and pop-ups stay readable in high-contrast mode.
- Hats, helmets and props have their shading and shadows back, and the chef's hat, medical mask and viking helmet were redrawn.
- Finishing the last stage no longer makes the game stutter on phones.
- On a computer, letting go of the mouse outside the window no longer leaves the apple pressing.
- The footer now says: no money, no ads, no accounts, and nothing leaves your device.

## October 13

- A Buy switch above the upgrades: x1, x10 or Max.
- Under the next upgrade you cannot afford yet, a note says about how long until you can.
- A Slow-moment note on Save & load keeps the last 30 slow moments on your device only, and a grown-up can copy it. Nothing is sent anywhere.
- The small apple in the top bar glows and bounces when a special apple flies by while you look through the upgrades.
- Special apples are lighter to draw while only part of the play area shows, which fixes the slowdown when one arrived mid-scroll.
- The promotion card's bonus shop is folded away until you tap it.
- The right curtain no longer jumps a hair just before the curtains part.

## October 12

- Fixed: the curtains could stay shut for good if progress dropped while they closed (for example from a poison apple).
- Fixed: every press failed partway through on the last bonus stage.
- Fixed: helper pop-up numbers were tripled or quintupled during a press boost, though what they earned was not.
- Fixed: starting a new run now clears special apples still flying from the old one.
- Time a phone or background tab spends frozen now counts at the away rate (at most 8 hours), like reopening the game.
- Fixed: the curtains could glitch on phones.

## October 8 to 9

- A small game logo sits beside the stage bar.
- When the big apple scrolls out of view on a phone, it shrinks into a small apple in the top bar and grows back when you scroll up.
- A version number shows at the bottom of the page. Every new build gets a new one.
- A first-time tour for new players, written for children about 6 years old: 18 short steps with simple words. Finishing it sends a golden apple floating by as a gift.
- The first adventure is shorter: a new game ends after stage 6 with "The Orchard Is Famous!". Start again opens up the full 13 stages.
- A gentler ending: the celebration card comes first, with a "See my story" button.
- The bonus shop's Auto Clicker now costs 35 credits (was 7) and Robot Arm 100 (was 16).
- Smoother curtains and presses: the next stage's curtain paints about five times faster, and the background petals, fireflies and stars use less power.
- The game file is about 28 KB smaller from the fonts alone, and a small self-opening copy for sending (266 KB instead of 647 KB) was added.
- Fixed colors: curtains and progress bars on several stages now match their stage colors, and stage 3's curtains are no longer nearly black.
- Fixed: a see-through strip under the closing curtains, the Cider Mill chimney, the stage 8 backdrop glow, and the tour lighting up the whole shop.

## October 5 to 7

- Hold your finger on the apple to press 5 times a second, with combos building as you hold. A Hold to press switch turns it off.
- Save backup: copy a save code or download a save file, then load it on any device.
- Safer saving: the game never writes a broken save, keeps a backup copy, and saves whenever you switch away.
- Each of the 13 stages has its own color for the apple, the curtains, the promotion glow and the buttons.
- Velvet stage curtains close and part as you fly through to each promotion.
- Promotion celebrations with confetti cannons, sparkle bursts and turning sun rays, and the card now drops in gently.
- Many fixes for stutter in promotions, big combo announcements and the later stages.
- Fixed: the title screen turning black in dark mode on Android phones, and its fonts and props jumping around on load.
- New costumes, and hats and helmets with soft shading.
- A taco, a sombrero, a cactus and maracas for Cinco de Mayo.
- The player file is 16% smaller with no visible change.

## October 2 to 3

- First version: press the apple, buy upgrades across 8 stages, celebrate each promotion, and keep your progress saved.
- Special apples, a combo counter that heats up as you tap fast, a help panel, and an apple that spins to show off.
- Animated background scenes for every stage, with birds, trucks, ships, satellites and more.
- Stages 9 to 13 and an ending, with a choice to start again and keep your bonus items.
- Bonus credits, a bonus shop, an autoclicker, boosts (Frenzy doubles every apple for 30 seconds; Golden Hour brings special apples more often) and Extras that open each time you start over.
- Apple Paradise, an optional bonus 14th stage.
- Faces and many costumes for the apple, plus scenery friends: a cat, a dog, a garden gnome, a friendly UFO and a nicer rainbow.
- Light and dark themes, and Full, Lite and Calm effect settings (Lite is chosen automatically on slow machines).
- "Welcome back": helpers keep picking apples for up to 8 hours while the game is closed.
- Fonts are built into the file, so the game works fully offline.
- Fixed: one damaged number in a save no longer throws away all your progress.
