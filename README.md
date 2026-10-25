# ไปเที่ยวเมืองไทย (ထိုင်းပြည် သွားကြမယ်)

A 3D browser game that teaches everyday Thai to Burmese speakers, with a focus on saying the tones right.

The player is a newcomer walking around a small low-poly Thai town. Each building is a zone with one vocabulary topic. Every word shows the Thai text, a reading in Burmese script, a Latin reading, and the Burmese meaning. Tones are color-coded, and the player hears each word read aloud.

## Playing

1. Choose a gender on the start screen. Phrases then end with ครับ or ค่ะ/คะ to match.
2. In the town, tap the ground to walk, or tap a building or its label to go to that zone.
3. Pick a mode in the zone:
   - 🃏 **Flashcards**: browse the words and listen to each one, at normal or slow speed.
   - 🎤 **Speaking practice**: say the word into the mic. The game checks the word and draws your pitch per syllable against the expected tone, then gives 1–3 stars.
   - 💸 **แม่ค้าใจดี** (market only): listen to a price and pay with the right notes and coins.

Stars, coins and settings are saved in the browser (localStorage).

Use **Chrome**. The speaking practice needs Thai speech recognition (`th-TH` Web Speech API) and mic access.

## Status

| Zone | Status |
|---|---|
| 🛒 ตลาดนัด (market): numbers, money, buying | ✅ playable |
| 🚌 ป้ายรถเมล์ (travel) | 🚧 on the map, no vocab yet |
| 🧭 ซอยวกวน (directions) | 🚧 on the map, no vocab yet |
| 🍜 ร้านข้าว (food) | 🚧 on the map, no vocab yet |
| 💊 ร้านยา (pharmacy) | 🚧 on the map, no vocab yet |
| 🏭 ที่ทำงาน (work) | 🚧 on the map, no vocab yet |

A native speaker has not yet checked the Burmese translations and Burmese-script readings.

## Development

Requires Node ≥ 20.19 (`.nvmrc` pins 22).

```bash
nvm use
npm install
npm run dev       # dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint
npm test          # Vitest
```

Tests (`*.test.js`, next to their modules) cover the pure logic: Thai numbers, answer matching, tone scoring, attempt scoring and pay-game rules. The mic, speech recognition and 3D need a manual check in the browser.

## Tech

React 19 + Vite 8 (plain JSX), `three` with `@react-three/fiber` and `@react-three/drei` for 3D (every model is built from primitives), `zustand` for state, and `pitchy` for pitch detection.

```
src/
  scenes/      start screen, town hub, zone screen
  modes/       FlashcardMode, SpeakMode, PayGame
  components/  three/ (3D town and characters), ui/ (HUD, mic, pitch graph, …)
  data/        zones, vocab per zone, tones, UI text (Burmese + Thai), money
  speech/      TTS, speech recognition, pitch tracking, tone scoring
  lib/         syllables, Thai numbers, pay-game rules
  store/       zustand game store
```

See `CLAUDE.md` for details on how the code fits together.
