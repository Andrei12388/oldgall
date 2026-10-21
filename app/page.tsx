'use client'

import { Logo, LogoIcon } from '@/components/logo'
import { products, type Product } from '@/data/products'
import { ArrowLeft, ArrowRight, Search, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useRef, useState, type SVGProps } from 'react'

const formatPrice = (price: number) =>
  `₱${price.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V7.2c0-.9.3-1.6 1.7-1.6H17V2.5c-.3 0-1.3-.2-2.4-.2-2.4 0-4 1.5-4 4.3v2.2H8v3.2h2.6v8h2.9Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
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
const collectionAccentMap: Record<string, string> = {
  Accessories: 'from-amber-200 via-orange-100 to-white',
  Bottoms: 'from-rose-200 via-pink-100 to-white',
  Athleisure: 'from-zinc-200 via-stone-100 to-white',
  Outerwear: 'from-emerald-200 via-teal-100 to-white',
}

const collectionGroups = Object.entries(
  products.reduce<Record<string, Product[]>>((groups, product) => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }

    groups[product.category].push(product)
    return groups
  }, {}),
).map(([category, categoryProducts]) => ({
  title: category,
  count: `${categoryProducts.filter((product) => !product.soldOut).length} piece${
    categoryProducts.filter((product) => !product.soldOut).length === 1 ? '' : 's'
  }`,
  image: categoryProducts[0]?.image ?? '/images/product1/image (1).jpg',
  accent: collectionAccentMap[category] ?? 'from-zinc-200 via-stone-100 to-white',
}))

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

        {product.soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
            Sold Out
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {product.category}
          </p>
         {/*  <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-zinc-700">{product.rating}</span>
          </div>
          */}
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
  const searchInputRef = useRef<HTMLInputElement | null>(null)

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

  const searchResults = search.trim() ? filteredProducts.slice(0, 5) : products.slice(0, 5)

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
      
<header className="sticky top-0 z-50 border-b border-[#e8ddd0] bg-[#f7f2ec]/95 shadow-sm backdrop-blur-md">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-4 lg:flex-nowrap">

      {/* Logo and store name */}
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
          <Logo className="h-10 w-10" />
        </div>

        <p className="text-base font-black tracking-tight sm:text-lg">
          OLDIES GALLERY
        </p>
      </Link>

      {/* Navigation */}
      <nav className="order-3 flex w-full items-center justify-center gap-6 text-xs font-medium text-zinc-700 sm:gap-8 sm:text-sm lg:order-none lg:w-auto lg:flex-1">
        <a href="#" className="transition hover:text-black">
          Home
        </a>
        <a href="#new-arrivals" className="transition hover:text-black">
          New Arrivals
        </a>
        <a href="#collections" className="transition hover:text-black">
          Collections
        </a>
      </nav>

      {/* Always-visible, wider search bar */}
      <div className="relative order-2 w-full sm:w-[360px] lg:order-none lg:w-[400px] lg:shrink-0 xl:w-[440px]">
        <div className="flex h-11 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 shadow-sm transition focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-200">
          <Search className="h-5 w-5 shrink-0 text-zinc-500" />

          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, colors, sizes..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                searchInputRef.current?.focus()
              }}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search suggestions */}
        {search.trim() && (
          <div className="absolute inset-x-0 top-full z-[60] mt-2 max-h-[min(360px,60vh)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">

            {filteredProducts.length === 0 ? (
              <div className="px-3 py-5 text-sm text-zinc-500">
                No matches for "{search.trim()}". Try another color, size, or category.
              </div>
            ) : (
              filteredProducts.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-zinc-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {product.category}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-zinc-900">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  </div>
</header>

      <main>
        <section className="bg-[#f6f1ea] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className='w-full h-5 flex text-center content-center justify-center align-center mb-2'>
              <div className='w-310 h-5 bg-gray-700 text-center content-center justify-center align-center text-xs font-semibold text-white'>
               FREE SHIPPING ON ALL ORDERS!
             </div>
          </div>
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
                    Shop Now
                  </a>
                  
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


        <section
  id="new-arrivals"
  className="scroll-mt-28 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
>
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

        <section
  id="collections"
  className="scroll-mt-28 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
>
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
              <Link
                key={collection.title}
                href={`/collections/${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative block overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_16px_32px_rgba(15,23,42,0.05)]"
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
                </div>
              </Link>
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
      <p className="text-xl font-black tracking-tight text-zinc-900">
        OLDIES GALLERY
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Turning old garments into one's new OOTD.
      </p>
    </div>

    <div className="flex flex-row items-start gap-10 lg:items-end">
     

      {/* Contact Information */}
      <div className="flex flex-col gap-2 text-sm text-zinc-600">
        <a
          href="mailto:oldies.gallery@gmail.com"
          className="flex items-center gap-2 transition hover:text-zinc-900"
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span>oldies.gallery@gmail.com</span>
        </a>

        <a
          href="tel:+639384268015"
          className="flex items-center gap-2 transition hover:text-zinc-900"
        >
          <Phone className="h-4 w-4 shrink-0" />
          <span>09384268015</span>
        </a>
      </div>
       {/* Social Media Icons */}
      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/oldies.gallery"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:-translate-y-0.5 hover:text-[#E1306C]"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>

        <a
          href="https://www.facebook.com/Oldies.gallery"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:-translate-y-0.5 hover:text-[#1877F2]"
        >
          <FacebookIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  </div>
</footer>

      </main>
    </div>
  )
}
