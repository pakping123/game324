import { describe, expect, it } from 'vitest'
import { pictureParts, twemojiFile } from './picture.js'

describe('twemojiFile', () => {
  it('names plain emoji by code point', () => {
    expect(twemojiFile('🍌')).toBe('1f34c.svg')
  })
  it('drops FE0F outside ZWJ sequences', () => {
    expect(twemojiFile('✈️')).toBe('2708.svg')
    expect(twemojiFile('2️⃣')).toBe('32-20e3.svg')
  })
  it('keeps FE0F inside ZWJ sequences', () => {
    expect(twemojiFile('🧑‍⚕️')).toBe('1f9d1-200d-2695-fe0f.svg')
  })
  it('names flags by both regional indicators', () => {
    expect(twemojiFile('🇹🇭')).toBe('1f1f9-1f1ed.svg')
  })
})

describe('pictureParts', () => {
  it('splits several emoji', () => {
    expect(pictureParts('🚗🚙').map((p) => p.emoji)).toEqual(['🚗', '🚙'])
  })
  it('keeps numbers as text', () => {
    expect(pictureParts('100')).toEqual([{ kind: 'text', text: '100' }])
  })
  it('keeps a ZWJ sequence as one picture', () => {
    expect(pictureParts('😵‍💫🗺️')).toHaveLength(2)
  })
  it('handles empty input', () => {
    expect(pictureParts(undefined)).toEqual([])
  })
})
