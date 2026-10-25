import { useState } from 'react'
import { lineFor } from '../../lib/line.js'
import { entrySyllables } from '../../lib/syllable.js'
import { isPass } from '../../speech/evaluateAttempt.js'
import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'
import ListenButton from './ListenButton.jsx'
import Phrase from './Phrase.jsx'
import Picture from './Picture.jsx'
import SpeakPractice from './SpeakPractice.jsx'
import ToneLegend from './ToneLegend.jsx'

// Failed tries before the player may skip a talk.
const SKIP_AFTER_FAILS = 3

// One meeting on the road, in two steps:
// 1. listen: the person's question is heard, not shown, and the player picks
//    the right answer from `choices` (pictures and meanings in their own
//    language). The question text is a tap away, and shows by itself when
//    the line has no sound (`questionSilent`).
// 2. speak: the answer, in the language being learned, with a listen button
//    and the microphone. A score of 50 or more passes; then the player can
//    walk on or keep trying for a better score.
// `learn` is the language being learned; `scoreId` where the score is saved.
// Give it a new key for each meeting.
export default function RoadTalk({
  talk,
  choices,
  speaker,
  learn,
  scoreId,
  questionSilent,
  onHearQuestion,
  onMood,
  onPass,
  onWalkOn,
  onSkip,
}) {
  const gender = useGameStore((s) => s.gender)
  const recordWord = useGameStore((s) => s.recordWord)
  const [stage, setStage] = useState('listen')
  const [wrongPicks, setWrongPicks] = useState([])
  const [showQuestion, setShowQuestion] = useState(false)
  const [fails, setFails] = useState(0)
  const [passed, setPassed] = useState(false)
  const [round, setRound] = useState(0)

  const askLine = lineFor(talk.ask, learn, speaker)
  const answerLine = lineFor(talk.answer, learn, gender)
  const own = learn === 'th' ? 'my' : 'th'
  const questionShown = stage === 'speak' || showQuestion || questionSilent

  const pick = (choice) => {
    if (choice.correct) {
      onMood('happy')
      setStage('speak')
    } else {
      onMood('confused')
      setWrongPicks([...wrongPicks, choice.id])
    }
  }

  const scored = (score) => {
    if (score > 0) recordWord(scoreId, score)
    if (isPass(score)) {
      onMood('happy')
      if (!passed) {
        setPassed(true)
        onPass()
      }
    } else {
      onMood('confused')
      setFails(fails + 1)
    }
  }

  return (
    <div className="road-talk">
      <div className="talk-ask">
        <Picture text={talk.ask.emoji} className="talk-icon" />
        <div className="talk-bubble">
          {questionShown ? (
            <Phrase line={askLine} size="md" />
          ) : (
            <div className="talk-hidden" aria-hidden="true">
              🔊 · · ·
            </div>
          )}
          <div className="row">
            <button type="button" className="btn" onClick={onHearQuestion}>
              <span className="btn-icon">🔊</span> <Label k="hearQuestion" />
            </button>
            {!questionShown && (
              <button type="button" className="btn btn-ghost" onClick={() => setShowQuestion(true)}>
                👀 <Label k="showQuestion" />
              </button>
            )}
          </div>
          {questionSilent && stage === 'listen' && <Label k="noSound" className="notice-small" />}
        </div>
      </div>

      {stage === 'listen' ? (
        <div className="panel talk-choices">
          <Label k="pickAnswer" className="talk-answer-label" />
          {choices.map((c) => {
            const wrong = wrongPicks.includes(c.id)
            return (
              <button
                key={c.id}
                type="button"
                className={`choice ${wrong ? 'is-wrong' : ''}`}
                disabled={wrong}
                onClick={() => pick(c)}
              >
                <Picture text={c.entry.emoji} className="choice-emoji" />
                <span className="choice-text" lang={own}>
                  {lineFor(c.entry, learn, gender).meaning}
                </span>
              </button>
            )
          })}
          {wrongPicks.length > 0 && <Label k="notThis" className="notice-small" />}
        </div>
      ) : (
        <div className="panel talk-answer">
          <Label k="answerLike" className="talk-answer-label" />
          <Picture text={talk.answer.emoji} className="talk-answer-emoji" />
          <Phrase line={answerLine} size="lg" />
          {learn === 'th' && <ToneLegend syllables={entrySyllables(talk.answer, gender)} />}
          <ListenButton entry={talk.answer} label="hearAnswer" learn={learn} />
          <SpeakPractice key={round} entry={talk.answer} learn={learn} onScored={scored} />
          <div className="row talk-actions">
            {passed && (
              <button type="button" className="btn btn-primary btn-big" onClick={onWalkOn}>
                🚶 <Label k="walkOn" /> ▶
              </button>
            )}
            {(passed || fails > 0) && (
              <button type="button" className="btn" onClick={() => setRound(round + 1)}>
                🔄 <Label k="tryAgain" />
              </button>
            )}
            {!passed && fails >= SKIP_AFTER_FAILS && (
              <button type="button" className="btn btn-ghost" onClick={onSkip}>
                <Label k="skip" /> ⏭
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
