// Rules of the market pay game, kept free of React so they can be tested.

export const ROUNDS_PER_GAME = 5
export const COINS_PER_STAR = 10
export const COINS_PER_SPOKEN_LINE = 2

const pick = (list, rng) => list[Math.floor(rng() * list.length)]

// `count` rounds of { wordId, price }, never the same good twice in a row.
export function makeRounds(goods, count, rng = Math.random) {
  const rounds = []
  for (let i = 0; i < count; i++) {
    const choices = goods.filter((g) => g.wordId !== rounds[i - 1]?.wordId)
    const good = pick(choices.length ? choices : goods, rng)
    rounds.push({ wordId: good.wordId, price: pick(good.prices, rng) })
  }
  return rounds
}

export const sum = (values) => values.reduce((a, b) => a + b, 0)

// Three different answers for "how much change?", one of them right.
// Wrong answers are near misses a player could plausibly pick.
export function changeOptions(change, rng = Math.random) {
  const nearMisses = [change + 10, change - 10, change + 5, change - 5, change + 1, change - 1, change + 20]
    .filter((n) => n >= 0 && n !== change)
  const options = new Set([change])
  while (options.size < 3 && nearMisses.length) {
    options.add(nearMisses.splice(Math.floor(rng() * nearMisses.length), 1)[0])
  }
  return [...options].sort((a, b) => a - b)
}

export function gameStars(mistakes) {
  if (mistakes <= 1) return 3
  if (mistakes <= 3) return 2
  return 1
}

export function gameCoins(stars, spokenLines) {
  return stars * COINS_PER_STAR + spokenLines * COINS_PER_SPOKEN_LINE
}
