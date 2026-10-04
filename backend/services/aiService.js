const OpenAI = require("openai");

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN
});

const MODEL = "openai/gpt-oss-120b:fastest";

const generateSummary = async (text) => {
    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are StudyBuddy, an AI study assistant. Summarize study notes in simple English. Keep important concepts and key points. Use clear headings and bullet points."
            },
            {
                role: "user",
                content: `Summarize these study notes:\n\n${text}`
            }
        ],
        max_tokens: 500,
        temperature: 0.3
    });

    return response.choices[0].message.content;
};


const generateQuiz = async (
    text,
    previousQuestions = []
) => {

    const previousText =
        previousQuestions.length > 0
            ? previousQuestions
                .slice(-15)
                .map((q, i) => `${i + 1}. ${q}`)
                .join("\n")
            : "None";

    const response =
        await client.chat.completions.create({

            model: MODEL,

            messages: [
                {
                    role: "system",
                    content: `
You are StudyBuddy.

Create exactly 5 fresh MCQ questions from the study notes.

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "Question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Short explanation"
    }
  ]
}

Rules:
- Exactly 5 questions.
- Exactly 4 options.
- correctAnswer must be 0, 1, 2, or 3.
- Questions must come only from the notes.
- NEVER repeat a previous question.
- NEVER create a question with the same concept and wording as a previous question.
- Test different concepts whenever possible.
- Keep explanations short.
`
                },
                {
                    role: "user",
                    content: `
Study notes:

${text}

Previously used questions:

${previousText}

Create 5 NEW questions that have not been asked before.
`
                }
            ],

            max_tokens: 1200,
            temperature: 0.9
        });

    const content =
        response.choices[0].message.content;

    try {

        return JSON.parse(content);

    } catch (error) {

        console.error(
            "QUIZ JSON ERROR:",
            content
        );

        throw new Error(
            "AI returned invalid quiz format"
        );
    }
};

const answerQuestion = async (
    text,
    question
) => {

    const response = await client.chat.completions.create({
        model: MODEL,

        messages: [
            {
                role: "system",
                content:
                    "You are StudyBuddy, an AI study assistant. Answer using the provided study notes in simple English."
            },

            {
                role: "user",
                content:
                    `Study notes:\n${text}\n\nQuestion:\n${question}`
            }
        ],

        max_tokens: 500,
        temperature: 0.3
    });

    return response.choices[0]
        .message
        .content;
};


module.exports = {
    generateSummary,
    generateQuiz,
    answerQuestion
};