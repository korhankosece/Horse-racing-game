import { describe, expect, it } from 'vitest'

import { getOrdinalSuffix } from './racing'

describe('getOrdinalSuffix', () => {
  it('should return "st" for numbers ending in 1 (except 11)', () => {
    expect(getOrdinalSuffix(1)).toBe('1st')
    expect(getOrdinalSuffix(21)).toBe('21st')
    expect(getOrdinalSuffix(31)).toBe('31st')
    expect(getOrdinalSuffix(101)).toBe('101st')
  })

  it('should return "nd" for numbers ending in 2 (except 12)', () => {
    expect(getOrdinalSuffix(2)).toBe('2nd')
    expect(getOrdinalSuffix(22)).toBe('22nd')
    expect(getOrdinalSuffix(32)).toBe('32nd')
    expect(getOrdinalSuffix(102)).toBe('102nd')
  })

  it('should return "rd" for numbers ending in 3 (except 13)', () => {
    expect(getOrdinalSuffix(3)).toBe('3rd')
    expect(getOrdinalSuffix(23)).toBe('23rd')
    expect(getOrdinalSuffix(33)).toBe('33rd')
    expect(getOrdinalSuffix(103)).toBe('103rd')
  })

  it('should return "th" for numbers ending in 11, 12, 13', () => {
    expect(getOrdinalSuffix(11)).toBe('11th')
    expect(getOrdinalSuffix(12)).toBe('12th')
    expect(getOrdinalSuffix(13)).toBe('13th')
  })
})
