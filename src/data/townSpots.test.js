import { describe, expect, it } from 'vitest'
import { joinThai } from '../lib/syllable.js'
import { nearestSpot, SPOT_RADIUS, TOWN_SPOTS } from './townSpots.js'
import { MAP_RADIUS, ZONES } from './zones.js'

describe('town spots', () => {
  it('each have a word in both languages', () => {
    expect(TOWN_SPOTS.length).toBe(20)
    expect(new Set(TOWN_SPOTS.map((s) => s.id)).size).toBe(TOWN_SPOTS.length)
    for (const { entry } of TOWN_SPOTS) {
      expect(entry.emoji).toBeTruthy()
      expect(entry.my).toMatch(/[က-႟]/)
      expect(entry.read).toMatch(/[฀-๿]/)
    }
  })

  it('spell whole words from their syllables', () => {
    const word = (kind) => joinThai(TOWN_SPOTS.find((s) => s.kind === kind).entry.syllables)
    expect(word('mailbox')).toBe('ตู้ไปรษณีย์')
    expect(word('bicycle')).toBe('จักรยาน')
    expect(word('trashBin')).toBe('ถังขยะ')
    expect(word('coconut')).toBe('ต้นมะพร้าว')
  })

  it('stand inside the map and clear of the zone buildings', () => {
    for (const { position: [x, z] } of TOWN_SPOTS) {
      expect(Math.hypot(x, z)).toBeLessThan(MAP_RADIUS)
      for (const zone of ZONES) {
        expect(Math.hypot(zone.position[0] - x, zone.position[2] - z)).toBeGreaterThan(2.5)
      }
    }
  })

  it('show when the player is close', () => {
    const [x, z] = TOWN_SPOTS[0].position
    expect(nearestSpot(x + 0.5, z).id).toBe(TOWN_SPOTS[0].id)
    expect(nearestSpot(0, 0)).toBeNull()
    expect(nearestSpot(x + SPOT_RADIUS + 0.1, z)?.id).not.toBe(TOWN_SPOTS[0].id)
  })
})

describe('zones', () => {
  it('are all open, with Burmese for Thai players in every word', () => {
    for (const zone of ZONES) {
      expect(zone.ready, zone.id).toBe(true)
      expect(zone.vocab.length, zone.id).toBeGreaterThan(8)
      expect(new Set(zone.vocab.map((v) => v.id)).size, zone.id).toBe(zone.vocab.length)
      for (const v of zone.vocab) {
        expect(v.read, `${zone.id} ${v.id}`).toMatch(/[฀-๿]/)
        expect(v.icon, `${zone.id} ${v.id}`).toBeTruthy()
        expect(v.key, `${zone.id} ${v.id}`).toBeTruthy()
      }
    }
  })
})
