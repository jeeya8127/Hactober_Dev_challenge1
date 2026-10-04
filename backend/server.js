const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pdfRoutes = require("./routes/pdfRoutes");

dotenv.config();

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const notesRoutes = require("./routes/notesRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const quizRoutes = require("./routes/quizRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "StudyBuddy API is running"
    });
});

app.use("/api/notes", notesRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", pdfRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});