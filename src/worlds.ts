export type WorldId = 'earth' | 'candy' | 'moon'

export interface World {
  id: WorldId
  name: string
  tagline: string
  /** Background glow behind the planet while this world is selected. */
  glow: string
}

export const GAME_TITLE = 'FALLAWAY'

export const WORLDS: readonly World[] = [
  { id: 'earth', name: 'Earth', tagline: 'Where it all began', glow: '#1b4048' },
  { id: 'candy', name: 'Sugar Rose', tagline: 'A planet made of sweets', glow: '#4d2038' },
  { id: 'moon', name: 'Moon', tagline: 'Something lives in the craters', glow: '#2b2a4d' },
]
