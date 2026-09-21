import { session } from '@/lib/session'

const API_URL = import.meta.env.VITE_API_URL

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
    detail || `API error: ${response.status} ${response.statusText}`,
    response.status,
  )
}

const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  const token = session.getToken()

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
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
