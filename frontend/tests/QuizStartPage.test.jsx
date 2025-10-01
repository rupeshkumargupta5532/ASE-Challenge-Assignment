import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import QuizStartPage from "../src/components/QuizStartPage.jsx";

// Mock API base URL
beforeAll(() => {
  import.meta.env = { VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9001/api" };
});

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockQuizzes = [
  { id: 1, title: "Quiz 1", time_limit: 1800 },
  { id: 2, title: "Quiz 2", time_limit: 1200 },
];

describe("QuizStartPage", () => {
  it("renders header and description", () => {
    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);
    expect(screen.getByText(/Knowledge Quiz Challenge/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Test your knowledge with our interactive quiz/i)
    ).toBeInTheDocument();
  });

  it("renders quiz selection dropdown with options", () => {
    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    mockQuizzes.forEach((quiz) => {
      expect(screen.getByText(new RegExp(quiz.title, "i"))).toBeInTheDocument();
    });
  });

  it("selects first quiz by default and fetches total questions", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ totalQuestions: 10 }),
    });

    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);

    // Wait for fetch to be called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/quiz/safe/1/questions`)
    );

    // Wait for questions count to appear
    await waitFor(() => expect(screen.getByText("10 Questions")).toBeInTheDocument());
  });

  it("changes quiz selection and fetches new question count", async () => {
    fetch.mockResolvedValue({
      json: async () => ({ totalQuestions: 15 }),
    });

    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/quiz/safe/2/questions`)
      )
    );
  });

  it("displays loading state while fetching questions", async () => {
    fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ json: async () => ({ totalQuestions: 5 }) }),
            100
          )
        )
    );

    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);
    expect(screen.getByText("... Questions")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("5 Questions")).toBeInTheDocument());
  });

  it("calls onStart with selected quiz when start button is clicked", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ totalQuestions: 10 }),
    });

    const onStartMock = vi.fn();
    render(<QuizStartPage quizzes={mockQuizzes} onStart={onStartMock} />);

    // Wait for initial fetch
    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.click(screen.getByTestId("button-start-quiz"));
    expect(onStartMock).toHaveBeenCalledWith(mockQuizzes[0]);
  });

  it("alerts if start is clicked without selecting quiz", () => {
    const onStartMock = vi.fn();
    window.alert = vi.fn();

    render(<QuizStartPage quizzes={[]} onStart={onStartMock} />);
    fireEvent.click(screen.getByTestId("button-start-quiz"));

    expect(window.alert).toHaveBeenCalledWith("Please select a quiz to start");
    expect(onStartMock).not.toHaveBeenCalled();
  });

  it("disables start button while loading questions", async () => {
    fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ json: async () => ({ totalQuestions: 5 }) }),
            100
          )
        )
    );

    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);
    const startButton = screen.getByTestId("button-start-quiz");

    expect(startButton).toBeDisabled(); // Disabled while loading

    await waitFor(() => expect(startButton).not.toBeDisabled());
  });

  it("renders Quiz Overview card with questions, time, and instant results", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ totalQuestions: 8 }),
    });

    render(<QuizStartPage quizzes={mockQuizzes} onStart={vi.fn()} />);

    await waitFor(() => screen.getByText("8 Questions"));

    expect(screen.getByText("8 Questions")).toBeInTheDocument();
    expect(screen.getByText("30:00")).toBeInTheDocument(); // 1800 seconds = 30:00
    expect(screen.getByText("Instant Results")).toBeInTheDocument();
  });
});
