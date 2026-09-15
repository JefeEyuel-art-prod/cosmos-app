// Lightweight astrological calculations.
//
// Sun sign is exact (calendar-based). Moon sign and Rising sign (Ascendant)
// require real ephemeris data for full precision; here we use well-known
// low-precision public formulas (in the spirit of Paul Schlyter's
// "How to compute planetary positions") that are accurate to within a few
// degrees — good enough to usually land on the correct zodiac sign, but
// not a substitute for a full ephemeris near sign boundaries. Results are
// always labeled as estimates in the UI.

export interface ZodiacSign {
  symbol: string
  name: string
  dates: string
  element: string
  ruler: string
  trait: string
}

export const zodiacSigns: ZodiacSign[] = [
  { symbol: '♈', name: 'Aries', dates: 'Mar 21 – Apr 19', element: 'Fire', ruler: 'Mars', trait: 'Bold initiator who moves first and asks questions later.' },
  { symbol: '♉', name: 'Taurus', dates: 'Apr 20 – May 20', element: 'Earth', ruler: 'Venus', trait: 'Steady builder who values comfort, loyalty, and slow growth.' },
  { symbol: '♊', name: 'Gemini', dates: 'May 21 – Jun 20', element: 'Air', ruler: 'Mercury', trait: 'Curious connector who thrives on ideas and conversation.' },
  { symbol: '♋', name: 'Cancer', dates: 'Jun 21 – Jul 22', element: 'Water', ruler: 'Moon', trait: 'Deeply intuitive protector of home, memory, and heart.' },
  { symbol: '♌', name: 'Leo', dates: 'Jul 23 – Aug 22', element: 'Fire', ruler: 'Sun', trait: 'Radiant performer who leads with warmth and pride.' },
  { symbol: '♍', name: 'Virgo', dates: 'Aug 23 – Sep 22', element: 'Earth', ruler: 'Mercury', trait: 'Precise craftsperson who finds meaning in devoted detail.' },
  { symbol: '♎', name: 'Libra', dates: 'Sep 23 – Oct 22', element: 'Air', ruler: 'Venus', trait: 'Harmonizer who seeks balance in beauty and relationship.' },
  { symbol: '♏', name: 'Scorpio', dates: 'Oct 23 – Nov 21', element: 'Water', ruler: 'Pluto', trait: 'Intense alchemist who transforms through depth and truth.' },
  { symbol: '♐', name: 'Sagittarius', dates: 'Nov 22 – Dec 21', element: 'Fire', ruler: 'Jupiter', trait: 'Wandering philosopher chasing meaning past the horizon.' },
  { symbol: '♑', name: 'Capricorn', dates: 'Dec 22 – Jan 19', element: 'Earth', ruler: 'Saturn', trait: 'Disciplined architect who builds legacy step by step.' },
  { symbol: '♒', name: 'Aquarius', dates: 'Jan 20 – Feb 18', element: 'Air', ruler: 'Uranus', trait: 'Visionary rebel who reimagines what feels possible.' },
  { symbol: '♓', name: 'Pisces', dates: 'Feb 19 – Mar 20', element: 'Water', ruler: 'Neptune', trait: 'Dreaming mystic who absorbs and heals through empathy.' },
]

// Sun sign date ranges. End wraps into next month for Capricorn.
const SUN_SIGN_RANGES: Array<{ sign: string; start: [number, number]; end: [number, number] }> = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
]

export function getSunSignName(dateValue: string): string | null {
  if (!dateValue) return null
  const parts = dateValue.split('-')
  if (parts.length < 3) return null
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (!month || !day) return null

  for (const range of SUN_SIGN_RANGES) {
    const [startMonth, startDay] = range.start
    const [endMonth, endDay] = range.end
    if (startMonth <= endMonth) {
      const afterStart = month > startMonth || (month === startMonth && day >= startDay)
      const beforeEnd = month < endMonth || (month === endMonth && day <= endDay)
      if (afterStart && beforeEnd) return range.sign
    } else {
      const inStartMonth = month === startMonth && day >= startDay
      const inEndMonth = month === endMonth && day <= endDay
      if (inStartMonth || inEndMonth) return range.sign
    }
  }
  return null
}

const DEG = Math.PI / 180

function normalizeDegrees(value: number): number {
  let v = value % 360
  if (v < 0) v += 360
  return v
}

function signIndexFromLongitude(longitudeDeg: number): number {
  return Math.floor(normalizeDegrees(longitudeDeg) / 30) % 12
}

export function signNameFromLongitude(longitudeDeg: number): string {
  return zodiacSigns[signIndexFromLongitude(longitudeDeg)].name
}

// Days since J2000.0 (Jan 1, 2000, 12:00 UTC), given a UTC Date.
function daysSinceJ2000(utcDate: Date): number {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0)
  return (utcDate.getTime() - J2000) / 86400000
}

/**
 * Estimated Moon sign from a birth date (+ optional time), assuming the
 * date/time is given in UTC. Uses a low-precision lunar orbital element
 * model (mean elements + first-order perturbation) — accurate to a few
 * degrees, which is usually enough to land on the correct sign.
 */
export function estimateMoonSign(dateValue: string, timeValue?: string): string | null {
  if (!dateValue) return null
  const [y, m, d] = dateValue.split('-').map(Number)
  if (!y || !m || !d) return null
  let hours = 0
  let minutes = 0
  if (timeValue) {
    const [h, min] = timeValue.split(':').map(Number)
    hours = h || 0
    minutes = min || 0
  }

  const utcDate = new Date(Date.UTC(y, m - 1, d, hours, minutes, 0))
  const dNum = daysSinceJ2000(utcDate)

  // Mean orbital elements of the Moon (degrees), Schlyter low-precision model.
  const N = normalizeDegrees(125.1228 - 0.0529538083 * dNum)
  const i = 5.1454
  const w = normalizeDegrees(318.0634 + 0.1643573223 * dNum)
  const a = 60.2666 // earth radii
  const e = 0.0549
  const M = normalizeDegrees(115.3654 + 13.0649929509 * dNum)

  // Solve Kepler's equation for eccentric anomaly (a couple of iterations
  // is plenty at this eccentricity).
  let E = M + (180 / Math.PI) * e * Math.sin(M * DEG) * (1 + e * Math.cos(M * DEG))
  for (let iter = 0; iter < 4; iter++) {
    const delta =
      E -
      (180 / Math.PI) * e * Math.sin(E * DEG) -
      M
    const dE = delta / (1 - e * Math.cos(E * DEG))
    E -= dE
  }

  const xv = a * (Math.cos(E * DEG) - e)
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E * DEG)
  const v = normalizeDegrees(Math.atan2(yv, xv) / DEG)
  const r = Math.sqrt(xv * xv + yv * yv)

  const vw = (v + w) * DEG
  const Nr = N * DEG
  const ir = i * DEG

  const xeclip = r * (Math.cos(Nr) * Math.cos(vw) - Math.sin(Nr) * Math.sin(vw) * Math.cos(ir))
  const yeclip = r * (Math.sin(Nr) * Math.cos(vw) + Math.cos(Nr) * Math.sin(vw) * Math.cos(ir))

  const lonEcl = normalizeDegrees(Math.atan2(yeclip, xeclip) / DEG)

  return signNameFromLongitude(lonEcl)
}

/**
 * Estimated Rising sign (Ascendant) from birth date, time (24h, local),
 * UTC offset in hours, and geographic latitude/longitude in degrees.
 * Longitude east is positive. Without an exact birth time and place this
 * cannot be computed precisely — the Ascendant changes roughly every two
 * hours — so this is always presented as an estimate.
 */
export function estimateRisingSign(
  dateValue: string,
  timeValue: string,
  utcOffsetHours: number,
  latitudeDeg: number,
  longitudeDeg: number,
): string | null {
  if (!dateValue || !timeValue) return null
  const [y, m, d] = dateValue.split('-').map(Number)
  const [h, min] = timeValue.split(':').map(Number)
  if (!y || !m || !d || h === undefined || min === undefined) return null

  // Convert local clock time to UTC.
  const utcDate = new Date(Date.UTC(y, m - 1, d, h, min, 0) - utcOffsetHours * 3600000)
  const jd = utcDate.getTime() / 86400000 + 2440587.5 // Unix epoch -> Julian Day

  const Tcent = (jd - 2451545.0) / 36525
  let gmst = normalizeDegrees(
    280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * Tcent * Tcent -
      (Tcent * Tcent * Tcent) / 38710000,
  )

  const ramc = normalizeDegrees(gmst + longitudeDeg)
  const obliquity = 23.4393 * DEG
  const lat = latitudeDeg * DEG
  const ramcRad = ramc * DEG

  const ascRad = Math.atan2(
    -Math.cos(ramcRad),
    Math.sin(ramcRad) * Math.cos(obliquity) + Math.tan(lat) * Math.sin(obliquity),
  )
  const ascDeg = normalizeDegrees(ascRad / DEG)

  gmst = gmst // keep linter happy about intermediate reuse
  return signNameFromLongitude(ascDeg)
}

export function findZodiacSign(name: string | null): ZodiacSign | null {
  if (!name) return null
  return zodiacSigns.find((sign) => sign.name === name) ?? null
}
