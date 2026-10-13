import { useMemo, type ReactNode } from 'react'
import { Quaternion, Vector3 } from 'three'

const UP = new Vector3(0, 1, 0)

interface OnSurfaceProps {
  dir: Vector3
  radius: number
  children: ReactNode
}

/** Places children on a sphere so their local +Y points away from the centre. */
export function OnSurface({ dir, radius, children }: OnSurfaceProps) {
  const quaternion = useMemo(() => new Quaternion().setFromUnitVectors(UP, dir), [dir])
  return (
    <group position={[dir.x * radius, dir.y * radius, dir.z * radius]} quaternion={quaternion}>
      {children}
    </group>
  )
}
