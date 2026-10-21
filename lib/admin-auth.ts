import type { NextRequest } from 'next/server'

export const ADMIN_USERNAME = 'leviselga'
export const ADMIN_PASSCODE = '123888'

export function buildBasicAuthHeader(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

export function getBasicCredentials(request: NextRequest) {
  const header = request.headers.get('authorization') ?? ''

  if (!header.startsWith('Basic ')) {
    return null
  }

  const encoded = header.slice('Basic '.length).trim()

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    const separator = decoded.indexOf(':')

    if (separator === -1) {
      return null
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    }
  } catch {
    return null
  }
}

export function isAuthorizedAdmin(request: NextRequest) {
  const credentials = getBasicCredentials(request)

  if (!credentials) {
    return false
  }

  return (
    credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSCODE
  )
}
