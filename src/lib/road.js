import { PASS_SCORE } from '../speech/evaluateAttempt.js'
import { entrySyllables, joinThai } from './syllable.js'

// The road game: the player walks along a street that never ends (toward -z)
// and meets one person after another.

// Distance between two people on the road.
export const TALK_SPACING = 16
// Where the first person stands.
const FIRST_TALK_Z = -9
// The player stops this far before the person.
const STOP_BEFORE = 1.5
// People stand this far from the middle of the street.
export const NPC_SIDE_X = 1.3
// The street is built from chunks this long.
export const CHUNK_LENGTH = 8
const CHUNKS_BEHIND = 2
const CHUNKS_AHEAD = 6

// Don't bring back any of the last few talks yet.
const RECENT_GAP = 6
const GOOD_SCORE = 80

export function npcZ(step) {
  return FIRST_TALK_Z - step * TALK_SPACING
}

// Where the player stands to talk with person `step`.
export function stopZ(step) {
  return npcZ(step) + STOP_BEFORE
}

// The street chunks to draw while walking to person `step`: a little behind
// where the walk started (the street goes on behind the start too), and far enough ahead to reach into the fog.
export function chunkRange(step) {
  const startZ = step > 0 ? stopZ(step - 1) : 0
  const first = Math.floor(-startZ / CHUNK_LENGTH) - CHUNKS_BEHIND
  const last = Math.floor(-npcZ(step) / CHUNK_LENGTH) + CHUNKS_AHEAD
  return Array.from({ length: last - first + 1 }, (_, i) => first + i)
}

// New and not-yet-passed talks come up more often than ones said well.
export function talkWeight(best) {
  if (best == null) return 3
  if (best < PASS_SCORE) return 4
  if (best < GOOD_SCORE) return 2
  return 1
}

// Pick the next talk. `scores` holds the best score per talk id, `recent` the
// ids of the latest talks (oldest first). `rand` returns a number in [0, 1).
export function pickTalk(talks, scores, recent, rand = Math.random) {
  const gap = Math.min(RECENT_GAP, talks.length - 1)
  const blocked = new Set(gap > 0 ? recent.slice(-gap) : [])
  const pool = talks.filter((t) => !blocked.has(t.id))
  const weights = pool.map((t) => talkWeight(scores[t.id]))
  let r = rand() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i]
    if (r < 0) return pool[i]
  }
  return pool[pool.length - 1]
}

// Where a talk's best score is saved. Thai keeps the plain id (as the market
// does); Burmese gets its own, since it is a different thing to learn.
export function scoreKey(learn, id) {
  return learn === 'my' ? `my:${id}` : id
}

// The best score per talk id for a player learning `learn`.
export function talkScores(learn, talks, wordScores) {
  return Object.fromEntries(talks.map((t) => [t.id, wordScores[scoreKey(learn, t.id)]]))
}

function shuffle(list, rand) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const CHOICES = 3

// The answers to choose from after hearing a question: the right one and two
// that can't answer it, shuffled. A word gets other words; a question gets
// answers from a different kind of talk (so "turn left" is never offered
// against "go straight"). Answers that read the same in either language as
// one already offered are left out.
export function answerChoices(talk, talks, rand) {
  const isWord = talk.cat === 'word'
  const pool = talks.filter((t) => (isWord ? t.cat === 'word' : t.cat !== 'word' && t.cat !== talk.cat))
  const thai = (entry) => joinThai(entrySyllables(entry, 'm'))
  const seen = new Set([thai(talk.answer), talk.answer.my])
  const picked = [talk]
  for (const t of shuffle(pool, rand)) {
    if (picked.length === CHOICES) break
    const th = thai(t.answer)
    if (t.id === talk.id || seen.has(th) || seen.has(t.answer.my)) continue
    seen.add(th)
    seen.add(t.answer.my)
    picked.push(t)
  }
  return shuffle(picked, rand).map((t) => ({ id: t.id, entry: t.answer, correct: t.id === talk.id }))
}

// Small deterministic random numbers, so the street and its people look the
// same every time they are drawn.
export function seededRandom(seed) {
  let s = Math.imul(seed + 1, 2654435761) >>> 0 || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)]

const NPC_SHIRTS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#2dd4bf', '#fb923c']
const NPC_BOTTOMS = ['#1e3a8a', '#374151', '#7c2d12', '#065f46', '#4c1d95', '#0f172a']
const NPC_SKINS = ['#e0ac69', '#d6a06b', '#c68642', '#f1c27d']
const NPC_HAIR = ['#1f130b', '#3b2314', '#111827']

// The person met at `step`: their gender (for ครับ/ค่ะ), which side of the
// street they stand on, and how they look.
export function npcFor(step) {
  const rand = seededRandom(step * 7919 + 13)
  const gender = rand() < 0.5 ? 'm' : 'f'
  return {
    gender,
    side: step % 2 ? 1 : -1,
    look: {
      shirt: pick(rand, NPC_SHIRTS),
      bottom: pick(rand, NPC_BOTTOMS),
      skin: pick(rand, NPC_SKINS),
      hair: pick(rand, NPC_HAIR),
      hairStyle: gender === 'f' ? pick(rand, ['long', 'bun', 'ponytail']) : 'short',
      bottomType: gender === 'f' ? pick(rand, ['longyi', 'skirt', 'pants']) : pick(rand, ['longyi', 'pants']),
      hat: rand() < 0.2 ? 'ngob' : 'none',
      glasses: rand() < 0.15,
      apron: rand() < 0.2 ? '#fef08a' : null,
    },
  }
}

const FACADES = ['#fde68a', '#bfdbfe', '#fecaca', '#bbf7d0', '#e9d5ff', '#fed7aa', '#f5f5f4', '#a5f3fc']
const AWNINGS = ['#ef4444', '#2563eb', '#16a34a', '#f59e0b', '#db2777']
const SIGNS = ['#dc2626', '#1d4ed8', '#15803d', '#facc15', '#7c3aed', '#0f766e']
// Things on the pavement in front of the shophouses.
const PROPS = ['stall', 'stall', 'tree', 'palm', 'pots', 'busStop', 'motorbike', null, null]

function shophouse(rand) {
  return {
    facade: pick(rand, FACADES),
    awning: pick(rand, AWNINGS),
    sign: pick(rand, SIGNS),
    floors: rand() < 0.4 ? 3 : 2,
    shutterOpen: rand() < 0.7,
    prop: pick(rand, PROPS),
  }
}

// What one chunk of street holds: a shophouse on each side with something in
// front of it, and sometimes a parked tuk-tuk.
export function chunkLayout(index) {
  const rand = seededRandom(index * 104729 + 7)
  return {
    left: shophouse(rand),
    right: shophouse(rand),
    tuktuk: rand() < 0.25 ? (rand() < 0.5 ? -1 : 1) : 0,
  }
}
