import { useEffect, useState } from "react";

import NotesInput from "./components/NotesInput";
import Summary from "./components/Summary";

import {
    generateSummary,
    generateQuiz,
    askQuestion,
    uploadPDF,
    saveNotes,
    updateSession,
    getSessions,
    deleteSession,
    saveQuizAttempt,
} from "./services/api";

function App() {

    const [notes, setNotes] = useState("");
    const [summary, setSummary] = useState("");
    const [quiz, setQuiz] = useState(null);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    const [pdfLoading, setPdfLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [sessions, setSessions] = useState([]);

    const [editingSessionId, setEditingSessionId] =
        useState(null);

    const [quizAttempts, setQuizAttempts] =
        useState([]);

    const [expandedAttempt, setExpandedAttempt] =
        useState(null);

        const [activePage, setActivePage] = useState("home");

    useEffect(() => {

        const loadSessions = async () => {

            try {

                const data = await getSessions();

                setSessions(data.sessions);

            } catch (error) {

                console.error(error);

            }
        };

        loadSessions();

    }, []);


    const handleGenerateSummary = async () => {

        if (!notes.trim()) {

            alert("Please enter your notes first.");

            return;
        }

        try {

            setLoading(true);

            const data =
                await generateSummary(notes);

            setSummary(data.summary);

        } catch (error) {

            console.error(error);

            alert("Failed to generate summary.");

        } finally {

            setLoading(false);

        }
    };


    const handleGenerateQuiz = async () => {

        if (!notes.trim()) {

            alert("Please enter your notes first.");

            return;
        }

        try {

            setQuizLoading(true);

            /*
             * Collect all questions from previous
             * completed quiz attempts.
             */
            const previousQuestions =
                quizAttempts.flatMap(
                    (attempt) =>
                        attempt.quiz?.questions?.map(
                            (question) =>
                                question.question
                        ) || []
                );

            const data = await generateQuiz(
                notes,
                previousQuestions
            );

            setQuiz(data.quiz);

            setCurrentQuestion(0);

            setSelectedAnswer(null);

            setScore(0);

            setQuizFinished(false);

        } catch (error) {

            console.error(error);

            alert("Failed to generate quiz.");

        } finally {

            setQuizLoading(false);

        }
    };


    const handleAskQuestion = async () => {

        if (!notes.trim()) {

            alert("Please enter your notes first.");

            return;
        }

        if (!question.trim()) {

            alert("Please enter a question.");

            return;
        }

        try {

            setChatLoading(true);

            const data = await askQuestion(
                notes,
                question
            );

            setAnswer(data.answer);

            setChatHistory((prev) => [
                ...prev,
                {
                    question,
                    answer: data.answer
                }
            ]);

            setQuestion("");

        } catch (error) {

            console.error(error);

            alert("Failed to get answer.");

        } finally {

            setChatLoading(false);

        }
    };


    const handlePDFUpload = async (file) => {

        if (!file) {

            return;
        }

        if (
            file.type !== "application/pdf" &&
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            alert("Please upload a PDF file.");

            return;
        }

        try {

            setPdfLoading(true);

            const data = await uploadPDF(file);

            setNotes(data.text);

            setSummary("");

            setQuiz(null);

            setAnswer("");

            setChatHistory([]);

            setCurrentQuestion(0);

            setSelectedAnswer(null);

            setScore(0);

            setQuizFinished(false);

            setQuizAttempts([]);

            setExpandedAttempt(null);

        } catch (error) {

            console.error(error);

            alert("Failed to process PDF.");

        } finally {

            setPdfLoading(false);

        }
    };


    const handleSaveSession = async () => {

        if (!notes.trim()) {

            alert(
                "Please enter or upload your notes first."
            );

            return;
        }

        try {

            const sessionTitle =
                title.trim() ||
                "My Study Session";

            if (editingSessionId) {

                await updateSession(
                    editingSessionId,
                    sessionTitle,
                    notes,
                    summary,
                    quiz,
                    chatHistory
                );

                alert(
                    "Study session updated successfully!"
                );

            } else {

                await saveNotes(
                    sessionTitle,
                    notes,
                    summary,
                    quiz,
                    quizAttempts,
                    chatHistory
                );

                alert(
                    "Study session saved successfully!"
                );
            }

            const data = await getSessions();

            setSessions(data.sessions);

        } catch (error) {

            console.error(error);

            alert(
                editingSessionId
                    ? "Failed to update study session."
                    : "Failed to save study session."
            );
        }
    };


    const handleOpenSession = (session) => {

        setEditingSessionId(session._id);

        setTitle(session.title);

        setNotes(session.notes);

        setSummary(session.summary || "");

        setQuiz(session.quiz || null);

        setQuizAttempts(
            session.quizAttempts || []
        );

        setChatHistory(
            session.chatHistory || []
        );

        setQuestion("");

        setAnswer("");

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setScore(0);

        setQuizFinished(false);

        setExpandedAttempt(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const handleDeleteSession = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this study session?"
            );

        if (!confirmed) {

            return;
        }

        try {

            await deleteSession(id);

            const data = await getSessions();

            setSessions(data.sessions);

            if (editingSessionId === id) {

                setEditingSessionId(null);

                setTitle("");

                setNotes("");

                setSummary("");

                setQuiz(null);

                setQuizAttempts([]);

                setChatHistory([]);

                setQuestion("");

                setAnswer("");

                setExpandedAttempt(null);
            }

            alert(
                "Study session deleted successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete study session."
            );
        }
    };


    const handleAnswer = (index) => {

        if (selectedAnswer !== null) {

            return;
        }

        setSelectedAnswer(index);

        if (
            index ===
            quiz.questions[currentQuestion]
                .correctAnswer
        ) {

            setScore((prev) => prev + 1);
        }
    };


    const handleNextQuestion = async () => {

        if (
            currentQuestion ===
            quiz.questions.length - 1
        ) {

            const isLastAnswerCorrect =
                selectedAnswer ===
                quiz.questions[currentQuestion]
                    .correctAnswer;

            const finalScore =
                score +
                (isLastAnswerCorrect ? 1 : 0);

            setScore(finalScore);

            setQuizFinished(true);

            /*
             * Save the complete quiz along with
             * score and attempt information.
             */
            if (editingSessionId) {

                try {

                    const data =
                        await saveQuizAttempt(
                            editingSessionId,
                            quiz,
                            finalScore,
                            quiz.questions.length
                        );

                    setQuizAttempts(
                        data.quizAttempts
                    );

                    setExpandedAttempt(null);

                    const sessionsData =
                        await getSessions();

                    setSessions(
                        sessionsData.sessions
                    );

                } catch (error) {

                    console.error(
                        "QUIZ ATTEMPT SAVE ERROR:",
                        error
                    );
                }
            }

            return;
        }

        setCurrentQuestion(
            (prev) => prev + 1
        );

        setSelectedAnswer(null);
    };


    const handleRestartQuiz = () => {

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setScore(0);

        setQuizFinished(false);
    };


    const toggleQuizHistory = (index) => {

        if (expandedAttempt === index) {

            setExpandedAttempt(null);

        } else {

            setExpandedAttempt(index);
        }
    };


    const formatAIText = (text) => {

        if (!text) {

            return "";
        }

        return text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/__(.*?)__/g, "$1")
            .replace(/^#{1,6}\s*/gm, "")
            .replace(/^[-*]\s*/gm, "")
            .replace(/`/g, "")
            .replace(/\|/g, " ")
            .replace(/-{3,}/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
    };


    const renderAIAnswer = (text) => {

        if (!text) {

            return null;
        }

        return text
            .split("\n")
            .map((line, index) => {

                const cleaned =
                    formatAIText(line);

                if (!cleaned) {

                    return null;
                }

                const isHeading =
                    line.includes("**") ||
                    /^#{1,6}\s/.test(line) ||
                    (
                        cleaned.length < 60 &&
                        !cleaned.endsWith(".")
                    );

                return isHeading ? (
                    <h5 key={index}>
                        {cleaned}
                    </h5>
                ) : (
                    <p key={index}>
                        {cleaned}
                    </p>
                );
            });
    };


    const currentQuizQuestion =
        quiz?.questions?.[currentQuestion];


    return (

        <div className="app">

            <header className="navbar">

                <h1>StudyBuddy</h1>

                <p>
                    Your Personal AI Study Partner
                </p>

            </header>


            <main className="container">

                <section className="hero">

                    <h2>
                        Study Smarter with AI
                    </h2>

                    <p>
                        Turn your notes into
                        summaries, quizzes and
                        interactive learning.
                    </p>

                </section>


                <div className="title-input">

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter a title for your study session..."
                    />

                </div>


                <NotesInput
                    notes={notes}
                    setNotes={setNotes}
                    onPDFUpload={handlePDFUpload}
                    pdfLoading={pdfLoading}
                />


                <div className="action-buttons">

                    <button
                        onClick={
                            handleGenerateSummary
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Summary"}
                    </button>


                    <button
                        onClick={
                            handleGenerateQuiz
                        }
                        disabled={quizLoading}
                    >
                        {quizLoading
                            ? "Generating..."
                            : "Generate Quiz"}
                    </button>


                    <button
                        onClick={
                            handleSaveSession
                        }
                    >
                        {editingSessionId
                            ? "Update Study Session"
                            : "Save Study Session"}
                    </button>

                </div>


                <Summary
                    summary={summary}
                />


                <section className="chat-card">

                    <h3>
                        Ask AI About Your Notes
                    </h3>

                    <p className="chat-description">
                        Ask anything from your
                        study notes and get an
                        AI-powered answer.
                    </p>


                    <textarea
                        value={question}
                        onChange={(e) =>
                            setQuestion(
                                e.target.value
                            )
                        }
                        placeholder="e.g. What is the difference between useState and useEffect?"
                    />


                    <button
                        className="ask-button"
                        onClick={
                            handleAskQuestion
                        }
                        disabled={chatLoading}
                    >
                        {chatLoading
                            ? "Thinking..."
                            : "Ask AI"}
                    </button>


                    {chatHistory.length > 0 && (

                        <div className="chat-history">

                            {chatHistory.map(
                                (chat, index) => (

                                    <div
                                        className="chat-item"
                                        key={index}
                                    >

                                        <div className="question-box">

                                            <p>
                                                {
                                                    chat.question
                                                }
                                            </p>

                                        </div>


                                        <div className="answer-box">

                                            <h4>
                                                AI Answer
                                            </h4>

                                            <div className="answer-content">

                                                {renderAIAnswer(
                                                    chat.answer
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>


                {quiz &&
                    !quizFinished &&
                    currentQuizQuestion && (

                    <section className="quiz-card">

                        <div className="quiz-header">

                            <h3>
                                AI Quiz
                            </h3>

                            <span>
                                Question{" "}
                                {currentQuestion + 1}{" "}
                                /{" "}
                                {
                                    quiz.questions
                                        .length
                                }
                            </span>

                        </div>


                        <h4 className="question">

                            {
                                currentQuizQuestion
                                    .question
                            }

                        </h4>


                        <div className="options">

                            {currentQuizQuestion.options.map(
                                (
                                    option,
                                    index
                                ) => {

                                    let className =
                                        "option";

                                    if (
                                        selectedAnswer !==
                                        null
                                    ) {

                                        if (
                                            index ===
                                            currentQuizQuestion.correctAnswer
                                        ) {

                                            className +=
                                                " correct";

                                        } else if (
                                            index ===
                                            selectedAnswer
                                        ) {

                                            className +=
                                                " incorrect";
                                        }
                                    }

                                    return (

                                        <button
                                            key={index}
                                            className={
                                                className
                                            }
                                            onClick={() =>
                                                handleAnswer(
                                                    index
                                                )
                                            }
                                            disabled={
                                                selectedAnswer !==
                                                null
                                            }
                                        >

                                            <span>
                                                {String.fromCharCode(
                                                    65 +
                                                    index
                                                )}
                                            </span>

                                            {option}

                                        </button>
                                    );
                                }
                            )}

                        </div>


                        {selectedAnswer !==
                            null && (

                            <div className="quiz-feedback">

                                <p>

                                    {
                                        selectedAnswer ===
                                        currentQuizQuestion.correctAnswer
                                            ? "Correct!"
                                            : "Not quite!"
                                    }

                                </p>

                                <small>

                                    {formatAIText(
                                        currentQuizQuestion
                                            .explanation
                                    )}

                                </small>

                            </div>
                        )}


                        {selectedAnswer !==
                            null && (

                            <button
                                className="next-button"
                                onClick={
                                    handleNextQuestion
                                }
                            >

                                {currentQuestion ===
                                quiz.questions.length -
                                    1
                                    ? "Finish Quiz"
                                    : "Next Question"}

                            </button>
                        )}

                    </section>
                )}


                {quiz && quizFinished && (

                    <section className="quiz-card result-card">

                        <h3>
                            Quiz Completed!
                        </h3>


                        <div className="score">

                            {score} /{" "}
                            {quiz.questions.length}

                        </div>


                        <p>

                            {score ===
                            quiz.questions.length
                                ? "Perfect score! 🎉"
                                : score >=
                                  quiz.questions.length /
                                      2
                                    ? "Good job! Keep practicing."
                                    : "Keep studying and try again!"}

                        </p>


                        <button
                            className="next-button"
                            onClick={
                                handleRestartQuiz
                            }
                        >
                            Try Again
                        </button>

                    </section>
                )}


                {quizAttempts.length > 0 && (

                    <section className="quiz-history-card">

                        <h3>
                            Quiz History
                        </h3>


                        <div className="quiz-history-list">

                            {quizAttempts.map(
                                (
                                    attempt,
                                    index
                                ) => (

                                    <div
                                        className="quiz-attempt"
                                        key={index}
                                    >

                                        <div className="quiz-attempt-header">

                                            <div className="quiz-attempt-info">

                                                <span>
                                                    Attempt{" "}
                                                    {index + 1}
                                                </span>

                                                <strong>
                                                    {
                                                        attempt.score
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        attempt.total
                                                    }
                                                </strong>

                                                <small>
                                                    {new Date(
                                                        attempt.attemptedAt
                                                    ).toLocaleString()}
                                                </small>

                                            </div>


                                            {attempt.quiz && (

                                                <button
                                                    className="quiz-view-button"
                                                    onClick={() =>
                                                        toggleQuizHistory(
                                                            index
                                                        )
                                                    }
                                                >

                                                    {expandedAttempt ===
                                                    index
                                                        ? "Hide Quiz"
                                                        : "View Quiz"}

                                                </button>
                                            )}

                                        </div>


                                        {expandedAttempt ===
                                            index &&
                                            attempt.quiz && (

                                            <div className="quiz-history-details">

                                                {attempt.quiz.questions?.map(
                                                    (
                                                        oldQuestion,
                                                        questionIndex
                                                    ) => (

                                                        <div
                                                            className="quiz-history-question"
                                                            key={
                                                                questionIndex
                                                            }
                                                        >

                                                            <h4>

                                                                {questionIndex +
                                                                    1}
                                                                .{" "}

                                                                {
                                                                    oldQuestion.question
                                                                }

                                                            </h4>


                                                            <div className="quiz-history-options">

                                                                {oldQuestion.options?.map(
                                                                    (
                                                                        option,
                                                                        optionIndex
                                                                    ) => (

                                                                        <div
                                                                            className={
                                                                                "quiz-history-option" +
                                                                                (
                                                                                    optionIndex ===
                                                                                    oldQuestion.correctAnswer
                                                                                        ? " correct"
                                                                                        : ""
                                                                                )
                                                                            }
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                        >

                                                                            <span>

                                                                                {String.fromCharCode(
                                                                                    65 +
                                                                                    optionIndex
                                                                                )}
                                                                                .{" "}

                                                                            </span>

                                                                            {
                                                                                option
                                                                            }

                                                                            {optionIndex ===
                                                                                oldQuestion.correctAnswer && (
                                                                                <strong>
                                                                                    {" "}
                                                                                    ✓
                                                                                </strong>
                                                                            )}

                                                                        </div>
                                                                    )
                                                                )}

                                                            </div>


                                                            {oldQuestion.explanation && (

                                                                <p className="quiz-history-explanation">

                                                                    <strong>
                                                                        Explanation:
                                                                    </strong>{" "}

                                                                    {
                                                                        formatAIText(
                                                                            oldQuestion.explanation
                                                                        )
                                                                    }

                                                                </p>
                                                            )}

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}


                <section className="sessions-section">

                    <h3>
                        My Study Sessions
                    </h3>


                    {sessions.length === 0 ? (

                        <p className="empty-sessions">
                            No saved study sessions yet.
                        </p>

                    ) : (

                        <div className="sessions-list">

                            {sessions.map(
                                (session) => (

                                    <div
                                        className="session-card"
                                        key={
                                            session._id
                                        }
                                        onClick={() =>
                                            handleOpenSession(
                                                session
                                            )
                                        }
                                    >

                                        <h4>
                                            {
                                                session.title
                                            }
                                        </h4>


                                        <p>

                                            {session.notes.slice(
                                                0,
                                                120
                                            )}

                                            {session.notes
                                                .length >
                                            120
                                                ? "..."
                                                : ""}

                                        </p>


                                        <small>

                                            {new Date(
                                                session.createdAt
                                            ).toLocaleDateString()}

                                        </small>


                                        <div className="session-actions">

                                            <span className="open-session">

                                                Click to open →

                                            </span>


                                            <button
                                                className="delete-session"
                                                onClick={(
                                                    e
                                                ) => {

                                                    e.stopPropagation();

                                                    handleDeleteSession(
                                                        session._id
                                                    );

                                                }}
                                            >

                                                Delete

                                            </button>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default App;