import { syl } from '../../lib/syllable.js'

// Pharmacy zone: feeling ill and asking for medicine. Like the road vocab,
// each entry has the Thai syllables, the Burmese (`my`) and how to say the
// Burmese in Thai letters (`read`); unchecked by a native Burmese speaker.

function word(id, emoji, syllables, my, read, extra) {
  return { id, syllables, my, read, emoji, icon: emoji, key: `zone-${id}`, ...extra }
}

const PUAT = syl('ปวด', 'low', 'pùat', 'ပွတ်')
const PEN = syl('เป็น', 'mid', 'pen', 'ပင်')
const YAA = syl('ยา', 'mid', 'yaa', 'ယာ')

export const pharmacyVocab = [
  word('ph-headache', '🤕', [PUAT, syl('หัว', 'rising', 'hǔa', 'ဟွာ')], 'ခေါင်းကိုက်တယ်', 'เกา-ไก-แด'),
  word('ph-stomach', '🤢', [PUAT, syl('ท้อง', 'high', 'thóng', 'ထောင်')], 'ဗိုက်နာတယ်', 'ไบ-นา-แด'),
  word('ph-fever', '🤒', [PEN, syl('ไข้', 'falling', 'khâi', 'ခိုင့်')], 'ဖျားတယ်', 'ผยา-แด'),
  word('ph-cough', '😷', [syl('ไอ', 'mid', 'ai', 'အိုင်')], 'ချောင်းဆိုးတယ်', 'เชา-โซ-แด'),
  word('ph-cold', '🤧', [PEN, syl('หวัด', 'low', 'wàt', 'ဝတ်')], 'အအေးမိတယ်', 'อะ-เอ-มิ-แด'),
  word('ph-wound', '🩹', [syl('แผล', 'rising', 'phlǎe', 'ဖလဲ')], 'ဒဏ်ရာ', 'ดัน-ยา'),
  word(
    'ph-see-doctor',
    '🧑‍⚕️',
    [syl('ไป', 'mid', 'pai', 'ပိုင်'), syl('หา', 'rising', 'hǎa', 'ဟာ'), syl('หมอ', 'rising', 'mǒr', 'မော')],
    'ဆရာဝန်ဆီ သွားမယ်',
    'ซะ-ยา-วุน-ซี ตวา-แม',
  ),
  word(
    'ph-painkiller',
    '💊🙏',
    [syl('ขอ', 'rising', 'khǒr', 'ခေါ'), YAA, syl('แก้', 'falling', 'kâe', 'ကဲ့'), PUAT],
    'အကိုက်အခဲပျောက်ဆေး ပေးပါ',
    'อะ-ไก-อะ-แค-ปยาว-เซ เป-บา',
    { polite: 'statement' },
  ),
  word('ph-allergy', '🚫💊', [syl('แพ้', 'high', 'pháe', 'ဖဲ'), YAA], 'ဆေးနဲ့ မတည့်ဘူး', 'เซ-แน มะ-แต-บู'),
  word(
    'ph-how-take',
    '💊❓',
    [syl('กิน', 'mid', 'kin', 'ကင်'), syl('ยัง', 'mid', 'yang', 'ယန်'), syl('ไง', 'mid', 'ngai', 'ငိုင်')],
    'ဘယ်လို သောက်ရမလဲ',
    'แบ-โล ตาว-ยะ-มะ-แล',
    { polite: 'question' },
  ),
  word(
    'ph-after-meal',
    '🍚➡️💊',
    [syl('หลัง', 'rising', 'lǎng', 'လန်'), syl('อา', 'mid', 'aa', 'အာ'), syl('หาร', 'rising', 'hǎan', 'ဟန်')],
    'ထမင်းစားပြီး',
    'ทะ-มิน-ซา-ปี',
  ),
  word(
    'ph-hurts-here',
    '👉🤕',
    [syl('เจ็บ', 'low', 'jèp', 'ကျက်'), syl('ตรง', 'mid', 'trong', 'တရုန်'), syl('นี้', 'high', 'níi', 'နီ')],
    'ဒီမှာ နာတယ်',
    'ดี-มา นา-แด',
    { polite: 'statement' },
  ),
]
