// How characters are dressed. The player picks a ready-made character and
// can change every part of it in the wardrobe; everything is free.

export const SKINS = ['#f1c27d', '#e0ac69', '#d6a06b', '#c68642', '#8d5524']
export const HAIR_COLORS = ['#1f130b', '#3b2314', '#111827', '#6b4423', '#b45309', '#9ca3af']
export const CLOTH_COLORS = [
  '#f8fafc',
  '#fde047',
  '#f59e0b',
  '#ef4444',
  '#fda4af',
  '#be185d',
  '#7c3aed',
  '#4338ca',
  '#38bdf8',
  '#14b8a6',
  '#16a34a',
  '#0f172a',
]

// The choices for each part of a look, with their labels (keys in data/ui.js).
export const HAIR_STYLES = ['short', 'long', 'bun', 'ponytail']
export const SHIRT_STYLES = ['tee', 'collar', 'stripes']
export const BOTTOMS = ['longyi', 'pants', 'skirt']
export const HATS = ['none', 'ngob', 'cap']
export const EXTRAS = ['thanaka', 'glasses', 'bag']

const BASE = {
  skin: '#e0ac69',
  hair: '#1f130b',
  hairStyle: 'short',
  shirt: '#f8fafc',
  shirtStyle: 'tee',
  bottom: '#4338ca',
  bottomType: 'longyi',
  hat: 'none',
  thanaka: false,
  glasses: false,
  bag: false,
}

// Ready-made characters, three men and three women.
export const PRESETS = [
  { id: 'm1', gender: 'm', look: { ...BASE, shirtStyle: 'collar' } },
  {
    id: 'm2',
    gender: 'm',
    look: { ...BASE, skin: '#c68642', hair: '#111827', shirt: '#38bdf8', bottomType: 'pants', bottom: '#0f172a', hat: 'cap' },
  },
  {
    id: 'm3',
    gender: 'm',
    look: { ...BASE, skin: '#d6a06b', shirt: '#16a34a', shirtStyle: 'stripes', bottom: '#7c3aed', hat: 'ngob', glasses: true },
  },
  {
    id: 'f1',
    gender: 'f',
    look: { ...BASE, hairStyle: 'long', shirt: '#fda4af', bottom: '#be185d', thanaka: true },
  },
  {
    id: 'f2',
    gender: 'f',
    look: { ...BASE, skin: '#f1c27d', hairStyle: 'bun', shirt: '#fde047', shirtStyle: 'collar', bottomType: 'skirt', bottom: '#7c3aed', bag: true },
  },
  {
    id: 'f3',
    gender: 'f',
    look: {
      ...BASE,
      skin: '#d6a06b',
      hair: '#3b2314',
      hairStyle: 'ponytail',
      shirt: '#14b8a6',
      bottomType: 'pants',
      bottom: '#4338ca',
      hat: 'cap',
      glasses: true,
    },
  },
]

export function defaultLook(gender) {
  return PRESETS.find((p) => p.gender === gender)?.look ?? PRESETS[0].look
}

export const VENDOR_LOOK = {
  shirt: '#fb923c',
  bottom: '#166534',
  skin: '#d6a06b',
  hat: 'ngob',
  apron: '#fef08a',
  hairStyle: 'long',
}

// The person the player talks with in each zone's scene (the market has the
// vendor above).
export const ZONE_LOOKS = {
  travel: {
    shirt: '#0ea5e9',
    shirtStyle: 'collar',
    bottom: '#1e293b',
    bottomType: 'pants',
    skin: '#c68642',
    hair: '#111827',
    hat: 'cap',
    bag: true,
  },
  directions: {
    shirt: '#fde047',
    shirtStyle: 'stripes',
    bottom: '#166534',
    bottomType: 'longyi',
    skin: '#d6a06b',
    hair: '#9ca3af',
    hat: 'ngob',
    glasses: true,
  },
  food: {
    shirt: '#f8fafc',
    bottom: '#0f172a',
    bottomType: 'pants',
    skin: '#e0ac69',
    hairStyle: 'bun',
    apron: '#ef4444',
  },
  pharmacy: {
    shirt: '#f8fafc',
    shirtStyle: 'collar',
    bottom: '#38bdf8',
    bottomType: 'skirt',
    skin: '#f1c27d',
    hairStyle: 'ponytail',
    glasses: true,
    apron: '#e2e8f0',
  },
  work: {
    shirt: '#f59e0b',
    shirtStyle: 'collar',
    bottom: '#1e3a8a',
    bottomType: 'pants',
    skin: '#c68642',
    hair: '#111827',
    hat: 'cap',
  },
}
