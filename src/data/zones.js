import { marketVocab } from './vocab/market.js'
import { pharmacyVocab } from './vocab/pharmacy.js'
import { roadTalkById, ROAD_TALKS } from './vocab/road.js'
import { workVocab } from './vocab/work.js'

// A zone's vocab taken from the road: the answers of one kind of talk (for
// both languages) plus some single words.
function fromRoad(cat, wordIds) {
  const talks = [...ROAD_TALKS.filter((t) => t.cat === cat && !t.learn), ...wordIds.map((id) => roadTalkById[id])]
  return talks.map((t) => ({ ...t.answer, id: t.id, icon: t.answer.emoji }))
}

// Zones of the town map. Each zone is one vocabulary topic. `position` is the
// building's spot on the map; the player walks to `position` + `door`.
// Every entry has a Burmese side (`my`, `read`), so Thai players can learn
// Burmese in any zone. The market's pay game is Thai money, so it stays a
// Burmese players' game (see ZoneScreen).
export const ZONES = [
  {
    id: 'market',
    th: 'ตลาดนัด',
    my: 'ဈေး',
    icon: '🛒',
    position: [-6, 0, -3],
    color: '#f97316',
    vocab: marketVocab,
    ready: true,
  },
  {
    id: 'travel',
    th: 'ป้ายรถเมล์',
    my: 'ဘတ်စ်ကားမှတ်တိုင်',
    icon: '🚌',
    position: [6, 0, -3],
    color: '#0ea5e9',
    vocab: fromRoad('travel', ['w-bus', 'w-train', 'w-plane', 'w-car', 'w-road']),
    ready: true,
  },
  {
    id: 'directions',
    th: 'ซอยวกวน',
    my: 'လမ်းညွှန်',
    icon: '🧭',
    position: [0, 0, -9],
    color: '#22c55e',
    vocab: fromRoad('directions', ['w-toilet', 'w-hospital', 'w-market', 'w-house']),
    ready: true,
  },
  {
    id: 'food',
    th: 'ร้านข้าว',
    my: 'စားသောက်ဆိုင်',
    icon: '🍜',
    position: [-7, 0, 6],
    color: '#ef4444',
    vocab: fromRoad('food', ['w-rice', 'w-water', 'w-chicken', 'w-fish', 'w-egg', 'w-coffee', 'w-banana']),
    ready: true,
  },
  {
    id: 'pharmacy',
    th: 'ร้านยา',
    my: 'ဆေးဆိုင်',
    icon: '💊',
    position: [7, 0, 6],
    color: '#14b8a6',
    vocab: pharmacyVocab,
    ready: true,
  },
  {
    id: 'work',
    th: 'ที่ทำงาน',
    my: 'အလုပ်',
    icon: '🏭',
    position: [0, 0, 11],
    color: '#8b5cf6',
    vocab: workVocab,
    ready: true,
  },
]

export const MAP_RADIUS = 14
const DOOR_OFFSET = 2.6

// Where the player stands to enter a zone: in front of the building, on the
// side facing the plaza at the map's center. Returns [x, z].
export function zoneDoor(zone) {
  const [x, , z] = zone.position
  const len = Math.hypot(x, z) || 1
  return [x - (x / len) * DOOR_OFFSET, z - (z / len) * DOOR_OFFSET]
}

export const zoneById = Object.fromEntries(ZONES.map((z) => [z.id, z]))
