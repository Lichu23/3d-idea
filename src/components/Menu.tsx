import { useEffect, useRef, type CSSProperties } from 'react'
import { useDrag } from '@use-gesture/react'
import { Backdrop } from './Backdrop'
import { WorldCarousel } from './WorldCarousel'
import { drag, useCarousel, useCurrentWorld, useGame } from '../store'
import { DIVE_SECONDS, VEIL_START } from '../transition'
import { GAME_TITLE, WORLDS, worldTheme } from '../worlds'

// The wash covers the tail of the dive and is fully opaque as the board takes over.
const VEIL_TIMING = {
  '--veil-delay': `${DIVE_SECONDS * VEIL_START}s`,
  '--veil-duration': `${DIVE_SECONDS * (1 - VEIL_START)}s`,
} as CSSProperties

export function Menu() {
  const next = useCarousel((s) => s.next)
  const prev = useCarousel((s) => s.prev)
  const world = useCurrentWorld()
  const phase = useGame((s) => s.phase)
  const play = useGame((s) => s.play)
  const zooming = phase === 'zooming'

  useEffect(() => {
    if (zooming) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, zooming])

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
    { axis: 'x', filterTaps: true, pointer: { capture: true }, enabled: !zooming },
  )

  return (
    <main
      className="menu"
      data-world={world.id}
      data-phase={phase}
      inert={zooming}
      style={worldTheme(world)}
    >
      <Backdrop active={world.id} />
      <WorldCarousel stageRef={stage} />
      <h1 className="title">{GAME_TITLE}</h1>

      <div className="stage" ref={stage}>
        <div className="drag-surface" {...bind()} />
      </div>

      <div aria-live="polite">
        <p className="world-label">
          World {WORLDS.indexOf(world) + 1} / {WORLDS.length}
        </p>
        <p className="world-name">{world.name}</p>
        <p className="world-tagline">{world.tagline}</p>
      </div>

      <dl className="world-facts">
        {world.facts.map((fact) => (
          <div key={fact.label} className="fact">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <nav className="actions" aria-label="Main menu">
        <button type="button" className="btn btn-primary" onClick={play}>
          Play
        </button>
        <button type="button" className="btn">Guide</button>
        <button type="button" className="btn">Options</button>
      </nav>

      {/* Washes the screen in the world's colour as the camera reaches the surface. */}
      <div className="zoom-veil" aria-hidden="true" style={VEIL_TIMING} />
    </main>
  )
}
