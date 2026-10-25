import { MAX_THAI_NUMBER, numberToThai } from '../lib/thaiNumber.js'

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙'
const PARTICLE_END = /(ครับผม|ครับ|คับ|ค่ะ|คะ|ค่า|จ้ะ|จ้า|จ๊ะ|นะ)+$/
// Zero-width characters sit outside the class: a joiner inside one is a lint error.
const STRIP = /[\s.,!?'"“”‘’\-–—:;()]|\u200b|\u200c|\u200d/g

// Speech recognizers return text in different shapes: "100 บาท", "๑๐๐บาท",
// "หนึ่งร้อยบาทครับ". Bring them all to one comparable form: Thai number words,
// no spaces or punctuation, no trailing polite particle.
export function normalizeThai(text) {
  let s = String(text ?? '')
  s = s.replace(/[๐-๙]/g, (d) => String(THAI_DIGITS.indexOf(d)))
  s = s.replace(/\d[\d,]*/g, (m) => {
    const n = Number(m.replace(/,/g, ''))
    return Number.isInteger(n) && n <= MAX_THAI_NUMBER ? numberToThai(n) : m
  })
  s = s.replace(STRIP, '')
  s = s.replace(PARTICLE_END, '')
  return s
}

const BURMESE_STRIP = /[\s.,!?'"“”‘’\-–—:;()၊။]|\u200b|\u200c|\u200d/g
// Polite endings: ခင်ဗျာ / ခင်ဗျ / ဗျာ (men), ရှင် / ရှင့် (women).
const BURMESE_PARTICLE_END = /(ခင်ဗျာ|ခင်ဗျ|ဗျာ|ဗျ|ရှင့်|ရှင်)+$/

// The same for Burmese: no spaces or punctuation, no polite ending.
export function normalizeBurmese(text) {
  return String(text ?? '')
    .replace(BURMESE_STRIP, '')
    .replace(BURMESE_PARTICLE_END, '')
}

// Levenshtein distance over code points.
function editDistance(a, b) {
  const x = [...a]
  const y = [...b]
  let prev = Array.from({ length: y.length + 1 }, (_, j) => j)
  for (let i = 1; i <= x.length; i++) {
    const cur = [i]
    for (let j = 1; j <= y.length; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
    }
    prev = cur
  }
  return prev[y.length]
}

export function similarity(a, b) {
  const longest = Math.max([...a].length, [...b].length)
  if (longest === 0) return 1
  return 1 - editDistance(a, b) / longest
}

export const CLOSE_ENOUGH = 0.75

// Compare what the recognizer heard (several alternatives) with the accepted
// answers. 'exact' when any pair matches after normalizing, 'close' when the
// best pair is similar enough, otherwise 'none'.
export function matchAnswer(heard, targets, normalize = normalizeThai) {
  const heardNorm = heard.map(normalize).filter(Boolean)
  const targetNorm = targets.map(normalize).filter(Boolean)
  let best = { match: 'none', score: 0, heard: heard[0] ?? '' }

  heardNorm.forEach((h, i) => {
    for (const t of targetNorm) {
      const score = similarity(h, t)
      if (score > best.score) best = { match: 'none', score, heard: heard[i] }
    }
  })

  if (best.score === 1) best.match = 'exact'
  else if (best.score >= CLOSE_ENOUGH) best.match = 'close'
  return best
}
