import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

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
  isLastQuestion
}: QuestionCardProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

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
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.questionText}
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
                  className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer"
                  onClick={() => onAnswerSelect(String(index))}
                >
                  <RadioGroupItem 
                    value={String(index)} 
                    id={`option-${index}`}
                    data-testid={`radio-option-${index}`}
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

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                data-testid="button-previous"
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={onSubmit}
                  disabled={!selectedAnswer}
                  data-testid="button-submit"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={!canGoNext || !selectedAnswer}
                  data-testid="button-next"
                >
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