import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Join class names, letting a passed className. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
