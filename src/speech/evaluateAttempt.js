import { lineFor } from '../lib/line.js'
import { entrySyllables, joinThai } from '../lib/syllable.js'
import { matchAnswer, normalizeBurmese } from './matchAnswer.js'
import { median, scoreTones } from './toneScore.js'

// A score of at least this much (out of 100) passes.
export const PASS_SCORE = 50
const WORD_POINTS = { exact: 50, close: 25, none: 0 }
const TONE_POINTS = 50
// Burmese has its own tones, which the Thai tone scorer can't judge, so a
// Burmese line is scored on the words alone. Checking yourself counts as close.
const BURMESE_WORD_POINTS = { exact: 100, close: 60, none: 0 }
// Fewer pitch points than this is too little to learn the player's voice from.
const MIN_POINTS_TO_LEARN_VOICE = 12

export function isPass(score) {
  return score != null && score >= PASS_SCORE
}

// Up to TONE_POINTS, an equal share for each syllable said in the right tone.
export function tonePoints(tones) {
  if (tones.tooShort || !tones.syllables.length) return 0
  const right = tones.syllables.filter((s) => s.ok).length
  return Math.round((TONE_POINTS * right) / tones.syllables.length)
}

// Words and tones together. Tones only count when the words were at least
// close, so humming the right melody alone scores nothing.
function totalScore(wordPoints, tones) {
  return wordPoints > 0 ? wordPoints + tonePoints(tones) : 0
}

// Judge one speaking attempt at `entry` and score it 0–100.
//
// With speech recognition: up to 50 for the words (25 when only close), plus
// up to 50 for the tones.
// Without it, `score` is null and the player checks themselves; see
// selfCheckScore.
export function evaluateAttempt(attempt, entry, gender, voiceHz) {
  const syllables = entrySyllables(entry, gender)
  const tones = scoreTones(
    attempt.contour,
    syllables.map((s) => s.tone),
    voiceHz,
  )

  if (!attempt.recognized) {
    return { word: null, tones, score: null, voiceSampleHz: null }
  }

  const targets = [joinThai(syllables), joinThai(entry.syllables), ...(entry.accept ?? [])]
  const word = matchAnswer(attempt.heard, targets)
  const score = totalScore(WORD_POINTS[word.match], tones)

  // Only learn from attempts that really were the word.
  const voiceSampleHz =
    word.match !== 'none' && attempt.contour.length >= MIN_POINTS_TO_LEARN_VOICE
      ? median(attempt.contour.map((p) => p.hz))
      : null

  return { word, tones, score, voiceSampleHz }
}

// The player says whether they said the right words; tones are still measured.
export function selfCheckScore(saidItRight, tones) {
  return totalScore(saidItRight ? WORD_POINTS.exact : 0, tones)
}

// Judge one attempt at saying `entry` in Burmese: the words only, 0–100.
// Without recognition `score` is null; see selfCheckBurmese.
export function evaluateBurmese(attempt, entry, gender) {
  if (!attempt.recognized) return { word: null, tones: null, score: null, voiceSampleHz: null }
  const targets = [lineFor(entry, 'my', gender).text, entry.my, ...(entry.myAccept ?? [])]
  const word = matchAnswer(attempt.heard, targets, normalizeBurmese)
  return { word, tones: null, score: BURMESE_WORD_POINTS[word.match], voiceSampleHz: null }
}

export function selfCheckBurmese(saidItRight) {
  return saidItRight ? BURMESE_WORD_POINTS.close : BURMESE_WORD_POINTS.none
}
