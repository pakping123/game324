import { useEffect, useRef } from 'react'
import { isPass, PASS_SCORE } from '../../speech/evaluateAttempt.js'
import Label from './Label.jsx'

// A speaking score out of 100: the number, a bar with the pass mark at the
// middle, and whether it passed. Scrolls itself into view when it appears,
// since it comes last under the pitch graph.
export default function ScoreMeter({ score }) {
  const passed = isPass(score)
  const ref = useRef(null)
  useEffect(() => {
    ref.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])
  return (
    <div ref={ref} className={`score-meter ${passed ? 'is-pass' : 'is-fail'}`}>
      <div className="score-number">
        {score}
        <small>/100</small>
      </div>
      <div className="score-bar" aria-hidden="true">
        <div className="score-fill" style={{ width: `${score}%` }} />
        <div className="score-mark" style={{ left: `${PASS_SCORE}%` }} />
      </div>
      <Label k={passed ? 'passed' : 'notPassed'} className="score-verdict" />
    </div>
  )
}
