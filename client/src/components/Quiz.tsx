import { useState } from "react";
import QuizStartPage from "./QuizStartPage";
import QuestionCard, { Question } from "./QuestionCard";
import QuizResults from "./QuizResults";
import ThemeToggle from "./ThemeToggle";

// TODO: remove mock functionality - replace with API calls
const mockQuestions: Question[] = [
  {
    id: '1',
    questionText: 'What is the capital city of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid']
  },
  {
    id: '2', 
    questionText: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn']
  },
  {
    id: '3',
    questionText: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear']
  },
  {
    id: '4',
    questionText: 'In which year did the Titanic sink?',
    options: ['1910', '1912', '1914', '1916']
  },
  {
    id: '5',
    questionText: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag']
  },
  {
    id: '6',
    questionText: 'Which continent is the Sahara Desert located in?',
    options: ['Asia', 'Africa', 'Australia', 'South America']
  },
  {
    id: '7',
    questionText: 'What is the smallest country in the world?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein']
  },
  {
    id: '8',
    questionText: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo']
  },
  {
    id: '9',
    questionText: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum']
  },
  {
    id: '10',
    questionText: 'Which ocean is the largest?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean']
  }
];

// TODO: remove mock functionality - correct answers for scoring
const mockCorrectAnswers: { [key: string]: string } = {
  '1': '2', // Paris
  '2': '2', // Mars  
  '3': '1', // Blue Whale
  '4': '1', // 1912
  '5': '2', // Au
  '6': '1', // Africa
  '7': '2', // Vatican City
  '8': '2', // Leonardo da Vinci
  '9': '2', // Diamond
  '10': '3' // Pacific Ocean
};

type QuizState = 'start' | 'taking' | 'results';

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState(0);
  const [quizResults, setQuizResults] = useState<any[]>([]);

  const startQuiz = () => {
    setQuizState('taking');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setQuizResults([]);
  };

  const selectAnswer = (answer: string) => {
    const questionId = mockQuestions[currentQuestionIndex].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    // TODO: remove mock functionality - replace with API call to calculate score
    let calculatedScore = 0;
    const results = mockQuestions.map((question, index) => {
      const userAnswer = answers[question.id] || '';
      const correctAnswer = mockCorrectAnswers[question.id];
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) calculatedScore++;
      
      return {
        questionText: question.questionText,
        userAnswer,
        correctAnswer,
        isCorrect,
        options: question.options
      };
    });

    setScore(calculatedScore);
    setQuizResults(results);
    setQuizState('results');
  };

  const restartQuiz = () => {
    setQuizState('start');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setQuizResults([]);
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {quizState === 'start' && (
        <QuizStartPage onStart={startQuiz} />
      )}
      
      {quizState === 'taking' && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={mockQuestions.length}
          selectedAnswer={currentAnswer}
          onAnswerSelect={selectAnswer}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onSubmit={submitQuiz}
          canGoNext={currentQuestionIndex < mockQuestions.length - 1}
          canGoPrevious={currentQuestionIndex > 0}
          isLastQuestion={currentQuestionIndex === mockQuestions.length - 1}
        />
      )}
      
      {quizState === 'results' && (
        <QuizResults
          score={score}
          totalQuestions={mockQuestions.length}
          results={quizResults}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
}