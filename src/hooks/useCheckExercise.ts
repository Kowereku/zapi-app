import { useMutation } from '@tanstack/react-query'
import { checkExercise } from '@/services/api'

export function useCheckExercise() {
  return useMutation({ mutationFn: checkExercise })
}
