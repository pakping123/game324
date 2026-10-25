// The five Thai tones. Colors are used everywhere a syllable is shown, so a
// player learns to link "this color" with "this pitch shape".
export const TONES = {
  mid: { th: 'สามัญ', my: 'အသံညီ', color: '#16a34a', arrow: '→' },
  low: { th: 'เอก', my: 'အသံနိမ့်', color: '#2563eb', arrow: '↘' },
  falling: { th: 'โท', my: 'အသံကျ', color: '#dc2626', arrow: '⤵' },
  high: { th: 'ตรี', my: 'အသံမြင့်', color: '#d97706', arrow: '↗' },
  rising: { th: 'จัตวา', my: 'အသံတက်', color: '#9333ea', arrow: '⤴' },
}

export const TONE_IDS = Object.keys(TONES)
