import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, Users } from "lucide-react";

export default function QuizStartPage({ quizzes = [], onStart }) {
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [questionsCount, setQuestionsCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Set default quiz when quizzes first load
  useEffect(() => {
    if (quizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(quizzes[0].id);
      setSelectedQuiz(quizzes[0]);
    }
  }, [quizzes, selectedQuizId]);

  // Fetch totalQuestions whenever a quiz is selected
  useEffect(() => {
    if (!selectedQuizId) return;

    const quiz = quizzes.find((q) => q.id === selectedQuizId) || {};
    setSelectedQuiz(quiz);
    setQuestionsCount(0);

    const fetchTotalQuestions = async () => {
      setLoadingCount(true);
      try {
        const res = await fetch(`${apiBaseUrl}/quiz/safe/${selectedQuizId}/questions`);
        const data = await res.json();
        setQuestionsCount(data.totalQuestions || 0);
      } catch (err) {
        console.error("Failed to fetch total questions:", err);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchTotalQuestions();
  }, [selectedQuizId, quizzes, apiBaseUrl]);

  // Format timeLimit (in seconds) to MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (!selectedQuizId) {
      alert("Please select a quiz to start");
      return;
    }
    onStart(selectedQuiz);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Knowledge Quiz Challenge
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Test your knowledge with our interactive quiz. Answer questions at your own pace and get instant feedback on your performance.
          </p>
        </div>

        {/* Quiz Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Quiz</CardTitle>
            <CardDescription>Pick a quiz to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full border rounded-md p-2"
              value={selectedQuizId || ""}
              onChange={(e) => setSelectedQuizId(Number(e.target.value))}
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title} — {formatTime(quiz.time_limit)} — Time Limit
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Quiz Overview */}
        {selectedQuizId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Overview</CardTitle>
              <CardDescription>Here's what you need to know before starting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Questions */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-md flex items-center justify-center">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">{loadingCount ? "..." : questionsCount} Questions</p>
                  <p className="text-sm text-muted-foreground">Multiple choice format</p>
                </div>
              </div>

              {/* Time Limit */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning/10 rounded-md flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium">{formatTime(selectedQuiz.time_limit || 0)}</p>
                  <p className="text-sm text-muted-foreground">Submit your answers within the time limit</p>
                </div>
              </div>

              {/* Instant Results */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Instant Results</p>
                  <p className="text-sm text-muted-foreground">See your score immediately</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-lg"
            onClick={handleStart}
            disabled={loadingCount}
            data-testid="button-start-quiz"
          >
            {loadingCount ? "Loading Questions..." : "Start Quiz"}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            You can navigate between questions and review your answers before submitting
          </p>
        </div>
      </div>
    </div>
  );
}
