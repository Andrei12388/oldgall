'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/data/products'

const ADMIN_USERNAME = 'leviselga'
const ADMIN_PASSCODE = '123888'

const initialDraft: Product = {
  id: 0,
  name: '',
  price: 0,
  originalPrice: 0,
  condition: 'Good',
  color: '',
  rating: 4.8,
  size: '',
  category: '',
  soldOut: false,
  image: '',
  images: [],
  description: '',
  details: [],
  paymentMethods: [],
  orderDetails: [],
}

function buildAuthHeader(username: string, password: string) {
  return `Basic ${btoa(`${username}:${password}`)}`
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [username, setUsername] = useState('')
  const [passcode, setPasscode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [draft, setDraft] = useState<Product>(initialDraft)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const authHeader = useMemo(
    () => buildAuthHeader(username || ADMIN_USERNAME, passcode || ADMIN_PASSCODE),
    [username, passcode],
  )

  async function fetchProducts() {
    try {
      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: authHeader,
        },
      })

      if (!response.ok) {
        throw new Error('Unable to load products.')
      }

      const data = (await response.json()) as { products?: Product[] }
      setProducts(data.products ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load products.')
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (username.trim() !== ADMIN_USERNAME || passcode.trim() !== ADMIN_PASSCODE) {
      setError('Incorrect credentials.')
      return
    }

    setError('')
    setIsAuthenticated(true)
    await fetchProducts()
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    void fetchProducts()
  }, [isAuthenticated, authHeader])

  function updateDraft<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function resetDraft() {
    setDraft(initialDraft)
    setEditingId(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...draft,
        id: editingId ?? (draft.id || Math.max(0, ...products.map((product) => product.id)) + 1),
        price: Number(draft.price),
        originalPrice: Number(draft.originalPrice || draft.price),
        rating: Number(draft.rating || 4.8),
        images: draft.images.length ? draft.images : draft.image ? [draft.image] : [],
        details: draft.details.length ? draft.details : [],
        paymentMethods: draft.paymentMethods.length ? draft.paymentMethods : [],
        orderDetails: draft.orderDetails.length ? draft.orderDetails : [],
      }

      const response = await fetch('/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save product.')
      }

      resetDraft()
      await fetchProducts()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(productId: number) {
    setError('')

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      })

      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete product.')
      }

      await fetchProducts()
      if (editingId === productId) {
        resetDraft()
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete product.')
    }
  }

  const currentImageList = useMemo(
    () =>
      (draft.images.length ? draft.images : draft.image ? [draft.image] : []).filter(
        (image): image is string => Boolean(image),
      ),
    [draft.image, draft.images],
  )

  function handleEdit(product: Product) {
    setDraft({
      ...product,
      image: product.image || product.images?.[0] || '',
      images: product.images?.length ? product.images : product.image ? [product.image] : [],
    })
    setEditingId(product.id)
    setError('')
  }

  const filteredProducts = useMemo(() => {
  const query = searchQuery.trim().toLowerCase()

  if (!query) return products

  return products.filter((product) => {
    const searchableFields = [
      product.id,
      product.name,
      product.category,
      product.condition,
      product.color,
      product.size,
      product.description,
      product.price,
      product.originalPrice,
      product.soldOut ? 'sold out' : 'available',
    ]

    return searchableFields.some((field) =>
      String(field ?? '').toLowerCase().includes(query),
    )
  })
}, [products, searchQuery])

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] p-6">
        <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin access</p>
          <h1 className="mt-3 text-3xl font-black text-zinc-900">Product Manager</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 outline-none ring-0 transition focus:border-zinc-400"
                placeholder="username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 outline-none ring-0 transition focus:border-zinc-400"
                placeholder="password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Log in
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin panel</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Manage Products</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(false)
              setError('')
              setUsername('')
              setPasscode('')
            }}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_2fr]">
          <section className="rounded-[26px] border border-zinc-200 bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.05)]">
            <h2 className="text-xl font-bold">{editingId ? 'Edit product' : 'Add product'}</h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                
<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 sm:col-span-2">
  <input
    type="checkbox"
    checked={draft.soldOut}
    onChange={(event) => updateDraft('soldOut', event.target.checked)}
    className="h-5 w-5 rounded border-zinc-300 accent-red-600"
  />

  <span className="flex-1">
    <span className="block font-semibold text-zinc-900">Sold Out</span>
    <span className="mt-1 block text-xs font-normal text-zinc-500">
      Mark this product as unavailable for purchase.
    </span>
  </span>

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      draft.soldOut
        ? 'bg-red-100 text-red-700'
        : 'bg-green-100 text-green-700'
    }`}
  >
    {draft.soldOut ? 'Sold Out' : 'Available'}
  </span>
</label>

                <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                  Product name
                  <input
                    value={draft.name}
                    onChange={(event) => updateDraft('name', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Category
                  <input
                    value={draft.category}
                    onChange={(event) => updateDraft('category', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Condition
                  <select
                    value={draft.condition}
                    onChange={(event) => updateDraft('condition', event.target.value as Product['condition'])}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Color
                  <input
                    value={draft.color}
                    onChange={(event) => updateDraft('color', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Size
                  <input
                    value={draft.size}
                    onChange={(event) => updateDraft('size', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Price
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(event) => updateDraft('price', Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Original price
                  <input
                    type="number"
                    value={draft.originalPrice}
                    onChange={(event) => updateDraft('originalPrice', Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                  Main image URL
                  <input
                    value={draft.image}
                    onChange={(event) => {
                      updateDraft('image', event.target.value)
                      if (!draft.images.length) {
                        updateDraft('images', event.target.value ? [event.target.value] : [])
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                  Gallery image URLs (comma separated)
                  <input
                    value={draft.images.join(', ')}
                    onChange={(event) => {
                      const nextImages = event.target.value
                        .split(',')
                        .map((value) => value.trim())
                        .filter(Boolean)

                      updateDraft('images', nextImages)
                      if (nextImages[0]) {
                        updateDraft('image', nextImages[0])
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>

                {currentImageList.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-medium text-zinc-700">Preview</p>
                    <div className="flex flex-wrap gap-3">
                      {currentImageList.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => updateDraft('image', image)}
                          className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-1 transition hover:border-zinc-400"
                        >
                          <img
                            src={image}
                            alt={`${draft.name || 'Product'} preview ${index + 1}`}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                  Description
                  <textarea
                    value={draft.description}
                    onChange={(event) => updateDraft('description', event.target.value)}
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                  />
                </label>
                
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
                </button>

                <button
                  type="button"
                  onClick={resetDraft}
                  className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[26px] border border-zinc-200 bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.05)]">
           
<div className="mb-5">
  <div className="flex items-center justify-between gap-3">
    <h2 className="text-xl font-bold">Current products</h2>
    <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
      {filteredProducts.length} of {products.length} items
    </span>
  </div>

  <div className="relative mt-4">
    <svg
      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>

    <input
      type="search"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder="Search by name, category, color, size, ID..."
      aria-label="Search products"
      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-12 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-100"
    />

    {searchQuery && (
      <button
        type="button"
        onClick={() => setSearchQuery('')}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>

  {searchQuery && (
    <p className="mt-2 text-xs text-zinc-500">
      {filteredProducts.length === 0
        ? `No products found for "${searchQuery}".`
        : `Showing ${filteredProducts.length} matching product${filteredProducts.length === 1 ? '' : 's'}.`}
    </p>
  )}
</div>

<div className="space-y-4">
  {products.length === 0 ? (
    <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
      No products available yet.
    </p>
  ) : filteredProducts.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
      <p className="font-semibold text-zinc-700">No matching products</p>
      <p className="mt-1 text-sm text-zinc-500">
        Try another name, category, color, or product ID.
      </p>
      <button
        type="button"
        onClick={() => setSearchQuery('')}
        className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
      >
        Clear search
      </button>
    </div>
  ) : (
    filteredProducts.map((product) => (
      <article
        key={product.id}
        className="rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-300"
      >
        <div className="flex items-start gap-3">
          <img
            src={product.image || product.images?.[0] || '/images/product1/image (1).jpg'}
            alt={product.name}
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-zinc-900">
                  {product.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {product.category} • {product.condition}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(product.id)}
                  className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
              <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
                ₱{product.price.toLocaleString()}
              </span>
              <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
                Color: {product.color}
              </span>
              <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
                Size: {product.size}
              </span>
              <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
                ID: {product.id}
              </span>
              {product.soldOut && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-600">
                  Sold out
                </span>
              )}
            </div>
          </div>
        </div>

        {product.images?.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {product.images.slice(0, 4).map((image, index) => (
              <img
                key={`${product.id}-thumb-${index}`}
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {product.updatedAt && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            Updated: {new Date(product.updatedAt).toLocaleDateString()}
          </p>
        )}
      </article>
    ))
  )}
</div>

          </section>
        </div>
      </div>
    </main>
  )
}
