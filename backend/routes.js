import express from "express";
import db from "./db.js";

const router = express.Router();

/** -------------------------------
 *  QUIZ ROUTES
 *  ------------------------------- */

// Create a new quiz
router.post("/api/quiz", (req, res) => {
  const { title, description, time_limit } = req.body;

  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const stmt = db.prepare(
      "INSERT INTO quiz (title, description, time_limit) VALUES (?, ?, ?)"
    );
    const result = stmt.run(title, description || null, time_limit || 1800);

    res.status(201).json({ message: "Quiz created", quizId: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// Get all quizzes
router.get("/api/quiz", (_req, res) => {
  const quizzes = db
    .prepare("SELECT * FROM quiz ORDER BY id DESC")
    .all();
  res.json(quizzes);
});

/** -------------------------------
 *  QUESTION ROUTES
 *  ------------------------------- */

// Add multiple questions to a quiz
router.post("/api/quiz/:quizId/questions", (req, res) => {
  const quizId = parseInt(req.params.quizId);
  const { questions } = req.body;

  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Questions must be an array" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO questions (quizId, text, option1, option2, option3, option4, correct_option)
      VALUES (@quizId, @text, @option1, @option2, @option3, @option4, @correct_option)
    `);

    const insertMany = db.transaction((qs) => {
      for (const q of qs) {
        stmt.run({ ...q, quizId });
      }
    });

    insertMany(questions);

    res.status(201).json({ message: "Questions added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add questions" });
  }
});

// Get safe questions count only
router.get("/api/quiz/safe/:quizId/questions", (req, res) => {
  const quizId = parseInt(req.params.quizId);

  const questions = db
    .prepare(
      "SELECT id, text, option1, option2, option3, option4 FROM questions WHERE quizId = ?"
    )
    .all(quizId);

  res.json({ totalQuestions: questions.length });
});

// Get all questions for a quiz
router.get("/api/quiz/:quizId/questions", (req, res) => {
  const quizId = parseInt(req.params.quizId);

  const questions = db
    .prepare(
      "SELECT id, text, option1, option2, option3, option4 FROM questions WHERE quizId = ?"
    )
    .all(quizId);

  res.json(questions);
});

// Submit quiz answers and calculate score
router.post("/api/quiz/:quizId/submit", (req, res) => {
  const quizId = parseInt(req.params.quizId);
  const userAnswers = req.body.answers || {};

  const questions = db
    .prepare("SELECT * FROM questions WHERE quizId = ?")
    .all(quizId);

  let score = 0;
  const results = questions.map((q) => {
    const userAnswer =
      userAnswers[q.id] !== undefined ? parseInt(userAnswers[q.id]) : null;
    const isCorrect = userAnswer === q.correct_option;
    if (isCorrect) score++;

    return {
      id: q.id,
      questionText: q.text,
      options: [q.option1, q.option2, q.option3, q.option4],
      userAnswer,
      correctAnswer: q.correct_option,
      isCorrect,
    };
  });

  res.json({ quizId, score, total: questions.length, results });
});

export default router;
