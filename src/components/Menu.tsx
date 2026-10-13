import { useEffect, useRef, type CSSProperties } from 'react'
import { useDrag } from '@use-gesture/react'
import { WorldCarousel } from './WorldCarousel'
import { drag, useCarousel, useCurrentWorld } from '../store'
import { GAME_TITLE, WORLDS } from '../worlds'

export function Menu() {
  const next = useCarousel((s) => s.next)
  const prev = useCarousel((s) => s.prev)
  const world = useCurrentWorld()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const stage = useRef<HTMLDivElement>(null)

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], last }) => {
      const slotWidth = (stage.current?.offsetWidth ?? 800) * 0.3
      drag.active = active
      drag.progress = Math.max(-1, Math.min(1, mx / slotWidth))

      if (last) {
        // Commit to the next world on a long drag or a quick flick.
        const commit = Math.abs(drag.progress) > 0.3 || vx > 0.5
        if (commit && dx > 0) prev()
        else if (commit && dx < 0) next()
        drag.progress = 0
      }
    },
    { axis: 'x', filterTaps: true, pointer: { capture: true } },
  )

  return (
    <main className="menu" style={{ '--bg-glow': world.glow } as CSSProperties}>
      <h1 className="title">{GAME_TITLE}</h1>

      <div className="stage" ref={stage}>
        <div className="drag-surface" {...bind()}>
          <WorldCarousel />
        </div>
      </div>

      <div aria-live="polite">
        <p className="world-label">
          World {WORLDS.indexOf(world) + 1} / {WORLDS.length}
        </p>
        <p className="world-name">{world.name}</p>
        <p className="world-tagline">{world.tagline}</p>
      </div>

      <nav className="actions" aria-label="Main menu">
        <button type="button" className="btn btn-primary">Play</button>
        <button type="button" className="btn">Guide</button>
        <button type="button" className="btn">Options</button>
      </nav>
    </main>
  )
}
