import { useState } from 'react'
import Label from '../components/ui/Label.jsx'
import ListenButton from '../components/ui/ListenButton.jsx'
import Money from '../components/ui/Money.jsx'
import Picture from '../components/ui/Picture.jsx'
import SpeakPractice from '../components/ui/SpeakPractice.jsx'
import StarRow from '../components/ui/StarRow.jsx'
import WordDisplay from '../components/ui/WordDisplay.jsx'
import { THAI_MONEY } from '../data/money.js'
import { UI } from '../data/ui.js'
import { MARKET_GOODS, marketVocabById } from '../data/vocab/market.js'
import {
  changeOptions,
  gameCoins,
  gameStars,
  makeRounds,
  ROUNDS_PER_GAME,
  sum,
} from '../lib/payGame.js'
import { speechRate } from '../lib/speakEntry.js'
import { entrySyllables, joinThai } from '../lib/syllable.js'
import { numberToSyllables } from '../lib/thaiNumber.js'
import { isPass } from '../speech/evaluateAttempt.js'
import { speak } from '../speech/tts.js'
import { useGameStore } from '../store/useGameStore.js'

const GAME_ID = 'market-pay'
// The vendor is a woman, so her lines end with ค่ะ.
const VENDOR = 'f'
const BAHT = marketVocabById.baht.syllables[0]

function priceLine(price) {
  return {
    id: `price-${price}`,
    syllables: [...numberToSyllables(price), BAHT],
    my: `${price} ဘတ်`,
    polite: 'statement',
  }
}

// "แม่ค้าใจดี": ask the price out loud, listen to the answer, pay with Thai
// money, and work out the change.
// `onStage` tells the 3D market scene which good to show and how the vendor looks.
export default function PayGame({ onStage }) {
  const settings = useGameStore((s) => s.settings)
  const recordGame = useGameStore((s) => s.recordGame)

  const [rounds, setRounds] = useState(null)
  const [roundIndex, setRoundIndex] = useState(0)
  // 'ask' → 'pay' → ('change') → 'done'
  const [phase, setPhase] = useState('ask')
  const [tray, setTray] = useState([])
  const [options, setOptions] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [spoken, setSpoken] = useState(0)
  const [hint, setHint] = useState(false)
  const [message, setMessage] = useState(null)
  const [result, setResult] = useState(null)

  const round = rounds?.[roundIndex]
  const good = round && marketVocabById[round.wordId]
  const total = sum(tray)

  const vendorSays = async (line) => {
    onStage({ wordId: round?.wordId, mood: 'talking' })
    await speak(joinThai(entrySyllables(line, VENDOR)), { rate: speechRate(settings) })
    onStage({ wordId: round?.wordId, mood: 'idle' })
  }

  const startRound = (list, i) => {
    setRoundIndex(i)
    setPhase('ask')
    setTray([])
    setHint(false)
    setMessage(null)
    onStage({ wordId: list[i].wordId, mood: 'idle' })
  }

  const newGame = () => {
    const list = makeRounds(MARKET_GOODS, ROUNDS_PER_GAME)
    setRounds(list)
    setMistakes(0)
    setSpoken(0)
    setResult(null)
    startRound(list, 0)
  }

  const goPay = () => {
    setPhase('pay')
    vendorSays(priceLine(round.price))
  }

  const mistake = (key) => {
    setMistakes(mistakes + 1)
    setMessage(key)
    onStage({ wordId: round.wordId, mood: 'confused' })
  }

  const pay = () => {
    if (total < round.price) return mistake('notEnough')
    setMessage(null)
    if (total === round.price) return finishRound()
    setOptions(changeOptions(total - round.price))
    setPhase('change')
  }

  const pickChange = (n) => {
    if (n === total - round.price) finishRound()
    else mistake('wrong')
  }

  const finishRound = () => {
    setPhase('done')
    setMessage('correct')
    onStage({ wordId: round.wordId, mood: 'happy' })
    speak(joinThai(entrySyllables(marketVocabById['p-thanks'], VENDOR)), { rate: speechRate(settings) })
  }

  const nextRound = () => {
    if (roundIndex + 1 < rounds.length) return startRound(rounds, roundIndex + 1)
    const stars = gameStars(mistakes)
    const coins = gameCoins(stars, spoken)
    recordGame(GAME_ID, stars, coins)
    setResult({ stars, coins })
  }

  const showHint = () => {
    if (!hint) setMistakes(mistakes + 1)
    setHint(true)
  }

  if (!rounds || result) {
    return (
      <div className="mode mode-pay">
        <div className="panel center">
          {result ? (
            <>
              <h2><Label k="finished" /></h2>
              <StarRow stars={result.stars} size="3rem" />
              <p className="coins-earned">
                🪙 +{result.coins} <Label k="coinsEarned" />
              </p>
            </>
          ) : (
            <>
              <Picture text="👩‍🌾🍉🥭🍍" className="big-emoji" />
              <h2><Label k="modePay" /></h2>
              <p><Label k="listenPrice" /></p>
            </>
          )}
          <button type="button" className="btn btn-primary btn-big" onClick={newGame}>
            ▶ <Label k={result ? 'playAgain' : 'start'} />
          </button>
        </div>
      </div>
    )
  }

  const line = priceLine(round.price)

  return (
    <div className="mode mode-pay">
      <div className="card-counter">
        {UI.round.my} {roundIndex + 1} / {rounds.length}
      </div>

      <div className="panel goods">
        <Picture text={good.icon} className="flashcard-icon small" />
        <WordDisplay entry={good} size="md" />
      </div>

      {phase === 'ask' && (
        <div className="panel">
          <h3><Label k="askPrice" /></h3>
          <WordDisplay entry={marketVocabById['p-how-much']} size="md" />
          <ListenButton entry={marketVocabById['p-how-much']} />
          <SpeakPractice
            key={roundIndex}
            entry={marketVocabById['p-how-much']}
            onScored={(score) => {
              if (isPass(score)) {
                setSpoken(spoken + 1)
                goPay()
              }
            }}
          />
          <button type="button" className="btn btn-ghost" onClick={goPay}>
            <Label k="skip" /> ⏭
          </button>
        </div>
      )}

      {(phase === 'pay' || phase === 'change') && (
        <div className="panel">
          <h3><Label k="listenPrice" /></h3>
          <div className="row">
            <button type="button" className="btn" onClick={() => vendorSays(line)}>
              🔊 <Label k="hearAgain" />
            </button>
            {!hint && (
              <button type="button" className="btn btn-ghost" onClick={showHint}>
                💡 <Label k="showHint" />
              </button>
            )}
          </div>
          {hint && <WordDisplay entry={line} speaker={VENDOR} size="md" />}

          {phase === 'pay' ? (
            <>
              <div className="money-grid">
                {THAI_MONEY.map((m) => (
                  <Money key={m.value} item={m} onClick={() => setTray([...tray, m.value])} />
                ))}
              </div>
              <div className="tray">
                <Label k="yourMoney" />
                <div className="tray-items">
                  {tray.map((v, i) => (
                    <Money
                      key={i}
                      small
                      item={THAI_MONEY.find((m) => m.value === v)}
                      onClick={() => setTray(tray.filter((_, j) => j !== i))}
                    />
                  ))}
                </div>
                <div className="tray-total">{total} ฿</div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-big"
                disabled={!tray.length}
                onClick={pay}
              >
                💸 <Label k="pay" />
              </button>
            </>
          ) : (
            <>
              <h3><Label k="howMuchChange" /></h3>
              <p className="tray-total">{total} ฿ − ? = 🪙</p>
              <div className="row">
                {options.map((n) => (
                  <button key={n} type="button" className="btn btn-option" onClick={() => pickChange(n)}>
                    {n} ฿
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="panel center">
          <div className="price-tag">{round.price} ฿</div>
          <WordDisplay entry={line} speaker={VENDOR} size="lg" />
          <button type="button" className="btn btn-primary btn-big" onClick={nextRound}>
            <Label k="next" /> ▶
          </button>
        </div>
      )}

      {message && (
        <p className={`toast ${message === 'correct' ? 'toast-good' : 'toast-bad'}`}>
          {message === 'correct' ? '✅' : '❌'} <Label k={message} />
        </p>
      )}
    </div>
  )
}
