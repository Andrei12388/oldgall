
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductPurchaseDetails from '@/components/ProductPurchaseDetails'
import { getDatabase } from '@/lib/mongodb'
import type { Product } from '@/data/products'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = await getDatabase()
  const product = (await db.collection('products').findOne({ id: Number(id) })) as Product | null

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-black"
        >
          <span aria-hidden="true">←</span>
          Back to shop
        </Link>

        {/* Product gallery, information, copy button, and ordering guide */}
        <ProductPurchaseDetails
          product={{
            id: product.id,
            name: product.name,
            image: product.image,
            images: product.images,
            category: product.category,
            soldOut: product.soldOut,
            condition: product.condition,
            color: product.color,
            size: product.size,
            price: product.price,
            originalPrice: (
              product as typeof product & { originalPrice?: number }
            ).originalPrice,
            description: product.description,
            details: product.details,
          }}
        />

        {/* Existing order details and payment information */}
        <section className="mt-10 grid gap-6 border-t border-zinc-200 pt-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Order details
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
              {product.orderDetails.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Payment method
            </h2>

            <div className="mt-4 space-y-3">
              {product.paymentMethods.map((method) => (
                <div
                  key={method}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  {method}
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
              For payment confirmation, send your proof of payment after
              placing the order. We will verify it and then package your
              item for shipping.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
