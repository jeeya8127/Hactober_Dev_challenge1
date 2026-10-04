const { extractTextFromPDF } = require("../services/pdfService");

const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF file"
            });
        }

        const text = await extractTextFromPDF(req.file.buffer);

        if (!text.trim()) {
            return res.status(400).json({
                message: "Could not extract text from this PDF"
            });
        }

        res.json({
            message: "PDF processed successfully",
            text
        });

    } catch (error) {
        console.error("PDF ERROR:", error);

        res.status(500).json({
            message: "Failed to process PDF",
            error: error.message
        });
    }
};

module.exports = {
    uploadPDF
};