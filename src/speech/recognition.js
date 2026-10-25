// Speech recognition through the Web Speech API. Thai works in Chrome
// (desktop and Android) and Safari; Burmese ('my-MM') may not be offered,
// in which case the result rejects with 'language-not-supported'. Needs an
// internet connection.

function recognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function isRecognitionSupported() {
  return recognitionCtor() != null
}

// Start listening for one utterance. `result` resolves with the transcripts
// the recognizer thinks are likely (best first); empty when nothing was heard.
// It rejects with the browser's error code, e.g. 'not-allowed' or 'network'.
export function startRecognition(lang = 'th-TH') {
  const Ctor = recognitionCtor()
  const rec = new Ctor()
  rec.lang = lang
  rec.interimResults = false
  rec.continuous = false
  rec.maxAlternatives = 5

  const result = new Promise((resolve, reject) => {
    let heard = []
    rec.onresult = (event) => {
      heard = Array.from(event.results[0] ?? [], (alt) => alt.transcript)
    }
    rec.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') resolve([])
      else reject(event.error)
    }
    rec.onend = () => resolve(heard)
  })

  rec.start()
  return { result, stop: () => rec.stop() }
}
