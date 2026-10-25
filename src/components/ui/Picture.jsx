import { useState } from 'react'
import { pictureParts } from '../../lib/picture.js'

// One emoji as a Twemoji picture; the device's own emoji if it can't load
// (e.g. offline).
function Emoji({ part }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="pic-emoji">{part.emoji}</span>
  return (
    <img
      className="pic-img"
      src={part.src}
      alt=""
      draggable={false}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

// A word's picture (its emoji, see lib/picture.js), sized by the font size
// of where it sits.
export default function Picture({ text, className = '' }) {
  const parts = pictureParts(text)
  if (!parts.length) return null
  return (
    <span className={`picture ${className}`} role="img" aria-label={text}>
      {parts.map((p, i) =>
        p.kind === 'emoji' ? (
          <Emoji key={`${i}-${p.src}`} part={p} />
        ) : (
          <span key={i} className="pic-text">
            {p.text}
          </span>
        ),
      )}
    </span>
  )
}
