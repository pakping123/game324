import { useCallback, useEffect, useRef, useState } from 'react'
import { startPitchRecording } from './pitch.js'
import { isRecognitionSupported, startRecognition } from './recognition.js'
import { stopSpeaking } from './tts.js'

const MAX_LISTEN_MS = 6000
// Without speech recognition nothing tells us the player finished, so stop
// after this long unless they tap the mic again.
const MANUAL_LISTEN_MS = 3500

// One "say it" attempt: records the voice pitch and, where the browser can,
// recognizes the words at the same time.
//
// status: 'idle' | 'listening' | 'done' | 'error'
// result: { heard: string[], contour: [{t, hz}], recognized: boolean, recError }
// `recognized` is false when the recognizer was missing or failed (offline,
// language not offered), so the player checks themselves instead.
// error:  'mic-denied' | 'mic-failed'
//
// start(lang) also resolves with the result (or null if the attempt failed or was
// cancelled), so callers can react to it right in their event handler.
export function useSpeechAttempt() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  // The attempt in progress. Cleared by reset/unmount, which tells a running
  // attempt that nobody is waiting for its result any more.
  const session = useRef(null)

  const stop = useCallback(() => session.current?.stop(), [])

  const start = useCallback(async (lang = 'th-TH') => {
    if (session.current) return null
    let stopEarly
    const stopped = new Promise((resolve) => {
      stopEarly = resolve
    })
    const current = { stop: () => stopEarly() }
    session.current = current
    stopSpeaking()
    setStatus('listening')
    setResult(null)
    setError(null)

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e) {
      if (session.current !== current) return null
      session.current = null
      setStatus('error')
      setError(e?.name === 'NotAllowedError' ? 'mic-denied' : 'mic-failed')
      return null
    }
    if (session.current !== current) {
      stream.getTracks().forEach((t) => t.stop())
      return null
    }

    const pitch = startPitchRecording(stream)
    let rec = null
    if (isRecognitionSupported()) {
      try {
        rec = startRecognition(lang)
      } catch {
        rec = null
      }
    }
    current.stop = () => {
      rec?.stop()
      stopEarly()
    }
    const timer = setTimeout(current.stop, rec ? MAX_LISTEN_MS : MANUAL_LISTEN_MS)

    let heard = []
    let recError = null
    try {
      heard = rec ? await rec.result : (await stopped, [])
    } catch (e) {
      recError = e
    }

    clearTimeout(timer)
    const contour = pitch.stop()
    stream.getTracks().forEach((t) => t.stop())
    if (session.current !== current) return null
    session.current = null
    const attempt = { heard, contour, recognized: Boolean(rec) && !recError, recError }
    setResult(attempt)
    setStatus('done')
    return attempt
  }, [])

  const reset = useCallback(() => {
    session.current?.stop()
    session.current = null
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [])

  useEffect(
    () => () => {
      session.current?.stop()
      session.current = null
    },
    [],
  )

  return { status, result, error, start, stop, reset }
}
