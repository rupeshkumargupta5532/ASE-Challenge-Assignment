import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, Users } from "lucide-react";

export default function QuizStartPage({ onStart }) {
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

        {/* Quiz Overview */}
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
                <p className="font-medium">10 Questions</p>
                <p className="text-sm text-muted-foreground">Multiple choice format</p>
              </div>
            </div>

            {/* Time Limit */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning/10 rounded-md flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="font-medium">45:00 Minutes </p>
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

        {/* Start Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg" 
            onClick={onStart}
            data-testid="button-start-quiz"
          >
            Start Quiz
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            You can navigate between questions and review your answers before submitting
          </p>
        </div>
      </div>
    </div>
  );
}
