
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import type { Product } from '@/data/products'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const params = request.nextUrl.searchParams

    const category = params.get('category')
    const limitValue = Number(params.get('limit') || 10)
    const limit = Number.isFinite(limitValue)
      ? Math.min(Math.max(Math.floor(limitValue), 1), 100)
      : 10

    const filter: Record<string, unknown> = {}

    if (category) {
      filter.category = category
    }

    const documents = await db
      .collection('products')
      .find(filter)
      .sort({ updatedAt: -1, id: -1 })
      .limit(limit)
      .toArray()

    const products: Product[] = documents.map(
      ({ _id, ...product }) => product as Product,
    )

    return NextResponse.json(
      { success: true, products },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Failed to fetch products:', error)

    return NextResponse.json(
      { success: false, message: 'Unable to fetch products.' },
      { status: 500 },
    )
  }
}
