import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useDeck } from "../context/DeckContext";
import DeckCard from "../components/DeckCard";
import CreateDeckModal from "../components/CreateDeckModal";

function Dashboard() {
    const { decks } = useDeck();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Your Study Decks
                    </h1>
                    <p className="text-gray-600">
                        Create and manage your flashcard collections
                    </p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="mb-8 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                    <Plus size={20} />
                    Create New Deck
                </motion.button>

                {decks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="w-24 h-24 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            No decks yet
                        </h2>
                        <p className="text-gray-500">
                            Create your first deck to get started
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map((deck, index) => (
                            <motion.div
                                key={deck.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <DeckCard deck={deck} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <CreateDeckModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}

export default Dashboard;
