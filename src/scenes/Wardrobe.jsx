import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Character from '../components/three/Character.jsx'
import Label from '../components/ui/Label.jsx'
import {
  BOTTOMS,
  CLOTH_COLORS,
  EXTRAS,
  HAIR_COLORS,
  HAIR_STYLES,
  HATS,
  PRESETS,
  SHIRT_STYLES,
  SKINS,
} from '../data/looks.js'
import { burmesePolite, learnFor } from '../lib/line.js'
import { playerLook, useGameStore } from '../store/useGameStore.js'

function Swatches({ colors, value, onPick }) {
  return (
    <div className="swatches">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          className={`swatch ${value === c ? 'is-on' : ''}`}
          style={{ '--swatch': c }}
          aria-label={c}
          aria-pressed={value === c}
          onClick={() => onPick(c)}
        />
      ))}
    </div>
  )
}

function Chips({ options, value, onPick }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`chip ${value === o ? 'is-on' : ''}`}
          aria-pressed={value === o}
          onClick={() => onPick(o)}
        >
          <Label k={`opt-${o}`} />
        </button>
      ))}
    </div>
  )
}

function Part({ label, children }) {
  return (
    <section className="wardrobe-part">
      <h3>
        <Label k={label} />
      </h3>
      {children}
    </section>
  )
}

// A tiny flat picture of a ready-made character: head, shirt, bottom.
function PresetFigure({ look }) {
  return (
    <span className="preset-figure" aria-hidden="true">
      <span className="preset-hair" style={{ background: look.hair }} />
      <span className="preset-head" style={{ background: look.skin }} />
      <span className="preset-shirt" style={{ background: look.shirt }} />
      <span className="preset-bottom" style={{ background: look.bottom }} />
    </span>
  )
}

// Choose a ready-made character, then change any part of it. Changing gender
// switches ครับ/ค่ะ (or ခင်ဗျာ/ရှင်), ผม/ฉัน and the voice everywhere.
export default function Wardrobe() {
  const look = useGameStore(playerLook)
  const gender = useGameStore((s) => s.gender)
  const learn = learnFor(useGameStore((s) => s.lang))
  const setLook = useGameStore((s) => s.setLook)
  const setGender = useGameStore((s) => s.setGender)
  const goBack = useGameStore((s) => s.goBack)
  const change = (part) => setLook({ ...look, ...part })
  const polite = (g) => (learn === 'my' ? burmesePolite(g).text : g === 'm' ? 'ครับ' : 'ค่ะ')

  return (
    <div className="screen screen-wardrobe">
      <div className="wardrobe-stage">
        <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 1.2, 3.4], fov: 38 }}>
          <color attach="background" args={['#fde68a']} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[2, 4, 3]} intensity={1.5} castShadow />
          <Character {...look} motion="idle" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[1, 32]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <OrbitControls
            target={[0, 0.9, 0]}
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
      <div className="wardrobe-panel panel">
        <h2>
          👕 <Label k="wardrobe" />
        </h2>
        <Part label="gender">
          <div className="chips">
            {['m', 'f'].map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${gender === g ? 'is-on' : ''}`}
                aria-pressed={gender === g}
                onClick={() => setGender(g)}
              >
                <Label k={g === 'm' ? 'male' : 'female'} />
                <span className="chip-particle" lang={learn}>
                  {polite(g)}
                </span>
              </button>
            ))}
          </div>
        </Part>
        <Part label="characters">
          <div className="presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="preset"
                onClick={() => {
                  setGender(p.gender)
                  setLook(p.look)
                }}
              >
                <PresetFigure look={p.look} />
              </button>
            ))}
          </div>
        </Part>
        <Part label="skin">
          <Swatches colors={SKINS} value={look.skin} onPick={(skin) => change({ skin })} />
        </Part>
        <Part label="hairStyle">
          <Chips options={HAIR_STYLES} value={look.hairStyle} onPick={(hairStyle) => change({ hairStyle })} />
        </Part>
        <Part label="hairColor">
          <Swatches colors={HAIR_COLORS} value={look.hair} onPick={(hair) => change({ hair })} />
        </Part>
        <Part label="shirt">
          <Chips options={SHIRT_STYLES} value={look.shirtStyle} onPick={(shirtStyle) => change({ shirtStyle })} />
          <Swatches colors={CLOTH_COLORS} value={look.shirt} onPick={(shirt) => change({ shirt })} />
        </Part>
        <Part label="bottomPart">
          <Chips options={BOTTOMS} value={look.bottomType} onPick={(bottomType) => change({ bottomType })} />
          <Swatches colors={CLOTH_COLORS} value={look.bottom} onPick={(bottom) => change({ bottom })} />
        </Part>
        <Part label="hat">
          <Chips options={HATS} value={look.hat} onPick={(hat) => change({ hat })} />
        </Part>
        <Part label="extras">
          <div className="chips">
            {EXTRAS.map((x) => (
              <button
                key={x}
                type="button"
                className={`chip ${look[x] ? 'is-on' : ''}`}
                aria-pressed={Boolean(look[x])}
                onClick={() => change({ [x]: !look[x] })}
              >
                <Label k={`opt-${x}`} />
              </button>
            ))}
          </div>
        </Part>
        <div className="wardrobe-done">
          <button type="button" className="btn btn-primary btn-big" onClick={goBack}>
            ✅ <Label k="done" />
          </button>
        </div>
      </div>
    </div>
  )
}
