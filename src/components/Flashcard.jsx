import { motion } from "framer-motion";

function Flashcard({ card, isFlipped, onFlip }) {
    return (
        <motion.div
            onClick={onFlip}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative cursor-pointer w-full"
            style={{ transformStyle: "preserve-3d" }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center"
                style={{ backfaceVisibility: "hidden" }}
            >
                <div className="text-center">
                    <p className="text-2xl font-medium text-gray-900">
                        {card.front}
                    </p>
                </div>
            </div>

            <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-12 min-h-[400px] flex items-center justify-center"
                style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                }}
            >
                <div className="text-center">
                    <p className="text-2xl font-medium text-white">
                        {card.back}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default Flashcard;
