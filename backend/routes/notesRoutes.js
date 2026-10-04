const express = require("express");

const router = express.Router();

const {
    createNotes,
    getSessions,
    updateSession,
    addQuizAttempt,
    deleteSession
} = require("../controllers/notesController");

router.post("/", createNotes);

router.get("/", getSessions);

router.put("/:id", updateSession);

router.post("/:id/quiz-attempt", addQuizAttempt);

router.delete("/:id", deleteSession);

module.exports = router;