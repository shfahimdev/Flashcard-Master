const app = {
    decks: [],
    currentDeck: null,
    editingDeck: null,
    flashcardIndex: 0,
    flashcardMode: "term",
    isFlipped: false,
    learnQueue: [],
    learnIndex: 0,
    testQuestions: [],
    testAnswers: [],
    currentTestIndex: 0,
    cramQuestions: [],
    cramAnswers: [],
    currentCramIndex: 0,
    cramStartTime: null,
    cramEndTime: null,

    init() {
        this.loadDecks();
        this.renderDecks();
        this.setupKeyboardShortcuts();
    },

    loadDecks() {
        const saved = localStorage.getItem("flashcard_decks");
        if (saved) {
            this.decks = JSON.parse(saved);
        }
    },

    saveDecks() {
        localStorage.setItem("flashcard_decks", JSON.stringify(this.decks));
    },

    generateId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    },

    switchView(viewId) {
        document
            .querySelectorAll(".view")
            .forEach((v) => v.classList.remove("active"));
        document.getElementById(viewId).classList.add("active");
    },

    renderDecks() {
        const container = document.getElementById("decksList");
        if (this.decks.length === 0) {
            container.innerHTML = `
            <div class="text-center" style="color: #6b7280; padding: 60px; grid-column: 1/-1;">
                <i class="fas fa-inbox" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.8;"></i>
                <h2 style="margin-bottom: 10px;">No decks yet!</h2>
                <p style="font-size: 1.1rem;">Create your first deck to get started.</p>
            </div>
        `;
            return;
        }

        container.innerHTML = this.decks
            .map(
                (deck) => `
            <div class="deck-card">
                <h3><i class="fas fa-layer-group" style="color: #4255ff; margin-right: 10px;"></i>${this.escapeHtml(
                    deck.title
                )}</h3>
                <p>${this.escapeHtml(deck.description) || "No description"}</p>
                <div class="deck-card-footer">
                    <span class="card-count"><i class="fas fa-clone"></i> ${
                        deck.cards.length
                    } cards</span>
                    <div class="deck-actions">
                        <button class="icon-btn" onclick="app.editDeck('${
                            deck.id
                        }')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn" onclick="app.exportDeck('${
                            deck.id
                        }')" title="Export">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="icon-btn" onclick="app.deleteDeck('${
                            deck.id
                        }')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="deck-study-modes mt-2">
                    <button class="btn btn-secondary btn-small" onclick="app.startFlashcards('${
                        deck.id
                    }')">
                        <i class="fas fa-clone"></i> Flashcards
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="app.startLearn('${
                        deck.id
                    }')">
                        <i class="fas fa-graduation-cap"></i> Learn
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="app.startTest('${
                        deck.id
                    }')">
                        <i class="fas fa-file-alt"></i> Test
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="app.startCram('${
                        deck.id
                    }')">
                        <i class="fas fa-bolt"></i> Cram
                    </button>
                </div>
            </div>
        `
            )
            .join("");
    },

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    },

    createNewDeck() {
        this.editingDeck = {
            id: this.generateId(),
            title: "New Deck",
            description: "",
            cards: [],
        };
        this.renderEditView();
        this.switchView("editView");
    },

    editDeck(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (deck) {
            this.editingDeck = JSON.parse(JSON.stringify(deck));
            this.renderEditView();
            this.switchView("editView");
        }
    },

    renderEditView() {
        document.getElementById("deckTitle").value = this.editingDeck.title;
        document.getElementById("deckDescription").value =
            this.editingDeck.description;
        this.renderCards();
    },

    renderCards() {
        const container = document.getElementById("cardsList");
        if (this.editingDeck.cards.length === 0) {
            container.innerHTML =
                '<p style="text-align: center; color: #718096; padding: 30px;"><i class="fas fa-info-circle"></i> No cards yet. Add your first card!</p>';
            return;
        }

        container.innerHTML = this.editingDeck.cards
            .map(
                (card, i) => `
            <div class="card-item">
                <div class="card-item-header">
                    <strong><i class="fas fa-hashtag"></i> Card ${
                        i + 1
                    }</strong>
                    <button class="icon-btn" onclick="app.removeCard(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <input type="text" placeholder="Term" value="${this.escapeHtml(
                    card.term
                )}" onchange="app.updateCard(${i}, 'term', this.value)">
                <input type="text" placeholder="Definition" value="${this.escapeHtml(
                    card.definition
                )}" onchange="app.updateCard(${i}, 'definition', this.value)">
            </div>
        `
            )
            .join("");
    },

    addCard() {
        this.editingDeck.cards.push({
            term: "",
            definition: "",
            correctCount: 0,
            starred: false,
        });
        this.renderCards();
    },

    updateCard(index, field, value) {
        this.editingDeck.cards[index][field] = value;
    },

    removeCard(index) {
        if (confirm("Delete this card?")) {
            this.editingDeck.cards.splice(index, 1);
            this.renderCards();
        }
    },

    saveDeck() {
        this.editingDeck.title =
            document.getElementById("deckTitle").value || "Untitled Deck";
        this.editingDeck.description =
            document.getElementById("deckDescription").value;

        const existingIndex = this.decks.findIndex(
            (d) => d.id === this.editingDeck.id
        );
        if (existingIndex !== -1) {
            this.decks[existingIndex] = this.editingDeck;
        } else {
            this.decks.push(this.editingDeck);
        }

        this.saveDecks();
        alert("Deck saved successfully!");
        this.backToHome();
    },

    deleteDeck(id) {
        if (confirm("Are you sure you want to delete this deck?")) {
            this.decks = this.decks.filter((d) => d.id !== id);
            this.saveDecks();
            this.renderDecks();
        }
    },

    exportDeck(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (deck) {
            let csvContent = "Term,Definition\n";
            deck.cards.forEach((card) => {
                const term = '"' + card.term.replace(/"/g, '""') + '"';
                const definition =
                    '"' + card.definition.replace(/"/g, '""') + '"';
                csvContent += term + "," + definition + "\n";
            });

            const blob = new Blob([csvContent], {
                type: "text/csv",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${deck.title}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    },

    exportCurrentDeck() {
        let csvContent = "Term,Definition\n";
        this.editingDeck.cards.forEach((card) => {
            const term = '"' + card.term.replace(/"/g, '""') + '"';
            const definition = '"' + card.definition.replace(/"/g, '""') + '"';
            csvContent += term + "," + definition + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.editingDeck.title}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importDeck() {
        document.getElementById("fileInput").click();
    },

    handleFileImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split("\n").filter((line) => line.trim());

                    if (lines.length < 2) {
                        alert(
                            "CSV file must have at least a header row and one data row."
                        );
                        return;
                    }

                    const cards = [];
                    for (let i = 1; i < lines.length; i++) {
                        const matches = lines[i].match(
                            /("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*)/
                        );
                        if (matches && matches.length >= 3) {
                            const term = matches[1]
                                .replace(/^"|"$/g, "")
                                .replace(/""/g, '"')
                                .trim();
                            const definition = matches[2]
                                .replace(/^"|"$/g, "")
                                .replace(/""/g, '"')
                                .trim();

                            if (term && definition) {
                                cards.push({
                                    term: term,
                                    definition: definition,
                                    correctCount: 0,
                                    starred: false,
                                });
                            }
                        }
                    }

                    if (cards.length === 0) {
                        alert("No valid cards found in CSV file.");
                        return;
                    }

                    const deckName = file.name.replace(".csv", "");
                    const newDeck = {
                        id: this.generateId(),
                        title: deckName,
                        description: "Imported from CSV",
                        cards: cards,
                    };

                    this.decks.push(newDeck);
                    this.saveDecks();
                    this.renderDecks();
                    alert(
                        `Deck imported successfully! ${cards.length} cards added.`
                    );
                } catch (err) {
                    alert("Error importing CSV file. Please check the format.");
                    console.error(err);
                }
            };
            reader.readAsText(file);
        }
        event.target.value = "";
    },

    startFlashcards(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (!deck || deck.cards.length === 0) {
            alert("This deck has no cards!");
            return;
        }

        this.currentDeck = JSON.parse(JSON.stringify(deck));
        this.flashcardIndex = 0;
        this.isFlipped = false;
        this.switchView("flashcardView");
        this.renderFlashcard();
    },

    setFlashcardMode(mode) {
        this.flashcardMode = mode;
        document
            .getElementById("termFirstBtn")
            .classList.toggle("active", mode === "term");
        document
            .getElementById("defFirstBtn")
            .classList.toggle("active", mode === "definition");
        this.isFlipped = false;
        document.getElementById("flashcard").classList.remove("flipped");
        this.renderFlashcard();
    },

    renderFlashcard() {
        const card = this.currentDeck.cards[this.flashcardIndex];
        const front =
            this.flashcardMode === "term" ? card.term : card.definition;
        const back =
            this.flashcardMode === "term" ? card.definition : card.term;

        document.getElementById("flashcardFront").textContent = front;
        document.getElementById("flashcardBack").textContent = back;
        document.getElementById("flashcardProgress").textContent = `${
            this.flashcardIndex + 1
        } / ${this.currentDeck.cards.length}`;
    },

    flipCard() {
        this.isFlipped = !this.isFlipped;
        document.getElementById("flashcard").classList.toggle("flipped");
    },

    markCard(known) {
        if (known) {
            this.currentDeck.cards[this.flashcardIndex].correctCount++;
        }

        this.flashcardIndex++;
        if (this.flashcardIndex >= this.currentDeck.cards.length) {
            alert("You have completed all cards!");
            this.backToHome();
            return;
        }

        this.isFlipped = false;
        document.getElementById("flashcard").classList.remove("flipped");
        this.renderFlashcard();
    },

    shuffleFlashcards() {
        for (let i = this.currentDeck.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.currentDeck.cards[i];
            this.currentDeck.cards[i] = this.currentDeck.cards[j];
            this.currentDeck.cards[j] = temp;
        }
        this.flashcardIndex = 0;
        this.isFlipped = false;
        document.getElementById("flashcard").classList.remove("flipped");
        this.renderFlashcard();
    },

    startLearn(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (!deck || deck.cards.length === 0) {
            alert("This deck has no cards!");
            return;
        }

        this.currentDeck = JSON.parse(JSON.stringify(deck));
        this.generateLearnQuestions();
        this.learnIndex = 0;
        this.switchView("learnView");
        this.renderLearnCard();
    },

    generateLearnQuestions() {
        this.learnQueue = [];

        // Create a copy of cards and shuffle them
        const shuffledCards = [...this.currentDeck.cards].sort(
            () => Math.random() - 0.5
        );

        // Generate multiple choice questions for each card
        shuffledCards.forEach((card, index) => {
            this.learnQueue.push({
                term: card.term,
                correctAnswer: card.definition,
                options: this.generateMCQOptions(card.definition, card.term),
                answered: false,
                correct: false,
            });
        });
    },

    generateMCQOptions(correctAnswer, correctTerm) {
        // Get 3 random distractors from other cards
        const distractors = this.currentDeck.cards
            .filter((card) => card.definition !== correctAnswer)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((card) => card.definition);

        // Combine correct answer with distractors and shuffle
        const options = [correctAnswer, ...distractors].sort(
            () => Math.random() - 0.5
        );
        return options;
    },

    renderLearnCard() {
        if (this.learnIndex >= this.learnQueue.length) {
            this.showLearnResults();
            return;
        }

        const question = this.learnQueue[this.learnIndex];
        const progress = (this.learnIndex / this.learnQueue.length) * 100;

        document.getElementById("learnProgress").style.width = progress + "%";
        document.getElementById(
            "learnProgressText"
        ).textContent = `${this.learnIndex} of ${this.learnQueue.length} answered`;

        const container = document.getElementById("learnContent");
        container.innerHTML = `
            <div class="learn-card">
                <div class="learn-term">${this.escapeHtml(question.term)}</div>
                <div class="test-options">
                    ${question.options
                        .map(
                            (option, i) => `
                        <div class="test-option" onclick="app.selectLearnOption(${i})">
                            ${this.escapeHtml(option)}
                        </div>
                    `
                        )
                        .join("")}
                </div>
                <button class="btn btn-primary mt-2" onclick="app.submitLearnAnswer()">
                    <i class="fas fa-check"></i> Submit Answer
                </button>
            </div>
        `;
    },

    selectLearnOption(index) {
        document.querySelectorAll(".test-option").forEach((opt, i) => {
            opt.classList.toggle("selected", i === index);
        });
    },

    submitLearnAnswer() {
        const selected = document.querySelector(".test-option.selected");
        if (!selected) {
            alert("Please select an answer!");
            return;
        }

        const question = this.learnQueue[this.learnIndex];
        const userAnswer = selected.textContent.trim();
        const isCorrect = userAnswer === question.correctAnswer;

        question.answered = true;
        question.correct = isCorrect;

        // Show feedback
        document.querySelectorAll(".test-option").forEach((opt) => {
            if (opt.textContent.trim() === question.correctAnswer) {
                opt.classList.add("correct");
            } else if (opt.classList.contains("selected") && !isCorrect) {
                opt.classList.add("incorrect");
            }
        });

        // Auto-advance after showing feedback
        setTimeout(
            () => {
                this.learnIndex++;
                this.renderLearnCard();
            },
            isCorrect ? 1000 : 2000
        );
    },

    showLearnResults() {
        const correctCount = this.learnQueue.filter((q) => q.correct).length;
        const percentage = Math.round(
            (correctCount / this.learnQueue.length) * 100
        );

        const container = document.getElementById("learnContent");
        container.innerHTML = `
            <div class="test-results">
                <i class="fas fa-award" style="font-size: 4rem; color: #ffcd1f; margin-bottom: 10px;"></i>
                <h2>Study Session Complete!</h2>
                <div class="test-score">${percentage}%</div>
                <p style="font-size: 1.2rem; margin-bottom: 30px; color: #4a5568;">
                    You got ${correctCount} out of ${this.learnQueue.length} correct
                </p>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="app.startLearn('${this.currentDeck.id}')">
                        <i class="fas fa-redo"></i> Study Again
                    </button>
                    <button class="btn btn-secondary" onclick="app.backToHome()">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
            </div>
        `;
    },

    startTest(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (!deck || deck.cards.length === 0) {
            alert("This deck has no cards!");
            return;
        }

        if (deck.cards.length < 4) {
            alert("You need at least 4 cards to take a test!");
            return;
        }

        this.currentDeck = JSON.parse(JSON.stringify(deck));
        this.generateTestQuestions();
        this.currentTestIndex = 0;
        this.testAnswers = [];
        this.switchView("testView");
        this.renderTestQuestion();
    },

    generateTestQuestions() {
        this.testQuestions = [];
        const numQuestions = Math.min(10, this.currentDeck.cards.length);

        const shuffled = [...this.currentDeck.cards].sort(
            () => Math.random() - 0.5
        );

        for (let i = 0; i < numQuestions; i++) {
            const card = shuffled[i];
            const isMC = Math.random() > 0.4;

            if (isMC) {
                const distractors = this.currentDeck.cards
                    .filter((c) => c.term !== card.term)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((c) => c.definition);

                const options = [card.definition, ...distractors].sort(
                    () => Math.random() - 0.5
                );

                this.testQuestions.push({
                    type: "multiple-choice",
                    term: card.term,
                    correctAnswer: card.definition,
                    options: options,
                });
            } else {
                this.testQuestions.push({
                    type: "fill-in",
                    term: card.term,
                    correctAnswer: card.definition,
                });
            }
        }
    },

    renderTestQuestion() {
        const container = document.getElementById("testContent");

        if (this.currentTestIndex >= this.testQuestions.length) {
            this.showTestResults();
            return;
        }

        const question = this.testQuestions[this.currentTestIndex];
        const questionNum = this.currentTestIndex + 1;

        if (question.type === "multiple-choice") {
            container.innerHTML = `
            <div class="test-question">
                <div class="progress-text mb-2"><i class="fas fa-clipboard-list"></i> Question ${questionNum} of ${
                this.testQuestions.length
            }</div>
                <div class="question-text">${this.escapeHtml(
                    question.term
                )}</div>
                <div class="test-options">
                    ${question.options
                        .map(
                            (opt, i) => `
                        <div class="test-option" onclick="app.selectTestOption(${i})">
                            ${this.escapeHtml(opt)}
                        </div>
                    `
                        )
                        .join("")}
                </div>
                <button class="btn btn-primary mt-2" onclick="app.submitTestAnswer()">
                    <i class="fas fa-paper-plane"></i> Submit Answer
                </button>
            </div>
        `;
        } else {
            container.innerHTML = `
            <div class="test-question">
                <div class="progress-text mb-2"><i class="fas fa-clipboard-list"></i> Question ${questionNum} of ${
                this.testQuestions.length
            }</div>
                <div class="question-text">${this.escapeHtml(
                    question.term
                )}</div>
                <input type="text" class="learn-input" id="testInput" placeholder="Type your answer...">
                <button class="btn btn-primary mt-2" onclick="app.submitTestAnswer()">
                    <i class="fas fa-paper-plane"></i> Submit Answer
                </button>
            </div>
        `;
        }
    },

    selectTestOption(index) {
        document.querySelectorAll(".test-option").forEach((opt, i) => {
            opt.classList.toggle("selected", i === index);
        });
    },

    submitTestAnswer() {
        const question = this.testQuestions[this.currentTestIndex];
        let userAnswer = null;
        let isCorrect = false;

        if (question.type === "multiple-choice") {
            const selected = document.querySelector(".test-option.selected");
            if (!selected) {
                alert("Please select an answer!");
                return;
            }
            userAnswer = selected.textContent.trim();
            isCorrect = userAnswer === question.correctAnswer;

            document.querySelectorAll(".test-option").forEach((opt) => {
                if (opt.textContent.trim() === question.correctAnswer) {
                    opt.classList.add("correct");
                } else if (opt.classList.contains("selected") && !isCorrect) {
                    opt.classList.add("incorrect");
                }
            });
        } else {
            userAnswer = document.getElementById("testInput").value.trim();
            if (!userAnswer) {
                alert("Please enter an answer!");
                return;
            }
            isCorrect =
                userAnswer.toLowerCase() ===
                question.correctAnswer.toLowerCase();

            const feedback = document.createElement("div");
            feedback.className =
                "learn-feedback " + (isCorrect ? "correct" : "incorrect");
            feedback.innerHTML = isCorrect
                ? '<i class="fas fa-check-circle"></i> Correct!'
                : `<i class="fas fa-times-circle"></i> Incorrect. The correct answer is: <strong>${this.escapeHtml(
                      question.correctAnswer
                  )}</strong>`;
            document.querySelector(".test-question").appendChild(feedback);
        }

        this.testAnswers.push({
            question: question.term,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
        });

        setTimeout(() => {
            this.currentTestIndex++;
            this.renderTestQuestion();
        }, 1500);
    },

    showTestResults() {
        const correctCount = this.testAnswers.filter((a) => a.isCorrect).length;
        const percentage = Math.round(
            (correctCount / this.testAnswers.length) * 100
        );

        const container = document.getElementById("testContent");
        container.innerHTML = `
        <div class="test-results">
            <i class="fas fa-award" style="font-size: 4rem; color: #f59e0b; margin-bottom: 10px;"></i>
            <h2>Test Complete!</h2>
            <div class="test-score">${percentage}%</div>
            <p style="font-size: 1.2rem; margin-bottom: 30px; color: #4a5568;">
                You got ${correctCount} out of ${
            this.testAnswers.length
        } correct
            </p>
            <div style="text-align: left; max-width: 700px; margin: 0 auto;">
                <h3 style="margin-bottom: 20px; color: #1a202c;"><i class="fas fa-list-check"></i> Review:</h3>
                ${this.testAnswers
                    .map(
                        (answer, i) => `
                    <div style="padding: 20px; background: ${
                        answer.isCorrect ? "#d4edda" : "#f8d7da"
                    }; 
                         border-radius: 12px; margin-bottom: 16px; border: 2px solid ${
                             answer.isCorrect ? "#28a745" : "#dc3545"
                         };">
                        <div style="font-weight: 700; margin-bottom: 10px; color: #1a202c;">
                            <i class="fas fa-${
                                answer.isCorrect ? "check" : "times"
                            }-circle"></i> ${i + 1}. ${this.escapeHtml(
                            answer.question
                        )}
                        </div>
                        <div style="color: #4a5568;"><strong>Your answer:</strong> ${this.escapeHtml(
                            answer.userAnswer
                        )}</div>
                        ${
                            !answer.isCorrect
                                ? `<div style="color: #4a5568;"><strong>Correct answer:</strong> ${this.escapeHtml(
                                      answer.correctAnswer
                                  )}</div>`
                                : ""
                        }
                    </div>
                `
                    )
                    .join("")}
            </div>
            <button class="btn btn-primary mt-2" onclick="app.backToHome()">
                <i class="fas fa-home"></i> Back to Home
            </button>
        </div>
    `;
    },

    startCram(id) {
        const deck = this.decks.find((d) => d.id === id);
        if (!deck || deck.cards.length === 0) {
            alert("This deck has no cards!");
            return;
        }

        if (deck.cards.length < 4) {
            alert("You need at least 4 cards to use Cram mode!");
            return;
        }

        this.currentDeck = JSON.parse(JSON.stringify(deck));
        this.generateCramQuestions();
        this.currentCramIndex = 0;
        this.cramAnswers = [];
        this.cramStartTime = Date.now();
        this.switchView("cramView");
        this.renderCramCard();
    },

    generateCramQuestions() {
        this.cramQuestions = [];

        // Create a copy of cards and shuffle them
        const shuffledCards = [...this.currentDeck.cards].sort(
            () => Math.random() - 0.5
        );

        // Generate multiple choice questions for each card
        shuffledCards.forEach((card) => {
            this.cramQuestions.push({
                term: card.term,
                correctAnswer: card.definition,
                options: this.generateMCQOptions(card.definition, card.term),
                answered: false,
                correct: false,
            });
        });
    },

    renderCramCard() {
        if (this.currentCramIndex >= this.cramQuestions.length) {
            this.showCramResults();
            return;
        }

        const question = this.cramQuestions[this.currentCramIndex];
        const progress =
            (this.currentCramIndex / this.cramQuestions.length) * 100;

        document.getElementById("cramProgress").style.width = progress + "%";

        // Update timer
        const elapsed = Math.floor((Date.now() - this.cramStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById("cramTimer").textContent = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;

        const container = document.getElementById("cramContent");
        container.innerHTML = `
            <div class="cram-card">
                <div class="cram-stats">
                    <div>${this.currentCramIndex + 1} of ${
            this.cramQuestions.length
        }</div>
                    <div class="cram-timer" id="cramTimer">${minutes}:${seconds
            .toString()
            .padStart(2, "0")}</div>
                </div>
                <div class="learn-term">${this.escapeHtml(question.term)}</div>
                <div class="test-options">
                    ${question.options
                        .map(
                            (option, i) => `
                        <div class="test-option" onclick="app.selectCramOption(${i})">
                            ${this.escapeHtml(option)}
                        </div>
                    `
                        )
                        .join("")}
                </div>
            </div>
        `;
    },

    selectCramOption(index) {
        document.querySelectorAll(".test-option").forEach((opt, i) => {
            opt.classList.toggle("selected", i === index);
        });

        // Auto-submit in cram mode
        setTimeout(() => {
            this.submitCramAnswer();
        }, 100);
    },

    submitCramAnswer() {
        const selected = document.querySelector(".test-option.selected");
        if (!selected) {
            // If no option selected, pick a random one to continue
            const options = document.querySelectorAll(".test-option");
            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].classList.add("selected");
                selected = options[randomIndex];
            }
        }

        const question = this.cramQuestions[this.currentCramIndex];
        const userAnswer = selected ? selected.textContent.trim() : "";
        const isCorrect = userAnswer === question.correctAnswer;

        question.answered = true;
        question.correct = isCorrect;
        this.cramAnswers.push({
            question: question.term,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
        });

        // Show brief feedback
        document.querySelectorAll(".test-option").forEach((opt) => {
            if (opt.textContent.trim() === question.correctAnswer) {
                opt.classList.add("correct");
            } else if (opt.classList.contains("selected") && !isCorrect) {
                opt.classList.add("incorrect");
            }
        });

        // Auto-advance quickly (0.5 seconds)
        setTimeout(() => {
            this.currentCramIndex++;
            this.renderCramCard();
        }, 500);
    },

    showCramResults() {
        this.cramEndTime = Date.now();
        const totalTime = Math.floor(
            (this.cramEndTime - this.cramStartTime) / 1000
        );
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        const correctCount = this.cramAnswers.filter((a) => a.isCorrect).length;
        const percentage = Math.round(
            (correctCount / this.cramAnswers.length) * 100
        );
        const cardsPerMinute = Math.round(
            (this.cramAnswers.length / totalTime) * 60
        );

        const container = document.getElementById("cramContent");
        container.innerHTML = `
            <div class="cram-results">
                <i class="fas fa-bolt" style="font-size: 4rem; color: #ffcd1f; margin-bottom: 10px;"></i>
                <h2>Cram Session Complete!</h2>
                <div class="cram-stats-final">
                    <div class="stat-item">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${minutes}:${seconds
            .toString()
            .padStart(2, "0")}</div>
                        <div class="stat-label">Time</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${cardsPerMinute}</div>
                        <div class="stat-label">Cards/Min</div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="app.startCram('${
                        this.currentDeck.id
                    }')">
                        <i class="fas fa-redo"></i> Cram Again
                    </button>
                    <button class="btn btn-secondary" onclick="app.backToHome()">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
            </div>
        `;
    },

    setupKeyboardShortcuts() {
        document.addEventListener("keydown", (e) => {
            // Only handle shortcuts when not in input fields
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            switch (e.key) {
                case " ":
                    e.preventDefault();
                    if (
                        document
                            .getElementById("flashcardView")
                            .classList.contains("active")
                    ) {
                        this.flipCard();
                    }
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                    const optionIndex = parseInt(e.key) - 1;
                    if (
                        document
                            .getElementById("learnView")
                            .classList.contains("active")
                    ) {
                        const options = document.querySelectorAll(
                            "#learnContent .test-option"
                        );
                        if (options[optionIndex]) {
                            this.selectLearnOption(optionIndex);
                            this.submitLearnAnswer();
                        }
                    } else if (
                        document
                            .getElementById("testView")
                            .classList.contains("active")
                    ) {
                        const options = document.querySelectorAll(
                            "#testContent .test-option"
                        );
                        if (options[optionIndex]) {
                            this.selectTestOption(optionIndex);
                            this.submitTestAnswer();
                        }
                    } else if (
                        document
                            .getElementById("cramView")
                            .classList.contains("active")
                    ) {
                        const options = document.querySelectorAll(
                            "#cramContent .test-option"
                        );
                        if (options[optionIndex]) {
                            this.selectCramOption(optionIndex);
                        }
                    }
                    break;
                case "Enter":
                    if (
                        document
                            .getElementById("learnView")
                            .classList.contains("active")
                    ) {
                        this.submitLearnAnswer();
                    } else if (
                        document
                            .getElementById("testView")
                            .classList.contains("active")
                    ) {
                        this.submitTestAnswer();
                    }
                    break;
            }
        });
    },

    backToHome() {
        this.switchView("homeView");
        this.renderDecks();
    },
};

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});
