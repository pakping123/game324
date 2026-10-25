import { useEffect, useRef, useState } from 'react'
import Hud from '../components/ui/Hud.jsx'
import Label from '../components/ui/Label.jsx'
import Phrase from '../components/ui/Phrase.jsx'
import Picture from '../components/ui/Picture.jsx'
import SpeakPractice from '../components/ui/SpeakPractice.jsx'
import { CHAT_SCENARIOS, chatScenarioById } from '../data/chatScenarios.js'
import { learnFor } from '../lib/line.js'
import { offlineReply } from '../lib/offlineChat.js'
import { speakText } from '../lib/speakEntry.js'
import { syl } from '../lib/syllable.js'
import { isRecognitionSupported, startRecognition } from '../speech/recognition.js'
import { stopSpeaking } from '../speech/tts.js'
import { useGameStore } from '../store/useGameStore.js'

const SPEECH_LANGS = { th: 'th-TH', my: 'my-MM' }
// The game's own partner answers at once; a short pause reads more like talk.
const OFFLINE_PAUSE_MS = 500

// A line from the partner ({ text, meaning, reading, syllables, emoji }) in
// the shape Phrase shows.
function chatLine(line, learn) {
  return {
    lang: learn,
    text: line.text,
    syllables: learn === 'th' && line.syllables?.length ? line.syllables : null,
    reading: line.reading,
    meaning: line.meaning,
  }
}

// The same line as a vocab entry, so it can be practised with the microphone
// (and its Thai tones scored).
function chatEntry(line, learn) {
  if (learn === 'my') return { id: 'chat', my: line.text, read: line.reading, syllables: [] }
  const syllables = line.syllables?.length
    ? line.syllables.map((s) => syl(s.th, s.tone, '', ''))
    : [syl(line.text, 'mid', '', '')]
  return { id: 'chat', syllables, my: line.meaning, accept: [line.text] }
}

function Feedback({ feedback, learn }) {
  const [practising, setPractising] = useState(false)
  const own = learn === 'th' ? 'my' : 'th'
  if (feedback.kind === 'ok') {
    return (
      <div className="chat-feedback is-ok" lang={own}>
        👍 {feedback.note}
      </div>
    )
  }
  if (feedback.kind !== 'offTopic' && feedback.kind !== 'mistake') return null
  return (
    <div className={`chat-feedback is-${feedback.kind}`}>
      <strong>
        {feedback.kind === 'offTopic' ? '🟠' : '🔴'} <Label k={feedback.kind} />
      </strong>
      <p lang={own}>{feedback.note}</p>
      {feedback.better.text && (
        <>
          <Label k="sayInstead" className="chat-say-instead" />
          <Phrase line={chatLine(feedback.better, learn)} size="md" />
          <div className="row">
            <SpeakLineButton text={feedback.better.text} learn={learn} />
            <button type="button" className="btn" onClick={() => setPractising(!practising)}>
              🎤 <Label k="practiseThis" />
            </button>
          </div>
          {practising && <SpeakPractice entry={chatEntry(feedback.better, learn)} learn={learn} />}
        </>
      )}
    </div>
  )
}

// Says a line in the learner's own voice gender.
function SpeakLineButton({ text, learn, gender }) {
  const playerGender = useGameStore((s) => s.gender)
  const settings = useGameStore((s) => s.settings)
  return (
    <button
      type="button"
      className="btn btn-listen"
      onClick={() => speakText(text, learn, gender ?? playerGender, settings)}
      aria-label="listen"
    >
      🔊
    </button>
  )
}

// Talk with a partner in a chosen situation, by voice or by typing. The
// partner answers in the language being learned (with meaning and reading
// help) and says when the player's answer was off topic or not quite right,
// with a better sentence to practise. The partner is the game's own
// (lib/offlineChat.js), which runs in the browser at no cost and offers a
// hint for each answer.
export default function ChatScreen() {
  const gender = useGameStore((s) => s.gender)
  const learn = learnFor(useGameStore((s) => s.lang))
  const goBack = useGameStore((s) => s.goBack)
  const [scenarioId, setScenarioId] = useState(null)
  // { who: 'ai', line } and { who: 'me', text, feedback }, oldest first.
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [draft, setDraft] = useState('')
  const [hintOpen, setHintOpen] = useState(false)
  const listening = useRef(null)
  const logRef = useRef(null)
  const scenario = chatScenarioById[scenarioId]

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [items, status])

  useEffect(
    () => () => {
      listening.current?.stop()
      stopSpeaking()
    },
    [],
  )

  // Send the conversation so far (ending with the player's message, or empty
  // to have the partner open) and add the reply.
  const send = async (nextItems, chosen = scenario) => {
    setItems(nextItems)
    setStatus('waiting')
    setError(null)
    setHintOpen(false)
    const history = nextItems.map((it) =>
      it.who === 'ai' ? { role: 'assistant', text: it.line.text } : { role: 'user', text: it.text },
    )
    await new Promise((resolve) => setTimeout(resolve, OFFLINE_PAUSE_MS))
    const { reply, feedback } = offlineReply({ learn, gender, scenario: chosen.id, history })
    const withFeedback = nextItems.map((it, i) =>
      i === nextItems.length - 1 && it.who === 'me' ? { ...it, feedback } : it,
    )
    setItems([...withFeedback, { who: 'ai', line: reply }])
    setStatus('idle')
    speakText(reply.text, learn, chosen.partner, useGameStore.getState().settings)
  }

  const start = (s) => {
    setScenarioId(s.id)
    send([], s)
  }

  const say = (text) => {
    const clean = text.trim()
    if (!clean || status === 'waiting') return
    setDraft('')
    send([...items, { who: 'me', text: clean }])
  }

  const listen = async () => {
    if (listening.current) {
      listening.current.stop()
      return
    }
    stopSpeaking()
    try {
      const rec = startRecognition(SPEECH_LANGS[learn])
      listening.current = rec
      setStatus('listening')
      const heard = await rec.result
      setStatus('idle')
      if (heard[0]) say(heard[0])
    } catch {
      setStatus('error')
      setError('mic')
    } finally {
      listening.current = null
    }
  }

  const restart = () => {
    stopSpeaking()
    setScenarioId(null)
    setItems([])
    setStatus('idle')
    setError(null)
    setHintOpen(false)
  }

  const lastAi = items.at(-1)?.who === 'ai' ? items.at(-1).line : null

  return (
    <div className="screen screen-chat">
      <Hud
        onBack={goBack}
        title={
          <>
            🤖 <Label k="chatTitle" />
          </>
        }
      />
      {!scenario ? (
        <div className="chat-scenarios">
          <h2>
            <Label k="pickScene" />
          </h2>
          <Label k="chatTip" className="chat-tip" />
          <div className="chat-scenario-grid">
            {CHAT_SCENARIOS.map((s) => (
              <button key={s.id} type="button" className="chat-scenario" onClick={() => start(s)}>
                <Picture text={s.emoji} className="chat-scenario-emoji" />
                <Label text={s.label} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="chat-log" ref={logRef}>
            {items.map((it, i) =>
              it.who === 'ai' ? (
                <div key={i} className="chat-row is-ai">
                  <span className="chat-avatar">
                    {scenario.emoji}
                    {scenario.partner === 'f' ? '👩' : '👨'}
                  </span>
                  <div className="chat-bubble">
                    {it.line.emoji && <Picture text={it.line.emoji} className="chat-picture" />}
                    <Phrase line={chatLine(it.line, learn)} size="md" />
                    <SpeakLineButton text={it.line.text} learn={learn} gender={scenario.partner} />
                  </div>
                </div>
              ) : (
                <div key={i} className="chat-row is-me">
                  <div className="chat-bubble" lang={learn}>
                    {it.text}
                  </div>
                  {it.feedback && <Feedback feedback={it.feedback} learn={learn} />}
                </div>
              ),
            )}
            {status === 'waiting' && (
              <div className="chat-row is-ai">
                <span className="chat-avatar">{scenario.emoji}</span>
                <div className="chat-bubble chat-typing">
                  <Label k="thinking" />
                </div>
              </div>
            )}
            {status === 'idle' && lastAi?.hint && (
              <div className="chat-hint">
                <button
                  type="button"
                  className={`btn btn-hint ${hintOpen ? 'is-open' : ''}`}
                  aria-expanded={hintOpen}
                  onClick={() => setHintOpen(!hintOpen)}
                >
                  💡 <Label k="showHint" />
                </button>
                {hintOpen && (
                  <div className="chat-hint-card">
                    <Label k="answerLike" className="chat-say-instead" />
                    <Phrase line={chatLine(lastAi.hint, learn)} size="md" />
                    <SpeakLineButton text={lastAi.hint.text} learn={learn} />
                  </div>
                )}
              </div>
            )}
            {status === 'error' && error === 'mic' && (
              <div className="notice notice-error chat-error">
                <Label k="micFailed" />
              </div>
            )}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              say(draft)
            }}
          >
            <button type="button" className="btn btn-ghost btn-round" onClick={restart} aria-label="new chat" title="เริ่มใหม่">
              ↺
            </button>
            {isRecognitionSupported() && (
              <button
                type="button"
                className={`mic-small ${status === 'listening' ? 'is-listening' : ''}`}
                onClick={listen}
                disabled={status === 'waiting'}
                aria-pressed={status === 'listening'}
                aria-label="speak"
              >
                🎤
              </button>
            )}
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              lang={learn}
              placeholder={status === 'listening' ? '…' : '✍️'}
              aria-label="message"
              maxLength={200}
            />
            <button type="submit" className="btn btn-primary" disabled={!draft.trim() || status === 'waiting'}>
              <Label k="send" />
            </button>
          </form>
        </>
      )}
    </div>
  )
}
