import { PitchDetector } from 'pitchy'

const FFT_SIZE = 2048
const SAMPLE_EVERY_MS = 15
// Only keep frames that clearly contain a voice in the human speaking range.
const MIN_CLARITY = 0.85
const MIN_HZ = 70
const MAX_HZ = 500

// Record the pitch of the microphone stream over time.
// stop() returns the contour as [{ t, hz }] with t in ms from start.
export function startPitchRecording(stream) {
  const ctx = new AudioContext()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  source.connect(analyser)

  const detector = PitchDetector.forFloat32Array(analyser.fftSize)
  const buffer = new Float32Array(analyser.fftSize)
  const contour = []
  const startedAt = performance.now()

  const timer = setInterval(() => {
    analyser.getFloatTimeDomainData(buffer)
    const [hz, clarity] = detector.findPitch(buffer, ctx.sampleRate)
    if (clarity >= MIN_CLARITY && hz >= MIN_HZ && hz <= MAX_HZ) {
      contour.push({ t: performance.now() - startedAt, hz })
    }
  }, SAMPLE_EVERY_MS)

  return {
    stop() {
      clearInterval(timer)
      source.disconnect()
      ctx.close()
      return smooth(contour)
    },
  }
}

// Drop single-frame octave jumps, a common pitch-detector error.
function smooth(contour) {
  return contour.filter((p, i) => {
    const prev = contour[i - 1]
    const next = contour[i + 1]
    if (!prev || !next) return true
    const jump = (a, b) => Math.abs(Math.log2(a.hz / b.hz)) > 0.4
    return !(jump(p, prev) && jump(p, next))
  })
}
