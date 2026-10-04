const express = require("express");
const multer = require("multer");

const router = express.Router();

const { uploadPDF } = require("../controllers/pdfController");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.post("/", upload.single("pdf"), uploadPDF);

module.exports = router;