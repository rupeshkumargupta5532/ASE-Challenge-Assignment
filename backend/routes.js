import express from "express";
import db from "./db.js";

const router = express.Router();

// GET all questions (without correct answers)
router.get("/api/quiz/:quizId/questions", (_req, res) => {
  const questions = db
    .prepare(
      "SELECT id, text, option1, option2, option3, option4 FROM questions"
    )
    .all();
  res.json(questions);
});

/// POST user answers and calculate score
router.post("/api/quiz/:quizId/submit", (req, res) => {
  const userAnswers = req.body.answers || {};
  
  // Get all questions with correct_option and options
  const questions = db
    .prepare("SELECT id, text, option1, option2, option3, option4, correct_option FROM questions")
    .all();

  let score = 0;
  const results = questions.map((q) => {
    const userAnswer = parseInt(userAnswers[q.id]) - 1;
    const isCorrect = userAnswer === q.correct_option;
    if (isCorrect) score++;

    return {
      id: q.id,
      questionText: q.text,
      options: [q.option1, q.option2, q.option3, q.option4],
      userAnswer: userAnswer != null ? userAnswer : null,
      correctAnswer: q.correct_option,
      isCorrect,
    };
  });

  res.json({ score, results });
});

export default router;
