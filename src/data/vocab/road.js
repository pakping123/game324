import { I, syl } from '../../lib/syllable.js'

// Everyday talk for the road game. Each talk is one meeting on the road: a
// person asks or says something (`ask`), and the player answers (`answer`).
//
// The game goes both ways. Burmese players learn the Thai lines; Thai players
// learn the Burmese ones. So every line has:
// - `syllables`: the Thai, one syllable at a time, each with its tone, a
//   Latin reading and a reading in Burmese script;
// - `my`: the Burmese, with `read` (how to say it, in Thai letters);
// - `emoji`: a picture of what it means.
// The Burmese and both Burmese readings still need checking by a native
// speaker.
//
// `I` in the syllables (and {I} in the Burmese) is "I", said as ผม or ฉัน
// (ကျွန်တော် or ကျွန်မ) to match the speaker.
// `polite` adds ครับ/ค่ะ/คะ (or ခင်ဗျာ/ရှင်): for the asker by their gender,
// for the answer by the player's. `accept` lists other Thai spellings a speech
// recognizer may return. `key` names the line's recorded Burmese audio.
//
// `cat` groups talks for the street (a person asking about travel stands at a
// bus stop, and so on). `learn` marks a talk used only when learning that
// language (e.g. "I'm from Myanmar" is for Burmese players).

// Syllables used more than once.
const S = {
  sa: syl('ส', 'low', 'sà', 'ဆ'),
  baai: syl('บาย', 'mid', 'baai', 'ဘိုင်'),
  dii: syl('ดี', 'mid', 'dii', 'ဒီ'),
  maiQ: syl('ไหม', 'rising', 'mǎi', 'မိုင်'),
  maiNot: syl('ไม่', 'falling', 'mâi', 'မိုင့်'),
  maa: syl('มา', 'mid', 'maa', 'မာ'),
  jaak: syl('จาก', 'low', 'jàak', 'ကျာက်'),
  nai: syl('ไหน', 'rising', 'nǎi', 'နိုင်'),
  thii: syl('ที่', 'falling', 'thîi', 'ထီ'),
  kin: syl('กิน', 'mid', 'kin', 'ကင်'),
  khaao: syl('ข้าว', 'falling', 'khâao', 'ခေါ်'),
  laew: syl('แล้ว', 'high', 'láew', 'လယ်'),
  khao: syl('เข้า', 'falling', 'khâo', 'ခေါင့်'),
  jai: syl('ใจ', 'mid', 'jai', 'ကျိုင်'),
  dai: syl('ได้', 'falling', 'dâai', 'ဒိုင်'),
  nit: syl('นิด', 'high', 'nít', 'နစ်'),
  noi: syl('หน่อย', 'low', 'nòi', 'နွိုင်'),
  pen: syl('เป็น', 'mid', 'pen', 'ပင်'),
  a: syl('อะ', 'low', 'à', 'အ'),
  rai: syl('ไร', 'mid', 'rai', 'ရိုင်'),
  khor: syl('ขอ', 'rising', 'khǒr', 'ခေါ'),
  pai: syl('ไป', 'mid', 'pai', 'ပိုင်'),
  tham: syl('ทำ', 'mid', 'tham', 'ထမ်'),
  ngaan: syl('งาน', 'mid', 'ngaan', 'ငန်'),
  yaak: syl('อยาก', 'low', 'yàak', 'ယာက်'),
  naam: syl('น้ำ', 'high', 'náam', 'နမ်'),
  phet: syl('เผ็ด', 'low', 'phèt', 'ဖက်'),
  aao: syl('เอา', 'mid', 'ao', 'အောင်'),
  an: syl('อัน', 'mid', 'an', 'အန်'),
  nii: syl('นี้', 'high', 'níi', 'နီ'),
  maak: syl('มาก', 'falling', 'mâak', 'မာက်'),
  hong: syl('ห้อง', 'falling', 'hông', 'ဟောင့်'),
  yuu: syl('อยู่', 'low', 'yùu', 'ယူ'),
  nueai: syl('เหนื่อย', 'low', 'nùeai', 'နွယ်'),
  ron: syl('ร้อน', 'high', 'rón', 'ရွန်'),
  chop: syl('ชอบ', 'falling', 'chôp', 'ချော့'),
  phuut: syl('พูด', 'falling', 'phûut', 'ဖုတ်'),
  thai: syl('ไทย', 'mid', 'thai', 'ထိုင်'),
  pha: syl('พ', 'high', 'phá', 'ဖ'),
  maaBurma: syl('ม่า', 'falling', 'mâa', 'မာ့'),
  mueang: syl('เมือง', 'mid', 'mueang', 'မောင်'),
  khaawp: syl('ขอบ', 'low', 'khàwp', 'ခေါ့'),
  khun: syl('คุณ', 'mid', 'khun', 'ခွန်'),
  rueQ: syl('หรือ', 'rising', 'rǔe', 'ရူ'),
  yang: syl('ยัง', 'mid', 'yang', 'ယန်'),
  ja: syl('จะ', 'low', 'jà', 'ကျ'),
  rot: syl('รถ', 'high', 'rót', 'ရုတ်'),
  fai: syl('ไฟ', 'mid', 'fai', 'ဖိုင်'),
  mee: syl('เมล์', 'mid', 'mee', 'မေ'),
  nang: syl('นั่ง', 'falling', 'nâng', 'နန့်'),
  trong: syl('ตรง', 'mid', 'trong', 'တရုန်'),
  jawt: syl('จอด', 'low', 'jàwt', 'ကျော့'),
  long: syl('ลง', 'mid', 'long', 'လုန်'),
  doen: syl('เดิน', 'mid', 'doen', 'ဒန်'),
  riip: syl('รีบ', 'falling', 'rîip', 'ရိပ်'),
  sanaam: [syl('ส', 'low', 'sà', 'ဆ'), syl('นาม', 'rising', 'nǎam', 'နမ်')],
  bin: syl('บิน', 'mid', 'bin', 'ဘင်'),
  tit: syl('ติด', 'low', 'tìt', 'တစ်'),
  naa: syl('นะ', 'high', 'ná', 'န'),
  thaang: syl('ทาง', 'mid', 'thaang', 'ထန်'),
  lot: syl('ลด', 'high', 'lót', 'လုတ်'),
  liao: syl('เลี้ยว', 'high', 'líao', 'လျော'),
  klai: syl('ไกล', 'mid', 'klai', 'ကလိုင်'),
  klaiNear: syl('ใกล้', 'falling', 'klâi', 'ကလိုင့်'),
  raan: syl('ร้าน', 'high', 'ráan', 'ရန်'),
  khaai: syl('ขาย', 'rising', 'khǎai', 'ခိုင်'),
  yaa: syl('ยา', 'mid', 'yaa', 'ယာ'),
  taLaat: [syl('ต', 'low', 'tà', 'တ'), syl('ลาด', 'low', 'làat', 'လတ်')],
  thao: syl('เท่า', 'falling', 'thâo', 'ထောင့်'),
  rai2: syl('ไหร่', 'low', 'rài', 'ရိုင့်'),
  baat: syl('บาท', 'low', 'bàat', 'ဘတ်'),
  sip: syl('สิบ', 'low', 'sìp', 'ဆိပ်'),
  haa: syl('ห้า', 'falling', 'hâa', 'ဟာ'),
  roi: syl('ร้อย', 'high', 'rói', 'ရွိုင်'),
  jaai: syl('จ่าย', 'low', 'jàai', 'ကျိုင့်'),
  ngoen: syl('เงิน', 'mid', 'ngoen', 'ငန်'),
  sot: syl('สด', 'low', 'sòt', 'ဆုတ်'),
  kaen: syl('แกน', 'mid', 'kaen', 'ကန်'),
  rap: syl('รับ', 'high', 'ráp', 'ရပ်'),
  mii: syl('มี', 'mid', 'mii', 'မီ'),
  hai: syl('ให้', 'falling', 'hâi', 'ဟိုင့်'),
  chuai: syl('ช่วย', 'falling', 'chûai', 'ချွယ့်'),
  duai: syl('ด้วย', 'falling', 'dûai', 'ဒွယ့်'),
  hiw: syl('หิว', 'rising', 'hǐw', 'ဟိဝ်'),
  khon: syl('คน', 'mid', 'khon', 'ခုန်'),
  chai: syl('ใช่', 'falling', 'châi', 'ချိုင့်'),
  phak: syl('พัก', 'high', 'phák', 'ဖက်'),
  niiHere: syl('นี่', 'falling', 'nîi', 'နီ့'),
  roe: syl('เหรอ', 'rising', 'rǒe', 'ရော'),
}

// The Burmese side of a line: the text, then how to say it in Thai letters.
const my = (text, read) => ({ my: text, read })

// Burmese lines used more than once.
const B = {
  hello: my('မင်္ဂလာပါ', 'มิง-กะ-ลา-บา'),
  ok: my('ရပါတယ်', 'ยะ-บา-แด'),
  thanks: my('ကျေးဇူးတင်ပါတယ်', 'เจ-ซู-ติน-บา-แด'),
  littleSpeak: my('နည်းနည်း ပြောတတ်ပါတယ်', 'นี-นี ปยอ-ตะ-บา-แด'),
  whereFrom: my('ဘယ်က လာတာလဲ', 'แบ-ก้า ลา-ดา-แล'),
  veryLike: my('အရမ်း ကြိုက်တယ်', 'อะ-ยัน ไจ-แด'),
  whereGo: my('ဘယ် သွားမလဲ', 'แบ ตวา-มะ-แล'),
  howMuchThis: my('ဒါ ဘယ်လောက်လဲ', 'ดา แบ-เลา-แล'),
}

function say(syllables, burmese, emoji, extra = {}) {
  return { syllables, ...burmese, emoji, polite: 'statement', ...extra }
}

const ask = (syllables, burmese, emoji, extra) => say(syllables, burmese, emoji, { polite: 'question', ...extra })

function talk(id, cat, asked, answer, learn) {
  return {
    id,
    cat,
    icon: asked.emoji,
    ask: { ...asked, key: asked.key ?? `${id}-ask` },
    answer: { ...answer, key: `${id}-answer` },
    ...(learn && { learn }),
  }
}

const HELLO = [S.sa, syl('วัส', 'low', 'wàt', 'ဝတ်'), S.dii]
const NEVER_MIND = [S.maiNot, S.pen, S.rai]
const THANK_YOU = [S.khaawp, S.khun]
const WHERE_IS = [S.yuu, S.nai]
const HOW_MUCH = [S.thao, S.rai2]

const CHAT = [
  talk('hello', 'chat', say(HELLO, B.hello, '👋'), say(HELLO, B.hello, '🙏😊')),
  talk(
    'how-are-you',
    'chat',
    ask([S.sa, S.baai, S.dii, S.maiQ], my('နေကောင်းလား', 'เน-เก้า-ลา'), '😊❓'),
    say([S.sa, S.baai, S.dii], my('နေကောင်းပါတယ်', 'เน-เก้า-บา-แด'), '😊👍'),
  ),
  talk(
    'from-where',
    'chat',
    ask([S.maa, S.jaak, S.nai], B.whereFrom, '🗺️❓'),
    say([S.maa, S.jaak, S.pha, S.maaBurma], my('မြန်မာပြည်က လာတာပါ', 'มยัน-มา-ปยี-ก้า ลา-ดา-บา'), '🇲🇲'),
    'th',
  ),
  talk(
    'from-where-thai',
    'chat',
    ask([S.maa, S.jaak, S.nai], B.whereFrom, '🗺️❓'),
    say([S.maa, S.jaak, S.mueang, S.thai], my('ထိုင်းက လာတာပါ', 'ไท-ก้า ลา-ดา-บา'), '🇹🇭'),
    'my',
  ),
  talk(
    'understand',
    'chat',
    ask([S.khao, S.jai, S.maiQ], my('နားလည်လား', 'นา-แล-ลา'), '🤔❓'),
    say([S.khao, S.jai], my('နားလည်ပါတယ်', 'นา-แล-บา-แด'), '💡👍'),
  ),
  talk(
    'speak-thai',
    'chat',
    ask([S.phuut, S.thai, S.dai, S.maiQ], my('ထိုင်းစကား ပြောတတ်လား', 'ไท-สะ-กา ปยอ-ตะ-ลา'), '🗣️🇹🇭❓'),
    say([S.dai, S.nit, S.noi], B.littleSpeak, '🤏🗣️'),
    'th',
  ),
  talk(
    'speak-burmese',
    'chat',
    ask(
      [S.phuut, S.pha, S.maaBurma, S.dai, S.maiQ],
      my('မြန်မာစကား ပြောတတ်လား', 'มยัน-มา-สะ-กา ปยอ-ตะ-ลา'),
      '🗣️🇲🇲❓',
    ),
    say([S.dai, S.nit, S.noi], B.littleSpeak, '🤏🗣️'),
    'my',
  ),
  talk('thanks', 'chat', say(THANK_YOU, B.thanks, '🙏'), say(NEVER_MIND, B.ok, '😊👌')),
  talk(
    'sorry',
    'chat',
    say([S.khor, syl('โทษ', 'falling', 'thôot', 'ထုတ်')], my('တောင်းပန်ပါတယ်', 'ต่าว-ปั่น-บา-แด'), '🙇'),
    say(NEVER_MIND, B.ok, '😊👌', { accept: ['ไม่เป็นไรนะ'] }),
  ),
  talk(
    'where-going',
    'chat',
    ask([S.pai, S.nai], B.whereGo, '🚶❓'),
    say([S.pai, S.tham, S.ngaan], my('အလုပ် သွားမယ်', 'อะ-โละ ตวา-แม'), '💼🚶'),
  ),
  talk(
    'work-where',
    'chat',
    ask([S.tham, S.ngaan, S.thii, S.nai], my('ဘယ်မှာ အလုပ်လုပ်လဲ', 'แบ-มา อะ-โละ-โละ-แล'), '💼❓'),
    say(
      [S.tham, S.ngaan, S.thii, syl('โรง', 'mid', 'roong', 'ရုန်'), S.ngaan],
      my('စက်ရုံမှာ အလုပ်လုပ်ပါတယ်', 'แซะ-โยน-มา อะ-โละ-โละ-บา-แด'),
      '🏭💼',
    ),
  ),
  talk(
    'whats-wrong',
    'chat',
    ask([S.pen, S.a, S.rai], my('ဘာဖြစ်လို့လဲ', 'บา-ผยิ-โล-แล'), '😟❓'),
    say([S.maiNot, S.sa, S.baai], my('နေမကောင်းဘူး', 'เน-มะ-เก้า-บู'), '🤒'),
  ),
  talk(
    'tired',
    'chat',
    ask([S.nueai, S.maiQ], my('ပင်ပန်းလား', 'ปิน-ปัน-ลา'), '😮‍💨❓'),
    say([S.nueai, S.nit, S.noi], my('နည်းနည်း ပင်ပန်းတယ်', 'นี-นี ปิน-ปัน-แด'), '🤏😮‍💨'),
  ),
  talk(
    'hot',
    'chat',
    ask([S.ron, S.maiQ], my('ပူလား', 'ปู-ลา'), '☀️❓'),
    say([S.ron, S.maak], my('အရမ်း ပူတယ်', 'อะ-ยัน ปู-แด'), '🥵'),
  ),
  talk(
    'home-where',
    'chat',
    ask([syl('บ้าน', 'falling', 'bâan', 'ဘန့်'), ...WHERE_IS], my('အိမ် ဘယ်မှာလဲ', 'เอง แบ-มา-แล'), '🏠❓'),
    say([S.yuu, S.maiNot, S.klai], my('သိပ် မဝေးပါဘူး', 'เต มะ-เว-บา-บู'), '🏠👌'),
  ),
  talk(
    'like-thailand',
    'chat',
    ask([S.chop, S.mueang, S.thai, S.maiQ], my('ထိုင်းနိုင်ငံကို ကြိုက်လား', 'ไท-ไน-งัน-โก ไจ-ลา'), '🇹🇭❤️❓'),
    say([S.chop, S.maak], B.veryLike, '😍'),
    'th',
  ),
  talk(
    'like-myanmar',
    'chat',
    ask([S.chop, S.pha, S.maaBurma, S.maiQ], my('မြန်မာပြည်ကို ကြိုက်လား', 'มยัน-มา-ปยี-โก ไจ-ลา'), '🇲🇲❤️❓'),
    say([S.chop, S.maak], B.veryLike, '😍'),
    'my',
  ),
  talk(
    'bye',
    'chat',
    say([S.pai, syl('ก่อน', 'low', 'kòn', 'ကွန်'), S.naa], my('သွားပြီနော်', 'ตวา-บี-นอ'), '👋🚶'),
    say([S.laew, syl('เจอ', 'mid', 'joe', 'ကျာ'), syl('กัน', 'mid', 'kan', 'ကန်')], my('နောက်မှ တွေ့မယ်', 'นาว-มา ตเว-แม'), '👋😊', {
      accept: ['แล้วเจอกันใหม่'],
    }),
  ),
  talk(
    'wait',
    'chat',
    say(
      [syl('รอ', 'mid', 'ror', 'ရော'), syl('สัก', 'low', 'sàk', 'ဆက်'), syl('ครู่', 'falling', 'khrûu', 'ခရူ့')],
      my('ခဏ စောင့်ပါ', 'คะ-นะ ซาว-บา'),
      '⏳✋',
    ),
    say([S.dai], B.ok, '👌'),
  ),
]

// Lines with "I" in them, which change with the speaker's gender.
const ARE_YOU_THAI = ask([S.pen, S.khon, S.thai, S.roe], my('ထိုင်းလူမျိုးလား', 'ไท-ลู-โม-ลา'), '🇹🇭❓')

const ABOUT_ME = [
  talk(
    'hungry',
    'chat',
    ask([S.hiw, S.maiQ], my('ဗိုက်ဆာလား', 'ไบ-ซา-ลา'), '🍽️❓'),
    say([I, S.hiw, S.maak], my('{I} ဗိုက်အရမ်းဆာတယ်', '{I} ไบ-อะ-ยัน-ซา-แด'), '🤤'),
  ),
  talk(
    'like-which',
    'chat',
    ask([S.chop, S.an, S.nai], my('ဘယ်ဟာ ကြိုက်လဲ', 'แบ-ฮา ไจ-แล'), '🤔❤️'),
    say([I, S.chop, S.an, S.nii], my('{I} ဒါ ကြိုက်တယ်', '{I} ดา ไจ-แด'), '👉❤️'),
  ),
  talk(
    'here-why',
    'chat',
    ask([S.maa, S.tham, S.a, S.rai, S.thii, S.niiHere], my('ဒီမှာ ဘာလာလုပ်တာလဲ', 'ดี-มา บา-ลา-โละ-ดา-แล'), '📍❓'),
    say([I, S.maa, S.tham, S.ngaan], my('{I} အလုပ်လာလုပ်တာပါ', '{I} อะ-โละ-ลา-โละ-ดา-บา'), '💼'),
  ),
  talk(
    'stay-where',
    'chat',
    ask([S.phak, S.yuu, S.thii, S.nai], my('ဘယ်မှာ နေလဲ', 'แบ-มา เน-แล'), '🛏️❓'),
    say(
      [I, S.phak, S.yuu, S.klaiNear, S.klaiNear],
      my('{I} နီးနီးလေးမှာ နေပါတယ်', '{I} นี-นี-เล-มา เน-บา-แด'),
      '🏠🤏',
      { accept: ['ผมพักอยู่ใกล้ๆ', 'ฉันพักอยู่ใกล้ๆ'] },
    ),
  ),
  talk(
    'are-you-thai',
    'chat',
    ARE_YOU_THAI,
    say(
      [S.maiNot, S.chai, I, S.pen, S.khon, S.pha, S.maaBurma],
      my('မဟုတ်ပါဘူး {I} မြန်မာပါ', 'มะ-โฮ-บา-บู {I} มยัน-มา-บา'),
      '🙅🇲🇲',
    ),
    'th',
  ),
  talk(
    'are-you-thai-yes',
    'chat',
    ARE_YOU_THAI,
    say([S.chai, I, S.pen, S.khon, S.thai], my('ဟုတ်ကဲ့ {I} ထိုင်းပါ', 'โฮ-แก {I} ไท-บา'), '👍🇹🇭'),
    'my',
  ),
]

const FOOD = [
  talk(
    'eaten',
    'food',
    ask([S.kin, S.khaao, S.rueQ, S.yang], my('ထမင်း စားပြီးပြီလား', 'ทะ-มิน ซา-ปี-บี-ลา'), '🍚❓'),
    say([S.kin, S.laew], my('စားပြီးပြီ', 'ซา-ปี-บี'), '🍚😋'),
  ),
  talk(
    'want-eat',
    'food',
    ask([S.yaak, S.kin, S.a, S.rai], my('ဘာ စားချင်လဲ', 'บา ซา-ชิน-แล'), '🍽️❓'),
    say(
      [S.yaak, S.kin, S.khaao, syl('ผัด', 'low', 'phàt', 'ဖတ်')],
      my('ထမင်းကြော် စားချင်ပါတယ်', 'ทะ-มิน-จอ ซา-ชิน-บา-แด'),
      '🍳🍚',
    ),
  ),
  talk(
    'drink',
    'food',
    ask([syl('ดื่ม', 'low', 'dùem', 'ဒုမ်'), S.a, S.rai, S.dii], my('ဘာ သောက်မလဲ', 'บา ตาว-มะ-แล'), '🥤❓'),
    say([S.khor, S.naam, syl('เปล่า', 'low', 'plàao', 'ပလောင်')], my('ရေ ပေးပါ', 'เย เป-บา'), '💧🙏'),
  ),
  talk(
    'spicy',
    'food',
    ask([S.phet, S.dai, S.maiQ], my('စပ်တာ စားနိုင်လား', 'ซะ-ดา ซา-ไน-ลา'), '🌶️❓'),
    say([S.maiNot, S.aao, S.phet], my('မစပ်ပါစေနဲ့', 'มะ-ซะ-บา-เซ-แน'), '🚫🌶️'),
  ),
  talk(
    'tasty',
    'food',
    ask([syl('อ', 'low', 'à', 'အ'), syl('ร่อย', 'low', 'ròi', 'ရွိုင်'), S.maiQ], my('စားကောင်းလား', 'ซา-เก้า-ลา'), '😋❓'),
    say([syl('อ', 'low', 'à', 'အ'), syl('ร่อย', 'low', 'ròi', 'ရွိုင်'), S.maak], my('အရမ်း စားကောင်းတယ်', 'อะ-ยัน ซา-เก้า-แด'), '😋👍'),
  ),
  talk(
    'which-one',
    'food',
    ask([S.aao, S.a, S.rai], my('ဘာ ယူမလဲ', 'บา ยู-มะ-แล'), '🤔❓'),
    say([S.aao, S.an, S.nii], my('ဒါ ယူမယ်', 'ดา ยู-แม'), '👉📦'),
  ),
]

const TRAVEL = [
  talk(
    'tr-station',
    'travel',
    ask([S.ja, S.pai, S.nai], B.whereGo, '🧳❓'),
    say(
      [S.pai, S.sa, syl('ถา', 'rising', 'thǎa', 'ထာ'), syl('นี', 'mid', 'nii', 'နီ'), S.rot, S.fai],
      my('ဘူတာရုံ သွားမယ်', 'บู-ดา-โยน ตวา-แม'),
      '🚉🚆',
    ),
  ),
  talk(
    'tr-how-go',
    'travel',
    ask([S.pai, S.yang, syl('ไง', 'mid', 'ngai', 'ငိုင်')], my('ဘယ်လို သွားမလဲ', 'แบ-โล ตวา-มะ-แล'), '🛣️❓'),
    say([S.nang, S.rot, S.mee], my('ဘတ်စ်ကား စီးမယ်', 'บะ-กา ซี-แม'), '🚌'),
  ),
  talk(
    'tr-stop-where',
    'travel',
    ask([S.jawt, S.trong, S.nai], my('ဘယ်မှာ ရပ်မလဲ', 'แบ-มา ยะ-มะ-แล'), '🚕❓'),
    say([S.jawt, S.trong, S.nii], my('ဒီမှာ ရပ်ပါ', 'ดี-มา ยะ-บา'), '🛑📍'),
  ),
  talk(
    'tr-ticket',
    'travel',
    ask(
      [syl('ซื้อ', 'high', 'súe', 'ဆူး'), syl('ตั๋ว', 'rising', 'tǔa', 'တွာ'), S.pai, S.nai],
      my('ဘယ်ကို လက်မှတ် ဝယ်မလဲ', 'แบ-โก แล-มะ แว-มะ-แล'),
      '🎫❓',
    ),
    say(
      [S.pai, syl('เชียง', 'mid', 'chiang', 'ချင်'), syl('ใหม่', 'low', 'mài', 'မိုင့်')],
      my('ချင်းမိုင် သွားမယ်', 'ชิน-ไม ตวา-แม'),
      '🏔️🚆',
    ),
  ),
  talk(
    'tr-bus-came',
    'travel',
    ask([S.rot, S.maa, S.rueQ, S.yang], my('ကား လာပြီလား', 'กา ลา-บี-ลา'), '🚌❓'),
    say([S.yang, S.maiNot, S.maa], my('မလာသေးဘူး', 'มะ-ลา-เต-บู'), '⏳🚫'),
  ),
  talk(
    'tr-motorbike',
    'travel',
    ask([S.nang, syl('วิน', 'mid', 'win', 'ဝင်'), S.maiQ], my('ဆိုင်ကယ် စီးမလား', 'ไซ-แก ซี-มะ-ลา'), '🏍️❓'),
    say([S.doen, S.pai], my('လမ်းလျှောက် သွားမယ်', 'ลัน-ชาว ตวา-แม'), '🚶'),
  ),
  talk(
    'tr-airport',
    'travel',
    ask([S.riip, S.maiQ], my('အလျင်လိုလား', 'อะ-ลยิน-โล-ลา'), '⏰❓'),
    say([S.riip, S.pai, ...S.sanaam, S.bin], my('လေဆိပ် သွားရမယ်', 'เล-เซ ตวา-ยะ-แม'), '✈️🏃'),
  ),
  talk(
    'tr-get-off',
    'travel',
    ask([S.long, S.thii, S.nai], my('ဘယ်မှာ ဆင်းမလဲ', 'แบ-มา ซิน-มะ-แล'), '🚏❓'),
    say(
      [S.long, syl('ป้าย', 'falling', 'pâai', 'ပိုင့်'), syl('หน้า', 'falling', 'nâa', 'နာ့')],
      my('နောက်မှတ်တိုင်မှာ ဆင်းမယ်', 'นาว-มะ-ไต-มา ซิน-แม'),
      '⏭️🚏',
    ),
  ),
  talk(
    'tr-seat',
    'travel',
    ask([S.nang, S.trong, S.nii, S.dai, S.maiQ], my('ဒီမှာ ထိုင်လို့ရလား', 'ดี-มา ไท-โล-ยะ-ลา'), '💺❓'),
    say([syl('เชิญ', 'mid', 'choen', 'ချန်'), syl('เลย', 'mid', 'loei', 'လေ')], my('ထိုင်ပါ', 'ไท-บา'), '😊💺'),
  ),
  talk(
    'tr-traffic',
    'travel',
    ask([S.rot, S.tit, S.maiQ], my('ကားကျပ်လား', 'กา-จะ-ลา'), '🚗🚙❓'),
    say([S.rot, S.tit, S.maak], my('ကား အရမ်းကျပ်တယ်', 'กา อะ-ยัน-จะ-แด'), '🚗🚙🚕😩'),
  ),
  talk(
    'tr-arrived',
    'travel',
    say([syl('ถึง', 'rising', 'thǔeng', 'ထုန်'), S.laew, S.naa], my('ရောက်ပြီနော်', 'ยาว-บี-นอ'), '🏁'),
    say(THANK_YOU, B.thanks, '🙏'),
  ),
]

const DIRECTIONS = [
  talk(
    'dir-toilet',
    'directions',
    ask(
      [S.mii, S.a, S.rai, S.hai, S.chuai, S.maiQ],
      my('ဘာ ကူညီပေးရမလဲ', 'บา กู-ญี-เป-ยะ-มะ-แล'),
      '🙋❓',
    ),
    ask([S.hong, S.naam, S.yuu, S.thii, S.nai], my('အိမ်သာ ဘယ်မှာလဲ', 'เอง-ตา แบ-มา-แล'), '🚻❓', {
      accept: ['ห้องน้ำอยู่ไหน', 'ห้องน้ำที่ไหน'],
    }),
  ),
  talk(
    'dir-lost',
    'directions',
    ask([syl('หลง', 'rising', 'lǒng', 'လုန်'), S.thaang, syl('เหรอ', 'rising', 'rǒe', 'ရော')], my('လမ်းပျောက်နေလား', 'ลัน-ปยาว-เน-ลา'), '😵‍💫❓'),
    say(
      [syl('ใช่', 'falling', 'châi', 'ချိုင့်'), syl('หลง', 'rising', 'lǒng', 'လုန်'), S.thaang],
      my('ဟုတ်ကဲ့ လမ်းပျောက်နေတယ်', 'โฮ-แก ลัน-ปยาว-เน-แด'),
      '😵‍💫🗺️',
    ),
  ),
  talk(
    'dir-market',
    'directions',
    ask([S.yaak, S.pai, S.nai], my('ဘယ်ကို သွားချင်လဲ', 'แบ-โก ตวา-ชิน-แล'), '🧭❓'),
    ask([...S.taLaat, S.pai, S.thaang, S.nai], my('ဈေးကို ဘယ်လို သွားရလဲ', 'เซ-โก แบ-โล ตวา-ยะ-แล'), '🛒➡️❓'),
  ),
  talk(
    'dir-straight',
    'directions',
    ask(
      [syl('โรง', 'mid', 'roong', 'ရုန်'), syl('พ', 'high', 'phá', 'ဖ'), S.yaa, syl('บาล', 'mid', 'baan', 'ဘန်'), ...WHERE_IS],
      my('ဆေးရုံ ဘယ်မှာလဲ', 'เซ-โยน แบ-มา-แล'),
      '🏥❓',
    ),
    say([S.trong, S.pai], my('တည့်တည့် သွားပါ', 'แต-แต ตวา-บา'), '⬆️'),
  ),
  talk(
    'dir-left',
    'directions',
    ask([S.raan, S.khaai, S.yaa, ...WHERE_IS], my('ဆေးဆိုင် ဘယ်မှာလဲ', 'เซ-ไซ แบ-มา-แล'), '💊🏪❓'),
    say([S.liao, syl('ซ้าย', 'high', 'sáai', 'ဆိုင်')], my('ဘယ်ဘက် ကွေ့ပါ', 'แบ-แบะ เกว-บา'), '⬅️'),
  ),
  talk(
    'dir-right',
    'directions',
    ask(
      [syl('ป้าย', 'falling', 'pâai', 'ပိုင့်'), S.rot, S.mee, ...WHERE_IS],
      my('ဘတ်စ်ကားမှတ်တိုင် ဘယ်မှာလဲ', 'บะ-กา-มะ-ไต แบ-มา-แล'),
      '🚏❓',
    ),
    say([S.liao, syl('ขวา', 'rising', 'khwǎa', 'ခွာ')], my('ညာဘက် ကွေ့ပါ', 'ญา-แบะ เกว-บา'), '➡️'),
  ),
  talk(
    'dir-far',
    'directions',
    ask([S.klai, S.maiQ], my('ဝေးလား', 'เว-ลา'), '📏❓'),
    say([S.klaiNear, S.klaiNear], my('နီးနီးလေးပါ', 'นี-นี-เล-บา'), '🤏📍', { accept: ['ใกล้ๆ', 'ใกล้ ๆ'] }),
  ),
  talk(
    'dir-opposite',
    'directions',
    ask(
      [S.raan, syl('กา', 'mid', 'kaa', 'ကာ'), syl('แฟ', 'mid', 'fae', 'ဖဲ'), ...WHERE_IS],
      my('ကော်ဖီဆိုင် ဘယ်မှာလဲ', 'กอ-ฟี-ไซ แบ-มา-แล'),
      '☕❓',
    ),
    say([S.yuu, S.trong, syl('ข้าม', 'falling', 'khâam', 'ခမ်')], my('တစ်ဖက်မှာ ရှိတယ်', 'ตะ-แผะ-มา ชิ-แด'), '↔️🏪'),
  ),
  talk(
    'dir-over-there',
    'directions',
    ask([...S.taLaat, ...WHERE_IS], my('ဈေး ဘယ်မှာလဲ', 'เซ แบ-มา-แล'), '🛒❓'),
    say([S.yuu, S.trong, syl('นั้น', 'high', 'nán', 'နန်')], my('ဟိုမှာ', 'โฮ-มา'), '👉'),
  ),
  talk(
    'dir-know-way',
    'directions',
    ask([S.pai, syl('ถูก', 'low', 'thùuk', 'ထုတ်'), S.maiQ], my('လမ်းသိလား', 'ลัน-ติ-ลา'), '🧭❓'),
    say([S.chuai, syl('บอก', 'low', 'bòk', 'ဘော့'), S.thaang, S.noi], my('လမ်း ပြပေးပါ', 'ลัน ปยา-เป-บา'), '🙏🗺️'),
  ),
  talk(
    'dir-turn-where',
    'directions',
    ask([S.liao, S.trong, S.nai], my('ဘယ်မှာ ကွေ့ရမလဲ', 'แบ-มา เกว-ยะ-มะ-แล'), '↪️❓'),
    say([S.liao, S.trong, S.fai, syl('แดง', 'mid', 'daeng', 'ဒဲင်')], my('မီးပွိုင့်မှာ ကွေ့ပါ', 'มี-ปไว-มา เกว-บา'), '🚦'),
  ),
]

const PAY = [
  talk(
    'pay-what',
    'pay',
    ask([S.rap, S.a, S.rai, S.dii], my('ဘာ ဝယ်မလဲ', 'บา แว-มะ-แล'), '🛍️❓'),
    ask([S.an, S.nii, syl('รา', 'mid', 'raa', 'ရာ'), syl('คา', 'mid', 'khaa', 'ခါ'), ...HOW_MUCH], B.howMuchThis, '🏷️❓'),
  ),
  talk(
    'pay-twenty',
    'pay',
    ask([S.an, S.nii, ...HOW_MUCH], B.howMuchThis, '🏷️❓'),
    say([syl('ยี่', 'falling', 'yîi', 'ယီ'), S.sip, S.baat], my('နှစ်ဆယ် ဘတ်ပါ', 'หนิ-แซ บะ-บา'), '💵2️⃣0️⃣'),
  ),
  talk(
    'pay-hundred',
    'pay',
    ask([syl('ทั้ง', 'high', 'tháng', 'ထန်'), syl('หมด', 'low', 'mòt', 'မုတ်'), ...HOW_MUCH], my('အားလုံး ဘယ်လောက်လဲ', 'อา-โลน แบ-เลา-แล'), '🧾❓'),
    say([S.roi, S.baat], my('တစ်ရာ ဘတ်ပါ', 'ตะ-ยา บะ-บา'), '💵💯', { accept: ['หนึ่งร้อยบาท'] }),
  ),
  talk(
    'pay-expensive',
    'pay',
    say([S.haa, S.roi, S.baat], my('ငါးရာ ဘတ်ပါ', 'งา-ยา บะ-บา'), '💰5️⃣0️⃣0️⃣'),
    ask(
      [syl('แพง', 'mid', 'phaeng', 'ဖဲင်'), S.pai, S.lot, S.dai, S.maiQ],
      my('ဈေးကြီးတယ် လျှော့ပေးလို့ရလား', 'เซ-จี-แด ฉอ-เป-โล-ยะ-ลา'),
      '😮💸⬇️',
    ),
  ),
  talk(
    'pay-fifty',
    'pay',
    ask([syl('แตง', 'mid', 'taeng', 'တဲင်'), syl('โม', 'mid', 'moo', 'မို'), ...HOW_MUCH], my('ဖရဲသီး ဘယ်လောက်လဲ', 'ผะ-แย-ตี แบ-เลา-แล'), '🍉❓'),
    say([S.haa, S.sip, S.baat], my('ငါးဆယ် ဘတ်ပါ', 'งา-แซ บะ-บา'), '💵5️⃣0️⃣'),
  ),
  talk(
    'pay-bottle',
    'pay',
    ask([syl('ขวด', 'low', 'khùat', 'ခွတ်'), syl('ละ', 'high', 'lá', 'လ'), ...HOW_MUCH], my('တစ်ပုလင်း ဘယ်လောက်လဲ', 'ตะ-บะ-ลิน แบ-เลา-แล'), '🍾❓'),
    say(
      [syl('ขวด', 'low', 'khùat', 'ခွတ်'), syl('ละ', 'high', 'lá', 'လ'), S.sip, S.baat],
      my('တစ်ပုလင်း ဆယ်ဘတ်ပါ', 'ตะ-บะ-ลิน แซ-บะ-บา'),
      '🍾🔟',
    ),
  ),
  talk(
    'pay-scan',
    'pay',
    ask(
      [S.jaai, S.ngoen, S.sot, S.rueQ, S.sa, S.kaen],
      my('ငွေသားလား စကင်ဖတ်မလား', 'งเว-ตา-ลา สะ-กิน-ผะ-มะ-ลา'),
      '💵❓📱',
    ),
    say([S.sa, S.kaen, S.jaai], my('စကင်ဖတ်ပြီး ပေးမယ်', 'สะ-กิน-ผะ-ปี เป-แม'), '📱✅'),
  ),
  talk(
    'pay-cash-only',
    'pay',
    ask([S.rap, S.sa, S.kaen, S.maiQ], my('စကင်ဖတ်လို့ ရလား', 'สะ-กิน-ผะ-โล ยะ-ลา'), '📱❓'),
    say(
      [S.rap, S.ngoen, S.sot, syl('อย่าง', 'low', 'yàang', 'ယန်'), syl('เดียว', 'mid', 'diao', 'ဒီယို')],
      my('ငွေသားပဲ ရပါတယ်', 'งเว-ตา-แบ ยะ-บา-แด'),
      '💵👍',
    ),
  ),
  talk(
    'pay-small-notes',
    'pay',
    ask([S.mii, syl('แบงก์', 'mid', 'baeng', 'ဘဲင်'), syl('ย่อย', 'falling', 'yôi', 'ယွိုင့်'), S.maiQ], my('အကြွေ ရှိလား', 'อะ-จเว ชิ-ลา'), '💵🪙❓'),
    say([S.maiNot, S.mii], my('မရှိဘူး', 'มะ-ชิ-บู'), '🙅'),
  ),
  talk(
    'pay-bag',
    'pay',
    ask([S.aao, syl('ถุง', 'rising', 'thǔng', 'ထုန်'), S.maiQ], my('အိတ် ယူမလား', 'เอ ยู-มะ-ลา'), '🛍️❓'),
    say([S.maiNot, syl('ต้อง', 'falling', 'tông', 'တောင့်')], my('မလိုပါဘူး', 'มะ-โล-บา-บู'), '🙅👌'),
  ),
  talk(
    'pay-receipt',
    'pay',
    ask([S.aao, S.a, S.rai, syl('อีก', 'low', 'ìik', 'အိတ်'), S.maiQ], my('ဘာ ထပ်ယူဦးမလဲ', 'บา ทะ-ยู-อู-มะ-แล'), '➕❓'),
    say(
      [S.khor, syl('ใบ', 'mid', 'bai', 'ဘိုင်'), syl('เสร็จ', 'low', 'sèt', 'ဆက်'), S.duai],
      my('ဘောင်ချာ ပေးပါ', 'บาว-ชา เป-บา'),
      '🧾🙏',
    ),
  ),
  talk(
    'pay-discount',
    'pay',
    say([S.lot, S.hai, S.laew, S.naa], my('လျှော့ပေးပြီနော်', 'ฉอ-เป-บี-นอ'), '⬇️💸😊'),
    say([...THANK_YOU, S.maak], my('ကျေးဇူး အများကြီး တင်ပါတယ်', 'เจ-ซู อะ-มยา-จี ติน-บา-แด'), '🙏🙏'),
  ),
  talk(
    'pay-please',
    'pay',
    say([S.jaai, S.ngoen, S.duai], my('ငွေ ရှင်းပေးပါ', 'งเว ชิน-เป-บา'), '💳🙏'),
    ask(HOW_MUCH, my('ဘယ်လောက်လဲ', 'แบ-เลา-แล'), '💰❓', { accept: ['เท่าไร'] }),
  ),
]

// "What is this called?"
const WHAT_IS_THIS = ask(
  [S.an, S.nii, syl('เรียก', 'falling', 'rîak', 'ရီယက်'), syl('ว่า', 'falling', 'wâa', 'ဝါ့'), S.a, S.rai],
  my('ဒါကို ဘာ ခေါ်လဲ', 'ดา-โก บา คอ-แล'),
  '🤔',
  { key: 'what-is-this' },
)

// Single words, asked as "what is this called?" with the thing's picture.
function word(id, emoji, syllables, burmese, extra) {
  return talk(`w-${id}`, 'word', { ...WHAT_IS_THIS, emoji }, say(syllables, burmese, emoji, extra))
}

const WORDS = [
  word('water', '💧', [S.naam], my('ရေ', 'เย')),
  word('rice', '🍚', [S.khaao], my('ထမင်း', 'ทะ-มิน')),
  word('toilet', '🚻', [S.hong, S.naam], my('အိမ်သာ', 'เอง-ตา')),
  word(
    'phone',
    '📱',
    [syl('โท', 'mid', 'thoo', 'ထို'), syl('ร', 'high', 'rá', 'ရ'), syl('ศัพท์', 'low', 'sàp', 'ဆပ်')],
    my('ဖုန်း', 'โพน'),
  ),
  word('bus', '🚌', [S.rot, S.mee], my('ဘတ်စ်ကား', 'บะ-กา')),
  word('medicine', '💊', [S.yaa], my('ဆေး', 'เซ')),
  word('doctor', '🧑‍⚕️', [syl('หมอ', 'rising', 'mǒr', 'မော')], my('ဆရာဝန်', 'ซะ-ยา-วุน')),
  word('chicken', '🐔', [syl('ไก่', 'low', 'kài', 'ကိုင်')], my('ကြက်', 'แจะ')),
  word('dog', '🐕', [syl('หมา', 'rising', 'mǎa', 'မာ')], my('ခွေး', 'คเว')),
  word('cat', '🐈', [syl('แมว', 'mid', 'maew', 'မယ်')], my('ကြောင်', 'เจา')),
  word('shirt', '👕', [syl('เสื้อ', 'falling', 'sûea', 'ဆွာ့')], my('အင်္ကျီ', 'อิน-จี')),
  word('fish', '🐟', [syl('ปลา', 'mid', 'plaa', 'ပလာ')], my('ငါး', 'งา')),
  word('egg', '🥚', [syl('ไข่', 'low', 'khài', 'ခိုင်')], my('ကြက်ဥ', 'แจะ-อู')),
  word('umbrella', '☂️', [syl('ร่ม', 'falling', 'rôm', 'ရုမ့်')], my('ထီး', 'ที')),
  word('money', '💵', [S.ngoen], my('ငွေ', 'งเว')),
  word('car', '🚗', [S.rot], my('ကား', 'กา')),
  word('train', '🚆', [S.rot, S.fai], my('ရထား', 'ยะ-ทา')),
  word('plane', '✈️', [syl('เครื่อง', 'falling', 'khrûeang', 'ခရောင့်'), S.bin], my('လေယာဉ်', 'เล-ยิน')),
  word('road', '🛣️', [syl('ถ', 'low', 'thà', 'ထ'), syl('นน', 'rising', 'nǒn', 'နုန်')], my('လမ်း', 'ลัน')),
  word('house', '🏠', [syl('บ้าน', 'falling', 'bâan', 'ဘန့်')], my('အိမ်', 'เอง')),
  word(
    'hospital',
    '🏥',
    [syl('โรง', 'mid', 'roong', 'ရုန်'), syl('พ', 'high', 'phá', 'ဖ'), S.yaa, syl('บาล', 'mid', 'baan', 'ဘန်')],
    my('ဆေးရုံ', 'เซ-โยน'),
  ),
  word('market', '🛒', S.taLaat, my('ဈေး', 'เซ')),
  word('coffee', '☕', [syl('กา', 'mid', 'kaa', 'ကာ'), syl('แฟ', 'mid', 'fae', 'ဖဲ')], my('ကော်ဖီ', 'กอ-ฟี')),
  word('banana', '🍌', [syl('กล้วย', 'falling', 'klûai', 'ကလွယ့်')], my('ငှက်ပျောသီး', 'แง-ปยอ-ตี')),
  word('bag', '👜', [syl('กระ', 'low', 'krà', 'ကြ'), syl('เป๋า', 'rising', 'pǎo', 'ပေါ')], my('အိတ်', 'เอ')),
  word('key', '🔑', [syl('กุญ', 'mid', 'kun', 'ကွန်'), syl('แจ', 'mid', 'jae', 'ကျဲ')], my('သော့', 'ตอ')),
]

export const ROAD_TALKS = [...CHAT, ...ABOUT_ME, ...FOOD, ...TRAVEL, ...DIRECTIONS, ...PAY, ...WORDS]

export const roadTalkById = Object.fromEntries(ROAD_TALKS.map((t) => [t.id, t]))

// The talks for a player learning `learn` ('th' or 'my').
export const ROAD_TALKS_FOR = {
  th: ROAD_TALKS.filter((t) => !t.learn || t.learn === 'th'),
  my: ROAD_TALKS.filter((t) => !t.learn || t.learn === 'my'),
}

// The road always starts with a greeting.
export const FIRST_TALK_ID = 'hello'
