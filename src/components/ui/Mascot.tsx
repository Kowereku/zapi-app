import ducky from '@/assets/mascot/ducky.svg'
import rubberDuck from '@/assets/mascot/rubber-duck.svg'
import duckLogin from '@/assets/mascot/duck-login.svg'
import duckRegister from '@/assets/mascot/duck-register.svg'

const sources = {
  ducky,
  rubberDuck,
  duckLogin,
  duckRegister,
} as const

const sizes = {
  icon: 'size-10',
  md: 'w-36 sm:w-44',
  peek: 'w-40 sm:w-60',
  hero: 'w-48 sm:w-72 lg:w-88',
} as const

export type MascotVariant = keyof typeof sources
export type MascotSize = keyof typeof sizes

type MascotProps = {
  variant: MascotVariant
  size?: MascotSize
  alt?: string
}

export function Mascot({ variant, size = 'md', alt = '' }: MascotProps) {
  return (
    <img
      src={sources[variant]}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className={`pointer-events-none shrink-0 select-none ${sizes[size]}`}
    />
  )
}
