
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

//export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const productId = Number(id)

    if (!Number.isSafeInteger(productId) || productId < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID.' },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const product = await db.collection('products').findOne(
      { id: productId },
      { projection: { _id: 0 } },
    )

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { success: true, product },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Failed to fetch product:', error)

    return NextResponse.json(
      { success: false, message: 'Unable to fetch product.' },
      { status: 500 },
    )
  }
}
