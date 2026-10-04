const StudySession = require("../models/StudySession");

const createNotes = async (req, res) => {
    try {
        const {
            title,
            notes,
            summary,
            quiz,
            quizAttempts,
            chatHistory
        } = req.body;

        if (!title || !notes) {
            return res.status(400).json({
                message: "Title and notes are required"
            });
        }

        const session = await StudySession.create({
            title,
            notes,
            summary: summary || "",
            quiz: quiz || null,
            quizAttempts: quizAttempts || [],
            chatHistory: chatHistory || []
        });

        res.status(201).json({
            message: "Study session saved successfully",
            session
        });

    } catch (error) {
        console.error("SAVE SESSION ERROR:", error);

        res.status(500).json({
            message: "Failed to save study session",
            error: error.message
        });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await StudySession
            .find()
            .sort({ createdAt: -1 });

        res.json({
            sessions
        });

    } catch (error) {
        console.error("GET SESSIONS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch study sessions",
            error: error.message
        });
    }
};

const updateSession = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            notes,
            summary,
            quiz,
            chatHistory
        } = req.body;

        if (!title || !notes) {
            return res.status(400).json({
                message: "Title and notes are required"
            });
        }

        const session = await StudySession.findByIdAndUpdate(
            id,
            {
                title,
                notes,
                summary: summary || "",
                quiz: quiz || null,
                chatHistory: chatHistory || []
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!session) {
            return res.status(404).json({
                message: "Study session not found"
            });
        }

        res.json({
            message: "Study session updated successfully",
            session
        });

    } catch (error) {
        console.error("UPDATE SESSION ERROR:", error);

        res.status(500).json({
            message: "Failed to update study session",
            error: error.message
        });
    }
};

const addQuizAttempt = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            quiz,
            score,
            total
        } = req.body;

        if (
            !quiz ||
            score === undefined ||
            total === undefined
        ) {
            return res.status(400).json({
                message: "Quiz, score and total are required"
            });
        }

        const session = await StudySession.findByIdAndUpdate(
            id,
            {
                $push: {
                    quizAttempts: {
                        quiz,
                        score,
                        total,
                        attemptedAt: new Date()
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!session) {
            return res.status(404).json({
                message: "Study session not found"
            });
        }

        res.json({
            message: "Quiz attempt saved successfully",
            quizAttempts: session.quizAttempts
        });

    } catch (error) {
        console.error(
            "SAVE QUIZ ATTEMPT ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to save quiz attempt",
            error: error.message
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await StudySession.findByIdAndDelete(id);

        if (!session) {
            return res.status(404).json({
                message: "Study session not found"
            });
        }

        res.json({
            message: "Study session deleted successfully"
        });

    } catch (error) {
        console.error("DELETE SESSION ERROR:", error);

        res.status(500).json({
            message: "Failed to delete study session",
            error: error.message
        });
    }
};

module.exports = {
    createNotes,
    getSessions,
    updateSession,
    addQuizAttempt,
    deleteSession
};