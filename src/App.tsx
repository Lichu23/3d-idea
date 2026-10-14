import { GameBoard } from './components/GameBoard'
import { Menu } from './components/Menu'
import { useGame } from './store'

export default function App() {
  const inGame = useGame((s) => s.phase === 'game')
  return inGame ? <GameBoard /> : <Menu />
}
