const express = require("express");

const router = express.Router();

const {
    createSummary
} = require("../controllers/summaryController");

router.post("/", createSummary);

module.exports = router;