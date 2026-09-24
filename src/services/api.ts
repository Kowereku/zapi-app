import { session } from '@/lib/session'

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

export type User = {
  id: number
  username: string
  email: string
  total_xp: number
  streak_days: number
  is_admin: boolean
  created_at: string
}

export type Token = {
  access_token: string
  token_type: string
}

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const buildApiRequestError = async (response: Response) => {
  const data = await response.json().catch(() => null)
  const detail = Array.isArray(data?.detail) ? data.detail[0]?.msg : data?.detail
  return new ApiRequestError(
    typeof detail === 'string' && detail
      ? detail
      : `API error: ${response.status} ${response.statusText}`,
    response.status,
  )
}

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = session.getToken()

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  // An expired or invalid token ends the session.
  if (response.status === 401 && token) session.clear()

  return response
}

export const login = async (body: {
  username_or_email: string
  password: string
}): Promise<Token> => {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const register = async (body: {
  username: string
  email: string
  password: string
}): Promise<User> => {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiFetch('/api/auth/me')
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}
