import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Edit, Eye } from "lucide-react";
import { useDeck } from "../context/DeckContext";

function DeckCard({ deck }) {
    const navigate = useNavigate();
    const { deleteDeck } = useDeck();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${deck.name}"?`)) {
            deleteDeck(deck.id);
        }
    };

    const handleView = () => {
        navigate(`/deck/${deck.id}`);
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-shadow hover:shadow-xl border border-gray-100"
            onClick={handleView}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {deck.name}
                    </h3>
                    {deck.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {deck.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    <span className="font-semibold text-indigo-600">
                        {deck.cards.length}
                    </span>{" "}
                    cards
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleView}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View deck"
                    >
                        <Eye size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete deck"
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default DeckCard;
