// Pictures for words: each emoji is drawn from Twemoji's SVG set (the same
// picture on every device, flags included), served from jsDelivr. Twemoji is
// CC BY 4.0, credited in the settings panel.
export const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/'

const PICTOGRAPH = /\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/u
const ZWJ = '‍'

const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null

function graphemes(text) {
  if (segmenter) return [...segmenter.segment(text)].map((s) => s.segment)
  return [...text]
}

// Twemoji names a file by the emoji's code points in hex, joined by '-',
// leaving out the variation selector FE0F unless the emoji is a ZWJ sequence
// (the same rule as twemoji.parse).
export function twemojiFile(emoji) {
  const chars = emoji.includes(ZWJ) ? emoji : emoji.replaceAll('️', '')
  return `${[...chars].map((c) => c.codePointAt(0).toString(16)).join('-')}.svg`
}

// Split `text` into emoji pictures and plain text runs (e.g. the numbers on
// money words), in order.
export function pictureParts(text) {
  const parts = []
  for (const g of graphemes(String(text ?? ''))) {
    if (PICTOGRAPH.test(g)) {
      parts.push({ kind: 'emoji', emoji: g, src: TWEMOJI_BASE + twemojiFile(g) })
    } else if (g.trim()) {
      const last = parts[parts.length - 1]
      if (last?.kind === 'text') last.text += g
      else parts.push({ kind: 'text', text: g })
    }
  }
  return parts
}
