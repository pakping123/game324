import { describe, expect, it } from 'vitest'
import { CHAT_SCENARIOS, chatScenarioById } from '../data/chatScenarios.js'
import { roadTalkById } from '../data/vocab/road.js'
import { lineFor } from './line.js'
import { offlineReply, scriptFor } from './offlineChat.js'

const say = (id, part, learn, gender) => lineFor(roadTalkById[id][part], learn, gender).text

// Play `scenario` for a player learning `learn`, given their messages.
function play(scenario, learn, gender, messages) {
  const history = []
  const turns = []
  const step = () => {
    const turn = offlineReply({ learn, gender, scenario, history })
    history.push({ role: 'assistant', text: turn.reply.text })
    turns.push(turn)
  }
  step()
  for (const text of messages) {
    history.push({ role: 'user', text })
    step()
  }
  return turns
}

describe('offlineReply', () => {
  it('opens with the first talk of the script, with a hint', () => {
    const [first] = play('market', 'th', 'm', [])
    expect(first.reply.text).toBe('สวัสดีค่ะ')
    expect(first.reply.hint.text).toBe('สวัสดีครับ')
    expect(first.feedback.kind).toBe('none')
  })

  it('praises the right answer and asks the next thing', () => {
    const turns = play('market', 'th', 'f', ['สวัสดีค่ะ'])
    expect(turns[1].feedback.kind).toBe('ok')
    expect(turns[1].reply.text).toBe(say('pay-what', 'ask', 'th', 'f'))
  })

  it('writes notes in the player’s own language', () => {
    const [, burmese] = play('market', 'th', 'm', ['สวัสดีครับ'])
    expect(burmese.feedback.note).toMatch(/[က-႟]/)
    const [, thai] = play('market', 'my', 'm', ['မင်္ဂလာပါ'])
    expect(thai.feedback.note).toMatch(/[฀-๿]/)
  })

  it('accepts answers without spaces or the polite ending', () => {
    const turns = play('restaurant', 'th', 'm', ['สวัสดี', 'อยากกิน ข้าวผัด'])
    expect(turns[1].feedback.kind).toBe('ok')
    expect(turns[2].feedback.kind).toBe('ok')
  })

  it('corrects a near miss and moves on', () => {
    const turns = play('restaurant', 'th', 'm', ['สวัสดีครับ', 'อยากกินข้าวผัก'])
    expect(turns[2].feedback.kind).toBe('mistake')
    expect(turns[2].feedback.better.text).toBe('อยากกินข้าวผัดครับ')
    expect(turns[2].reply.text).toBe(say('spicy', 'ask', 'th', 'f'))
  })

  it('answers the player’s own question, says it was off topic and asks again', () => {
    const turns = play('market', 'th', 'm', ['สวัสดีครับ', 'ห้องน้ำอยู่ไหน'])
    const reply = turns[2]
    expect(reply.feedback.kind).toBe('offTopic')
    expect(reply.feedback.better.text).toBe(say('pay-what', 'answer', 'th', 'm'))
    expect(reply.reply.text.endsWith(say('pay-what', 'ask', 'th', 'f'))).toBe(true)
    expect(reply.reply.text.startsWith(say('dir-straight', 'answer', 'th', 'f'))).toBe(true)
  })

  it('moves on after asking the same thing twice', () => {
    const turns = play('market', 'th', 'm', ['สวัสดีครับ', 'กกกก', 'ขขขข'])
    expect(turns[2].reply.text).toBe(say('pay-what', 'ask', 'th', 'f'))
    expect(turns[3].reply.text).toBe(say('pay-expensive', 'ask', 'th', 'f'))
  })

  it('tells the way after the player asks it', () => {
    const toilet = say('dir-toilet', 'answer', 'th', 'f')
    const turns = play('directions', 'th', 'f', ['สวัสดีค่ะ', toilet])
    expect(turns[2].feedback.kind).toBe('ok')
    expect(turns[2].reply.text.startsWith(say('dir-straight', 'answer', 'th', 'm'))).toBe(true)
  })

  it('answers questions asked by the player', () => {
    const turns = play('restaurant', 'th', 'm', ['สวัสดีครับ', 'อันนี้เท่าไหร่ครับ'])
    expect(turns[2].reply.text.startsWith(say('pay-twenty', 'answer', 'th', 'f'))).toBe(true)
  })

  it('answers as a native of the language being learned', () => {
    const thai = play('free', 'th', 'm', ['มาจากไหนครับ'])[1]
    expect(thai.reply.text.startsWith('มาจากเมืองไทย')).toBe(true)
    const burmese = play('free', 'my', 'm', ['ဘယ်က လာတာလဲ'])[1]
    expect(burmese.reply.text.startsWith('မြန်မာပြည်က')).toBe(true)
  })

  it('starts over at the end of the script', () => {
    const script = scriptFor(chatScenarioById.market, 'th')
    const answers = script.map((t) => lineFor(t.answer, 'th', 'm').text)
    const turns = play('market', 'th', 'm', answers)
    expect(turns.slice(1).every((t) => t.feedback.kind === 'ok')).toBe(true)
    expect(turns.at(-1).reply.text).toBe(turns[0].reply.text)
  })

  it('plays every scenario in both languages', () => {
    for (const s of CHAT_SCENARIOS) {
      for (const learn of ['th', 'my']) {
        const script = scriptFor(s, learn)
        expect(script.length).toBeGreaterThan(3)
        // Each question is told apart by its text.
        const asks = script.map((t) => lineFor(t.ask, learn, s.partner).text)
        expect(new Set(asks).size).toBe(asks.length)
        const answers = script.map((t) => lineFor(t.answer, learn, 'f').text)
        const turns = play(s.id, learn, 'f', answers)
        expect(turns.slice(1).map((t) => t.feedback.kind)).toEqual(answers.map(() => 'ok'))
      }
    }
  })

  it('only refers to talks that exist', () => {
    for (const s of CHAT_SCENARIOS) {
      for (const id of s.script) expect(roadTalkById[id], id).toBeDefined()
      for (const [id, part] of Object.values(s.after ?? {})) expect(roadTalkById[id]?.[part], id).toBeDefined()
    }
  })
})
