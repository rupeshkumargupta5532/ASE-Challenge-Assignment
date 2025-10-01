import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function QuestionCard({
  question,
  questions = [],
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSkip,
  onSubmit,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  timeLimit = 45 * 60,
  answers = {},
  skipped = [],
  onNavigateTo,
}) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // reset timer when timeLimit changes (new quiz)
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // ensure we don't call onSubmit repeatedly
      onSubmit();
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, onSubmit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Progress bar color
  const progressColorClass =
    progress < 40
      ? "bg-red-500"
      : progress < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  // Determine status per question id (using the questions array to find id)
  const getStatusClasses = (qId, qNumber) => {
    if (
      answers &&
      Object.prototype.hasOwnProperty.call(answers, qId) &&
      answers[qId]
    ) {
      return "bg-green-600 text-white"; // attempted
    }
    if (skipped && skipped.includes(qId)) {
      return "bg-blue-600 text-white"; // skipped
    }
    return "bg-red-500 text-white"; // not attempted
  };

  return (
    <div className="min-h-screen bg-background flex p-6 gap-6">
      {/* Sidebar with all questions */}
      <aside className="w-56 border rounded-lg p-4 space-y-4 bg-card shadow">
        <h3 className="font-semibold mb-2">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((q, idx) => {
            const qNumber = idx + 1;
            const qId = q.id;
            const isActive = currentQuestion === qNumber;
            const statusClass = getStatusClasses(qId, qNumber);
            return (
              <button
                key={qId}
                onClick={() => onNavigateTo(idx)}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${statusClass} ${
                  isActive ? "ring-2 ring-primary scale-105" : ""
                }`}
                type="button"
                aria-current={isActive ? "true" : undefined}
                title={`Question ${qNumber}`}
              >
                {qNumber}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div>
            <span className="inline-block w-3 h-3 mr-1 rounded-full bg-green-600 align-middle" />{" "}
            Attempted
          </div>
          <div>
            <span className="inline-block w-3 h-3 mr-1 rounded-full bg-blue-600 align-middle" />{" "}
            Skipped
          </div>
          <div>
            <span className="inline-block w-3 h-3 mr-1 rounded-full bg-red-500 align-middle" />{" "}
            Not Attempted
          </div>
        </div>
      </aside>

      {/* Main Question Content */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 ${progressColorClass}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer Display */}
          <div className="mt-3 text-right">
            <span
              className={`text-sm font-semibold ${
                timeLeft <= 60 ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedAnswer || ""}
              onValueChange={onAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                  onClick={() => onAnswerSelect(String(index + 1))}
                >
                  <RadioGroupItem
                    value={String(index + 1)}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4 gap-2">
              <Button
                variant="default"
                onClick={onPrevious}
                disabled={!canGoPrevious}
              >
                Previous
              </Button>

              <Button
                // variant="secondary"
                onClick={onSkip}
              >
                Skip
              </Button>

              {isLastQuestion ? (
                <Button className="bg-green-500" onClick={onSubmit}>
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={onNext}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
