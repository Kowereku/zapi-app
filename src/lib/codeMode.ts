import { storage } from './storage'

/** How a code exercise is answered: typed in the editor, or built from blocks (Dual mode). */
export type CodeMode = 'typing' | 'blocks'

const STORAGE_KEY = 'polycode.codeMode'

/** The last mode picked on this device, so a phone that used blocks starts with blocks. */
export function getCodeMode(): CodeMode {
  return storage.get(STORAGE_KEY) === 'blocks' ? 'blocks' : 'typing'
}

export function setCodeMode(mode: CodeMode) {
  storage.set(STORAGE_KEY, mode)
}
