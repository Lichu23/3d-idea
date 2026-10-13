import type { CSSProperties } from 'react'
import type { WorldId } from '../worlds'
import { seededRandom } from './worlds/geometry'

// Decoration layouts are generated once so they stay put between renders.
const random = seededRandom(99)
const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)]
const pct = () => `${(random() * 100).toFixed(1)}%`

const clouds = Array.from({ length: 6 }, () => ({
  top: `${(5 + random() * 70).toFixed(1)}%`,
  scale: 0.6 + random() * 0.9,
  duration: 60 + random() * 50,
  delay: -random() * 110,
}))

const birds = Array.from({ length: 4 }, (_, i) => ({
  top: `${(10 + random() * 30).toFixed(1)}%`,
  duration: 28 + random() * 14,
  delay: -i * 9,
}))

const SPRINKLE_COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#8e7dff', '#4cc9f0', '#ffffff']
const sprinkles = Array.from({ length: 36 }, () => ({
  left: pct(),
  color: pick(SPRINKLE_COLORS),
  duration: 9 + random() * 9,
  delay: -random() * 18,
}))

const lollipops = [
  { left: '6%', top: '22%', size: 70, delay: 0 },
  { left: '88%', top: '16%', size: 54, delay: -2 },
  { left: '10%', top: '72%', size: 46, delay: -4 },
  { left: '84%', top: '68%', size: 64, delay: -1 },
]

const stars = Array.from({ length: 70 }, () => ({
  left: pct(),
  top: pct(),
  size: random() > 0.85 ? 3 : random() > 0.5 ? 2 : 1,
  duration: 2 + random() * 4,
  delay: -random() * 6,
}))

const vars = (values: Record<string, string | number>) => values as CSSProperties

function EarthBackdrop() {
  return (
    <>
      {clouds.map((c, i) => (
        <span
          key={i}
          className="cloud"
          style={vars({ top: c.top, '--scale': c.scale, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` })}
        />
      ))}
      {birds.map((b, i) => (
        <svg
          key={i}
          className="bird"
          viewBox="0 0 24 8"
          style={{ top: b.top, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        >
          <path d="M1 6 Q6 0 12 5 Q18 0 23 6" />
        </svg>
      ))}
    </>
  )
}

function CandyBackdrop() {
  return (
    <>
      {sprinkles.map((s, i) => (
        <span
          key={i}
          className="sprinkle"
          style={{ left: s.left, background: s.color, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
      {lollipops.map((l, i) => (
        <span
          key={i}
          className="lollipop"
          style={vars({ left: l.left, top: l.top, '--size': `${l.size}px`, animationDelay: `${l.delay}s` })}
        />
      ))}
    </>
  )
}

function MoonBackdrop() {
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <span className="shooting-star" />
      <span className="shooting-star shooting-star-late" />
      <span className="distant-earth" />
    </>
  )
}

const LAYERS: Record<WorldId, () => React.JSX.Element> = {
  earth: EarthBackdrop,
  candy: CandyBackdrop,
  moon: MoonBackdrop,
}

/** Themed decorations behind the menu; layers cross-fade when the world changes. */
export function Backdrop({ active }: { active: WorldId }) {
  return (
    <div className="backdrop" aria-hidden="true">
      {(Object.keys(LAYERS) as WorldId[]).map((id) => {
        const Layer = LAYERS[id]
        return (
          <div key={id} className="backdrop-layer" data-active={id === active}>
            <Layer />
          </div>
        )
      })}
    </div>
  )
}
