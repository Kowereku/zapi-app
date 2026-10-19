import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { warmUpAi } from '@/services/api'

export function useWarmUpAi() {
  const { mutate } = useMutation({ mutationFn: warmUpAi })

  useEffect(() => mutate(), [mutate])
}
