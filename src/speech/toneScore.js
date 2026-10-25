import { TONE_IDS } from '../data/tones.js'

const POINTS = 10

// Typical pitch shape of each tone, in semitones relative to the speaker's
// usual speaking pitch, sampled at 10 points across the syllable.
export const TONE_TEMPLATES = {
  mid: [0.5, 0.4, 0.3, 0.2, 0.1, 0, -0.1, -0.2, -0.4, -0.6],
  low: [-0.5, -1, -1.4, -1.8, -2.1, -2.4, -2.7, -3, -3.2, -3.4],
  falling: [1.5, 2, 2.4, 2.5, 2.2, 1.5, 0.5, -0.7, -2, -3],
  high: [0.8, 1, 1.2, 1.4, 1.7, 2, 2.4, 2.8, 3.1, 3.3],
  rising: [-1, -1.6, -2, -2.2, -2, -1.4, -0.4, 0.8, 2, 3],
}

// How much the overall pitch level counts next to the shape. Only used when
// we know the speaker's usual pitch; without it, low and mid look alike.
const LEVEL_WEIGHT = 0.5
// Silence longer than this splits the contour into separate syllables.
const SYLLABLE_GAP_MS = 80

export function hzToSemitones(hz, refHz) {
  return 12 * Math.log2(hz / refHz)
}

export function median(values) {
  if (!values.length) return NaN
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length

// Linear resample of `values` to `count` evenly spaced points.
export function resample(values, count = POINTS) {
  if (values.length === 1) return Array(count).fill(values[0])
  return Array.from({ length: count }, (_, i) => {
    const pos = (i * (values.length - 1)) / (count - 1)
    const lo = Math.floor(pos)
    const hi = Math.min(lo + 1, values.length - 1)
    return values[lo] + (values[hi] - values[lo]) * (pos - lo)
  })
}

// Split a contour ([{t, hz}], t in ms) into `count` syllables. Prefer real
// pauses between syllables; if the pauses don't give the right count, cut the
// voiced time into equal parts instead.
export function splitSyllables(contour, count) {
  if (count <= 1) return [contour]
  const byGap = [[]]
  contour.forEach((p, i) => {
    if (i > 0 && p.t - contour[i - 1].t > SYLLABLE_GAP_MS) byGap.push([])
    byGap[byGap.length - 1].push(p)
  })
  if (byGap.length === count) return byGap

  const parts = Array.from({ length: count }, () => [])
  contour.forEach((_, i) => {
    parts[Math.min(count - 1, Math.floor((i * count) / contour.length))].push(contour[i])
  })
  return parts
}

// Which tone a single syllable sounds like. `semis` is the syllable's pitch in
// semitones relative to the speaker's usual pitch.
export function classifyTone(semis, { useLevel = true } = {}) {
  const shape = resample(semis)
  const shapeMean = mean(shape)
  const distances = {}
  for (const tone of TONE_IDS) {
    const tpl = TONE_TEMPLATES[tone]
    const tplMean = mean(tpl)
    let d = 0
    for (let i = 0; i < POINTS; i++) {
      d += (shape[i] - shapeMean - (tpl[i] - tplMean)) ** 2
    }
    d /= POINTS
    if (useLevel) d += LEVEL_WEIGHT * (shapeMean - tplMean) ** 2
    distances[tone] = d
  }
  const best = TONE_IDS.reduce((a, b) => (distances[a] <= distances[b] ? a : b))
  return { best, distances }
}

const MIN_POINTS_PER_SYLLABLE = 3

// Without the player's usual pitch, guess it: try a range of reference
// levels and keep the one where the syllables fit some tone best overall.
// Uses no knowledge of the target tones.
const OFFSET_SEARCH = { from: -4, to: 4, step: 0.25 }

function bestReferenceOffset(syllableSemis) {
  let best = { offset: 0, total: Infinity }
  for (let o = OFFSET_SEARCH.from; o <= OFFSET_SEARCH.to; o += OFFSET_SEARCH.step) {
    let total = 0
    for (const semis of syllableSemis) {
      const { best: tone, distances } = classifyTone(semis.map((v) => v - o))
      total += distances[tone]
    }
    if (total < best.total) best = { offset: o, total }
  }
  return best.offset
}

// Score a recorded word against the tones it should have.
// `voiceHz` is the player's usual speaking pitch (null if not known yet).
export function scoreTones(contour, targetTones, voiceHz = null) {
  if (contour.length < MIN_POINTS_PER_SYLLABLE * targetTones.length) {
    return { ok: false, tooShort: true, refHz: null, syllables: [] }
  }
  let refHz = voiceHz ?? median(contour.map((p) => p.hz))
  const parts = splitSyllables(contour, targetTones.length)
  const usable = parts.filter((part) => part.length >= MIN_POINTS_PER_SYLLABLE)
  const toSemis = (part) => part.map((p) => hzToSemitones(p.hz, refHz))

  // A single syllable with no known voice pitch can only be judged by shape.
  // With several syllables, their levels relative to each other still count.
  const useLevel = voiceHz != null || targetTones.length > 1
  if (voiceHz == null && useLevel && usable.length) {
    refHz *= 2 ** (bestReferenceOffset(usable.map(toSemis)) / 12)
  }

  const syllables = parts.map((part, i) => {
    const target = targetTones[i]
    if (part.length < MIN_POINTS_PER_SYLLABLE) {
      return { target, detected: null, ok: false }
    }
    const { best } = classifyTone(toSemis(part), { useLevel })
    return { target, detected: best, ok: best === target }
  })
  return {
    ok: syllables.every((s) => s.ok),
    tooShort: false,
    refHz,
    syllables,
  }
}
