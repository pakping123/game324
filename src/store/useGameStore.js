import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultLook } from '../data/looks.js'
import { PASS_SCORE } from '../speech/evaluateAttempt.js'

// How fast the stored voice pitch follows new recordings (0..1).
const VOICE_SMOOTHING = 0.3

// Saves before version 1 kept 1–3 stars per word instead of a 0–100 score.
// Before version 2 every player was a Burmese speaker learning Thai.
function migrate(saved, version) {
  let s = saved ?? {}
  if (version < 1 && s.wordStars) {
    const { wordStars, ...rest } = s
    const wordScores = Object.fromEntries(
      Object.entries(wordStars).map(([id, stars]) => [id, Math.round((stars / 3) * 100)]),
    )
    s = { ...rest, wordScores }
  }
  if (version < 2) s = { ...s, lang: s.gender ? 'my' : null }
  return s
}

export const useGameStore = create(
  persist(
    (set) => ({
      // The player's own language: 'my' (Burmese, learns Thai) or 'th' (Thai,
      // learns Burmese). null until chosen on the start screen.
      lang: null,
      // 'm' uses ครับ, 'f' uses ค่ะ/คะ. null until chosen on the start screen.
      gender: null,
      // How the player's character looks (see data/looks.js); null until the
      // wardrobe is first used, then defaultLook(gender) applies.
      look: null,
      // 'road', 'hub', 'wardrobe', 'chat' or a zone id. Not saved: the game
      // always reopens on the road.
      scene: 'road',
      // Where 'wardrobe' and 'chat' go back to.
      prevScene: 'road',
      // Where the player stands in the town ([x, z]), so leaving a zone puts
      // them back at its door. Not saved.
      hubPos: [0, 2],
      coins: 0,
      // Best speaking score (0–100) per word or road-talk id (see scoreKey
      // in lib/road.js for Burmese).
      wordScores: {},
      // Best stars per mini-game id.
      gameStars: {},
      // The player's usual speaking pitch in Hz, learned from recordings.
      voiceHz: null,
      settings: {
        showMyReading: true,
        showTranslation: true,
        slowSpeech: false,
        // Open the reading help card right away instead of on a tap.
        autoHint: false,
      },

      setLang: (lang) => set({ lang }),
      setGender: (gender) => set({ gender }),
      setLook: (look) => set({ look }),
      goTo: (scene) => set({ scene }),
      // Open a screen that returns to the current one (see goBack).
      openScene: (scene) => set((s) => (s.scene === scene ? {} : { scene, prevScene: s.scene })),
      goBack: () => set((s) => ({ scene: s.prevScene ?? 'road' })),
      // Back to the start screen to choose the language and gender again.
      // Scores, coins and the look are kept.
      goHome: () => set({ lang: null, gender: null, scene: 'road', prevScene: 'road' }),
      enterZone: (zoneId, hubPos) => set({ scene: zoneId, hubPos }),
      recordWord: (id, score) =>
        set((s) => ({
          wordScores: { ...s.wordScores, [id]: Math.max(score, s.wordScores[id] ?? 0) },
        })),
      recordGame: (id, stars, coins) =>
        set((s) => ({
          gameStars: { ...s.gameStars, [id]: Math.max(stars, s.gameStars[id] ?? 0) },
          coins: s.coins + coins,
        })),
      learnVoice: (hz) =>
        set((s) => ({
          voiceHz: s.voiceHz == null ? hz : s.voiceHz + (hz - s.voiceHz) * VOICE_SMOOTHING,
        })),
      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
    }),
    {
      name: 'game324-progress',
      version: 2,
      migrate,
      partialize: (s) => ({
        lang: s.lang,
        look: s.look,
        gender: s.gender,
        coins: s.coins,
        wordScores: s.wordScores,
        gameStars: s.gameStars,
        voiceHz: s.voiceHz,
        settings: s.settings,
      }),
      // Settings added later get their defaults in older saves.
      merge: (saved, current) => ({
        ...current,
        ...saved,
        settings: { ...current.settings, ...saved?.settings },
      }),
    },
  ),
)

// How many words and road talks the player has passed at least once.
export function passedCount(state) {
  return Object.values(state.wordScores).filter((score) => score >= PASS_SCORE).length
}

// How the player's character looks: their own look, or the first ready-made
// character of their gender.
export function playerLook(state) {
  return state.look ?? defaultLook(state.gender)
}
