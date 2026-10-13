export type WorldId = 'earth' | 'candy' | 'moon'

export interface WorldFact {
  label: string
  value: string
}

export interface World {
  id: WorldId
  name: string
  tagline: string
  /** Background glow behind the planet while this world is selected. */
  glow: string
  /** Buttons, sparkles and highlights. */
  accent: string
  /** Readable text colour on top of `accent`. */
  accentText: string
  facts: readonly WorldFact[]
}

export const GAME_TITLE = 'FALLAWAY'

export const WORLDS: readonly World[] = [
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'Where it all began',
    glow: '#1b4048',
    accent: '#5cc98f',
    accentText: '#062114',
    facts: [
      { label: 'Gravity', value: '1.0 g' },
      { label: 'Climate', value: 'Temperate' },
      { label: 'Inhabitants', value: 'Humans' },
    ],
  },
  {
    id: 'candy',
    name: 'Sugar Rose',
    tagline: 'A planet made of sweets',
    glow: '#4d2038',
    accent: '#ff79ad',
    accentText: '#3a0619',
    facts: [
      { label: 'Gravity', value: '0.6 g' },
      { label: 'Climate', value: 'Sugary' },
      { label: 'Inhabitants', value: 'Gummies' },
    ],
  },
  {
    id: 'moon',
    name: 'Moon',
    tagline: 'Something lives in the craters',
    glow: '#2b2a4d',
    accent: '#a596ff',
    accentText: '#130b3a',
    facts: [
      { label: 'Gravity', value: '0.16 g' },
      { label: 'Climate', value: 'Freezing' },
      { label: 'Inhabitants', value: 'Moonlings' },
    ],
  },
]
