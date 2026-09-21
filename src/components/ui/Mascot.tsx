import ducky from '@/assets/mascot/ducky.svg'
import rubberDuck from '@/assets/mascot/rubberDuck.svg'
import duckLogin from '@/assets/mascot/duckLogin.svg'
import duckRegister from '@/assets/mascot/duckRegister.svg'

const sources = { ducky, rubberDuck, duckLogin, duckRegister }

const sizes = {
  md: 'w-36 sm:w-44',
  peek: 'w-60',
  hero: 'w-48 sm:w-72 lg:w-88',
}

type MascotProps = {
  variant: keyof typeof sources
  size?: keyof typeof sizes
}

export function Mascot({ variant, size = 'md' }: MascotProps) {
  return (
    <img
      src={sources[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none shrink-0 select-none ${sizes[size]}`}
    />
  )
}
