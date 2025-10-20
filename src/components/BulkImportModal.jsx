import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, AlertCircle } from 'lucide-react'
import { useDeck } from '../context/DeckContext'

function BulkImportModal({ deckId, onClose }) {
  const [tsvText, setTsvText] = useState('')
  const [error, setError] = useState('')
  const { addCard } = useDeck()

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setTsvText(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!tsvText.trim()) {
      setError('Please enter or upload TSV data')
      return
    }

    const lines = tsvText.trim().split('\n')
    let imported = 0
    let failed = 0

    lines.forEach((line, index) => {
      const parts = line.split('\t')
      
      if (parts.length >= 2) {
        const front = parts[0].trim()
        const back = parts[1].trim()
        
        if (front && back) {
          addCard(deckId, front, back)
          imported++
        } else {
          failed++
        }
      } else {
        failed++
      }
    })

    if (imported > 0) {
      alert(`Successfully imported ${imported} cards!${failed > 0 ? ` (${failed} lines skipped)` : ''}`)
      onClose()
    } else {
      setError('No valid cards found. Make sure each line has front and back separated by a tab.')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Import Cards</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Format:</strong> Each line should have the front and back separated by a TAB character.
            </p>
            <p className="text-xs text-blue-700 font-mono">
              What is React?[TAB]A JavaScript library for building UIs<br/>
              What is JSX?[TAB]JavaScript XML syntax extension
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload TSV File
              </label>
              <input
                type="file"
                accept=".tsv,.txt"
                onChange={handleFileUpload}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="text-center text-gray-500 text-sm">or</div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paste TSV Data
              </label>
              <textarea
                value={tsvText}
                onChange={(e) => setTsvText(e.target.value)}
                placeholder="Front text[TAB]Back text&#10;Question 1[TAB]Answer 1&#10;Question 2[TAB]Answer 2"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none font-mono text-sm"
                rows={10}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                Import Cards
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BulkImportModal
