import QuizStartPage from '../QuizStartPage';

export default function QuizStartPageExample() {
  return (
    <QuizStartPage onStart={() => console.log('Quiz started!')} />
  );
}