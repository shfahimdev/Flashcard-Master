import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

function TestQuestion({
    question,
    selectedAnswer,
    onSelectAnswer,
    onWrittenSubmit,
    isAnswered,
}) {
    // Local state for textarea
    const [localWrittenAnswer, setLocalWrittenAnswer] = useState('');

    // FIX: Only sync when selectedAnswer exists (user came back to answered question)
    useEffect(() => {
        if (selectedAnswer) {
            setLocalWrittenAnswer(selectedAnswer);
        } else {
            setLocalWrittenAnswer('');
        }
    }, [question.id]); // Only depend on question.id, not selectedAnswer

    const handleSubmit = () => {
        if (localWrittenAnswer.trim()) {
            onWrittenSubmit(localWrittenAnswer.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-2xl p-12"
        >
            <div className="mb-8">
                <span className="text-sm font-semibold text-indigo-600 uppercase">
                    {question.type === "mcq"
                        ? "Multiple Choice"
                        : "Written Answer"}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                    {question.question}
                </h2>
            </div>

            {question.type === "mcq" ? (
                <div className="space-y-3">
                    {question.options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelectAnswer(option)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedAnswer === option
                                    ? "border-indigo-600 bg-indigo-50"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                            } ${isAnswered ? 'cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        selectedAnswer === option
                                            ? "border-indigo-600 bg-indigo-600"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {selectedAnswer === option && (
                                        <Check
                                            size={16}
                                            className="text-white"
                                        />
                                    )}
                                </div>
                                <span className="text-gray-900">{option}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div>
                    <textarea
                        value={localWrittenAnswer}
                        onChange={(e) => setLocalWrittenAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
                        rows={4}
                        disabled={isAnswered}
                    />
                    {!isAnswered && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={!localWrittenAnswer.trim()}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </motion.button>
                    )}
                    {isAnswered && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 font-medium">
                                ✓ Answer submitted: "{selectedAnswer}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default TestQuestion;
