
'use client'

import { useState } from 'react'

type Product = {
  id: number | string
  name: string
  image: string
  images: string[]
  category: string
  condition: string
  color: string
  size: string
  price: number
  originalPrice?: number
  description: string
  details: string[]
}

export default function ProductPurchaseDetails({
  product,
}: {
  product: Product
}) {
  const images = product.images?.length
    ? product.images
    : [product.image]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const originalPrice = product.originalPrice

  const formatPrice = (price: number) =>
    `₱${price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const orderMessage = [
    'ORDER DETAILS',
    `Product: ${product.name}`,
    `Price: ${formatPrice(product.price)}`,
    ...(originalPrice && originalPrice > product.price
      ? [`Original Price: ${formatPrice(originalPrice)}`]
      : []),
    `Category: ${product.category}`,
    `Size: ${product.size}`,
    `Color: ${product.color}`,
    `Condition: ${product.condition}`,
    `Product ID: ${product.id}`,
    '',
    'Please assist me with placing this order.',
  ].join('\n')

  async function copyOrderDetails() {
    try {
      await navigator.clipboard.writeText(orderMessage)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers where the Clipboard API is unavailable.
      const textarea = document.createElement('textarea')
      textarea.value = orderMessage
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()

      const successful = document.execCommand('copy')
      textarea.remove()

      if (successful) {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  function changeImage(direction: number) {
    setSelectedIndex(
      (current) => (current + direction + images.length) % images.length,
    )
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
      {/* B. Interactive product gallery */}
      <div className="grid min-w-0 grid-cols-[58px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4">
        <div className="flex max-h-[650px] flex-col gap-3 overflow-y-auto pr-1">
          {images.map((image, index) => (
            <button
              key={`${product.id}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`shrink-0 overflow-hidden rounded-xl border-2 bg-zinc-50 transition ${
                selectedIndex === index
                  ? 'border-zinc-900'
                  : 'border-transparent hover:border-zinc-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="h-[76px] w-full object-cover sm:h-24"
              />
            </button>
          ))}
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-2xl bg-[#f5f5f2]">
          <img
            key={images[selectedIndex]}
            src={images[selectedIndex]}
            alt={product.name}
            className="aspect-[4/5] max-h-[760px] w-full object-contain sm:object-cover"
          />

          {/* Previous / next controls */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous product image"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow transition hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next product image"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow transition hover:bg-white"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* C, D, E. Product information and order actions */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {product.category}
        </p>

        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {product.condition}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            Size: {product.size}
          </span>
        </div>

        {/* Current and crossed-out original prices */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-zinc-950">
            {formatPrice(product.price)}
          </p>

          {/*
            The original price is optional.
            It appears only when originalPrice is greater than price.
          */}
          {originalPrice !== undefined &&
            originalPrice > product.price && (
              <p className="text-base text-zinc-400 line-through">
                {formatPrice(originalPrice)}
              </p>
            )}
        </div>

        <p className="mt-5 text-sm leading-6 text-zinc-600">
          {product.description}
        </p>

        {/* D. Copy order details */}
        <div className="mt-6">
          <button
            type="button"
            onClick={copyOrderDetails}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {copied ? (
              <>
                <span aria-hidden="true">✓</span>
                Order Details Copied!
              </>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </svg>
                Copy Order Details
              </>
            )}
          </button>

          <p className="mt-2 text-center text-xs leading-5 text-zinc-500">
            Copy the details and paste them into our Facebook page chat
            to place your order.
          </p>
        </div>

        {/* E. Product specifications */}
        <div className="mt-7 border-t border-zinc-200 pt-4">
          <dl className="space-y-3 text-sm">
            <div className="flex gap-2">
              <dt className="font-semibold text-zinc-900">Tag Size:</dt>
              <dd className="text-zinc-600">{product.size}</dd>
            </div>

            <div className="flex gap-2">
              <dt className="font-semibold text-zinc-900">Color:</dt>
              <dd className="text-zinc-600">{product.color}</dd>
            </div>

            <div className="flex gap-2">
              <dt className="font-semibold text-zinc-900">Condition:</dt>
              <dd className="text-zinc-600">{product.condition}</dd>
            </div>

            <div className="flex gap-2">
              <dt className="font-semibold text-zinc-900">Product ID:</dt>
              <dd className="text-zinc-600">{product.id}</dd>
            </div>
          </dl>

          {product.details.length > 0 && (
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              {product.details.map((detail) => (
                <p key={detail}>• {detail}</p>
              ))}
            </div>
          )}
        </div>

        {/* How to order panel */}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-900">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4"
            >
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 5V3m8 2V3M8 10h8" />
            </svg>
            How to order
          </h2>

          <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
            <li className="flex gap-3">
              <span className="font-semibold">1.</span>
              <span>Click “Copy Order Details” above.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">2.</span>
              <span>
                Open our Facebook page and paste the details into chat.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">3.</span>
              <span>Our team will assist you with checkout.</span>
            </li>
          </ol>

          <div className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-700">
            <span className="font-semibold">Shipping:</span>{' '}
            Add your actual shipping offer here, if applicable.
          </div>
        </div>
      </div>
    </div>
  )
}
