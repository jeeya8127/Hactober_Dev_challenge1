const {
    generateQuiz: createQuiz
} = require("../services/aiService");

const generateQuiz = async (req, res) => {
    try {

        const {
            text,
            previousQuestions = []
        } = req.body;

        if (!text) {

            return res.status(400).json({
                message: "Notes are required"
            });
        }

        const quiz =
            await createQuiz(
                text,
                previousQuestions
            );

        res.json({
            quiz
        });

    } catch (error) {

        console.error(
            "QUIZ ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to generate quiz",
            error: error.message
        });
    }
};

module.exports = {
    generateQuiz
};