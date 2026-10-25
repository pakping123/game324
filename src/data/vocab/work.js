import { syl } from '../../lib/syllable.js'

// Workplace zone: the words a worker needs every day. Like the road vocab,
// each entry has the Thai syllables, the Burmese (`my`) and how to say the
// Burmese in Thai letters (`read`); unchecked by a native Burmese speaker.

function word(id, emoji, syllables, my, read, extra) {
  return { id, syllables, my, read, emoji, icon: emoji, key: `zone-${id}`, ...extra }
}

const THAM = syl('ทำ', 'mid', 'tham', 'ထမ်')
const KHOR = syl('ขอ', 'rising', 'khǒr', 'ခေါ')

export const workVocab = [
  word('wk-work', '💼', [THAM, syl('งาน', 'mid', 'ngaan', 'ငန်')], 'အလုပ်လုပ်တယ်', 'อะ-โละ-โละ-แด'),
  word('wk-boss', '👔', [syl('หัว', 'rising', 'hǔa', 'ဟွာ'), syl('หน้า', 'falling', 'nâa', 'နာ့')], 'သူဌေး', 'ตะ-เท'),
  word('wk-salary', '💰', [syl('เงิน', 'mid', 'ngoen', 'ငန်'), syl('เดือน', 'mid', 'duean', 'ဒွမ်')], 'လစာ', 'ละ-ซา'),
  word('wk-holiday', '🏖️', [syl('วัน', 'mid', 'wan', 'ဝန်'), syl('หยุด', 'low', 'yùt', 'ယုတ်')], 'ပိတ်ရက်', 'เป-แย'),
  word('wk-factory', '🏭', [syl('โรง', 'mid', 'roong', 'ရုန်'), syl('งาน', 'mid', 'ngaan', 'ငန်')], 'စက်ရုံ', 'แซะ-โยน'),
  word('wk-careful', '⚠️', [syl('ระ', 'high', 'rá', 'ရ'), syl('วัง', 'mid', 'wang', 'ဝန်')], 'သတိထား', 'ตะ-ดิ-ทา'),
  word('wk-gloves', '🧤', [syl('ถุง', 'rising', 'thǔng', 'ထုန်'), syl('มือ', 'mid', 'mue', 'မူ')], 'လက်အိတ်', 'แล-เอ'),
  word('wk-overtime', '⏰', [THAM, syl('โอ', 'mid', 'oo', 'အို'), syl('ที', 'mid', 'thii', 'ထီ')], 'အချိန်ပို', 'อะ-เชง-โป'),
  word(
    'wk-finished',
    '✅',
    [syl('เสร็จ', 'low', 'sèt', 'ဆက်'), syl('แล้ว', 'high', 'láew', 'လယ်')],
    'ပြီးပါပြီ',
    'ปี-บา-บี',
    { polite: 'statement' },
  ),
  word(
    'wk-cant-do',
    '🤷',
    [THAM, syl('ไม่', 'falling', 'mâi', 'မိုင့်'), syl('เป็น', 'mid', 'pen', 'ပင်')],
    'မလုပ်တတ်ဘူး',
    'มะ-โละ-ตะ-บู',
    { polite: 'statement' },
  ),
  word(
    'wk-help',
    '🙏',
    [syl('ช่วย', 'falling', 'chûai', 'ချွယ့်'), syl('หน่อย', 'low', 'nòi', 'နွိုင်')],
    'ကူညီပေးပါ',
    'กู-ญี-เป-บา',
    { polite: 'statement' },
  ),
  word(
    'wk-sick-leave',
    '🤒📝',
    [KHOR, syl('ลา', 'mid', 'laa', 'လာ'), syl('ป่วย', 'low', 'pùai', 'ပွယ်')],
    'ဖျားလို့ ခွင့်ယူမယ်',
    'ผยา-โล คเวง-ยู-แม',
    { polite: 'statement' },
  ),
  word(
    'wk-got-it',
    '👍',
    [syl('เข้า', 'falling', 'khâo', 'ခေါင့်'), syl('ใจ', 'mid', 'jai', 'ကျိုင်'), syl('แล้ว', 'high', 'láew', 'လယ်')],
    'နားလည်ပြီ',
    'นา-แล-บี',
    { polite: 'statement' },
  ),
]
