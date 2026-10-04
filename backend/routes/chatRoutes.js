const express = require("express");

const router = express.Router();

const {
    chatWithNotes
} = require("../controllers/chatController");

router.post("/", chatWithNotes);

module.exports = router;