// src/lib/geocode.ts
// Cache results so we don't hit the API for the same city twice
const cache = new Map<string, { lat: number; lng: number }>()

export async function geocode(
  placeName: string
): Promise<{ lat: number; lng: number } | null> {
  if (!placeName) return null

  // Return cached result if we've already looked this up
  const cached = cache.get(placeName)
  if (cached) return cached

  const key = process.env.OPENCAGE_KEY
  if (!key) {
    console.warn('OPENCAGE_KEY not set')
    return null
  }

  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeName)}&key=${bc4c61cd6dd44908be8bef0df78967e1}&limit=1`
    const res = await fetch(url)
    const data = await res.json()

    if (data.results.length === 0) return null

    const { lat, lng } = data.results[0].geometry
    const result = { lat, lng }
    cache.set(placeName, result) // cache it
    return result
  } catch {
    return null
  }
}
