import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeLesson, type Progress, type User } from '@/services/api'

export function useCompleteLesson(course_id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: (result, variables) => {
      // The response describes the completion, not the user, so only XP and streak are carried over.
      queryClient.setQueryData<User>(['currentUser'], (old) =>
        old ? { ...old, total_xp: result.total_xp, streak_days: result.streak_days } : old,
      )
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
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
    },
  })
}
