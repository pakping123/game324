import { syl } from './syllable.js'

const DIGITS = [
  syl('ศูนย์', 'rising', 'sǔun', 'ဆုန်'),
  syl('หนึ่ง', 'low', 'nùeng', 'နိုင်'),
  syl('สอง', 'rising', 'sǒong', 'ဆောင်'),
  syl('สาม', 'rising', 'sǎam', 'ဆမ်'),
  syl('สี่', 'low', 'sìi', 'ဆီ'),
  syl('ห้า', 'falling', 'hâa', 'ဟာ'),
  syl('หก', 'low', 'hòk', 'ဟုတ်'),
  syl('เจ็ด', 'low', 'jèt', 'ကျက်'),
  syl('แปด', 'low', 'pàet', 'ပက်'),
  syl('เก้า', 'falling', 'kâo', 'ကောင်'),
]

const SIP = syl('สิบ', 'low', 'sìp', 'ဆစ်')
const YII = syl('ยี่', 'falling', 'yîi', 'ယီ')
const ET = syl('เอ็ด', 'low', 'èt', 'အက်')
const ROI = syl('ร้อย', 'high', 'rói', 'ရွိုင်')
const PHAN = syl('พัน', 'mid', 'phan', 'ဖန်')
const MUEN = syl('หมื่น', 'low', 'mùen', 'မွန်')

export const MAX_THAI_NUMBER = 99999

// Thai number words as syllables, e.g. 21 → ยี่ สิบ เอ็ด.
export function numberToSyllables(n) {
  if (!Number.isInteger(n) || n < 0 || n > MAX_THAI_NUMBER) {
    throw new RangeError(`numberToSyllables: unsupported ${n}`)
  }
  if (n === 0) return [DIGITS[0]]

  const out = []
  const tenThousands = Math.floor(n / 10000)
  const thousands = Math.floor(n / 1000) % 10
  const hundreds = Math.floor(n / 100) % 10
  const tens = Math.floor(n / 10) % 10
  const units = n % 10

  if (tenThousands) out.push(DIGITS[tenThousands], MUEN)
  if (thousands) out.push(DIGITS[thousands], PHAN)
  if (hundreds) out.push(DIGITS[hundreds], ROI)
  if (tens === 1) out.push(SIP)
  else if (tens === 2) out.push(YII, SIP)
  else if (tens) out.push(DIGITS[tens], SIP)
  if (units === 1 && n > 10) out.push(ET)
  else if (units) out.push(DIGITS[units])
  return out
}

export function numberToThai(n) {
  return numberToSyllables(n)
    .map((s) => s.th)
    .join('')
}
