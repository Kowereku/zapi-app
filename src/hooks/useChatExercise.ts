import { useMutation } from '@tanstack/react-query'
import { chatExercise } from '@/services/api'

export function useChatExercise() {
  return useMutation({ mutationFn: chatExercise })
}
