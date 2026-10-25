import { speak } from '../speech/tts.js'
import { lineFor } from './line.js'

export const NORMAL_RATE = 0.9
export const SLOW_RATE = 0.6
// Recorded files are already at a natural speed.
const SLOW_FILE_RATE = 0.75

const SPEECH_LANGS = { th: 'th-TH', my: 'my-MM' }

// Most devices have a single voice per language, usually a woman's, so a
// man's lines are read lower to sound like him.
const VOICE_PITCH = { m: 0.7, f: 1.05 }

export function speechRate(settings) {
  return settings.slowSpeech ? SLOW_RATE : NORMAL_RATE
}

export function voicePitch(gender) {
  return VOICE_PITCH[gender] ?? 1
}

// Recorded lines, when added, live in audio/<lang>/: one
// file per line and speaker gender, since the polite ending, "I" and the
// voice all change with it. The game only plays files listed in the folder's
// index.json: a missing file can't be told apart quickly from a slow one.
export function audioPath(learn, entry, gender) {
  return `audio/${learn}/${entry.key}-${gender ?? 'm'}.mp3`
}

export function audioIndexPath(learn) {
  return `audio/${learn}/index.json`
}

const indexes = {}

function recordedFiles(learn) {
  indexes[learn] ??= fetch(`${import.meta.env.BASE_URL}${audioIndexPath(learn)}`)
    .then((res) => (res.ok ? res.json() : []))
    .then((paths) => new Set(Array.isArray(paths) ? paths : []))
    .catch(() => new Set())
  return indexes[learn]
}

// Say `text` in `learn` ('th' or 'my') as someone of `gender` would: from the
// recording at `recorded` when given, else with the browser's voice. Resolves
// with whether there was any sound (most devices have no Burmese voice).
export async function speakText(text, learn, gender, settings, recorded = null) {
  return speak(text, {
    lang: SPEECH_LANGS[learn],
    rate: speechRate(settings),
    pitch: voicePitch(gender),
    audio: recorded,
    fileRate: settings.slowSpeech ? SLOW_FILE_RATE : 1,
  })
}

// Say a vocab entry in `learn` as someone of `gender` would (see speakText).
export async function speakLine(entry, learn, gender, settings) {
  const path = audioPath(learn, entry, gender)
  const recorded = entry.key ? await recordedFiles(learn) : new Set()
  const src = recorded.has(path) ? `${import.meta.env.BASE_URL}${path}` : null
  return speakText(lineFor(entry, learn, gender).text, learn, gender, settings, src)
}
