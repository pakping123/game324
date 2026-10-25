import { TONES } from '../../data/tones.js'
import { hzToSemitones, TONE_TEMPLATES } from '../../speech/toneScore.js'
import Label from './Label.jsx'

const W = 320
const H = 140
const PAD = 10
const SEMI_RANGE = 6

const y = (semi) => {
  const clamped = Math.max(-SEMI_RANGE, Math.min(SEMI_RANGE, semi))
  return H / 2 - (clamped / SEMI_RANGE) * (H / 2 - PAD)
}

const toPath = (points) => points.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('')

// The target tone shapes (thick colored lines, one per syllable) with the
// player's recorded pitch drawn on top, so they can see where they went
// too high, too low, or the wrong way.
export default function PitchGraph({ tones, contour = [], refHz = null }) {
  const slot = (W - PAD * 2) / tones.length

  const targets = tones.map((tone, s) => {
    const tpl = TONE_TEMPLATES[tone]
    const pts = tpl.map((semi, i) => [PAD + s * slot + (i / (tpl.length - 1)) * slot * 0.86 + slot * 0.07, y(semi)])
    return { tone, d: toPath(pts) }
  })

  let player = null
  if (contour.length > 1 && refHz) {
    const t0 = contour[0].t
    const span = contour[contour.length - 1].t - t0 || 1
    const pts = contour.map((p) => [PAD + ((p.t - t0) / span) * (W - PAD * 2), y(hzToSemitones(p.hz, refHz))])
    player = toPath(pts)
  }

  return (
    <figure className="pitch-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img">
        <rect x="0" y="0" width={W} height={H} rx="12" className="pitch-bg" />
        <line x1={PAD} x2={W - PAD} y1={H / 2} y2={H / 2} className="pitch-mid" />
        {targets.map((t, i) => (
          <path key={i} d={t.d} stroke={TONES[t.tone].color} className="pitch-target" />
        ))}
        {player && <path d={player} className="pitch-player" />}
      </svg>
      <figcaption>
        <span className="pitch-key pitch-key-target" />
        <Label k="targetVoice" />
        {player && (
          <>
            <span className="pitch-key pitch-key-player" />
            <Label k="yourVoice" />
          </>
        )}
      </figcaption>
    </figure>
  )
}
