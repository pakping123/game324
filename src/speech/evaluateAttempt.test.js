import { describe, expect, it } from 'vitest'
import { marketVocabById } from '../data/vocab/market.js'
import { roadTalkById } from '../data/vocab/road.js'
import {
  evaluateAttempt,
  evaluateBurmese,
  isPass,
  PASS_SCORE,
  selfCheckBurmese,
  selfCheckScore,
  tonePoints,
} from './evaluateAttempt.js'

const howMuch = marketVocabById['how-much']
const askPrice = marketVocabById['p-how-much']

describe('evaluateAttempt', () => {
  it('gives half the score for the right word when tones cannot be judged', () => {
    const r = evaluateAttempt({ recognized: true, heard: ['เท่าไหร่'], contour: [] }, howMuch, 'm', null)
    expect(r.word.match).toBe('exact')
    expect(r.tones.tooShort).toBe(true)
    expect(r.score).toBe(50)
    expect(isPass(r.score)).toBe(true)
  })

  it('accepts a phrase with or without the polite particle', () => {
    const attempt = (heard) => ({ recognized: true, heard: [heard], contour: [] })
    expect(evaluateAttempt(attempt('อันนี้เท่าไหร่คะ'), askPrice, 'f', null).word.match).toBe('exact')
    expect(evaluateAttempt(attempt('อันนี้เท่าไหร่'), askPrice, 'm', null).word.match).toBe('exact')
  })

  it('uses alternative spellings from the vocab entry', () => {
    const r = evaluateAttempt({ recognized: true, heard: ['เท่าไร'], contour: [] }, howMuch, 'm', null)
    expect(r.word.match).toBe('exact')
  })

  it('scores zero for the wrong word', () => {
    const r = evaluateAttempt({ recognized: true, heard: ['สวัสดี'], contour: [] }, howMuch, 'm', null)
    expect(r.score).toBe(0)
    expect(isPass(r.score)).toBe(false)
    expect(r.voiceSampleHz).toBeNull()
  })

  it('leaves the word check to the player without speech recognition', () => {
    const r = evaluateAttempt({ recognized: false, heard: [], contour: [] }, howMuch, 'm', null)
    expect(r.score).toBeNull()
    expect(selfCheckScore(true, r.tones)).toBe(50)
    expect(selfCheckScore(false, r.tones)).toBe(0)
  })
})

describe('tonePoints', () => {
  const tones = (...oks) => ({ tooShort: false, syllables: oks.map((ok) => ({ ok })) })

  it('shares the tone points out per syllable', () => {
    expect(tonePoints(tones(true, true))).toBe(50)
    expect(tonePoints(tones(true, false))).toBe(25)
    expect(tonePoints(tones(true, false, false))).toBe(17)
    expect(tonePoints(tones(false))).toBe(0)
  })

  it('gives nothing when the recording was too short', () => {
    expect(tonePoints({ tooShort: true, syllables: [] })).toBe(0)
  })

  it('lets a close word pass only with good tones', () => {
    expect(25 + tonePoints(tones(true, false)) >= PASS_SCORE).toBe(true)
    expect(25 + tonePoints(tones(false, false, true)) >= PASS_SCORE).toBe(false)
  })
})

describe('evaluateBurmese', () => {
  const hello = roadTalkById.hello.answer
  const attempt = (...heard) => ({ recognized: true, heard, contour: [] })

  it('scores the words alone, with or without the polite ending', () => {
    expect(evaluateBurmese(attempt('မင်္ဂလာပါ ခင်ဗျာ'), hello, 'm').score).toBe(100)
    expect(evaluateBurmese(attempt('မင်္ဂလာပါ'), hello, 'f').score).toBe(100)
    expect(evaluateBurmese(attempt('နေကောင်းလား'), hello, 'm').score).toBe(0)
  })

  it('leaves it to the player without recognition', () => {
    const r = evaluateBurmese({ recognized: false, heard: [], contour: [] }, hello, 'm')
    expect(r.score).toBeNull()
    expect(isPass(selfCheckBurmese(true))).toBe(true)
    expect(selfCheckBurmese(false)).toBe(0)
  })
})
