// src/app/api/news/route.ts
// Fetches top headlines from international sources and attaches real coordinates.

import { NextResponse } from 'next/server'
import type { NewsItem } from '@/types/news'

type NewsCategory = 'politics' | 'technology' | 'environment' | 'economy' | 'conflict' | 'science' | 'health'
type NewsImpact   = 'low' | 'medium' | 'high' | 'critical'

// Map source IDs → geographic coordinates
const SOURCE_COORDS: Record<string, { lat: number; lng: number; country: string; city: string }> = {
  // North America
  'the-washington-post':   { lat: 38.89,  lng: -77.04,  country: 'United States',  city: 'Washington D.C.' },
  'cnn':                   { lat: 33.75,  lng: -84.39,  country: 'United States',  city: 'Atlanta'         },
  'the-new-york-times':    { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'associated-press':      { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'abc-news':              { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'nbc-news':              { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'usa-today':             { lat: 38.89,  lng: -77.04,  country: 'United States',  city: 'Washington D.C.' },
  'cbs-news':              { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'fox-news':              { lat: 40.71,  lng: -74.01,  country: 'United States',  city: 'New York'        },
  'the-globe-and-mail':    { lat: 43.65,  lng: -79.38,  country: 'Canada',         city: 'Toronto'         },
  // Europe
  'bbc-news':              { lat: 51.50,  lng:  -0.12,  country: 'United Kingdom', city: 'London'          },
  'the-guardian-uk':       { lat: 51.50,  lng:  -0.12,  country: 'United Kingdom', city: 'London'          },
  'independent':           { lat: 51.50,  lng:  -0.12,  country: 'United Kingdom', city: 'London'          },
  'reuters':               { lat: 51.50,  lng:  -0.12,  country: 'United Kingdom', city: 'London'          },
  'le-monde':              { lat: 48.85,  lng:   2.35,  country: 'France',         city: 'Paris'           },
  'france-24':             { lat: 48.85,  lng:   2.35,  country: 'France',         city: 'Paris'           },
  'der-spiegel':           { lat: 53.55,  lng:  10.00,  country: 'Germany',        city: 'Hamburg'         },
  'el-mundo':              { lat: 40.42,  lng:  -3.70,  country: 'Spain',          city: 'Madrid'          },
  'ansa':                  { lat: 41.90,  lng:  12.49,  country: 'Italy',          city: 'Rome'            },
  // Middle East & Africa
  'al-jazeera-english':    { lat: 25.29,  lng:  51.53,  country: 'Qatar',          city: 'Doha'            },
  'haaretz':               { lat: 32.08,  lng:  34.78,  country: 'Israel',         city: 'Tel Aviv'        },
  // Asia & Pacific
  'google-news-in':        { lat: 28.61,  lng:  77.21,  country: 'India',          city: 'New Delhi'       },
  'the-times-of-india':    { lat: 19.08,  lng:  72.88,  country: 'India',          city: 'Mumbai'          },
  'australian-financial-review': { lat: -33.87, lng: 151.21, country: 'Australia', city: 'Sydney'          },
  // Latin America
  'infobae':               { lat: -34.60, lng: -58.38,  country: 'Argentina',      city: 'Buenos Aires'    },
}

// Fallback coords when source is unknown — spread around the globe
const FALLBACK_COORDS = [
  { lat: 35.69,  lng: 139.69, country: 'Japan',        city: 'Tokyo'      },
  { lat: -33.87, lng: 151.21, country: 'Australia',    city: 'Sydney'     },
  { lat: -15.79, lng: -47.88, country: 'Brazil',       city: 'Brasília'   },
  { lat: -25.74, lng:  28.19, country: 'South Africa', city: 'Pretoria'   },
  { lat: 55.75,  lng:  37.62, country: 'Russia',       city: 'Moscow'     },
  { lat: 39.91,  lng: 116.39, country: 'China',        city: 'Beijing'    },
  { lat: 37.57,  lng: 126.98, country: 'South Korea',  city: 'Seoul'      },
  { lat: -1.29,  lng:  36.82, country: 'Kenya',        city: 'Nairobi'    },
  { lat: 30.04,  lng:  31.24, country: 'Egypt',        city: 'Cairo'      },
  { lat: 19.43,  lng: -99.13, country: 'Mexico',       city: 'Mexico City'},
]

function classifyCategory(title: string, description: string): NewsCategory {
  const text = `${title} ${description ?? ''}`.toLowerCase()
  if (/war|attack|military|troops|missile|bomb|conflict|terror|shoot|kill|weapon/.test(text)) return 'conflict'
  if (/climate|environment|carbon|emission|forest|flood|drought|wildfire|ocean|pollution|green/.test(text)) return 'environment'
  if (/\bai\b|artificial intelligence|tech|software|cyber|robot|startup|app|digital|quantum/.test(text)) return 'technology'
  if (/health|covid|virus|disease|vaccine|hospital|medical|cancer|drug|pandemic|surgery/.test(text)) return 'health'
  if (/economy|market|stock|trade|inflation|gdp|recession|bank|finance|bitcoin|crypto|dollar/.test(text)) return 'economy'
  if (/science|nasa|space|physics|biology|chemistry|astronomy|discovery|research|study/.test(text)) return 'science'
  return 'politics'
}

function classifyImpact(title: string, description: string): NewsImpact {
  const text = `${title} ${description ?? ''}`.toLowerCase()
  if (/crisis|critical|emergency|disaster|catastrophe|war|death|collapse|explosion/.test(text)) return 'critical'
  if (/major|significant|serious|threat|concern|urgent|breaking/.test(text)) return 'high'
  if (/new|update|report|plan|deal|agreement|launch|announce/.test(text)) return 'medium'
  return 'low'
}

const jitter = () => (Math.random() - 0.5) * 5

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=${apiKey}`,
      { next: { revalidate: 300 } } as RequestInit
    )
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)
    const data = await res.json()

    let fallbackIndex = 0
    const items: NewsItem[] = []

    for (const [i, article] of (data.articles ?? []).entries()) {
      if (!article.title || article.title === '[Removed]') continue

      const sourceId = article.source?.id ?? ''
      let coords = SOURCE_COORDS[sourceId]

      // If source unknown, assign a fallback location from around the globe
      if (!coords) {
        coords = FALLBACK_COORDS[fallbackIndex % FALLBACK_COORDS.length]
        fallbackIndex++
      }

      items.push({
        id:          String(i + 1),
        title:       article.title,
        summary:     article.description ?? article.title,
        category:    classifyCategory(article.title, article.description ?? ''),
        impact:      classifyImpact(article.title, article.description ?? ''),
        source:      article.source?.name ?? 'Unknown',
        sourceUrl:   article.url,
        publishedAt: article.publishedAt,
        lat:         coords.lat + jitter(),
        lng:         coords.lng + jitter(),
        country:     coords.country,
        city:        coords.city,
        imageUrl:    article.urlToImage ?? undefined,
      })
    }

    return NextResponse.json(items)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
