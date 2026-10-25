import { Canvas } from '@react-three/fiber'
import { useRef, useState } from 'react'
import Road from '../components/three/Road.jsx'
import Hud from '../components/ui/Hud.jsx'
import Label from '../components/ui/Label.jsx'
import Picture from '../components/ui/Picture.jsx'
import RoadTalk from '../components/ui/RoadTalk.jsx'
import { FIRST_TALK_ID, ROAD_TALKS_FOR, roadTalkById } from '../data/vocab/road.js'
import { learnFor } from '../lib/line.js'
import { answerChoices, npcFor, pickTalk, scoreKey, seededRandom, talkScores } from '../lib/road.js'
import { speakLine } from '../lib/speakEntry.js'
import { stopSpeaking } from '../speech/tts.js'
import { useGameStore } from '../store/useGameStore.js'

// How many past talks to remember for choosing the next one.
const HISTORY = 10

// Browsers only let a page speak after the player has tapped something. When
// the game opens straight onto the road (e.g. after a reload), wait for a tap.
function hasUserTapped() {
  return navigator.userActivation?.hasBeenActive !== false
}

// The main game: walk down an endless street, meet people, understand what
// they say and answer out loud. No levels; every talk can come up at any
// time. Burmese players answer in Thai, Thai players in Burmese.
// Give it key={lang} so a language change starts a fresh walk.
export default function RoadScreen() {
  const lang = useGameStore((s) => s.lang)
  const goTo = useGameStore((s) => s.goTo)
  const learn = learnFor(lang)
  const talks = ROAD_TALKS_FOR[learn]
  const [started, setStarted] = useState(hasUserTapped)
  const [step, setStep] = useState(0)
  // The talk at each step, newest last; the last one is the current talk.
  const [history, setHistory] = useState([FIRST_TALK_ID])
  const [talking, setTalking] = useState(false)
  const [mood, setMood] = useState('idle')
  const [walk, setWalk] = useState({ passed: 0, streak: 0 })
  // The step whose question turned out to have no sound.
  const [silentStep, setSilentStep] = useState(-1)
  const bubbleRef = useRef(null)

  const talk = roadTalkById[history[history.length - 1]]
  const prevTalk = roadTalkById[history[history.length - 2]]
  const npc = npcFor(step)
  const choices = answerChoices(talk, talks, seededRandom(step * 31 + 5))

  const askAloud = async () => {
    setMood('talking')
    const played = await speakLine(talk.ask, learn, npc.gender, useGameStore.getState().settings)
    if (!played) setSilentStep(step)
    setMood((m) => (m === 'talking' ? 'idle' : m))
  }

  const arrive = () => {
    setTalking(true)
    askAloud()
  }

  const walkOn = ({ skipped = false } = {}) => {
    stopSpeaking()
    const scores = talkScores(learn, talks, useGameStore.getState().wordScores)
    const next = pickTalk(talks, scores, history)
    setHistory([...history.slice(1 - HISTORY), next.id])
    setStep(step + 1)
    setTalking(false)
    setMood('idle')
    if (skipped) setWalk((w) => ({ ...w, streak: 0 }))
  }

  return (
    <div className="screen screen-road">
      <Canvas className="scene-bg" shadows dpr={[1, 1.75]} camera={{ fov: 50, position: [0, 3.4, 6.5] }}>
        <Road
          step={step}
          talking={talking}
          mood={mood}
          paused={!started}
          onArrive={arrive}
          cat={talk.cat}
          prevCat={prevTalk?.cat}
          bubbleRef={bubbleRef}
        />
      </Canvas>
      <div className="npc-bubble-layer">
        <div ref={bubbleRef} className={`npc-bubble ${mood === 'talking' ? 'is-talking' : ''}`} style={{ visibility: 'hidden' }}>
          <Picture text={talk.ask.emoji} />
        </div>
      </div>
      <Hud onBack={() => goTo('hub')} backIcon="🏙️" backLabel="toTown" />
      <div className="road-stats">
        <span className="hud-pill" title="ผ่านแล้ว">✅ {walk.passed}</span>
        <span className="hud-pill" title="ติดกัน">🔥 {walk.streak}</span>
      </div>

      {!started && (
        <div className="road-start">
          <button type="button" className="btn btn-primary btn-big" onClick={() => setStarted(true)}>
            🚶 <Label k="start" />
          </button>
        </div>
      )}
      {started && !talking && (
        <p className="hub-hint"><Label k="walking" /></p>
      )}
      {talking && (
        <div className="road-sheet">
          <RoadTalk
            key={step}
            talk={talk}
            choices={choices}
            speaker={npc.gender}
            learn={learn}
            scoreId={scoreKey(learn, talk.id)}
            questionSilent={silentStep === step}
            onHearQuestion={askAloud}
            onMood={setMood}
            onPass={() => setWalk((w) => ({ passed: w.passed + 1, streak: w.streak + 1 }))}
            onWalkOn={() => walkOn()}
            onSkip={() => walkOn({ skipped: true })}
          />
        </div>
      )}
    </div>
  )
}
