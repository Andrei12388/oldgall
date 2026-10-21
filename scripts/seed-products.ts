
import { config } from 'dotenv'
config({ path: '.env' })

import { MongoClient } from 'mongodb'
import { products } from '../data/products'

async function main() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'oldies_gallery'

  if (!uri) {
    throw new Error('Missing MONGODB_URI in .env')
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()

    const db = client.db(dbName)
    const collection = db.collection('products')

    await collection.createIndex({ id: 1 }, { unique: true })

    for (const product of products) {
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
    }

    console.log(`Imported ${products.length} products into ${dbName}.products`)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Product import failed:', error)
  process.exitCode = 1
})
