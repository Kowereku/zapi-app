/** Positions taken from the 1440×1024 Figma frames, expressed as percentages. */
const snippets = [
  { text: '< >', position: 'left-[9%] top-[14%]' },
  { text: 'cout << "" << endl();', position: 'right-[11%] top-[10%]' },
  { text: '{ }', position: 'right-[11%] top-[26%]' },
  { text: '[ ]', position: 'left-[17%] top-[39%]' },
  { text: 'console.log();', position: 'right-[10%] top-[48%]' },
  { text: 'System.out.println();', position: 'bottom-[8%] left-[8%]' },
] as const

export function CodeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {snippets.map(({ text, position }) => (
        <span
          key={text}
          className={`absolute text-3xl whitespace-nowrap text-on-page-muted md:text-5xl ${position}`}
        >
          {text}
        </span>
      ))}
    </div>
  )
}
