import { useQuery } from '@tanstack/react-query'
import { getCourse } from '@/services/api'

export function useCourse(course_id: number) {
  return useQuery({ queryKey: ['course', course_id], queryFn: () => getCourse(course_id) })
}
