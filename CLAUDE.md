# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

`game324` is "ไปเที่ยวเมืองไทย" (ထိုင်းပြည် သွားကြမယ်), a 3D game for everyday speaking that goes both ways: Burmese speakers learn Thai (with a focus on saying the tones right), and Thai speakers learn Burmese. The player picks their own language on the start screen (`lang` in the store: `'my'` or `'th'`); `learnFor(lang)` in `lib/line.js` gives the language they learn. The full plan (zones, milestones) is at `~/.claude/plans/vivid-riding-unicorn.md`.

Built so far:
- Start screen: language, then gender, then the wardrobe (six ready-made characters; skin, hair style and color, shirt, longyi/pants/skirt, hat, thanaka, glasses, bag; all free). Gender sets ครับ/ค่ะ or ခင်ဗျာ/ရှင်, "I" (ผม/ฉัน, ကျွန်တော်/ကျွန်မ) and the voice.
- Road game (the main game): walk an endless Thai street; each person asks something, the player first picks the right answer by listening, then says it out loud. No levels. ~90 talks per language: chat, lines with "I", food, travel, directions, paying, single words.
- Town hub: open to both languages. All six zones (market, travel, directions, food, pharmacy, work) have their own 3D scene (a market stall, a bus stop by a busy road, a crossroads in a soi, a noodle shop, a pharmacy, a factory yard), each with its own person who reacts to the player, plus flashcards and speaking practice in the language being learned; the word being practised shows as a big picture over the scene. The market's pay game (Thai money) is for Burmese players only. Twenty things around the town (trees, a shrine, a food cart…) show their word when the player walks up.
- Chat (🤖 in the top bar): role-play a situation by voice or typing; the partner says when an answer was off topic or wrong and gives a better sentence to practise. The partner is the game's own (no AI, nothing paid): it plays the scene from road talks, answers the player's questions from them, and offers a 💡 hint for each answer.
- 🏠 in the top bar (and in settings) goes back to the start screen to choose the language and gender again; scores, coins and the look are kept.
- Word pictures are Twemoji SVGs from jsDelivr (CC BY 4.0, credited in settings), the same on every device; offline, the device's own emoji show instead.

Speaking Thai is scored 0–100 (50 for the words, 50 for the tones); Burmese is scored on the words only (the tone scorer knows Thai tones only). 50 or more passes. The reading help shows only the player's own script (no Latin). The Burmese translations, the Burmese-script readings of Thai and the Thai-letter readings of Burmese have not been checked by a native speaker.

The game uses no paid services (no Claude API, no Azure) and needs no keys: everything runs in the browser, and `server/index.mjs` only serves the built files. Don't add a paid API. Lines play a recording from `public/audio/<lang>/` when one is listed in that folder's `index.json` (none are there now), else the browser voice (men read at a lower pitch); most devices have no Burmese voice, so Burmese is usually silent. Whether Chrome recognizes Burmese speech (`my-MM`) is untested; when it can't, the player checks themselves.

## Commands

Vite 8 needs Node ≥ 20.19 (`.nvmrc` pins 22). The default shell Node here may be older, so run `nvm use` first.

```bash
npm install       # install dependencies
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/ locally
npm run lint      # ESLint over the whole repo (dist/ ignored)
npm run serve     # serve dist/ on :4324 (after npm run build)
npm test          # Vitest, run once
npx vitest run src/speech/toneScore.test.js   # one test file
```

Tests sit next to their modules as `*.test.js` and cover the pure logic: Thai numbers, answer matching, tone scoring, attempt evaluation, pay-game rules, road talks and layout, lines and pronouns, town spots and zones, the game's own chat partner (every scenario played through in both languages), and Twemoji file names. Mic, speech recognition and 3D need a manual check in a browser. Chrome is the target, since it has Thai `SpeechRecognition`.

## Stack and structure

- React 19 + Vite 8, plain JavaScript/JSX (no TypeScript), ES modules. 3D uses `three` + `@react-three/fiber` + `@react-three/drei`. State lives in `zustand` (with `persist` to localStorage). Pitch detection uses `pitchy`.
- `src/App.jsx` routes on store state (`goHome` clears language and gender): no language or gender → `scenes/StartScreen`, then by `scene`: `'wardrobe'`, `'chat'` (opened with `openScene`, closed with `goBack`), `'road'` (the default), `'hub'`, otherwise `scenes/ZoneScreen` for that zone id.
- Road game: talks (question → answer) in `data/vocab/road.js`, each line in both languages (Thai syllables; Burmese `my` with `read` in Thai letters and `rom` in Latin letters) plus an `emoji`. Picking the next talk, the answer choices, score keys (`my:<id>` for Burmese), NPC looks and the street layout are pure functions in `lib/road.js`. `lib/line.js` (`lineFor`) turns an entry into what to show for the language being learned. The 3D street is `components/three/Road.jsx` + `StreetParts.jsx` + `SpotProps.jsx` (a bus stop sign, signpost or stall by each person, by topic); the emoji bubble over the person is a DOM element positioned from the canvas. The dialogue panel is `components/ui/RoadTalk.jsx`, and `Phrase.jsx` shows a line with its "reading help" card.
- `src/data/`: vocab per zone (`vocab/market.js`, `pharmacy.js`, `work.js`; travel, directions and food reuse road talks) and for the road (`vocab/road.js`), `townSpots.js`, `chatScenarios.js` (with each scene's `script` of road talks for the game's own chat partner), `zones.js` (map positions, `ready` flag), `tones.js` (5 tones and their colors), `ui.js` (all UI text as `{ my, th }`; `Label` shows the player's language first), `money.js`, `looks.js` (look options and ready-made characters).
- Vocab entries are lists of syllables made with `syl(th, tone, latin, my)` from `lib/syllable.js` (the Latin reading is kept but not shown), plus `my` (Burmese), `read` (the Burmese in Thai letters), `emoji` and `key` (names the recording). Phrases with `polite: 'statement' | 'question'` get ครับ/ค่ะ/คะ appended by `entrySyllables(entry, gender)`; the `I` syllable (and `{I}` in the Burmese) becomes ผม/ฉัน (ကျွန်တော်/ကျွန်မ). `accept` lists other spellings a recognizer may return.
- `src/lib/speakEntry.js`: `speakLine`/`speakText` pick a recording or the browser voice.
- `src/lib/offlineChat.js`: `offlineReply` is the chat partner, `{ reply, feedback }` worked out from the conversation's text alone. `lib/picture.js` + `components/ui/Picture.jsx` draw emoji as Twemoji pictures.
- `src/speech/`: `tts.js` (`speechSynthesis` per language, or an audio URL), `recognition.js` (Web Speech, `th-TH` or `my-MM`), `pitch.js` (mic → pitch contour), `toneScore.js` (contour → tone per syllable), `matchAnswer.js`, `evaluateAttempt.js` (0–100 scores, `evaluateBurmese` for Burmese), and `useSpeechAttempt.js` (the hook that runs one recording).
- `src/modes/`: `FlashcardMode` and `SpeakMode` work for any zone's vocab in either language. `PayGame` is market-only; its rules are in `lib/payGame.js`.
- `src/components/three/`: everything is built from primitives (no model files). `ZoneScenes.jsx` picks a zone's scene (`MarketScene.jsx` for the market); `ZoneScreen` passes it `stage` (`{ wordId, mood }`) from the modes, so the person there reacts and the market's fruit floats up. `Character.jsx` draws any look. `Town.jsx` positions the DOM zone labels from `components/ui/ZoneLabels.jsx` every frame; `TownDecor.jsx` draws the town spots. drei's `<Html>` is not used: its React roots get lost under StrictMode.
- ESLint uses flat config: `@eslint/js` recommended, `react-hooks` recommended (including the compiler rules, e.g. no `Math.random` or ref reads during render), and `react-refresh`. A `.jsx` module should export only components, so put data and helpers in `.js` files.
