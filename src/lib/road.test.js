import { describe, expect, it } from 'vitest'
import { ROAD_TALKS, ROAD_TALKS_FOR, roadTalkById } from '../data/vocab/road.js'
import { entrySyllables, joinThai } from './syllable.js'
import {
  answerChoices,
  chunkLayout,
  chunkRange,
  CHUNK_LENGTH,
  npcFor,
  npcZ,
  pickTalk,
  scoreKey,
  seededRandom,
  stopZ,
  talkWeight,
} from './road.js'

const talks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((id) => ({ id }))

describe('pickTalk', () => {
  it('never repeats one of the last six talks', () => {
    const recent = ['a', 'b', 'c', 'd', 'e', 'f']
    for (let i = 0; i < 20; i++) {
      const t = pickTalk(talks, {}, recent, () => i / 20)
      expect(['g', 'h']).toContain(t.id)
    }
  })

  it('still finds something with very few talks', () => {
    expect(pickTalk([{ id: 'a' }], {}, ['a']).id).toBe('a')
    expect(pickTalk([{ id: 'a' }, { id: 'b' }], {}, ['a', 'b'], () => 0).id).toBe('a')
  })

  it('picks failed talks more often than ones said well', () => {
    expect(talkWeight(20)).toBeGreaterThan(talkWeight(90))
    expect(talkWeight(undefined)).toBeGreaterThan(talkWeight(60))
    const two = [{ id: 'good' }, { id: 'bad' }]
    // weights 1 and 4: everything from 0.2 up lands on 'bad'
    expect(pickTalk(two, { good: 95, bad: 10 }, [], () => 0.1).id).toBe('good')
    expect(pickTalk(two, { good: 95, bad: 10 }, [], () => 0.3).id).toBe('bad')
  })
})

describe('road layout', () => {
  it('stops the player just before each person', () => {
    expect(stopZ(0)).toBeGreaterThan(npcZ(0))
    expect(npcZ(1)).toBeLessThan(stopZ(0))
  })

  it('draws the street from behind the start of the walk to past the person', () => {
    const range = chunkRange(3)
    expect(range[0] * CHUNK_LENGTH).toBeLessThanOrEqual(-stopZ(2))
    expect(range[range.length - 1] * CHUNK_LENGTH).toBeGreaterThan(-npcZ(3))
    expect(chunkRange(0)[0]).toBeLessThan(0)
  })

  it('looks the same every time', () => {
    expect(chunkLayout(5)).toEqual(chunkLayout(5))
    expect(npcFor(4)).toEqual(npcFor(4))
    const rand = seededRandom(1)
    for (let i = 0; i < 50; i++) {
      const r = rand()
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(1)
    }
  })

  it('puts people on alternating sides', () => {
    expect(npcFor(0).side).toBe(-npcFor(1).side)
  })
})

describe('road talks', () => {
  it('have unique ids', () => {
    const ids = ROAD_TALKS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('have no numbers to work out', () => {
    for (const t of ROAD_TALKS) {
      expect(joinThai(entrySyllables(t.answer, 'm'))).not.toMatch(/[0-9๐-๙]/)
    }
  })

  it('spell whole words from their syllables', () => {
    const answers = Object.fromEntries(ROAD_TALKS.map((t) => [t.id, joinThai(t.answer.syllables)]))
    expect(answers.hello).toBe('สวัสดี')
    expect(answers['tasty']).toBe('อร่อยมาก')
    expect(answers['w-phone']).toBe('โทรศัพท์')
    expect(answers['from-where']).toBe('มาจากพม่า')
    expect(answers['w-road']).toBe('ถนน')
    expect(answers['w-market']).toBe('ตลาด')
    expect(answers['tr-airport']).toBe('รีบไปสนามบิน')
    expect(answers['tr-station']).toBe('ไปสถานีรถไฟ')
  })

  it('have a picture and both languages on every line', () => {
    for (const t of ROAD_TALKS) {
      for (const line of [t.ask, t.answer]) {
        expect(line.emoji, t.id).toBeTruthy()
        expect(line.syllables.length, t.id).toBeGreaterThan(0)
        expect(line.my, t.id).toMatch(/[\u1000-\u109f]/)
        expect(line.read, t.id).toMatch(/[\u0e00-\u0e7f]/)
        expect(line.read.includes('{I}'), t.id).toBe(line.my.includes('{I}'))
      }
    }
  })

  it('name a recording for each answer', () => {
    const keys = ROAD_TALKS.map((t) => t.answer.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('give each language its own talks about where the player is from', () => {
    const th = ROAD_TALKS_FOR.th.map((t) => t.id)
    const my = ROAD_TALKS_FOR.my.map((t) => t.id)
    expect(th).toContain('from-where')
    expect(th).not.toContain('from-where-thai')
    expect(my).toContain('from-where-thai')
    expect(my).not.toContain('from-where')
  })

  it('cover travel, directions and paying', () => {
    const count = (cat) => ROAD_TALKS.filter((t) => t.cat === cat).length
    expect(count('travel')).toBeGreaterThanOrEqual(10)
    expect(count('directions')).toBeGreaterThanOrEqual(10)
    expect(count('pay')).toBeGreaterThanOrEqual(10)
  })
})

describe('answerChoices', () => {
  const talks = ROAD_TALKS_FOR.th

  it('offers three different answers, one of them right', () => {
    for (let step = 0; step < 30; step++) {
      const talk = talks[step % talks.length]
      const choices = answerChoices(talk, talks, seededRandom(step))
      expect(choices).toHaveLength(3)
      expect(choices.filter((c) => c.correct)).toHaveLength(1)
      expect(choices.find((c) => c.correct).id).toBe(talk.id)
      const texts = choices.map((c) => joinThai(c.entry.syllables))
      expect(new Set(texts).size).toBe(3)
    }
  })

  it('offers words for a word, and other kinds of talk for a question', () => {
    const forWord = answerChoices(roadTalkById['w-water'], talks, seededRandom(1))
    expect(forWord.every((c) => roadTalkById[c.id].cat === 'word')).toBe(true)
    const forLeft = answerChoices(roadTalkById['dir-left'], talks, seededRandom(2))
    for (const c of forLeft.filter((c) => !c.correct)) {
      expect(['word', 'directions']).not.toContain(roadTalkById[c.id].cat)
    }
  })

  it('keeps Burmese scores apart from Thai ones', () => {
    expect(scoreKey('th', 'hello')).toBe('hello')
    expect(scoreKey('my', 'hello')).toBe('my:hello')
  })
})
