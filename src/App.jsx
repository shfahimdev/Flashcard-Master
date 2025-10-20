import { Routes, Route } from 'react-router-dom'
import { DeckProvider } from './context/DeckContext'
import Dashboard from './pages/Dashboard'
import DeckView from './pages/DeckView'
import FlashMode from './pages/FlashMode'
import LearnMode from './pages/LearnMode'
import TestMode from './pages/TestMode'

function App() {
  return (
    <DeckProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deck/:id" element={<DeckView />} />
          <Route path="/deck/:id/flash" element={<FlashMode />} />
          <Route path="/deck/:id/learn" element={<LearnMode />} />
          <Route path="/deck/:id/test" element={<TestMode />} />
        </Routes>
      </div>
    </DeckProvider>
  )
}

export default App
