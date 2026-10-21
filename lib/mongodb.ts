
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) {
  throw new Error('Missing MONGODB_URI. Add it in Vercel Project Settings > Environment Variables and redeploy.')
}

if (!dbName) {
  throw new Error('Missing MONGODB_DB. Add it in Vercel Project Settings > Environment Variables and redeploy.')
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }

  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase() {
  const connectedClient = await clientPromise
  return connectedClient.db(dbName)
}
