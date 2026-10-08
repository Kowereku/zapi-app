import { useQuery } from '@tanstack/react-query'
import { getLesson } from '@/services/api'

export function useLesson(lesson_id: number) {
  return useQuery({ queryKey: ['lesson', lesson_id], queryFn: () => getLesson(lesson_id) })
}
