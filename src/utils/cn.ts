import { clsx, type ClassValue } from 'clsx'

/** Join class names for conditional rendering. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
