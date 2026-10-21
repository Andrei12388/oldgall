export type Product = {
  id: number
  name: string
  price: number
  originalPrice: number
  condition: 'Excellent' | 'Very Good' | 'Good'
  color: string
  rating: number
  size: string
  category: string
  soldOut: boolean
  image: string
  images: string[]
  description: string
  details: string[]
  paymentMethods: string[]
  orderDetails: string[]
}

const productImageMap: Record<number, string[]> = {
  1: [
    '/images/product1/image (1).jpg',
    '/images/product1/image (2).jpg',
    '/images/product1/image (3).jpg',
    '/images/product1/image (4).jpg',
  ],
  2: [
    '/images/product2/image (1).jpg',
    '/images/product2/image (2).jpg',
    '/images/product2/image (3).jpg',
  ],
  3: [
    '/images/product3/image (1).jpg',
    '/images/product3/image (2).jpg',
    '/images/product3/image (3).jpg',
  ],
  4: [
    '/images/product4/image (1).jpg',
    '/images/product4/image (2).jpg',
    '/images/product4/image (3).jpg',
  ],
  5: [
    '/images/product5/image (1).jpg',
    '/images/product5/image (2).jpg',
    '/images/product5/image (3).jpg',
  ],
}

export const slugifyCategory = (category: string) =>
  category
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const products: Product[] = [
  {
    id: 1,
    name: 'Nike Heritage Belt Bag “All Over Swoosh” in Black',
    price: 2500,
    originalPrice: 3000,
    condition: 'Excellent',
    color: 'Black',
    rating: 4.8,
    size: 'One Size',
    category: 'Accessories',
    soldOut: false,
    image: '/images/product1/image (1).jpg',
    images: productImageMap[1],
    description:
      'A statement accessory with a sleek all-over Swoosh detail, designed for everyday carrying and easy styling.',
    details: ['Premium pre-loved condition', 'Authentic Nike style', 'Lightweight and functional', 'Perfect for daily errands'],
    paymentMethods: ['GCash', 'Bank Transfer', 'Cash on Delivery'],
    orderDetails: ['Item is packed securely before dispatch', 'Order confirmation sent after payment', 'Shipping time depends on location', 'Please send proof of payment for verification'],
  },
  {
    id: 2,
    name: 'Nike Loose Fit Sweatpants in Black (Size 30-38)',
    price: 800,
    originalPrice: 1000,
    condition: 'Very Good',
    color: 'Black',
    rating: 4.7,
    size: '30-38',
    category: 'Bottoms',
    soldOut: false,
    image: '/images/product2/image (1).jpg',
    images: productImageMap[2],
    description:
      'Comfort-first lounge and streetwear staple made for relaxed fits, weekend wear, and easy layering.',
    details: ['Loose fit silhouette', 'Soft cotton-blend feel', 'Great for casual wear', 'Clean and ready to style'],
    paymentMethods: ['GCash', 'Bank Transfer', 'Cash on Delivery'],
    orderDetails: ['Available for order confirmation within 24 hours', 'Secure packaging included', 'Weighted shipping based on address', 'Please confirm your size before checkout'],
  },
  {
    id: 3,
    name: 'Nike Club Fleece Jogger Pants in Wine Red (Size 28-34)',
    price: 800,
    originalPrice: 1000,
    condition: 'Good',
    color: 'Wine Red',
    rating: 4.6,
    size: '28-34',
    category: 'Bottoms',
    soldOut: false,
    image: '/images/product3/image (1).jpg',
    images: productImageMap[3],
    description:
      'Warm, comfortable, and easy to style with neutral tops or layered streetwear pieces for a standout casual look.',
    details: ['Soft fleece material', 'Relaxed jogger cut', 'Color-rich wine red finish', 'Ready for daily wear'],
    paymentMethods: ['GCash', 'Bank Transfer', 'Cash on Delivery'],
    orderDetails: ['Please message us for stock confirmation', 'Item is photographed before packing', 'Returns are reviewed case by case', 'Proof of payment is required before shipping'],
  },
  {
    id: 4,
    name: 'Nike Lightweight Training Pants in Black (Size 28-36)',
    price: 800,
    originalPrice: 1000,
    condition: 'Excellent',
    color: 'Black',
    rating: 4.9,
    size: '28-36',
    category: 'Athleisure',
    soldOut: false,
    image: '/images/product4/image (1).jpg',
    images: productImageMap[4],
    description:
      'Lightweight training pants with a clean athletic profile that balances movement, fit, and everyday versatility.',
    details: ['Breathable fabric', 'Ideal for workouts or casual wear', 'Minimalist black finish', 'Comfortable stretch feel'],
    paymentMethods: ['GCash', 'Bank Transfer', 'Cash on Delivery'],
    orderDetails: ['Payment confirms order placement', 'Prepared and packed in protective wrapping', 'Tracking provided once shipped', 'For faster processing, send the exact product name in your message'],
  },
  {
    id: 5,
    name: 'Adidas Essentials Hoodie in Grey',
    price: 1200,
    originalPrice: 1500,
    condition: 'Very Good',
    color: 'Grey',
    rating: 4.8,
    size: 'M-XL',
    category: 'Outerwear',
    soldOut: false,
    image: '/images/product5/image (1).jpg',
    images: productImageMap[5],
    description:
      'A throw-on-and-go hoodie with a clean silhouette, good layering potential, and everyday comfort for cooler days.',
    details: ['Comfortable everyday hoodie', 'Soft neutral grey color', 'Relaxed fit for layering', 'Good condition with minimal wear'],
    paymentMethods: ['GCash', 'Bank Transfer', 'Cash on Delivery'],
    orderDetails: ['Order is reserved after payment confirmation', 'Item photos are sent upon request', 'Customer support is available for order updates', 'Strictly no cancellation after item is packed'],
  },
]

export const getProductById = (id: number) =>
  products.find((product) => product.id === id) ?? null
