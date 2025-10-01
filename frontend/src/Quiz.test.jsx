import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Quiz from "./components/Quiz.jsx";

const mockQuizzes = [{ id: 1, title: "Quiz 1", time_limit: 1800 }];
const mockQuestions = [
  {
    id: 1,
    text: "2+2?",
    option1: "1",
    option2: "2",
    option3: "3",
    option4: "4",
  },
];

describe("Quiz component", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.endsWith("/quiz")) {
        return Promise.resolve({ json: () => Promise.resolve(mockQuizzes) });
      }
      if (url.endsWith("/questions")) {
        return Promise.resolve({ json: () => Promise.resolve(mockQuestions) });
      }
      if (url.endsWith("/submit")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              quizId: 1,
              score: 1,
              total: 1,
              results: [
                {
                  id: 1,
                  questionText: "2+2?",
                  options: ["1", "2", "3", "4"],
                  userAnswer: 4,
                  correctAnswer: 4,
                  isCorrect: true,
                },
              ],
            }),
        });
      }
      if (url.includes("/safe/")) {
        return Promise.resolve({
          json: () => Promise.resolve({ totalQuestions: 1 }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
  });

  it("renders start page and starts quiz", async () => {
    render(<Quiz />);
    await waitFor(() => screen.getByRole("button", { name: /Start Quiz/i }));

    const startButton = screen.getByRole("button", { name: /Start Quiz/i });
    fireEvent.click(startButton);

    await waitFor(() => screen.getByText("2+2?"));
    expect(screen.getByText("2+2?")).toBeInTheDocument();
  });

  it("submits quiz and shows results", async () => {
    render(<Quiz />);
    await waitFor(() => screen.getByRole("button", { name: /Start Quiz/i }));

    fireEvent.click(screen.getByRole("button", { name: /Start Quiz/i }));

    await waitFor(() => screen.getByText("2+2?"));

    // Select an answer
    fireEvent.click(screen.getByText("4"));

    // Submit
    fireEvent.click(screen.getByText("Submit Quiz"));

    await waitFor(() => screen.getByText("Quiz Complete!"));
    expect(screen.getByText("Quiz Complete!")).toBeInTheDocument();
  });
});
