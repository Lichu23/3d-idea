import { useEffect } from 'react'
import { useCurrentWorld, useGame } from '../store'
import { worldTheme } from '../worlds'

/** Board for the selected world. Empty for now; pieces and play come later. */
export function GameBoard() {
  const world = useCurrentWorld()
  const exitToMenu = useGame((s) => s.exitToMenu)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitToMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exitToMenu])

  return (
    <main className="board-screen" data-world={world.id} style={worldTheme(world)}>
      <header className="hud">
        <button type="button" className="btn" onClick={exitToMenu} autoFocus>
          ← Menu
        </button>
        <h1 className="hud-world">{world.name}</h1>
      </header>

      <div className="board" role="img" aria-label={`${world.name} board, empty`} />
    </main>
  )
}
