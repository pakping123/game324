import { describe, expect, it } from 'vitest'
import { MARKET_GOODS } from '../data/vocab/market.js'
import { changeOptions, gameCoins, gameStars, makeRounds } from './payGame.js'

// Deterministic stand-in for Math.random.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('makeRounds', () => {
  it('makes rounds with real goods and their prices', () => {
    const rounds = makeRounds(MARKET_GOODS, 20, seeded(7))
    expect(rounds).toHaveLength(20)
    for (const r of rounds) {
      const good = MARKET_GOODS.find((g) => g.wordId === r.wordId)
      expect(good.prices).toContain(r.price)
    }
  })

  it('never repeats a good twice in a row', () => {
    const rounds = makeRounds(MARKET_GOODS, 50, seeded(3))
    rounds.slice(1).forEach((r, i) => expect(r.wordId).not.toBe(rounds[i].wordId))
  })
})

describe('changeOptions', () => {
  it.each([0, 1, 5, 15, 80])('gives 3 different non-negative options including %i', (change) => {
    const options = changeOptions(change, seeded(change + 1))
    expect(options).toHaveLength(3)
    expect(new Set(options).size).toBe(3)
    expect(options).toContain(change)
    options.forEach((o) => expect(o).toBeGreaterThanOrEqual(0))
  })
})

describe('scoring', () => {
  it('gives fewer stars for more mistakes, never below 1', () => {
    expect([0, 1, 2, 3, 4, 10].map(gameStars)).toEqual([3, 3, 2, 2, 1, 1])
  })

  it('pays coins for stars and spoken lines', () => {
    expect(gameCoins(3, 2)).toBe(34)
  })
})
