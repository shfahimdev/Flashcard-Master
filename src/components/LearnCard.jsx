import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

function LearnCard({ card, showAnswer, onShowAnswer, onCorrect, onIncorrect }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
        >
            <div className="bg-white rounded-2xl shadow-2xl p-12 min-h-[400px] flex flex-col items-center justify-center">
                {!showAnswer ? (
                    <div className="text-center w-full">
                        <div className="text-sm font-semibold text-indigo-600 mb-6">
                            QUESTION
                        </div>
                        <p className="text-2xl font-medium text-gray-900 mb-12">
                            {card.front}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onShowAnswer}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                        >
                            Show Answer
                        </motion.button>
                    </div>
                ) : (
                    <div className="text-center w-full">
                        <div className="text-sm font-semibold text-green-600 mb-4">
                            ANSWER
                        </div>
                        <p className="text-2xl font-medium text-gray-900 mb-8">
                            {card.back}
                        </p>
                        <div className="border-t pt-8">
                            <p className="text-sm text-gray-600 mb-6">
                                Did you get it right?
                            </p>
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onIncorrect}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X size={20} />
                                    Incorrect
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onCorrect}
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
    );
}

export default LearnCard;
