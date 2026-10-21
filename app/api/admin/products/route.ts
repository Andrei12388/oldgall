import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ADMIN_PASSCODE, ADMIN_USERNAME, isAuthorizedAdmin } from '@/lib/admin-auth'
import type { Product } from '@/data/products'

function normalizeProduct(payload: Partial<Product> & Record<string, unknown>) {
  const productId = Number(payload.id ?? 0)
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const category = typeof payload.category === 'string' ? payload.category.trim() : ''
  const condition = typeof payload.condition === 'string' ? payload.condition : 'Good'
  const color = typeof payload.color === 'string' ? payload.color.trim() : ''
  const size = typeof payload.size === 'string' ? payload.size.trim() : ''
  const image = typeof payload.image === 'string' ? payload.image.trim() : '/images/product1/image (1).jpg'
  const images = Array.isArray(payload.images)
    ? payload.images.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : [image]
  const price = Number(payload.price ?? 0)
  const originalPrice = Number(payload.originalPrice ?? price)
  const soldOut = Boolean(payload.soldOut)
  const rating = Number(payload.rating ?? 4.8)
  const description = typeof payload.description === 'string' ? payload.description.trim() : ''
  const details = Array.isArray(payload.details)
    ? payload.details.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : []
  const paymentMethods = Array.isArray(payload.paymentMethods)
    ? payload.paymentMethods.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : []
  const orderDetails = Array.isArray(payload.orderDetails)
    ? payload.orderDetails.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : []

  if (!name || !category || !color || !size || !description) {
    throw new Error('Name, category, color, size, and description are required.')
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Price must be a positive number.')
  }

  return {
    id: Number.isFinite(productId) && productId > 0 ? productId : 0,
    name,
    price,
    originalPrice,
    condition: (condition as Product['condition']) || 'Good',
    color,
    rating,
    size,
    category,
    soldOut,
    image,
    images: images.length ? images : [image],
    description,
    details,
    paymentMethods,
    orderDetails,
  } satisfies Product
}

async function getProductCollection() {
  const db = await getDatabase()
  return db.collection('products')
}

function rejectUnauthorized() {
  return NextResponse.json(
    {
      success: false,
      message: 'Unauthorized. Use the hardcoded admin credentials.',
    },
    { status: 401 },
  )
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return rejectUnauthorized()
  }

  try {
    const collection = await getProductCollection()
    const products = await collection
      .find({})
      .sort({ id: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      products: products.map(({ _id, ...product }) => product as Product),
    })
  } catch (error) {
    console.error('Failed to fetch admin products:', error)

    return NextResponse.json(
      { success: false, message: 'Unable to fetch products.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return rejectUnauthorized()
  }

  try {
    const payload = (await request.json()) as Partial<Product> & Record<string, unknown>
    const collection = await getProductCollection()
    const product = normalizeProduct(payload)

    if (!product.id || product.id <= 0) {
      const lastProduct = await collection.find({}).sort({ id: -1 }).limit(1).next()
      product.id = (lastProduct?.id ?? 0) + 1
    }

    await collection.updateOne(
      { id: product.id },
      {
        $set: {
          ...product,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json(
      { success: true, message: 'Product added successfully.', product },
      { status: 201 },
    )
  } catch (error) {
    console.error('Failed to add product:', error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to add product.',
      },
      { status: 400 },
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return rejectUnauthorized()
  }

  try {
    const payload = (await request.json()) as Partial<Product> & Record<string, unknown>
    const productId = Number(payload.id)

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: 'A valid product id is required.' },
        { status: 400 },
      )
    }

    const collection = await getProductCollection()
    const product = normalizeProduct({ ...payload, id: productId })

    const result = await collection.updateOne(
      { id: productId },
      {
        $set: {
          ...product,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    })
  } catch (error) {
    console.error('Failed to update product:', error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to update product.',
      },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return rejectUnauthorized()
  }

  try {
    const queryId = request.nextUrl.searchParams.get('id')
    const payload = (await request.json().catch(() => ({}))) as Partial<Product> & Record<string, unknown>
    const productId = Number(queryId ?? payload.id)

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: 'A valid product id is required.' },
        { status: 400 },
      )
    }

    const collection = await getProductCollection()
    const result = await collection.deleteOne({ id: productId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Product ${productId} deleted successfully.`,
    })
  } catch (error) {
    console.error('Failed to delete product:', error)

    return NextResponse.json(
      { success: false, message: 'Unable to delete product.' },
      { status: 500 },
    )
  }
}

export const GET_ADMIN_CREDENTIALS = {
  username: ADMIN_USERNAME,
  passcode: ADMIN_PASSCODE,
}
