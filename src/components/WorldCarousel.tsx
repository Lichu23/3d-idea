import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { MathUtils } from 'three'
import { CarouselItem } from './CarouselItem'
import { WORLD_SCENES } from './worlds'
import { drag, useCarousel, useCurrentWorld } from '../store'
import { WORLDS } from '../worlds'

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const wrap = (value: number, size: number) =>
  ((((value + size / 2) % size) + size) % size) - size / 2

// Own component so only the sparkles re-render when the world changes.
function ThemedSparkles() {
  const accent = useCurrentWorld().accent
  return <Sparkles count={40} scale={[10, 5, 4]} size={3} speed={0.3} color={accent} />
}

function Scene() {
  const width = useThree((s) => s.viewport.width)
  const spacing = Math.min(3.2, width * 0.32)
  const position = useRef(useCarousel.getState().index)
  // One ref object per world so each planet reads its own animated offset.
  const [offsetRefs] = useState(() => WORLDS.map(() => ({ current: 0 })))

  useFrame((_, delta) => {
    const target = useCarousel.getState().index - drag.progress
    // Follow the pointer tightly while dragging, ease into place on release.
    position.current = reducedMotion
      ? target
      : MathUtils.damp(position.current, target, drag.active ? 25 : 6, delta)
    offsetRefs.forEach((ref, i) => {
      ref.current = wrap(i - position.current, WORLDS.length)
    })
  })

  return (
    <>
      <hemisphereLight args={['#cfe3ff', '#20152e', 0.5]} />
      <directionalLight position={[3, 3, 4]} intensity={2.4} />
      <ThemedSparkles />
      {WORLDS.map((world, i) => {
        const WorldScene = WORLD_SCENES[world.id]
        return (
          <CarouselItem
            key={world.id}
            offsetRef={offsetRefs[i]}
            spacing={spacing}
            reducedMotion={reducedMotion}
          >
            <WorldScene />
          </CarouselItem>
        )
      })}
    </>
  )
}

export function WorldCarousel() {
  return (
    <div className="canvas-layer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}
