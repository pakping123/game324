import { describe, expect, it } from 'vitest'
import { roadTalkById } from '../data/vocab/road.js'
import { learnFor, lineFor } from './line.js'

const hello = roadTalkById.hello.answer

describe('lineFor', () => {
  it('teaches Thai to Burmese players and Burmese to Thai players', () => {
    expect(learnFor('my')).toBe('th')
    expect(learnFor('th')).toBe('my')
  })

  it('shows Thai with its polite particle and a Burmese meaning', () => {
    const line = lineFor(hello, 'th', 'm')
    expect(line.text).toBe('สวัสดีครับ')
    expect(line.syllables).toHaveLength(4)
    expect(line.meaning).toBe('မင်္ဂလာပါ ခင်ဗျာ')
  })

  it('shows Burmese with its polite ending, readings and a Thai meaning', () => {
    const line = lineFor(hello, 'my', 'f')
    expect(line.text).toBe('မင်္ဂလာပါ ရှင်')
    expect(line.reading).toBe('มิง-กะ-ลา-บา ชิ่น')
    expect(line.meaning).toBe('สวัสดีค่ะ')
    expect(line.syllables).toBeNull()
  })

  it('has women say นะคะ, not นะค่ะ', () => {
    expect(lineFor(roadTalkById.bye.ask, 'th', 'f').text).toBe('ไปก่อนนะคะ')
    expect(lineFor(roadTalkById.bye.ask, 'th', 'm').text).toBe('ไปก่อนนะครับ')
  })
})

describe('pronouns', () => {
  const hungry = roadTalkById.hungry.answer

  it('say ผม or ฉัน in Thai to match the speaker', () => {
    expect(lineFor(hungry, 'th', 'm').text).toBe('ผมหิวมากครับ')
    expect(lineFor(hungry, 'th', 'f').text).toBe('ฉันหิวมากค่ะ')
    expect(lineFor(hungry, 'th', 'f').meaning).toBe('ကျွန်မ ဗိုက်အရမ်းဆာတယ် ရှင်')
  })

  it('say ကျွန်တော် or ကျွန်မ in Burmese, in the reading too', () => {
    const m = lineFor(hungry, 'my', 'm')
    expect(m.text).toBe('ကျွန်တော် ဗိုက်အရမ်းဆာတယ် ခင်ဗျာ')
    expect(m.reading).toBe('จะ-หน่อ ไบ-อะ-ยัน-ซา-แด ขะ-มยา')
    expect(m.meaning).toBe('ผมหิวมากครับ')
    expect(lineFor(hungry, 'my', 'f').text).toBe('ကျွန်မ ဗိုက်အရမ်းဆာတယ် ရှင်')
  })
})
