import QuestionCard from '../QuestionCard';
import { useState } from 'react';

export default function QuestionCardExample() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const mockQuestion = {
    id: '1',
    questionText: 'What is the capital city of France?',
    options: [
      'London',
      'Berlin', 
      'Paris',
      'Madrid'
    ]
  };

  return (
    <QuestionCard
      question={mockQuestion}
      currentQuestion={1}
      totalQuestions={10}
      selectedAnswer={selectedAnswer}
      onAnswerSelect={(answer) => {
        setSelectedAnswer(answer);
        console.log('Answer selected:', answer);
      }}
      onNext={() => console.log('Next question')}
      onPrevious={() => console.log('Previous question')}
      onSubmit={() => console.log('Quiz submitted')}
      canGoNext={true}
      canGoPrevious={false}
      isLastQuestion={false}
    />
  );
}