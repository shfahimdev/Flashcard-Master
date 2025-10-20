import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, Award, RotateCcw } from 'lucide-react'
import { useDeck } from '../context/DeckContext'
import TestQuestion from '../components/TestQuestion' 

function TestMode() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getDeck } = useDeck()
    const deck = getDeck(id)
    
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)

    // Generate test only once when component mounts
    useEffect(() => {
        if (!deck || !deck.cards || deck.cards.length < 4) return

        const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
        const testQuestions = shuffled.slice(0, Math.min(10, deck.cards.length)).map((card, idx) => {
            const isMCQ = idx % 2 === 0

            if (isMCQ) {
                // FIX: Use card.front instead of card.id to filter unique wrong options
                const wrongOptions = deck.cards
                    .filter(c => c.front !== card.front)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map(c => c.back)

                const options = [...wrongOptions, card.back].sort(() => Math.random() - 0.5)

                return {
                    id: `${card.id}-${idx}`, // Make unique ID for each question
                    type: 'mcq',
                    question: card.front,
                    correctAnswer: card.back,
                    options
                }
            } else {
                return {
                    id: `${card.id}-${idx}`, // Make unique ID for each question
                    type: 'written',
                    question: card.front,
                    correctAnswer: card.back
                }
            }
        })

        setQuestions(testQuestions)
    }, [deck])

    if (!deck || !deck.cards || deck.cards.length < 4) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Not enough cards</h2>
                    <p className="text-gray-600 mb-4">You need at least 4 cards to take a test</p>
                    <Link to={`/deck/${id}`} className="text-indigo-600 hover:underline">Go back to deck</Link>
                </div>
            </div>
        )
    }

    if (questions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading test...</div>
    }

    const currentQuestion = questions[currentIndex]

    const handleMCQAnswer = (option) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))
    }

    const handleWrittenSubmit = (answer) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }))
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            calculateScore()
        }
    }

    const calculateScore = () => {
        let correct = 0
        questions.forEach(q => {
            const userAnswer = answers[q.id]
            if (q.type === 'mcq') {
                if (userAnswer === q.correctAnswer) correct++
            } else {
                if (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
                    correct++
                }
            }
        })
        setScore(correct)
        setShowResults(true)
    }

    const handleRestart = () => {
        // Regenerate test
        const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
        const testQuestions = shuffled.slice(0, Math.min(10, deck.cards.length)).map((card, idx) => {
            const isMCQ = idx % 2 === 0

            if (isMCQ) {
                const wrongOptions = deck.cards
                    .filter(c => c.front !== card.front)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map(c => c.back)

                const options = [...wrongOptions, card.back].sort(() => Math.random() - 0.5)

                return {
                    id: `${card.id}-${idx}`,
                    type: 'mcq',
                    question: card.front,
                    correctAnswer: card.back,
                    options
                }
            } else {
                return {
                    id: `${card.id}-${idx}`,
                    type: 'written',
                    question: card.front,
                    correctAnswer: card.back
                }
            }
        })

        setQuestions(testQuestions)
        setCurrentIndex(0)
        setAnswers({})
        setShowResults(false)
        setScore(0)
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100)

        return (
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                <Award size={48} className={`${
                                    percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`} />
                            </div>

                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Test Complete!</h2>
                            <p className="text-6xl font-bold text-indigo-600 mb-8">{percentage}%</p>
                            <p className="text-xl text-gray-600 mb-12">You got {score} out of {questions.length} correct</p>

                            <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
                                {questions.map((q, idx) => {
                                    const userAnswer = answers[q.id]
                                    const isCorrect = q.type === 'mcq'
                                        ? userAnswer === q.correctAnswer
                                        : userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()

                                    return (
                                        <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                                                    }`}>
                                                    {isCorrect ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 mb-2">{idx + 1}. {q.question}</p>
                                                    <p className="text-sm text-gray-600 mb-1">Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer || '(no answer)'}</span></p>
                                                    {!isCorrect && (
                                                        <p className="text-sm text-gray-600">Correct answer: <span className="text-green-600">{q.correctAnswer}</span></p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRestart}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <RotateCcw size={20} />
                                    Take Again
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
            </div>
        )
    }

    const isAnswered = answers.hasOwnProperty(currentQuestion.id)

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.name} - Test</h1>
                        <p className="text-gray-600">Question {currentIndex + 1} of {questions.length}</p>
                        <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                className="h-full bg-indigo-600"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <TestQuestion
                            key={currentQuestion.id}
                            question={currentQuestion}
                            selectedAnswer={answers[currentQuestion.id]}
                            onSelectAnswer={handleMCQAnswer}
                            onWrittenSubmit={handleWrittenSubmit}
                            isAnswered={isAnswered}
                        />
                    </AnimatePresence>

                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default TestMode
