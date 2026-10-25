import { describe, expect, it } from 'vitest'
import { TONE_IDS } from '../data/tones.js'
import { classifyTone, resample, scoreTones, TONE_TEMPLATES } from './toneScore.js'

const VOICE_HZ = 200

// A fake recording of one syllable following a tone template, sampled every
// 10 ms, starting at `startMs`.
function fakeSyllable(tone, startMs = 0, points = 25) {
  return resample(TONE_TEMPLATES[tone], points).map((semi, i) => ({
    t: startMs + i * 10,
    hz: VOICE_HZ * 2 ** (semi / 12),
  }))
}

describe('classifyTone', () => {
  it.each(TONE_IDS)('recognizes its own %s template', (tone) => {
    expect(classifyTone(TONE_TEMPLATES[tone]).best).toBe(tone)
  })

  it.each(TONE_IDS)('recognizes %s by shape alone', (tone) => {
    const shifted = TONE_TEMPLATES[tone].map((v) => v + 4)
    expect(classifyTone(shifted, { useLevel: false }).best).toBe(tone)
  })
})

describe('scoreTones', () => {
  it.each(TONE_IDS)('accepts a clean %s syllable with a known voice pitch', (tone) => {
    const r = scoreTones(fakeSyllable(tone), [tone], VOICE_HZ)
    expect(r.ok).toBe(true)
  })

  it('splits a two-syllable word at the pause', () => {
    // เท่าไหร่: falling then low, with a 120 ms pause between.
    const contour = [...fakeSyllable('falling', 0), ...fakeSyllable('low', 370)]
    const r = scoreTones(contour, ['falling', 'low'])
    expect(r.syllables.map((s) => s.detected)).toEqual(['falling', 'low'])
    expect(r.ok).toBe(true)
  })

  it('reports the wrong tone', () => {
    const r = scoreTones(fakeSyllable('mid'), ['rising'], VOICE_HZ)
    expect(r.ok).toBe(false)
    expect(r.syllables[0]).toMatchObject({ target: 'rising', detected: 'mid' })
  })

  it('flags recordings that are too short', () => {
    expect(scoreTones(fakeSyllable('mid').slice(0, 2), ['mid']).tooShort).toBe(true)
  })
})

describe('scoreTones without a known voice pitch', () => {
  it.each([
    ['falling', 'low'],
    ['mid', 'high'],
    ['high', 'falling'],
    ['rising', 'mid'],
    ['low', 'rising'],
  ])('reads %s + %s', (a, b) => {
    const contour = [...fakeSyllable(a, 0), ...fakeSyllable(b, 370)]
    expect(scoreTones(contour, [a, b]).syllables.map((s) => s.detected)).toEqual([a, b])
  })
})
