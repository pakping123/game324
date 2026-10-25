import { syl } from '../lib/syllable.js'

// Things around the town (trees, a bench, a shrine…). Walking up to one shows
// its word to say: Thai for Burmese players, Burmese for Thai players. Like
// the road vocab, each word has the Thai syllables, the Burmese (`my`) and
// how to say the Burmese in Thai letters (`read`); unchecked by a native
// Burmese speaker. `kind` picks the 3D model (see TownDecor).

const TON = syl('ต้น', 'falling', 'tôn', 'တုန့်')
const MAAI = syl('ไม้', 'high', 'máai', 'မိုင်')
const ROT = syl('รถ', 'high', 'rót', 'ရုတ်')

function word(kind, emoji, syllables, my, read) {
  return { kind, entry: { id: `spot-${kind}`, key: `spot-${kind}`, syllables, my, read, emoji } }
}

const WORDS = [
  word('tree', '🌳', [TON, MAAI], 'သစ်ပင်', 'ติ-ปิน'),
  word('flowers', '🌸', [syl('ดอก', 'low', 'dòk', 'ဒေါ့'), MAAI], 'ပန်း', 'ปัน'),
  word('bench', '🪑', [syl('ม้า', 'high', 'máa', 'မာ'), syl('นั่ง', 'falling', 'nâng', 'နန့်')], 'ခုံတန်းလျား', 'โคน-ตัน-ลยา'),
  word('lamp', '💡', [syl('เสา', 'rising', 'sǎo', 'ဆောင်'), syl('ไฟ', 'mid', 'fai', 'ဖိုင်')], 'မီးတိုင်', 'มี-ไต'),
  word(
    'mailbox',
    '📮',
    [
      syl('ตู้', 'falling', 'tûu', 'တူ့'),
      syl('ไปร', 'mid', 'prai', 'ပရိုင်'),
      syl('ษ', 'low', 'sà', 'ဆ'),
      syl('ณีย์', 'mid', 'nii', 'နီ'),
    ],
    'စာတိုက်ပုံး',
    'ซา-ไต-โปน',
  ),
  word('bananaTree', '🍌', [TON, syl('กล้วย', 'falling', 'klûai', 'ကလွယ့်')], 'ငှက်ပျောပင်', 'แง-ปยอ-ปิน'),
  word(
    'shrine',
    '🙏',
    [syl('ศาล', 'rising', 'sǎan', 'ဆန်'), syl('พระ', 'high', 'phrá', 'ဖရ'), syl('ภูมิ', 'mid', 'phuum', 'ဖုမ်')],
    'နတ်စင်',
    'นะ-ซิน',
  ),
  word('foodCart', '🍢', [ROT, syl('เข็น', 'rising', 'khěn', 'ခဲန်')], 'လက်တွန်းလှည်း', 'แล-ตุน-แล'),
  word(
    'bicycle',
    '🚲',
    [syl('จัก', 'low', 'jàk', 'ကျက်'), syl('ร', 'low', 'krà', 'ကြ'), syl('ยาน', 'mid', 'yaan', 'ယန်')],
    'စက်ဘီး',
    'แซะ-เบ',
  ),
  word(
    'motorbike',
    '🏍️',
    [syl('มอ', 'mid', 'mor', 'မော'), syl('เตอร์', 'mid', 'toe', 'တာ'), syl('ไซค์', 'mid', 'sai', 'ဆိုင်')],
    'ဆိုင်ကယ်',
    'ไซ-แก',
  ),
  word('bird', '🐦', [syl('นก', 'high', 'nók', 'နုတ်')], 'ငှက်', 'แง'),
  word('car', '🚗', [ROT, syl('ยนต์', 'mid', 'yon', 'ယုန်')], 'ကား', 'กา'),
  word(
    'trashBin',
    '🗑️',
    [syl('ถัง', 'rising', 'thǎng', 'ထန်'), syl('ข', 'low', 'khà', 'ခ'), syl('ยะ', 'low', 'yà', 'ယ')],
    'အမှိုက်ပုံး',
    'อะ-ไม-โปน',
  ),
  word('ball', '⚽', [syl('ลูก', 'falling', 'lûuk', 'လုတ်'), syl('บอล', 'mid', 'bon', 'ဘွန်')], 'ဘောလုံး', 'บอ-โลน'),
  word('sala', '🛖', [syl('ศา', 'rising', 'sǎa', 'ဆာ'), syl('ลา', 'mid', 'laa', 'လာ')], 'ဇရပ်', 'ซะ-ยะ'),
  word(
    'coconut',
    '🥥',
    [TON, syl('มะ', 'high', 'má', 'မ'), syl('พร้าว', 'high', 'práao', 'ပရောင်')],
    'အုန်းပင်',
    'โอน-ปิน',
  ),
  word('elephant', '🐘', [syl('ช้าง', 'high', 'cháang', 'ချန်')], 'ဆင်', 'ซิน'),
  word('temple', '🛕', [syl('วัด', 'high', 'wát', 'ဝတ်')], 'ဘုရားကျောင်း', 'พะ-ยา-เจา'),
  word('sign', '🪧', [syl('ป้าย', 'falling', 'pâai', 'ပိုင့်')], 'ဆိုင်းဘုတ်', 'ไซ-โบ'),
  word('flag', '🚩', [syl('ธง', 'mid', 'thong', 'ထုန်')], 'အလံ', 'อะ-ลัน'),
]

// Spots sit between the roads to the zone buildings (in degrees around the
// plaza), at three distances from it, plus two more.
const ANGLES = [7, 65, 115, 172, 238, 301]
const RADII = [5, 8.6, 12.2]
const PLACES = [
  ...RADII.flatMap((r) => ANGLES.map((a) => [a, r])),
  [25, 11.5],
  [283, 6.5],
]

export const TOWN_SPOTS = WORDS.map((w, i) => {
  const [angle, r] = PLACES[i]
  const rad = (angle * Math.PI) / 180
  return { ...w, id: w.entry.id, position: [Math.cos(rad) * r, Math.sin(rad) * r] }
})

// How close the player has to be for a spot's word to show.
export const SPOT_RADIUS = 2.2

// The spot within reach of [x, z], nearest first, or null.
export function nearestSpot(x, z, spots = TOWN_SPOTS) {
  let best = null
  let bestDist = SPOT_RADIUS
  for (const spot of spots) {
    const d = Math.hypot(spot.position[0] - x, spot.position[1] - z)
    if (d < bestDist) {
      best = spot
      bestDist = d
    }
  }
  return best
}
