import { useState } from 'react'
import { TONES } from '../../data/tones.js'
import { entrySyllables } from '../../lib/syllable.js'
import {
  evaluateAttempt,
  evaluateBurmese,
  selfCheckBurmese,
  selfCheckScore,
} from '../../speech/evaluateAttempt.js'
import { isRecognitionSupported } from '../../speech/recognition.js'
import { useSpeechAttempt } from '../../speech/useSpeechAttempt.js'
import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'
import MicButton from './MicButton.jsx'
import PitchGraph from './PitchGraph.jsx'
import ScoreMeter from './ScoreMeter.jsx'

const WORD_VERDICT = { exact: 'wordRight', close: 'wordClose', none: 'wordWrong' }

// Microphone + feedback for saying one entry: what was heard, whether each
// syllable's tone was right, the pitch graph and the score out of 100. Calls
// onScored(score) after each attempt is judged (by recognition or by the
// player's own check). With learn="my" the entry is said in Burmese and only
// the words are judged (the tone scorer knows Thai tones only).
// Give it key={entry.id} so it starts fresh for each entry.
export default function SpeakPractice({ entry, onScored, learn = 'th' }) {
  const gender = useGameStore((s) => s.gender)
  const voiceHz = useGameStore((s) => s.voiceHz)
  const learnVoice = useGameStore((s) => s.learnVoice)
  const attempt = useSpeechAttempt()
  const [evaluation, setEvaluation] = useState(null)
  const [score, setScore] = useState(null)
  const syllables = entrySyllables(entry, gender)
  const burmese = learn === 'my'

  const finish = (n) => {
    setScore(n)
    onScored?.(n)
  }

  const begin = async () => {
    setEvaluation(null)
    setScore(null)
    const result = await attempt.start(burmese ? 'my-MM' : 'th-TH')
    if (!result) return
    const ev = burmese ? evaluateBurmese(result, entry, gender) : evaluateAttempt(result, entry, gender, voiceHz)
    setEvaluation(ev)
    if (ev.voiceSampleHz) learnVoice(ev.voiceSampleHz)
    if (ev.score != null) finish(ev.score)
  }

  const tones = evaluation?.tones

  return (
    <div className="speak-practice">
      {!isRecognitionSupported() && <p className="notice"><Label k="noRecognition" /></p>}
      <MicButton status={attempt.status} onStart={begin} onStop={attempt.stop} />
      {attempt.error && (
        <p className="notice notice-error">
          <Label k={attempt.error === 'mic-denied' ? 'micDenied' : 'micFailed'} />
        </p>
      )}

      {evaluation && (
        <div className="feedback">
          {evaluation.word && (
            <div className={`verdict verdict-${evaluation.word.match}`}>
              <Label k={WORD_VERDICT[evaluation.word.match]} />
              <div className="heard">
                <Label k="youSaid" className="heard-label" />{' '}
                {evaluation.word.heard ? (
                  <span lang={burmese ? 'my' : 'th'}>{evaluation.word.heard}</span>
                ) : (
                  <Label k="heardNothing" />
                )}
              </div>
            </div>
          )}

          {burmese ? null : tones.tooShort ? (
            <p className="notice"><Label k="toneTooShort" /></p>
          ) : (
            <div className={`verdict ${tones.ok ? 'verdict-exact' : 'verdict-none'}`}>
              <Label k={tones.ok ? 'toneRight' : 'toneWrong'} />
              <div className="tone-results">
                {tones.syllables.map((s, i) => (
                  <span key={i} className={`tone-result ${s.ok ? 'ok' : 'bad'}`}>
                    <span lang="th" style={{ color: TONES[s.target].color }}>{syllables[i].th}</span>
                    {!s.ok && s.detected && (
                      <small>
                        {TONES[s.detected].arrow} → {TONES[s.target].arrow}
                      </small>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!burmese && (
            <PitchGraph
              tones={syllables.map((s) => s.tone)}
              contour={attempt.result?.contour}
              refHz={tones.refHz}
            />
          )}

          {score == null && evaluation.score == null && (
            <div className="self-check">
              <Label k="selfCheck" />
              <div className="row">
                <button type="button" className="btn btn-good" onClick={() => finish(burmese ? selfCheckBurmese(true) : selfCheckScore(true, tones))}>
                  👍 <Label k="selfYes" />
                </button>
                <button type="button" className="btn" onClick={() => finish(burmese ? selfCheckBurmese(false) : selfCheckScore(false, tones))}>
                  👎 <Label k="selfNo" />
                </button>
              </div>
            </div>
          )}
          {score != null && <ScoreMeter score={score} />}
        </div>
      )}
    </div>
  )
}
