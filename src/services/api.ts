import { session } from '@/lib/session'
import i18n from '@/locale'

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

export type CourseListItem = {
  id: number
  name: string
  description: string | null
  icon_url: string | null
  modules_count: number
  lessons_count: number
}

export type Lesson = {
  id: number
  module_id: number
  title: string
  xp_reward: number
  is_quiz: boolean
}

export type Module = {
  id: number
  course_id: number
  title: string
  order_index: number
  lessons: Lesson[]
}

export type CourseDetail = {
  id: number
  name: string
  description: string | null
  icon_url: string | null
  language: string
  modules: Module[]
}

export type Exercise = {
  id: number
  lesson_id: number
  type:
    | 'multiple_choice'
    | 'code'
    | 'fill_in_blank'
    | 'true_false'
    | 'block_assembly'
    | 'matching'
    | 'chat'
  content: string
  code_snippet: string | null
  correct_answer: string
  /** Choices or tiles (`string[]`), matching pairs (`[left, right][]`), or `null`. */
  options: string[] | [string, string][] | null
}

export type LessonDetail = {
  id: number
  module_id: number
  title: string
  xp_reward: number
  is_quiz: boolean
  exercises: Exercise[]
}

export type CompletedLesson = {
  lesson_id: number
  course_id: number
}

export type Progress = {
  completed_lessons: CompletedLesson[]
}

export type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

export type ExerciseChatRead = {
  passed: boolean
  reply: string
}

export type ExerciseCheckRead = {
  passed: boolean
}

export type UserProgressUpdate = {
  status?: string | null
  last_position?: unknown
}

export type UserProgress = {
  user_id: number
  lesson_id: number
  status: string
  last_position?: unknown
  completed_at: string | null
  mistakes_made: number
  updated_at: string
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
      'Accept-Language': i18n.language,
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

export const getCourses = async (): Promise<CourseListItem[]> => {
  const response = await apiFetch('/api/courses')
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const getCourse = async (course_id: number): Promise<CourseDetail> => {
  const response = await apiFetch(`/api/courses/${course_id}`)
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const getLesson = async (lesson_id: number): Promise<LessonDetail> => {
  const response = await apiFetch(`/api/lessons/${lesson_id}`)
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const getProgress = async (): Promise<Progress> => {
  const response = await apiFetch('/api/progress')
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const completeLesson = async ({
  lesson_id,
  mistakes_made,
}: {
  lesson_id: number
  mistakes_made: number
}): Promise<User> => {
  const response = await apiFetch(`/api/lessons/${lesson_id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ mistakes_made }),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const chatExercise = async ({
  exercise_id,
  messages,
  locale,
}: {
  exercise_id: number
  messages: ChatMessage[]
  locale: string
}): Promise<ExerciseChatRead> => {
  const response = await apiFetch(`/api/exercises/${exercise_id}/chat`, {
    method: 'POST',
    body: JSON.stringify({ messages, locale }),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const checkExercise = async ({
  exercise_id,
  answer,
}: {
  exercise_id: number
  answer: string
}): Promise<ExerciseCheckRead> => {
  const response = await apiFetch(`/api/exercises/${exercise_id}/check`, {
    method: 'POST',
    body: JSON.stringify({ answer }),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const warmUpAi = async (): Promise<void> => {
  const response = await apiFetch('/api/ai/warmup', { method: 'POST' })
  if (!response.ok) throw await buildApiRequestError(response)
}

export const saveUserLessonProgress = async (
  lesson_id: number,
  body: UserProgressUpdate,
): Promise<UserProgress> => {
  const response = await apiFetch(`/api/progress/users/me/lessons/${lesson_id}/progress`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const getUserLessonProgress = async (lesson_id: number): Promise<UserProgress> => {
  const response = await apiFetch(`/api/progress/users/me/lessons/${lesson_id}/progress`)
  if (!response.ok) throw await buildApiRequestError(response)
  return response.json()
}

export const saveProgress = saveUserLessonProgress
