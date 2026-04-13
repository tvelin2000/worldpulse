// src/app/api/news/route.ts
// This runs on the SERVER, not the browser — the API key stays secret.

import { NextResponse } from 'next/server'
import type { NewsItem } from '@/types/news'

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    // NewsAPI — top headlines from multiple countries
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${45953cfacc90446dadae433d72e8da23}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)

    const data = await res.json()

    // Map NewsAPI shape → your NewsItem shape
    // NewsAPI doesn't give lat/lng — we'll add geocoding in Step 4
    const items: Partial<NewsItem>[] = data.articles.map((article: {
      title: string
      description: string
      source: { name: string }
      url: string
      publishedAt: string
    }, i: number) => ({
      id: String(i + 1),
      title: article.title,
      summary: article.description ?? '',
      category: 'politics', // default — you'd classify this with AI or a lookup table
      impact: 'medium',
      source: article.source.name,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      // lat/lng added by geocoding (see Guide 4)
      lat: 0,
      lng: 0,
      country: '',
      city: '',
    }))

    return NextResponse.json(items)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
