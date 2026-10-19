import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeLesson, type Progress } from '@/services/api'

export function useCompleteLesson(course_id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: (user, variables) => {
      queryClient.setQueryData(['currentUser'], user)
      if (course_id) {
        queryClient.setQueryData<Progress>(['progress'], (old) => {
          const list = old?.completed_lessons ?? []
          if (list.some((item) => item.lesson_id === variables.lesson_id)) {
            return old ?? { completed_lessons: list }
          }
          return {
            completed_lessons: [...list, { lesson_id: variables.lesson_id, course_id }],
          }
        })
      }
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
