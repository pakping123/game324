import { syl } from '../../lib/syllable.js'
import { numberToSyllables } from '../../lib/thaiNumber.js'

// Market zone vocabulary: numbers, money, buying and selling.
//
// `my` is the Burmese meaning. Each syllable also carries a reading in Burmese
// script, because most players read Burmese more easily than Latin letters.
// Both still need checking by a native Burmese speaker.
//
// `polite` marks phrases that end with ครับ/ค่ะ/คะ ('statement' or 'question').
// `accept` lists other spellings a speech recognizer may return.
//
// Thai players learn the Burmese side, so `read` gives each Burmese meaning
// in Thai letters (see READ below); unchecked by a native speaker too.

function numberWord(n, my, extra = {}) {
  return {
    id: `num-${n}`,
    kind: 'number',
    syllables: numberToSyllables(n),
    my,
    icon: String(n),
    ...extra,
  }
}

const NUMBERS = [
  numberWord(0, 'သုည'),
  numberWord(1, 'တစ်'),
  numberWord(2, 'နှစ်'),
  numberWord(3, 'သုံး'),
  numberWord(4, 'လေး'),
  numberWord(5, 'ငါး'),
  numberWord(6, 'ခြောက်'),
  numberWord(7, 'ခုနစ်'),
  numberWord(8, 'ရှစ်'),
  numberWord(9, 'ကိုး'),
  numberWord(10, 'တစ်ဆယ်'),
  numberWord(20, 'နှစ်ဆယ်'),
  numberWord(50, 'ငါးဆယ်'),
  numberWord(100, 'တစ်ရာ', { accept: ['ร้อย'] }),
  numberWord(1000, 'တစ်ထောင်', { accept: ['พัน'] }),
]

const WORDS = [
  {
    id: 'baht',
    syllables: [syl('บาท', 'low', 'bàat', 'ဘတ်')],
    my: 'ဘတ်',
    icon: '💵',
  },
  {
    id: 'money',
    syllables: [syl('เงิน', 'mid', 'ngoen', 'ငန်')],
    my: 'ငွေ',
    icon: '💰',
  },
  {
    id: 'price',
    syllables: [syl('รา', 'mid', 'raa', 'ရာ'), syl('คา', 'mid', 'khaa', 'ခါ')],
    my: 'ဈေးနှုန်း',
    icon: '🏷️',
  },
  {
    id: 'how-much',
    syllables: [syl('เท่า', 'falling', 'thâo', 'တောင်'), syl('ไหร่', 'low', 'rài', 'ရိုင်')],
    my: 'ဘယ်လောက်လဲ',
    icon: '❓',
    accept: ['เท่าไร'],
  },
  {
    id: 'expensive',
    syllables: [syl('แพง', 'mid', 'phaeng', 'ဖိန်')],
    my: 'ဈေးကြီးတယ်',
    icon: '📈',
  },
  {
    id: 'cheap',
    syllables: [syl('ถูก', 'low', 'thùuk', 'ထုတ်')],
    my: 'ဈေးပေါတယ်',
    icon: '📉',
  },
  {
    id: 'buy',
    syllables: [syl('ซื้อ', 'high', 'súe', 'ဆူး')],
    my: 'ဝယ်တယ်',
    icon: '🛍️',
  },
  {
    id: 'sell',
    syllables: [syl('ขาย', 'rising', 'khǎai', 'ခိုင်')],
    my: 'ရောင်းတယ်',
    icon: '🧺',
  },
  {
    id: 'pay',
    syllables: [syl('จ่าย', 'low', 'jàai', 'ကျိုင်')],
    my: 'ငွေပေးတယ်',
    icon: '💳',
  },
  {
    id: 'change',
    syllables: [syl('เงิน', 'mid', 'ngoen', 'ငန်'), syl('ทอน', 'mid', 'thon', 'ထွန်')],
    my: 'ငွေအမ်း',
    icon: '🪙',
  },
  {
    id: 'this',
    syllables: [syl('อัน', 'mid', 'an', 'အန်'), syl('นี้', 'high', 'níi', 'နီ')],
    my: 'ဒီဟာ',
    icon: '👇',
  },
  {
    id: 'that',
    syllables: [syl('อัน', 'mid', 'an', 'အန်'), syl('นั้น', 'high', 'nán', 'နန်')],
    my: 'အဲဒီဟာ',
    icon: '👉',
  },
  {
    id: 'take',
    syllables: [syl('เอา', 'mid', 'ao', 'အောင်')],
    my: 'ယူမယ်',
    icon: '✋',
  },
  {
    id: 'bag',
    syllables: [syl('ถุง', 'rising', 'thǔng', 'ထုန်')],
    my: 'အိတ်',
    icon: '👜',
  },
  {
    id: 'kilo',
    syllables: [syl('กิ', 'low', 'kì', 'ကိ'), syl('โล', 'mid', 'loo', 'လို')],
    my: 'ကီလို',
    icon: '⚖️',
  },
  {
    id: 'fruit',
    syllables: [syl('ผล', 'rising', 'phǒn-lá', 'ဖုန်-လ'), syl('ไม้', 'high', 'máai', 'မိုင်')],
    my: 'သစ်သီး',
    icon: '🧺',
  },
  {
    id: 'mango',
    syllables: [syl('มะ', 'high', 'má', 'မ'), syl('ม่วง', 'falling', 'mûang', 'မွမ်')],
    my: 'သရက်သီး',
    icon: '🥭',
  },
  {
    id: 'banana',
    syllables: [syl('กล้วย', 'falling', 'klûai', 'ကလွယ်')],
    my: 'ငှက်ပျောသီး',
    icon: '🍌',
  },
  {
    id: 'watermelon',
    syllables: [syl('แตง', 'mid', 'taeng', 'တိန်'), syl('โม', 'mid', 'moo', 'မို')],
    my: 'ဖရဲသီး',
    icon: '🍉',
  },
  {
    id: 'orange',
    syllables: [syl('ส้ม', 'falling', 'sôm', 'ဆုမ်')],
    my: 'လိမ္မော်သီး',
    icon: '🍊',
  },
  {
    id: 'pineapple',
    syllables: [
      syl('สับ', 'low', 'sàp', 'ဆပ်'),
      syl('ปะ', 'low', 'pà', 'ပ'),
      syl('รด', 'high', 'rót', 'ရုတ်'),
    ],
    my: 'နာနတ်သီး',
    icon: '🍍',
  },
  {
    id: 'thank-you',
    syllables: [syl('ขอบ', 'low', 'khàwp', 'ခေါ့'), syl('คุณ', 'mid', 'khun', 'ခွန်')],
    my: 'ကျေးဇူးတင်ပါတယ်',
    icon: '🙏',
  },
].map((w) => ({ kind: 'word', ...w }))

const THIS = [syl('อัน', 'mid', 'an', 'အန်'), syl('นี้', 'high', 'níi', 'နီ')]

export const PHRASES = [
  {
    id: 'p-how-much',
    syllables: [...THIS, syl('เท่า', 'falling', 'thâo', 'တောင်'), syl('ไหร่', 'low', 'rài', 'ရိုင်')],
    my: 'ဒါ ဘယ်လောက်လဲ',
    icon: '🗣️',
    polite: 'question',
    accept: ['อันนี้เท่าไร', 'นี่เท่าไหร่', 'เท่าไหร่'],
  },
  {
    id: 'p-discount',
    syllables: [
      syl('ลด', 'high', 'lót', 'လုတ်'),
      syl('ได้', 'falling', 'dâai', 'ဒိုင်'),
      syl('ไหม', 'rising', 'mǎi', 'မိုင်'),
    ],
    my: 'လျှော့ပေးလို့ရမလား',
    icon: '🤏',
    polite: 'question',
    accept: ['ลดได้มั้ย', 'ลดได้มั๊ย', 'ลดได้ไม๊'],
  },
  {
    id: 'p-take-this',
    syllables: [syl('เอา', 'mid', 'ao', 'အောင်'), ...THIS],
    my: 'ဒါ ယူမယ်',
    icon: '✋',
    polite: 'statement',
  },
  {
    id: 'p-bag',
    syllables: [
      syl('ขอ', 'rising', 'khǒr', 'ခေါ'),
      syl('ถุง', 'rising', 'thǔng', 'ထုန်'),
      syl('ด้วย', 'falling', 'dûai', 'ဒွယ်'),
    ],
    my: 'အိတ်လေး ပေးပါ',
    icon: '👜',
    polite: 'statement',
  },
  {
    id: 'p-thanks',
    syllables: [syl('ขอบ', 'low', 'khàwp', 'ခေါ့'), syl('คุณ', 'mid', 'khun', 'ခွန်')],
    my: 'ကျေးဇူးတင်ပါတယ်',
    icon: '🙏',
    polite: 'statement',
  },
].map((p) => ({ kind: 'phrase', ...p }))

// How to say each Burmese meaning, in Thai letters.
const READ = {
  'num-0': 'โตน-ญะ',
  'num-1': 'ติ',
  'num-2': 'หนิ',
  'num-3': 'โตน',
  'num-4': 'เล',
  'num-5': 'งา',
  'num-6': 'เชา',
  'num-7': 'คุ-นิ',
  'num-8': 'ชิ',
  'num-9': 'โก',
  'num-10': 'ตะ-แซ',
  'num-20': 'หนะ-แซ',
  'num-50': 'งา-แซ',
  'num-100': 'ตะ-ยา',
  'num-1000': 'ตะ-เทา',
  baht: 'บะ',
  money: 'งเว',
  price: 'เซ-โนน',
  'how-much': 'แบ-เลา-แล',
  expensive: 'เซ-จี-แด',
  cheap: 'เซ-ปอ-แด',
  buy: 'แว-แด',
  sell: 'เยา-แด',
  pay: 'งเว-เป-แด',
  change: 'งเว-อัน',
  this: 'ดี-ฮา',
  that: 'แอ-ดี-ฮา',
  take: 'ยู-แม',
  bag: 'เอ',
  kilo: 'กี-โล',
  fruit: 'ติ-ตี',
  mango: 'ตะ-แย-ตี',
  banana: 'แง-ปยอ-ตี',
  watermelon: 'ผะ-แย-ตี',
  orange: 'เลง-มอ-ตี',
  pineapple: 'นา-นะ-ตี',
  'thank-you': 'เจ-ซู-ติน-บา-แด',
  'p-how-much': 'ดา แบ-เลา-แล',
  'p-discount': 'ฉอ-เป-โล-ยะ-มะ-ลา',
  'p-take-this': 'ดา ยู-แม',
  'p-bag': 'เอ-เล เป-บา',
  'p-thanks': 'เจ-ซู-ติน-บา-แด',
}

export const marketVocab = [...NUMBERS, ...WORDS, ...PHRASES].map((v) => ({
  ...v,
  read: READ[v.id],
  emoji: v.icon,
  key: `market-${v.id}`,
}))

export const marketVocabById = Object.fromEntries(marketVocab.map((v) => [v.id, v]))

// Goods sold in the pay game, with prices the vendor may ask for.
export const MARKET_GOODS = [
  { wordId: 'mango', prices: [20, 25, 30, 35, 40, 45, 50, 60] },
  { wordId: 'banana', prices: [10, 15, 20, 25, 30, 35] },
  { wordId: 'watermelon', prices: [35, 40, 45, 50, 60, 75, 80, 99] },
  { wordId: 'orange', prices: [25, 30, 40, 45, 55, 65, 70] },
  { wordId: 'pineapple', prices: [20, 30, 40, 50, 60, 85, 120, 150] },
]
