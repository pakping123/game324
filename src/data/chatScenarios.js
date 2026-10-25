// Situations to practise with the AI chat partner. `partner` is the AI
// character's gender (for ครับ/ค่ะ, ခင်ဗျာ/ရှင် and the voice); `role` tells
// the AI who to be (see server/chat.mjs).
//
// Without an AI key the game's own chat partner (lib/offlineChat.js) plays
// the scene from road talks (data/vocab/road.js): `script` lists the talks it
// asks in order, then starts over. Talks marked for one language are skipped
// for the other. `after` gives what the partner says once the player has
// answered a talk well, before the next one: a talk id and which of its
// lines (e.g. the player asks the way, and the partner tells them).
export const CHAT_SCENARIOS = [
  {
    id: 'free',
    emoji: '💬',
    label: { my: 'စကားပြောမယ်', th: 'คุยทั่วไป' },
    partner: 'f',
    role: 'a friendly neighbour making small talk: greetings, family, work, food, the weather',
    script: [
      'hello',
      'how-are-you',
      'from-where',
      'from-where-thai',
      'speak-thai',
      'speak-burmese',
      'work-where',
      'hungry',
      'hot',
      'like-thailand',
      'like-myanmar',
      'stay-where',
      'bye',
    ],
  },
  {
    id: 'market',
    emoji: '🛒',
    label: { my: 'ဈေးဝယ်မယ်', th: 'ซื้อของในตลาด' },
    partner: 'f',
    role: 'a fruit and vegetable seller at a market in Thailand; prices are in Thai baht and the learner is the customer',
    script: ['hello', 'pay-what', 'pay-expensive', 'pay-discount', 'pay-bag', 'pay-scan', 'pay-receipt', 'thanks'],
  },
  {
    id: 'taxi',
    emoji: '🚕',
    label: { my: 'တက္ကစီ စီးမယ်', th: 'นั่งแท็กซี่' },
    partner: 'm',
    role: 'a taxi driver in a Thai city who asks where to go, chats on the way and says the fare at the end',
    script: [
      'hello',
      'tr-station',
      'tr-traffic',
      'from-where',
      'from-where-thai',
      'tr-stop-where',
      'tr-arrived',
      'pay-please',
      'thanks',
    ],
    after: { 'pay-please': ['pay-hundred', 'answer'] },
  },
  {
    id: 'directions',
    emoji: '🧭',
    label: { my: 'လမ်းမေးမယ်', th: 'ถามทาง' },
    partner: 'm',
    role: 'a local person on the street whom the learner asks for the way to nearby places (bus stop, market, hospital, toilet, pharmacy)',
    script: ['hello', 'dir-toilet', 'understand', 'dir-lost', 'dir-know-way', 'dir-market', 'bye'],
    after: {
      'dir-toilet': ['dir-straight', 'answer'],
      'dir-know-way': ['dir-turn-where', 'answer'],
      'dir-market': ['dir-left', 'answer'],
    },
  },
  {
    id: 'restaurant',
    emoji: '🍜',
    label: { my: 'အစားအသောက် မှာမယ်', th: 'สั่งอาหาร' },
    partner: 'f',
    role: 'a server at a small rice and noodle shop who takes the order, asks about spiciness and drinks, and gives the bill',
    script: ['hello', 'want-eat', 'spicy', 'drink', 'wait', 'tasty', 'pay-please', 'thanks'],
    after: { 'pay-please': ['pay-hundred', 'answer'] },
  },
]

export const chatScenarioById = Object.fromEntries(CHAT_SCENARIOS.map((s) => [s.id, s]))
