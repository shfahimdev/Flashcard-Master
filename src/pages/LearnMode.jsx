import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react'
import { useDeck } from '../context/DeckContext'

function LearnMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDeck } = useDeck()
  const deck = getDeck(id)
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [known, setKnown] = useState([])
  const [unknown, setUnknown] = useState([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (deck && deck.cards && deck.cards.length > 0) {
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
      setCards(shuffled)
      setUnknown(shuffled.map(c => c.id))
    }
  }, [deck])

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deck not found</h2>
          <Link to="/" className="text-indigo-600 hover:underline">Go back to dashboard</Link>
        </div>
      </div>
    )
  }

  if (!deck.cards || deck.cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No cards available</h2>
          <Link to={`/deck/${id}`} className="text-indigo-600 hover:underline">Go back to deck</Link>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  const handleCorrect = () => {
    setKnown([...known, currentCard.id])
    setUnknown(unknown.filter(id => id !== currentCard.id))
    moveToNext()
  }

  const handleIncorrect = () => {
    moveToNext()
  }

  const moveToNext = () => {
    setShowAnswer(false)
    const remainingCards = cards.filter(card => 
      unknown.includes(card.id) && card.id !== currentCard.id
    )
    
    if (remainingCards.length === 0 && unknown.length === 1) {
      setCompleted(true)
    } else {
      const nextIndex = (currentIndex + 1) % cards.length
      let searchIndex = nextIndex
      
      while (known.includes(cards[searchIndex].id)) {
        searchIndex = (searchIndex + 1) % cards.length
        if (searchIndex === currentIndex) break
      }
      
      setCurrentIndex(searchIndex)
    }
  }

  const handleRestart = () => {
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setShowAnswer(false)
    setKnown([])
    setUnknown(shuffled.map(c => c.id))
    setCompleted(false)
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Done!</h2>
            <p className="text-gray-600 mb-8">You've mastered all cards in this deck.</p>
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw size={20} />
                Study Again
              </motion.button>
              <button
                onClick={() => navigate(`/deck/${id}`)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Deck
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(`/deck/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Deck
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{deck.name}</h1>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Known: {known.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Learning: {unknown.length}</span>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(known.length / cards.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-8" style={{ minHeight: '400px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id + showAnswer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-12 min-h-[400px] flex flex-col items-center justify-center">
                  {!showAnswer ? (
                    <div className="text-center w-full">
                      <div className="text-sm font-semibold text-indigo-600 mb-6">QUESTION</div>
                      <p className="text-2xl font-medium text-gray-900 mb-12">{currentCard.front}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAnswer(true)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                      >
                        Show Answer
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="text-sm font-semibold text-green-600 mb-4">ANSWER</div>
                      <p className="text-2xl font-medium text-gray-900 mb-8">{currentCard.back}</p>
                      <div className="border-t pt-8">
                        <p className="text-sm text-gray-600 mb-6">Did you get it right?</p>
                        <div className="flex gap-4 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleIncorrect}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X size={20} />
                            Incorrect
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCorrect}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                          >
                            <Check size={20} />
                            Correct
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LearnMode
