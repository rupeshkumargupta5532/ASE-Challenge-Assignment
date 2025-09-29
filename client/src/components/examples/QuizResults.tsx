import QuizResults from '../QuizResults';

export default function QuizResultsExample() {
  const mockResults = [
    {
      questionText: 'What is the capital city of France?',
      userAnswer: '2',
      correctAnswer: '2', 
      isCorrect: true,
      options: ['London', 'Berlin', 'Paris', 'Madrid']
    },
    {
      questionText: 'Which planet is known as the Red Planet?',
      userAnswer: '1',
      correctAnswer: '2',
      isCorrect: false,
      options: ['Venus', 'Jupiter', 'Mars', 'Saturn']
    },
    {
      questionText: 'What is 2 + 2?',
      userAnswer: '1',
      correctAnswer: '1',
      isCorrect: true,
      options: ['3', '4', '5', '6']
    }
  ];

  return (
    <QuizResults
      score={2}
      totalQuestions={3}
      results={mockResults}
      onRestart={() => console.log('Quiz restarted!')}
    />
  );
}