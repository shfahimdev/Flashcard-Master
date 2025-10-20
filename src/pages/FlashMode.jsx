import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import { useDeck } from '../context/DeckContext'

function FlashMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDeck } = useDeck()
  const deck = getDeck(id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState([])
  const [shuffled, setShuffled] = useState(false)

  useEffect(() => {
    if (deck && deck.cards && deck.cards.length > 0) {
      setCards([...deck.cards])
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

  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShuffled(true)
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const currentCard = cards[currentIndex]

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.name}</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Card {currentIndex + 1} of {cards.length}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShuffle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  shuffled ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Shuffle size={18} />
                Shuffle
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8" style={{ perspective: '1000px', minHeight: '400px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
              >
                <motion.div
                  onClick={() => setIsFlipped(!isFlipped)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="relative cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div
                    className="bg-white rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-indigo-600 mb-4">FRONT</div>
                      <p className="text-2xl font-medium text-gray-900">{currentCard.front}</p>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white/80 mb-4">BACK</div>
                      <p className="text-2xl font-medium text-white">{currentCard.back}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Click card to flip</p>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ChevronLeft size={20} />
              Previous
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Next
              <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsFlipped(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FlashMode
