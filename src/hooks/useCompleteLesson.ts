import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeLesson } from '@/services/api'

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user)
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
