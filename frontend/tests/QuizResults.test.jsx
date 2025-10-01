import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import QuizResults from "../src/components/QuizResults.jsx";

const mockResults = [
  {
    questionText: "What is 2+2?",
    options: ["1", "2", "3", "4"],
    userAnswer: "4",
    correctAnswer: "4",
    isCorrect: true,
  },
  {
    questionText: "What is 3+5?",
    options: ["7", "8", "9", "10"],
    userAnswer: "1",
    correctAnswer: "2",
    isCorrect: false,
  },
];

describe("QuizResults", () => {
  const onRestartMock = vi.fn();

  it("renders score and percentage with correct color and message", () => {
    render(
      <QuizResults
        score={1}
        totalQuestions={2}
        results={mockResults}
        onRestart={onRestartMock}
      />
    );

    const scoreText = screen.getByTestId("text-final-score");
    expect(scoreText).toHaveTextContent("1/2");

    const percentageText = screen.getByText("50%");
    expect(percentageText).toBeInTheDocument();

    // Score color should be destructive (red)
    expect(scoreText).toHaveClass("text-red-600");

    // Score message
    expect(screen.getByText("Keep practicing!")).toBeInTheDocument();
  });

  it("renders correct score color for high percentage", () => {
    render(
      <QuizResults
        score={9}
        totalQuestions={10}
        results={mockResults}
        onRestart={onRestartMock}
      />
    );

    const scoreText = screen.getByTestId("text-final-score");
    expect(scoreText).toHaveClass("text-green-600");
    expect(screen.getByText("Excellent work!")).toBeInTheDocument();
  });

  it("calls onRestart when 'Take Quiz Again' button is clicked", () => {
    render(
      <QuizResults
        score={1}
        totalQuestions={2}
        results={mockResults}
        onRestart={onRestartMock}
      />
    );

    const restartButton = screen.getByTestId("button-restart-quiz");
    fireEvent.click(restartButton);
    expect(onRestartMock).toHaveBeenCalledTimes(1);
  });

  it("renders detailed results with user answers and correct answers", () => {
    render(
      <QuizResults
        score={1}
        totalQuestions={2}
        results={mockResults}
        onRestart={onRestartMock}
      />
    );

    // First question correct
    const firstUserAnswer = screen.getByTestId("text-user-answer-0");
    expect(firstUserAnswer).toHaveTextContent("4");
    expect(screen.queryByTestId("text-correct-answer-0")).toBeNull();

    // Second question incorrect
    const secondUserAnswer = screen.getByTestId("text-user-answer-1");
    expect(secondUserAnswer).toHaveTextContent("7");

    const secondCorrectAnswer = screen.getByTestId("text-correct-answer-1");
    expect(secondCorrectAnswer).toHaveTextContent("8");

    // Badge texts
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("renders all result questions", () => {
    render(
      <QuizResults
        score={1}
        totalQuestions={2}
        results={mockResults}
        onRestart={onRestartMock}
      />
    );

    mockResults.forEach((_, index) => {
      expect(
        screen.getByTestId(`result-question-${index}`)
      ).toBeInTheDocument();
    });
  });
});
