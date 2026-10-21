'use client'

import { Logo, LogoIcon } from '@/components/logo'
import { products, type Product } from '@/data/products'
import { ArrowLeft, ArrowRight, Search, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useRef, useState, type SVGProps } from 'react'

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V7.2c0-.9.3-1.6 1.7-1.6H17V2.5c-.3 0-1.3-.2-2.4-.2-2.4 0-4 1.5-4 4.3v2.2H8v3.2h2.6v8h2.9Z" />
    </svg>
  )
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.8 3c.3 1.5 1.4 2.8 3 3.3v2.7c-1.3-.1-2.5-.6-3.5-1.5v7.2a5.3 5.3 0 1 1-5.3-5.3c.2 0 .4 0 .6.1v2.8a2.7 2.7 0 1 0 1.8 2.6V3h3.4Z" />
    </svg>
  )
}


const collectionGroups = [
  {
    title: 'Pants',
    subtitle: 'Relaxed essentials',
    count: '18 pieces',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    accent: 'from-amber-200 via-orange-100 to-white',
  },
  {
    title: 'Dresses',
    subtitle: 'Fresh and polished',
    count: '12 pieces',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    accent: 'from-rose-200 via-pink-100 to-white',
  },
  {
    title: 'Hoodies',
    subtitle: 'Cozy everyday picks',
    count: '21 pieces',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    accent: 'from-zinc-200 via-stone-100 to-white',
  },
  {
    title: 'Jackets',
    subtitle: 'Layered statement looks',
    count: '14 pieces',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    accent: 'from-emerald-200 via-teal-100 to-white',
  },
]

function ProductCard({ product }: { product: Product }) {
  const imageCount = product.images.length
  const [currentIndex, setCurrentIndex] = useState(0)

  const showPreviousImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1))
  }

  const showNextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageCount)
  }

  const originalPrice = product.originalPrice

  const formatPrice = (price: number) =>
    `₱${price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    
<article
  className="group relative min-w-[280px] max-w-[280px] snap-start rounded-[26px] border border-zinc-200 bg-white p-3 shadow-[0_16px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.08)]"
>
  {/* Makes the entire card clickable */}
  <Link
    href={`/products/${product.id}`}
    aria-label={`View ${product.name}`}
    className="absolute inset-0 z-10 rounded-[26px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
  />

      <div className="relative overflow-hidden rounded-[22px] bg-zinc-100">
        <img
          src={product.images[currentIndex]}
          alt={`${product.name} photo ${currentIndex + 1}`}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {imageCount > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-2 z-20 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/55"
              aria-label={`Previous image for ${product.name}`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-2 z-20 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/55"
              aria-label={`Next image for ${product.name}`}
            >
              →
            </button>
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {product.images.map((_, index) => (
                <span
                  key={`${product.id}-${index}`}
                  className={`h-1.5 rounded-full ${index === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-800 backdrop-blur">
          {product.condition}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {product.category}
          </p>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-zinc-700">{product.rating}</span>
          </div>
        </div>

        <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-900">
  {product.name}
</h3>
        
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            Condition
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-700">
            {product.condition}
          </p>
        </div>

        {/* Current price and optional original price */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-lg font-bold leading-tight text-zinc-950 sm:text-xl">
            {formatPrice(product.price)}
          </p>

          {originalPrice !== undefined &&
            originalPrice > product.price && (
              <p className="text-sm text-zinc-400 line-through">
                {formatPrice(originalPrice)}
              </p>
            )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
          <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
            Color: {product.color}
          </span>
          <span className="rounded-full bg-[#f5efe7] px-2.5 py-1">
            Size: {product.size}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    if (!searchTerm) {
      return products
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.condition,
        product.color,
        product.size,
        product.category,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(searchTerm)
    })
  }, [search])

  const scrollSlider = (direction: 'prev' | 'next') => {
    const cardWidth = 320
    sliderRef.current?.scrollBy({
      left: direction === 'next' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    })
  }

  const seoProducts = filteredProducts.slice(0, 6)

  
const galleryVideos = [
  '/videos/gallery1.mp4',
  '/videos/gallery2.mp4',
  '/videos/gallery3.mp4',
  '/videos/gallery4.mp4',
]

const [currentVideo, setCurrentVideo] = useState(0)
const [isFading, setIsFading] = useState(false)
const [isTransitioning, setIsTransitioning] = useState(false)

const handleVideoEnded = () => {
  if (isTransitioning) return

  setIsTransitioning(true)
  setIsFading(true)

  // Fade to black, then switch to the next video
  setTimeout(() => {
    setCurrentVideo((prev) => (prev + 1) % galleryVideos.length)

    // Wait briefly before fading back in
    setTimeout(() => {
      setIsFading(false)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 100)
  }, 300)
}

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-zinc-900">
      <header className="bg-[#f7f2ec]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-[#e8ddd0] py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                <Logo className="h-50 w-50" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">Oldies Gallery</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Levi Selga
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
              <a href="#">Home</a>
              <a href="#new-arrivals">New Arrivals</a>
              <a href="#collections">Collections</a>
              <a href="#about">About</a>
            </nav>

            <div className="flex items-center gap-3">
              <button className="rounded-full border border-zinc-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5">
                <Search className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800">
                Shop now
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#f6f1ea] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#ebe1d4] shadow-[0_30px_80px_rgba(26,18,12,0.12)]">
            <div className="grid items-center gap-8 px-6 py-8 md:grid-cols-2 md:px-12 lg:px-16 lg:py-16">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-[#c7b29a] bg-[#f9f3ec] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-700">
                  New Collection
                </p>
                <h1 className="max-w-md text-4xl font-black leading-none tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                  Fresh finds for bold everyday style.
                </h1>
                <p className="mt-5 max-w-lg text-base text-zinc-700 sm:text-lg">
                  Discover premium secondhand fashion from the Philippines with trusted quality, curated filters, and unbeatable value.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#new-arrivals"
                    className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Shop here
                  </a>
                  <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Free shipping on all orders
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-6 h-28 w-28 rounded-full bg-[#f7d6a7] blur-3xl" />
                <div className="absolute -right-6 bottom-10 h-32 w-32 rounded-full bg-[#e7c7b3] blur-3xl" />
                <div className="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden rounded-[28px] shadow-2xl">
                  <video
  key={galleryVideos[currentVideo]}
  autoPlay
  muted
  playsInline
  onEnded={handleVideoEnded}
  className="h-full w-full object-cover"
>
  <source
    src={galleryVideos[currentVideo]}
    type="video/mp4"
  />
  Your browser does not support the video element.
</video>

{/* Fade-to-black overlay */}
<div
  className={`pointer-events-none absolute inset-0 z-10 bg-black transition-opacity duration-600 ease-in-out ${
    isFading ? 'opacity-100' : 'opacity-0'
  }`}
/>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent p-5">
                    <div>
                     <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/75">New Collection</p>
                      <p className="mt-1 text-xl font-bold text-white">Fresh drops, daily finds</p>
                    </div>
                   {/*   <a
                      href="#new-arrivals"
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                    >
                      Shop here
                    </a>
                    */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="new-arrivals" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Trending now</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">New Arrivals</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, color, size..."
                  aria-label="Search products"
                  className="w-52 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => scrollSlider('prev')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5"
                aria-label="Previous products"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('next')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5"
                aria-label="Next products"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
              No products match your search. Try a different color, size, or category.
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="scrollbar-none flex snap-x gap-5 overflow-x-auto pb-4"
              aria-live="polite"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section id="collections" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Shop by style</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">Collections</h2>
            </div>
            <a href="#new-arrivals" className="hidden text-sm font-semibold text-zinc-700 underline-offset-4 hover:underline sm:inline-block">
              View all items
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {collectionGroups.map((collection) => (
              <article
                key={collection.title}
                className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_16px_32px_rgba(15,23,42,0.05)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.accent}`} />
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-72 w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{collection.count}</p>
                  <h3 className="mt-2 text-2xl font-black">{collection.title}</h3>
                 {/*  <p className="mt-1 text-sm text-white/80">{collection.subtitle}</p> */}
                  
                </div>
              </article>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Ukay Salakay new arrivals',
              itemListElement: seoProducts.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product.name,
                  category: product.category,
                  color: product.color,
                  size: product.size,
                  itemCondition: `https://schema.org/${product.condition.replace(/\s+/g, '')}Condition`,
                  brand: {
                    '@type': 'Brand',
                    name: 'Ukay Salakay',
                  },
                  offers: {
                    '@type': 'Offer',
                    priceCurrency: 'PHP',
                    price: String(product.price),
                    availability: 'https://schema.org/InStock',
                  },
                },
              })),
            }),
          }}
        />

        <footer className="mt-12 border-t border-zinc-200 bg-[#f4ece4]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xl font-black tracking-tight text-zinc-900">Oldies Gallery</p>
              <p className="mt-1 text-sm text-zinc-600">Curated thrifted finds for everyday style.</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:-translate-y-0.5 hover:text-[#1877F2]"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:-translate-y-0.5 hover:text-black"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
