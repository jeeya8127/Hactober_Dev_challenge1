# 📚 StudyBuddy — Your Personal AI Study Partner

> An AI-powered study companion that turns notes and PDFs into summaries, quizzes, and interactive Q&A.

StudyBuddy was built for a friend who spends a lot of time studying from lengthy notes and PDFs and needs a simpler way to **understand, revise, practice, and revisit** study material.

Instead of switching between a PDF reader, a summarizer, a quiz platform, and a chatbot, StudyBuddy brings the complete study workflow into one place.

**Learn → Summarize → Practice → Ask → Revisit**

---

## 🌐 Live Demo

🚀 **Try StudyBuddy:** [Live Demo](https://hactober-dev-challenge1-1.onrender.com/)

> Use the live application to upload study material, generate AI summaries and quizzes, ask questions from your notes, and manage saved study sessions.


## ✨ Features

### 📝 Notes & Study Material

- Paste study notes directly into StudyBuddy.
- Upload PDF files and automatically extract their text.
- Work with your study material inside a single workspace.

### 🤖 AI-Powered Summaries

- Generate concise and structured summaries from study notes.
- Important concepts and key points are preserved.
- Summaries use headings and bullet points for easier revision.

### 🧠 AI Quiz Generation

- Generate multiple-choice quizzes from your study material.
- Each question contains:
  - Question
  - Four options
  - Correct answer
  - Short explanation
- Previous questions can be provided to the AI to reduce repetition.

### 📊 Quiz History

- Save completed quizzes.
- Store questions and correct answers.
- Track quiz scores.
- Revisit previous quizzes and their explanations.

### 💬 Chat with Your Notes

- Ask questions about your study material.
- StudyBuddy answers using the provided notes as context.

### 📚 My Study Sessions

- Save study sessions for later.
- Reopen previously saved study material.
- Keep notes, summaries, quizzes, and study history organized.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React + Vite   │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
                ┌──────────┘       └──────────────┐
                ▼                                 ▼
      ┌──────────────────┐              ┌──────────────────┐
      │  Hugging Face    │              │   MongoDB Atlas  │
      │  OpenAI Router   │              │    Database      │
      │                  │              │                  │
      │ Open-weight AI   │              │ Study Sessions   │
      │ Models           │              │ Quiz History     │
      └──────────────────┘              │ Chat History     │
                                        └──────────────────┘

                ┌──────────────────┐
                │    PDF Parser    │
                │    pdf-parse     │
                └──────────────────┘
