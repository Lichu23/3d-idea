import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, Vector3, type Color, type Group } from 'three'
import { OnSurface } from './OnSurface'
import { createPlanetGeometry, fbm, fibonacciSphere, randomDirection, seededRandom } from './geometry'

const SEED = 7
const SEA_LEVEL = 0.5

const landNoise = (dir: Vector3) => fbm(dir, 1.8, SEED)

function height(dir: Vector3) {
  const n = landNoise(dir)
  return n > SEA_LEVEL ? (n - SEA_LEVEL) * 0.45 : 0
}

function faceColor(dir: Vector3, h: number, out: Color) {
  if (Math.abs(dir.y) > 0.86) out.set('#eef3f6')
  else if (h <= 0) out.set(landNoise(dir) > SEA_LEVEL - 0.05 ? '#3a8fc4' : '#1f5a96')
  else if (h < 0.012) out.set('#d9c88f')
  else if (h < 0.05) out.set('#5a9a3c')
  else if (h < 0.08) out.set('#3b7533')
  else if (h < 0.11) out.set('#8a7a66')
  else out.set('#f4f4f0')
}

const geometry = createPlanetGeometry({ detail: 3, height, faceColor })

const trees = fibonacciSphere(400)
  .filter((dir) => {
    const h = height(dir)
    return h > 0.012 && h < 0.07 && Math.abs(dir.y) < 0.8
  })
  .slice(0, 45)
  .map((dir) => ({ dir, radius: 1 + height(dir) }))

const random = seededRandom(SEED)
const clouds = Array.from({ length: 8 }, () => ({
  dir: randomDirection(random),
  puffs: Array.from({ length: 3 }, (_, i) => ({
    x: (i - 1) * 0.08,
    size: 0.06 + random() * 0.04,
  })),
}))

export function Earth() {
  const cloudLayer = useRef<Group>(null)

  useFrame((_, delta) => {
    if (cloudLayer.current) cloudLayer.current.rotation.y += delta * 0.08
  })

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.85} />
      </mesh>

      {trees.map(({ dir, radius }, i) => (
        <OnSurface key={i} dir={dir} radius={radius}>
          <mesh position={[0, 0.05, 0]}>
            <coneGeometry args={[0.035, 0.1, 5]} />
            <meshStandardMaterial color="#2d6a2f" flatShading />
          </mesh>
        </OnSurface>
      ))}

      <group ref={cloudLayer}>
        {clouds.map(({ dir, puffs }, i) => (
          <OnSurface key={i} dir={dir} radius={1.2}>
            {puffs.map(({ x, size }, j) => (
              <mesh key={j} position={[x, 0, 0]} scale={[1, 0.6, 1]}>
                <icosahedronGeometry args={[size, 0]} />
                <meshStandardMaterial color="#ffffff" flatShading roughness={1} />
              </mesh>
            ))}
          </OnSurface>
        ))}
      </group>

      {/* Soft atmosphere halo. */}
      <mesh>
        <sphereGeometry args={[1.18, 32, 32]} />
        <meshBasicMaterial color="#7cc4ff" side={BackSide} transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  )
}
