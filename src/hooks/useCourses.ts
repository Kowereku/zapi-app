import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/api'

export function useCourses() {
  return useQuery({ queryKey: ['courses'], queryFn: getCourses })
}
