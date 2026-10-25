// One spoken Thai syllable: the Thai letters, its tone, a Latin reading with
// tone marks (kept for reference, not shown), and a reading written in
// Burmese script.
export function syl(th, tone, latin, my) {
  return { th, tone, latin, my }
}

// Polite particles. Men end with ครับ; women use ค่ะ for statements and คะ for
// questions. The Burmese translation gets the matching polite ending.
const PARTICLES = {
  m: {
    statement: syl('ครับ', 'high', 'khráp', 'ခရပ်'),
    question: syl('ครับ', 'high', 'khráp', 'ခရပ်'),
    my: 'ခင်ဗျာ',
  },
  f: {
    statement: syl('ค่ะ', 'falling', 'khâ', 'ခ'),
    question: syl('คะ', 'high', 'khá', 'ခ'),
    my: 'ရှင်',
  },
}

// Stands for "I" in a line's syllables: ผม for men, ฉัน for women. In the
// Burmese text and its reading, "I" is written {I}.
export const I = { pronoun: true }
const PRONOUNS = {
  m: syl('ผม', 'rising', 'phǒm', 'ဖုမ်'),
  f: syl('ฉัน', 'rising', 'chǎn', 'ချန်'),
}
// Burmese "I" (ကျွန်တော် for men, ကျွန်မ for women) and its reading in Thai letters.
const BURMESE_I = {
  m: { text: 'ကျွန်တော်', reading: 'จะ-หน่อ' },
  f: { text: 'ကျွန်မ', reading: 'จะ-มะ' },
}

export function burmeseI(gender) {
  return BURMESE_I[gender ?? 'm']
}

// The syllables to show and speak for a vocab entry, said by someone of
// `gender`: "I" becomes ผม or ฉัน, and phrases with a `polite` type get the
// particle that matches.
export function entrySyllables(entry, gender) {
  const syllables = entry.syllables.some((s) => s.pronoun)
    ? entry.syllables.map((s) => (s.pronoun ? PRONOUNS[gender ?? 'm'] : s))
    : entry.syllables
  if (!entry.polite || !gender) return syllables
  // After นะ, women say นะคะ (high tone), never นะค่ะ.
  const afterNa = syllables[syllables.length - 1]?.th === 'นะ'
  return [...syllables, PARTICLES[gender][afterNa ? 'question' : entry.polite]]
}

// The Burmese meaning, with "I" and the polite ending for `gender`.
export function entryTranslation(entry, gender) {
  const my = entry.my.replaceAll('{I}', burmeseI(gender).text)
  if (!entry.polite || !gender) return my
  return `${my} ${PARTICLES[gender].my}`
}

export function joinThai(syllables) {
  return syllables.map((s) => s.th).join('')
}

export function joinMy(syllables) {
  return syllables.map((s) => s.my).join('-')
}
