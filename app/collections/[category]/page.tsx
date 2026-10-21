import Link from 'next/link'
import { notFound } from 'next/navigation'
import { products, slugifyCategory } from '@/data/products'

export function generateStaticParams() {
  return Array.from(new Set(products.map((product) => slugifyCategory(product.category))))
    .filter(Boolean)
    .map((category) => ({ category }))
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const matchingCategory = products.find(
    (product) => slugifyCategory(product.category) === category,
  )?.category

  if (!matchingCategory) {
    notFound()
  }

  const categoryProducts = products.filter(
    (product) => product.category === matchingCategory,
  )
  const availableCount = categoryProducts.filter((product) => !product.soldOut).length

  const formatPrice = (price: number) =>
    `₱${price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-black"
        >
          <span aria-hidden="true">←</span>
          Back to shop
        </Link>

        <header className="mb-8 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Collection
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              {matchingCategory}
            </h1>
            <span className="inline-flex rounded-full border border-zinc-200 bg-[#f7f2ec] px-3 py-1 text-sm font-medium text-zinc-700">
              {availableCount} available item{availableCount === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        {categoryProducts.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
            No items are currently listed in this category.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_16px_32px_rgba(15,23,42,0.05)]"
              >
                <div className="relative">
                  <Link href={`/products/${product.id}`} className="block">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {product.soldOut && (
                    <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        {product.category}
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-zinc-900">
                        {product.name}
                      </h2>
                    </div>
                    {product.soldOut && (
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                        Unavailable
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
       
{/* Current price and optional original price */}
<div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
  <p className="text-lg font-bold leading-tight text-zinc-950 sm:text-xl">
    {formatPrice(product.price)}
  </p>

  {product.originalPrice !== undefined &&
    product.originalPrice !== null &&
    product.originalPrice > product.price && (
      <p className="text-sm text-zinc-400 line-through">
        {formatPrice(product.originalPrice)}
      </p>
    )}
</div>


                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      {product.soldOut ? 'View item' : 'View item'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
