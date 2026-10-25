import { burmeseI, entrySyllables, entryTranslation, joinMy, joinThai } from './syllable.js'

// The game goes both ways: Burmese speakers ('my') learn Thai, Thai speakers
// ('th') learn Burmese. `lang` is the player's own language; this is the one
// they learn.
export function learnFor(lang) {
  return lang === 'th' ? 'my' : 'th'
}

// Burmese polite endings (the ครับ/ค่ะ of Burmese), with their readings.
const BURMESE_POLITE = {
  m: { text: 'ခင်ဗျာ', reading: 'ขะ-มยา' },
  f: { text: 'ရှင်', reading: 'ชิ่น' },
}

export function burmesePolite(gender) {
  return BURMESE_POLITE[gender]
}

// One line of talk as shown to a player learning `learn`, said by someone of
// `gender`:
// - text: in the language being learned (`syllables` too for Thai, so each
//   can be colored by its tone);
// - reading: how to say it, in the player's own script (Thai in Burmese
//   letters for Burmese players, Burmese in Thai letters for Thai players);
// - meaning: in the player's own language.
export function lineFor(entry, learn, gender) {
  if (learn === 'my') {
    const polite = entry.polite && gender ? BURMESE_POLITE[gender] : null
    const me = burmeseI(gender)
    const add = (s, key) => {
      const said = s.replaceAll('{I}', me[key])
      return polite ? `${said} ${polite[key]}` : said
    }
    return {
      lang: 'my',
      text: add(entry.my, 'text'),
      syllables: null,
      reading: add(entry.read, 'reading'),
      meaning: joinThai(entrySyllables(entry, gender)),
      emoji: entry.emoji,
    }
  }
  const syllables = entrySyllables(entry, gender)
  return {
    lang: 'th',
    text: joinThai(syllables),
    syllables,
    reading: joinMy(syllables),
    meaning: entryTranslation(entry, gender),
    emoji: entry.emoji,
  }
}
