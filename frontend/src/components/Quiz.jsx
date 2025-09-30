import { useState } from "react";
import QuizStartPage from "./QuizStartPage";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";
import ThemeToggle from "./ThemeToggle";

const QUIZ_ID = 1; // Replace with dynamic quiz ID if needed

export default function Quiz() {
  const [quizState, setQuizState] = useState("start"); // 'start' | 'taking' | 'results'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const startQuiz = async () => {
    setQuizState("taking");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setQuizResults([]);
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/quiz/${QUIZ_ID}/questions`);
      const data = await res.json();

      // Map SQLite backend format to frontend format
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
    const questionId = questions[currentQuestionIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
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

  const submitQuiz = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/quiz/${QUIZ_ID}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const result = await res.json();

      console.log("Submission result:", result);

      // Use the results returned by backend directly
      setScore(result.score);
      setQuizResults(result.results);
      setQuizState("results");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Failed to submit quiz answers.");
    }
  };

  const restartQuiz = () => {
    setQuizState("start");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setQuizResults([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {quizState === "start" && (
        <QuizStartPage onStart={startQuiz} loading={loading} />
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
          onSubmit={submitQuiz}
          canGoNext={currentQuestionIndex < questions.length - 1}
          canGoPrevious={currentQuestionIndex > 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      )}

      {quizState === "results" && (
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          results={quizResults}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
}
