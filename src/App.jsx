import { useEffect } from 'react'
import ChatScreen from './scenes/ChatScreen.jsx'
import RoadScreen from './scenes/RoadScreen.jsx'
import StartScreen from './scenes/StartScreen.jsx'
import TownHub from './scenes/TownHub.jsx'
import Wardrobe from './scenes/Wardrobe.jsx'
import ZoneScreen from './scenes/ZoneScreen.jsx'
import { useGameStore } from './store/useGameStore.js'

export default function App() {
  const lang = useGameStore((s) => s.lang)
  const gender = useGameStore((s) => s.gender)
  const scene = useGameStore((s) => s.scene)

  useEffect(() => {
    document.documentElement.lang = lang ?? 'my'
  }, [lang])

  if (!lang || !gender) return <StartScreen />
  if (scene === 'wardrobe') return <Wardrobe />
  if (scene === 'chat') return <ChatScreen key={lang} />
  if (scene === 'road') return <RoadScreen key={lang} />
  if (scene === 'hub') return <TownHub />
  return <ZoneScreen key={lang} />
}
