const {
    generateSummary
} = require("../services/aiService");

const createSummary = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Text is required"
            });
        }

        const summary = await generateSummary(text);

        res.json({
            summary
        });
    } catch (error) {
        console.error("SUMMARY ERROR:", error);
        res.status(500).json({
            message: "Failed to generate summary",
            error: error.message
        });
    }
};

module.exports = {
    createSummary
};