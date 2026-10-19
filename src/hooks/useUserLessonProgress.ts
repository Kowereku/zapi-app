import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserLessonProgress,
  saveUserLessonProgress,
  type UserProgressUpdate,
} from '@/services/api'

export function useUserLessonProgress(lesson_id: number) {
  return useQuery({
    queryKey: ['userLessonProgress', lesson_id],
    queryFn: () => getUserLessonProgress(lesson_id),
    retry: false,
  })
}

export function useSaveUserLessonProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lesson_id, body }: { lesson_id: number; body: UserProgressUpdate }) =>
      saveUserLessonProgress(lesson_id, body),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['userLessonProgress', variables.lesson_id], data)
    },
  })
}
