import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import Character from '../components/three/Character.jsx'
import Town from '../components/three/Town.jsx'
import Label from '../components/ui/Label.jsx'
import { defaultLook } from '../data/looks.js'
import { UI } from '../data/ui.js'
import { burmesePolite, learnFor } from '../lib/line.js'
import { isTtsSupported, waitForThaiVoice } from '../speech/tts.js'
import { useGameStore } from '../store/useGameStore.js'

const ORBIT_RADIUS = 22
const ORBIT_SPEED = 0.06

// The player's own language, and so which one they learn.
const LANGS = [
  { lang: 'my', flag: '🇲🇲', name: 'မြန်မာ', learns: 'learnThai' },
  { lang: 'th', flag: '🇹🇭', name: 'ไทย', learns: 'learnBurmese' },
]

function OrbitCamera() {
  useFrame(({ camera, clock }) => {
    const a = clock.elapsedTime * ORBIT_SPEED
    camera.position.set(Math.sin(a) * ORBIT_RADIUS, 13, Math.cos(a) * ORBIT_RADIUS)
    camera.lookAt(0, 0, 0)
  })
  return null
}

// How each gender ends a polite sentence in the language being learned.
function politeWord(gender, learn) {
  if (learn === 'my') return burmesePolite(gender).text
  return gender === 'm' ? 'ครับ' : 'ค่ะ'
}

function GenderButton({ gender, learn, onPick }) {
  return (
    <button type="button" className="gender-button" onClick={() => onPick(gender)}>
      <span className="gender-preview">
        <Canvas camera={{ position: [0, 0.5, 4.8], fov: 35 }} dpr={[1, 1.5]}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 4, 3]} intensity={1.4} />
          <Character {...defaultLook(gender)} motion="happy" position={[0, -1.05, 0]} />
        </Canvas>
      </span>
      <Label k={gender === 'm' ? 'male' : 'female'} />
      <span className="gender-particle" lang={learn}>
        {politeWord(gender, learn)}
      </span>
    </button>
  )
}

export default function StartScreen() {
  const lang = useGameStore((s) => s.lang)
  const setLang = useGameStore((s) => s.setLang)
  const setGender = useGameStore((s) => s.setGender)
  const openScene = useGameStore((s) => s.openScene)
  const learn = learnFor(lang)
  // After choosing, dress the character up.
  const pickGender = (gender) => {
    setGender(gender)
    openScene('wardrobe')
  }
  const [hasThaiVoice, setHasThaiVoice] = useState(true)

  useEffect(() => {
    let alive = true
    waitForThaiVoice().then((ok) => alive && setHasThaiVoice(ok && isTtsSupported()))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="screen screen-start">
      <Canvas className="scene-bg" shadows dpr={[1, 1.75]} camera={{ fov: 40 }}>
        <Town />
        <OrbitCamera />
      </Canvas>
      <div className="start-card panel">
        <h1 className="title">
          <span className="title-my" lang="my">ထိုင်းပြည် သွားကြမယ်</span>
          <span className="title-th" lang="th">ไปเที่ยวเมืองไทย</span>
        </h1>
        {!lang ? (
          <>
            <h2><Label k="chooseLang" /></h2>
            <div className="row">
              {LANGS.map((l) => (
                <button key={l.lang} type="button" className="lang-button" onClick={() => setLang(l.lang)}>
                  <span className="lang-flag">{l.flag}</span>
                  <span className="lang-name" lang={l.lang}>{l.name}</span>
                  {/* in that language: the player may not read the other one */}
                  <span className="lang-learns" lang={l.lang}>{UI[l.learns][l.lang]}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p><Label k={learn === 'my' ? 'gameSubtitleMy' : 'gameSubtitle'} /></p>
            <h2><Label k="chooseGender" /></h2>
            <div className="row">
              <GenderButton gender="m" learn={learn} onPick={pickGender} />
              <GenderButton gender="f" learn={learn} onPick={pickGender} />
            </div>
            <p className="hint"><Label k={learn === 'my' ? 'genderHintMy' : 'genderHint'} /></p>
            {learn === 'th' && !hasThaiVoice && <p className="notice"><Label k="noThaiVoice" /></p>}
            <button type="button" className="btn btn-ghost" onClick={() => setLang(null)}>
              ◀ <Label k="language" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
