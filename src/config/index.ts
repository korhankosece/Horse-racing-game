export const RACE_CONFIG = {
  interval: 500, // ms
  maxSpeed: 50, // pixels per interval
  trackLengths: {
    1200: 600, // meters -> pixels
    1400: 700,
    1600: 800,
    1800: 900,
    2000: 1000,
    2200: 1100,
  },
  trackWidth: 1100, // max track width in pixels
} as const

export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const

export const HORSES_PER_ROUND = 10
export const TOTAL_HORSES = 20

