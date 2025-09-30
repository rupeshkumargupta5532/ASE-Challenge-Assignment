import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSubmit,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
}) {
  const progress = (currentQuestion / totalQuestions) * 100;

  // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(); // auto submit when timer ends
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onSubmit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Timer Display */}
          <div className="mt-3 text-right">
            <span className={`text-sm font-semibold ${timeLeft <= 60 ? "text-red-500" : "text-muted-foreground"}`}>
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
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
                  className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer"
                  onClick={() => onAnswerSelect(String(index + 1))}
                >
                  <RadioGroupItem value={String(index + 1)} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
                Previous
              </Button>

              {isLastQuestion ? (
                <Button onClick={onSubmit} disabled={!selectedAnswer}>
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={onNext} disabled={!canGoNext || !selectedAnswer}>
                  Next Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
