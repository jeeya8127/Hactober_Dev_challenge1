const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        notes: {
            type: String,
            required: true
        },

        summary: {
            type: String,
            default: ""
        },

        quiz: {
            type: Object,
            default: null
        },

        quizAttempts: {
            type: [
                {
                    quiz: {
                        type: Object,
                        required: true
                    },

                    score: {
                        type: Number,
                        required: true
                    },

                    total: {
                        type: Number,
                        required: true
                    },

                    attemptedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            default: []
        },

        chatHistory: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudySession",
    studySessionSchema
);