import { describe, expect, it } from 'vitest'
import { numberToThai } from './thaiNumber.js'

describe('numberToThai', () => {
  it.each([
    [0, 'ศูนย์'],
    [1, 'หนึ่ง'],
    [10, 'สิบ'],
    [11, 'สิบเอ็ด'],
    [20, 'ยี่สิบ'],
    [21, 'ยี่สิบเอ็ด'],
    [35, 'สามสิบห้า'],
    [99, 'เก้าสิบเก้า'],
    [100, 'หนึ่งร้อย'],
    [101, 'หนึ่งร้อยเอ็ด'],
    [120, 'หนึ่งร้อยยี่สิบ'],
    [1000, 'หนึ่งพัน'],
    [2511, 'สองพันห้าร้อยสิบเอ็ด'],
    [10000, 'หนึ่งหมื่น'],
  ])('%i → %s', (n, th) => {
    expect(numberToThai(n)).toBe(th)
  })

  it('rejects numbers it cannot say', () => {
    expect(() => numberToThai(-1)).toThrow(RangeError)
    expect(() => numberToThai(1.5)).toThrow(RangeError)
    expect(() => numberToThai(100000)).toThrow(RangeError)
  })
})
