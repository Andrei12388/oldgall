import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

//export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = await getDatabase()
    await db.command({ ping: 1 })

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas!',
      database: db.databaseName,
    })
  } catch (error) {
    console.error('MongoDB connection failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed.',
      },
      { status: 500 },
    )
  }
}