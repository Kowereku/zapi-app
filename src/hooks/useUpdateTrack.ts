import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTrack } from '@/services/api'

export function useUpdateTrack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTrack,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user)
      // The profile shows the area and suggests a course from it.
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
