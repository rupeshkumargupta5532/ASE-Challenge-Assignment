import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import QuestionCard from "../src/components/QuestionCard.jsx";

const mockQuestion = {
  id: 1,
  text: "What is 2+2?",
  options: ["1", "2", "3", "4"],
};

describe("QuestionCard", () => {
  const onAnswerSelect = vi.fn();
  const onNext = vi.fn();
  const onPrevious = vi.fn();
  const onSkip = vi.fn();
  const onSubmit = vi.fn();
  const onNavigateTo = vi.fn();

  const renderCard = (props = {}) =>
    render(
      <QuestionCard
        question={mockQuestion}
        questions={[mockQuestion]}
        currentQuestion={1}
        totalQuestions={1}
        selectedAnswer={null}
        onAnswerSelect={onAnswerSelect}
        onNext={onNext}
        onPrevious={onPrevious}
        onSkip={onSkip}
        onSubmit={onSubmit}
        canGoNext={false}
        canGoPrevious={false}
        isLastQuestion={true}
        onNavigateTo={onNavigateTo}
        {...props}
      />
    );

   it("renders question text and options", () => {
    renderCard();

    const cardTitle = screen.getByText(mockQuestion.text);
    expect(cardTitle).toBeInTheDocument();

    mockQuestion.options.forEach((opt) => {
      expect(screen.getByLabelText(opt)).toBeInTheDocument();
    });
  });

  it("calls onAnswerSelect when an option is clicked", () => {
    renderCard();
    const option = screen.getByText("4");
    fireEvent.click(option);
    expect(onAnswerSelect).toHaveBeenCalledWith("4");
  });

  it("calls onSkip when Skip button is clicked", () => {
    renderCard();
    const skipButton = screen.getByText("Skip");
    fireEvent.click(skipButton);
    expect(onSkip).toHaveBeenCalled();
  });

  it("calls onSubmit when Submit Quiz button is clicked", () => {
    renderCard();
    const submitButton = screen.getByText("Submit Quiz");
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("calls onNavigateTo when a sidebar question is clicked", () => {
    renderCard();
    const sidebarButton = screen.getByTitle("Question 1");
    fireEvent.click(sidebarButton);
    expect(onNavigateTo).toHaveBeenCalledWith(0);
  });
});
