import { chatScenarioById } from '../data/chatScenarios.js'
import { UI } from '../data/ui.js'
import { ROAD_TALKS, roadTalkById } from '../data/vocab/road.js'
import { CLOSE_ENOUGH, matchAnswer, normalizeBurmese, normalizeThai } from '../speech/matchAnswer.js'
import { lineFor } from './line.js'

// The game's own chat partner, for when there is no AI (no key, or a static
// host): it plays a scenario from road talks (see `script` in
// data/chatScenarios.js), answers the player's questions from them too, and
// gives the same { reply, feedback } as the AI in server/chat.mjs, plus
// `reply.hint`: the answer the player is expected to give next.
//
// It works from the conversation's text alone, like the AI: the talk it last
// asked is found by the end of its last message.

// Ask the same thing at most this many times before moving on.
const MAX_ASKS = 2

const own = (learn) => (learn === 'th' ? 'my' : 'th')
const normalizer = (learn) => (learn === 'th' ? normalizeThai : normalizeBurmese)

// Talks the player can be asked (some are for one learned language only), and
// talks whose answer the partner can give as their own: a partner speaking
// Thai is Thai, so they answer "from Thailand", not "from Myanmar".
const forPlayer = (talk, learn) => !talk.learn || talk.learn === learn
const forPartner = (talk, learn) => !talk.learn || talk.learn !== learn

// A line in the shape the chat shows ({ text, meaning, reading, syllables,
// emoji }), said by someone of `gender`.
function chatLine(entry, learn, gender) {
  const line = lineFor(entry, learn, gender)
  return {
    text: line.text,
    meaning: line.meaning,
    reading: line.reading,
    syllables: (line.syllables ?? []).map((s) => ({ th: s.th, tone: s.tone })),
    emoji: line.emoji ?? '',
  }
}

// Two lines said one after the other.
function joinLines(a, b) {
  if (!a) return b
  return {
    text: `${a.text} ${b.text}`,
    meaning: `${a.meaning} ${b.meaning}`,
    reading: `${a.reading} · ${b.reading}`,
    syllables: a.syllables.length ? [...a.syllables, { th: ' ', tone: 'mid' }, ...b.syllables] : [],
    emoji: b.emoji,
  }
}

// What a player of `gender` might say for `entry`, in every accepted spelling.
function spellings(entry, learn, gender) {
  const text = lineFor(entry, learn, gender).text
  return learn === 'th' ? [text, ...(entry.accept ?? [])] : [text]
}

function similarity(said, targets, learn) {
  return matchAnswer([said], targets, normalizer(learn)).score
}

// The talks of a scenario's script for this learned language.
export function scriptFor(scenario, learn) {
  return scenario.script.map((id) => roadTalkById[id]).filter((t) => t && forPlayer(t, learn))
}

// The best match in `items` for what the player said, comparing with the
// line `lineOf(item)`, with its score.
function bestMatch(said, items, lineOf, learn, gender) {
  let best = { item: null, score: 0 }
  for (const item of items) {
    const score = similarity(said, spellings(lineOf(item), learn, gender), learn)
    if (score > best.score) best = { item, score }
  }
  return best
}

// Questions the player may ask, each with the partner's answer: every road
// talk's question (but "what is this called?"), and the answers that are
// questions themselves.
const ANSWERED = {
  'dir-toilet': ['dir-straight', 'answer'],
  'dir-market': ['dir-left', 'answer'],
  'dir-know-way': ['dir-turn-where', 'answer'],
  'pay-what': ['pay-twenty', 'answer'],
  'pay-please': ['pay-hundred', 'answer'],
  'pay-expensive': ['pay-discount', 'ask'],
}

function questionsFor(learn) {
  return [
    ...ROAD_TALKS.filter((t) => t.cat !== 'word' && forPartner(t, learn)).map((t) => ({ asked: t.ask, reply: t.answer })),
    ...Object.entries(ANSWERED).map(([id, [replyId, part]]) => ({
      asked: roadTalkById[id].answer,
      reply: roadTalkById[replyId][part],
    })),
  ]
}

function feedback(kind, learn, better = null) {
  const empty = { text: '', meaning: '', reading: '', syllables: [], emoji: '' }
  const notes = { ok: 'chatGood', close: 'chatClose', offTopic: 'chatOffTopic', unknown: 'chatUnknown' }
  return {
    kind: kind === 'close' || kind === 'unknown' ? 'mistake' : kind,
    note: notes[kind] ? UI[notes[kind]][own(learn)] : '',
    better: better ?? empty,
  }
}

// The partner's next turn. `history` is [{ role: 'user' | 'assistant', text }],
// oldest first, ending with the player's message (or empty to start).
export function offlineReply({ learn, gender, scenario: scenarioId, history }) {
  const scenario = chatScenarioById[scenarioId]
  const partner = scenario.partner
  const script = scriptFor(scenario, learn)
  const askOf = (talk) => chatLine(talk.ask, learn, partner)
  const withHint = (line, talk) => ({ ...line, hint: chatLine(talk.answer, learn, gender) })
  const ask = (i, before = null) => withHint(joinLines(before, askOf(script[i])), script[i])

  const said = history.at(-1)?.role === 'user' ? history.at(-1).text : null
  const partnerTurns = history.filter((t) => t.role === 'assistant').map((t) => t.text)
  const last = partnerTurns.at(-1) ?? ''
  // The talk whose question ends the last message (the longest, should one
  // question end with another).
  let at = -1
  script.forEach((t, i) => {
    const text = askOf(t).text
    if (last.endsWith(text) && (at < 0 || text.length > askOf(script[at]).text.length)) at = i
  })

  if (said == null || at < 0) {
    return { reply: ask(0), feedback: feedback('none', learn) }
  }

  const asked = script[at]
  // Every answer that fits what was asked (several talks share a question).
  const askedText = normalizer(learn)(askOf(asked).text)
  const fitting = ROAD_TALKS.filter(
    (t) => forPlayer(t, learn) && normalizer(learn)(lineFor(t.ask, learn, partner).text) === askedText,
  )
  const right = bestMatch(said, fitting, (t) => t.answer, learn, gender)
  const better = chatLine(asked.answer, learn, gender)
  const next = (at + 1) % script.length

  if (right.score === 1) {
    const [id, part] = scenario.after?.[asked.id] ?? []
    const told = id ? chatLine(roadTalkById[id][part], learn, partner) : null
    return { reply: ask(next, told), feedback: feedback('ok', learn) }
  }

  // The player asked something themselves: answer it, then ask again.
  const question = bestMatch(said, questionsFor(learn), (q) => q.asked, learn, gender)
  const asks = [...partnerTurns].reverse().findIndex((text) => !text.endsWith(askOf(asked).text))
  const timesAsked = asks < 0 ? partnerTurns.length : asks
  const moveOn = timesAsked >= MAX_ASKS
  const then = moveOn ? next : at

  if (question.score >= CLOSE_ENOUGH && question.score > right.score) {
    const answer = chatLine(question.item.reply, learn, partner)
    return { reply: ask(then, answer), feedback: feedback('offTopic', learn, better) }
  }
  if (right.score >= CLOSE_ENOUGH) {
    return { reply: ask(next), feedback: feedback('close', learn, chatLine(right.item.answer, learn, gender)) }
  }
  const other = bestMatch(said, ROAD_TALKS.filter((t) => forPlayer(t, learn)), (t) => t.answer, learn, gender)
  const kind = other.score >= CLOSE_ENOUGH ? 'offTopic' : 'unknown'
  return { reply: ask(then), feedback: feedback(kind, learn, better) }
}
