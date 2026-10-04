const {
    answerQuestion
} = require("../services/aiService");

const chatWithNotes = async (req, res) => {
    try {
        const { text, question } = req.body;

        if (!text || !question) {
            return res.status(400).json({
                message: "Notes and question are required"
            });
        }

        const answer = await answerQuestion(
            text,
            question
        );

        res.json({
            answer
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to answer question",
            error: error.message
        });
    }
};

module.exports = {
    chatWithNotes
};