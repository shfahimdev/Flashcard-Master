import { createContext, useContext, useState, useEffect } from "react";

const DeckContext = createContext();

export const useDeck = () => {
    const context = useContext(DeckContext);
    if (!context) {
        throw new Error("useDeck must be used within DeckProvider");
    }
    return context;
};

export const DeckProvider = ({ children }) => {
    const [decks, setDecks] = useState(() => {
        const saved = localStorage.getItem("quizlet-decks");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("quizlet-decks", JSON.stringify(decks));
    }, [decks]);

    const createDeck = (name, description = "") => {
        const newDeck = {
            id: Date.now().toString(),
            name,
            description,
            cards: [],
            createdAt: new Date().toISOString(),
        };
        setDecks((prev) => [...prev, newDeck]);
        return newDeck.id;
    };

    const updateDeck = (id, updates) => {
        setDecks((prev) =>
            prev.map((deck) =>
                deck.id === id ? { ...deck, ...updates } : deck
            )
        );
    };

    const deleteDeck = (id) => {
        setDecks((prev) => prev.filter((deck) => deck.id !== id));
    };

    const getDeck = (id) => {
        return decks.find((deck) => deck.id === id);
    };

    const addCard = (deckId, front, back) => {
        setDecks((prev) =>
            prev.map((deck) => {
                if (deck.id === deckId) {
                    return {
                        ...deck,
                        cards: [
                            ...deck.cards,
                            { id: Date.now().toString(), front, back },
                        ],
                    };
                }
                return deck;
            })
        );
    };

    const updateCard = (deckId, cardId, front, back) => {
        setDecks((prev) =>
            prev.map((deck) => {
                if (deck.id === deckId) {
                    return {
                        ...deck,
                        cards: deck.cards.map((card) =>
                            card.id === cardId ? { ...card, front, back } : card
                        ),
                    };
                }
                return deck;
            })
        );
    };

    const deleteCard = (deckId, cardId) => {
        setDecks((prev) =>
            prev.map((deck) => {
                if (deck.id === deckId) {
                    return {
                        ...deck,
                        cards: deck.cards.filter((card) => card.id !== cardId),
                    };
                }
                return deck;
            })
        );
    };

    return (
        <DeckContext.Provider
            value={{
                decks,
                createDeck,
                updateDeck,
                deleteDeck,
                getDeck,
                addCard,
                updateCard,
                deleteCard,
            }}
        >
            {children}
        </DeckContext.Provider>
    );
};
