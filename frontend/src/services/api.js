import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export const saveNotes = async (
    title,
    notes,
    summary,
    quiz,
    quizAttempts,
    chatHistory
) => {
    const response = await API.post("/notes", {
        title,
        notes,
        summary,
        quiz,
        quizAttempts,
        chatHistory
    });

    return response.data;
};

export const getSessions = async () => {
    const response = await API.get("/notes");

    return response.data;
};

export const generateSummary = async (text) => {
    const response = await API.post("/summary", {
        text
    });

    return response.data;
};

export const generateQuiz = async (
    text,
    previousQuestions = []
) => {
    const response = await API.post("/quiz", {
        text,
        previousQuestions
    });

    return response.data;
};

export const askQuestion = async (
    text,
    question
) => {
    const response = await API.post("/chat", {
        text,
        question
    });

    return response.data;
};

export const uploadPDF = async (file) => {
    const formData = new FormData();

    formData.append("pdf", file);

    const response = await API.post(
        "/pdf",
        formData
    );

    return response.data;
};

export const updateSession = async (
    id,
    title,
    notes,
    summary,
    quiz,
    chatHistory
) => {
    const response = await API.put(
        `/notes/${id}`,
        {
            title,
            notes,
            summary,
            quiz,
            chatHistory
        }
    );

    return response.data;
};

export const saveQuizAttempt = async (
    id,
    quiz,
    score,
    total
) => {
    const response = await API.post(
        `/notes/${id}/quiz-attempt`,
        {
            quiz,
            score,
            total
        }
    );

    return response.data;
};

export const deleteSession = async (id) => {
    const response = await API.delete(
        `/notes/${id}`
    );

    return response.data;
};