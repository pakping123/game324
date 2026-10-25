import { describe, expect, it } from 'vitest'
import { matchAnswer, normalizeThai } from './matchAnswer.js'

describe('normalizeThai', () => {
  it('drops spaces, punctuation and trailing polite particles', () => {
    expect(normalizeThai('เท่าไหร่ ครับ')).toBe('เท่าไหร่')
    expect(normalizeThai('อันนี้เท่าไหร่คะ?')).toBe('อันนี้เท่าไหร่')
    expect(normalizeThai('ขอบคุณค่ะ')).toBe('ขอบคุณ')
  })

  it('turns Arabic and Thai digits into Thai number words', () => {
    expect(normalizeThai('100 บาท')).toBe('หนึ่งร้อยบาท')
    expect(normalizeThai('๓๕บาท')).toBe('สามสิบห้าบาท')
    expect(normalizeThai('1,000')).toBe('หนึ่งพัน')
  })
})

describe('matchAnswer', () => {
  it('is exact when any alternative matches any target', () => {
    const r = matchAnswer(['เท่าไร', 'เท่าไหร่ครับ'], ['เท่าไหร่'])
    expect(r.match).toBe('exact')
    expect(r.heard).toBe('เท่าไหร่ครับ')
  })

  it('is close when only a small part differs', () => {
    expect(matchAnswer(['อันนี้เท่าไร'], ['อันนี้เท่าไหร่']).match).toBe('close')
  })

  it('is none for unrelated speech or silence', () => {
    expect(matchAnswer(['สวัสดี'], ['เท่าไหร่']).match).toBe('none')
    expect(matchAnswer([], ['เท่าไหร่']).match).toBe('none')
  })
})
