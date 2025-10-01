import React, { useState, useEffect } from "react";
import QuizStartPage from "./QuizStartPage";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizState, setQuizState] = useState("start"); // 'start' | 'taking' | 'results'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [questionId]: "1"|"2"|"3"|"4" }
  const [skipped, setSkipped] = useState([]); // array of questionIds
  const [score, setScore] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/quiz`);
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    };
    fetchQuizzes();
  }, [apiBaseUrl]);

  const startQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setQuizState("taking");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSkipped([]);
    setScore(0);
    setQuizResults([]);
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/quiz/${quiz.id}/questions`);
      const data = await res.json();

      const formattedQuestions = data.map((q) => ({
        id: q.id,
        text: q.text,
        options: [q.option1, q.option2, q.option3, q.option4],
      }));

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Failed to load quiz questions.");
      setQuizState("start");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answer) => {
    if (!questions.length) return;
    const qId = questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));

    // If it was previously skipped, remove from skipped
    setSkipped((prev) => prev.filter((id) => id !== qId));
  };

  const skipQuestion = () => {
    if (!questions.length) return;
    const qId = questions[currentQuestionIndex].id;

    // Only mark skipped if not answered
    if (!answers[qId] && !skipped.includes(qId)) {
      setSkipped((prev) => [...prev, qId]);
    }

    // Move to next question if possible
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      const res = await fetch(`${apiBaseUrl}/quiz/${selectedQuiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const result = await res.json();
      setScore(result.score);
      setQuizResults(result.results);
      setQuizState("results");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Failed to submit quiz answers.");
    }
  };

  const restartQuiz = () => {
    setSelectedQuiz(null);
    setQuizState("start");
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswers({});
    setSkipped([]);
    setScore(0);
    setQuizResults([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  return (
    <div className="relative">
      {quizState === "start" && (
        <QuizStartPage quizzes={quizzes} onStart={startQuiz} loading={loading} />
      )}

      {quizState === "taking" && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={currentAnswer}
          onAnswerSelect={selectAnswer}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onSkip={skipQuestion}
          onSubmit={submitQuiz}
          canGoNext={currentQuestionIndex < questions.length - 1}
          canGoPrevious={currentQuestionIndex > 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          timeLimit={selectedQuiz?.time_limit || 0}
          questions={questions}
          answers={answers}
          skipped={skipped}
          onNavigateTo={goToQuestion}
        />
      )}

      {quizState === "results" && (
        <QuizResults score={score} totalQuestions={questions.length} results={quizResults} onRestart={restartQuiz} />
      )}
    </div>
  );
}
