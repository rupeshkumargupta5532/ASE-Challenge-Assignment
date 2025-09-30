import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";

export default function QuizResults({ score, totalQuestions, results, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent work!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  return (
    <div className="min-h-screen bg-background-gradient p-6">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-muted-foreground">{getScoreMessage()}</p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Score</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`} data-testid="text-final-score">
              {score}/{totalQuestions}
            </div>
            <div className={`text-2xl font-semibold mb-6 ${getScoreColor()}`}>
              {percentage}%
            </div>
            <Button 
              onClick={onRestart} 
              className="px-6 py-2"
              data-testid="button-restart-quiz"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>Review your answers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3" data-testid={`result-question-${index}`}>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-foreground leading-relaxed">
                    {index + 1}. {result.questionText}
                  </h3>
                  <Badge variant={result.isCorrect ? "default" : "destructive"} className="ml-2 shrink-0">
                    {result.isCorrect ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Your answer:</span>
                    <span className={result.isCorrect ? 'text-success font-medium' : 'text-destructive font-medium'} data-testid={`text-user-answer-${index}`}>
                      {result.options[parseInt(result.userAnswer)]}
                    </span>
                  </div>

                  {!result.isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Correct answer:</span>
                      <span className="text-success font-medium" data-testid={`text-correct-answer-${index}`}>
                        {result.options[parseInt(result.correctAnswer)]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
