// src/app/api/news/route.ts
// Fetches top headlines from multiple countries and attaches real coordinates.

import { NextResponse } from 'next/server'
import type { NewsItem } from '@/types/news'

type NewsCategory = 'politics' | 'technology' | 'environment' | 'economy' | 'conflict' | 'science' | 'health'
type NewsImpact   = 'low' | 'medium' | 'high' | 'critical'

const COUNTRIES = [
  { code: 'us', lat: 38.89,  lng: -77.04,  country: 'United States',  city: 'Washington D.C.' },
  { code: 'gb', lat: 51.51,  lng:  -0.13,  country: 'United Kingdom', city: 'London'           },
  { code: 'fr', lat: 48.85,  lng:   2.35,  country: 'France',         city: 'Paris'            },
  { code: 'de', lat: 52.52,  lng:  13.40,  country: 'Germany',        city: 'Berlin'           },
  { code: 'jp', lat: 35.69,  lng: 139.69,  country: 'Japan',          city: 'Tokyo'            },
  { code: 'au', lat: -33.87, lng: 151.21,  country: 'Australia',      city: 'Sydney'           },
  { code: 'in', lat: 28.61,  lng:  77.21,  country: 'India',          city: 'New Delhi'        },
  { code: 'br', lat: -15.79, lng: -47.88,  country: 'Brazil',         city: 'Brasília'         },
  { code: 'ca', lat: 45.42,  lng: -75.69,  country: 'Canada',         city: 'Ottawa'           },
  { code: 'za', lat: -25.74, lng:  28.19,  country: 'South Africa',   city: 'Pretoria'         },
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

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    // Fetch top headlines from each country in parallel
    const results = await Promise.allSettled(
      COUNTRIES.map(({ code }) =>
        fetch(
          `https://newsapi.org/v2/top-headlines?country=${code}&pageSize=3&apiKey=${apiKey}`,
          { next: { revalidate: 300 } } as RequestInit
        ).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      )
    )

    let id = 1
    const items: NewsItem[] = []

    results.forEach((result, index) => {
      if (result.status !== 'fulfilled') return
      const { country, city, lat, lng } = COUNTRIES[index]

      for (const article of (result.value.articles ?? [])) {
        if (!article.title || article.title === '[Removed]') continue

        items.push({
          id:          String(id++),
          title:       article.title,
          summary:     article.description ?? article.title,
          category:    classifyCategory(article.title, article.description ?? ''),
          impact:      classifyImpact(article.title, article.description ?? ''),
          source:      article.source?.name ?? 'Unknown',
          sourceUrl:   article.url,
          publishedAt: article.publishedAt,
          lat,
          lng,
          country,
          city,
          imageUrl:    article.urlToImage ?? undefined,
        })
      }
    })

    return NextResponse.json(items)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
