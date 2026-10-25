// Text-to-speech with the browser's voices, or a recorded `audio` file when
// there is one, since a real speaker's tones are more exact. Burmese has no
// browser voice on most devices, so Burmese lines rely on recorded files
// (see lib/speakEntry.js).

const cachedVoices = {}

function voiceFor(lang) {
  const prefix = lang.slice(0, 2).toLowerCase()
  if (cachedVoices[prefix]) return cachedVoices[prefix]
  const voices = window.speechSynthesis?.getVoices() ?? []
  const matching = voices.filter((v) => v.lang?.toLowerCase().startsWith(prefix))
  cachedVoices[prefix] = matching.find((v) => v.localService) ?? matching[0] ?? null
  return cachedVoices[prefix]
}

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Voices load asynchronously in most browsers. Resolves with whether a Thai
// voice is installed, or false after a short wait.
export function waitForThaiVoice(timeoutMs = 2000) {
  if (!isTtsSupported()) return Promise.resolve(false)
  if (voiceFor('th')) return Promise.resolve(true)
  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onChange)
      resolve(Boolean(voiceFor('th')))
    }
    const onChange = () => voiceFor('th') && done()
    window.speechSynthesis.addEventListener('voiceschanged', onChange)
    setTimeout(done, timeoutMs)
  })
}

// Files that failed to load, so they aren't tried again.
const missingFiles = new Set()
let playing = null

// Give up on a file that hasn't started playing after this long.
const FILE_START_MS = 4000

// Resolves with 'ok' when the file played to the end, 'missing' when it could
// not be loaded, or 'blocked' when the browser refused to play.
function playFile(src, rate) {
  return new Promise((resolve) => {
    const audio = new Audio(src)
    audio.playbackRate = rate
    playing = audio
    const timer = setTimeout(() => {
      audio.pause()
      resolve('missing')
    }, FILE_START_MS)
    audio.onplaying = () => clearTimeout(timer)
    audio.onended = () => resolve('ok')
    audio.onpause = () => resolve('ok')
    audio.onerror = () => resolve('missing')
    audio.play().catch((e) => resolve(e?.name === 'NotAllowedError' ? 'blocked' : 'missing'))
  })
}

// Speak text in `lang`, from the audio at URL `audio` when there is one.
// Resolves when speaking ends, with whether anything was said, so callers can
// chain lines of dialogue and notice when a line has no sound.
export async function speak(text, { rate = 1, pitch = 1, audio = null, lang = 'th-TH', fileRate = 1 } = {}) {
  stopSpeaking()
  if (audio && !missingFiles.has(audio)) {
    const result = await playFile(audio, fileRate)
    if (result === 'ok') return true
    if (result === 'blocked') return false
    missingFiles.add(audio)
  }
  if (!isTtsSupported()) return false
  const voice = voiceFor(lang)
  // Any voice reads Thai somehow, but another language read by the wrong
  // voice is worse than silence.
  if (!voice && !lang.startsWith('th')) return false
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = rate
    u.pitch = pitch
    if (voice) u.voice = voice
    u.onend = () => resolve(true)
    u.onerror = () => resolve(false)
    synth.speak(u)
  })
}

export function stopSpeaking() {
  if (playing) {
    playing.pause()
    playing = null
  }
  if (isTtsSupported()) window.speechSynthesis.cancel()
}
