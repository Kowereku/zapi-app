import { storage } from './storage'

const TOKEN_KEY = 'polycode.token'

export const session = {
  getToken: () => storage.get(TOKEN_KEY),
  setToken: (token: string) => storage.set(TOKEN_KEY, token),
  clear: () => storage.remove(TOKEN_KEY),
}
