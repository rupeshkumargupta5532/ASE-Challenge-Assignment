import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import router from "../routes.js"; // your router file

// Setup Express app for testing
const app = express();
app.use(bodyParser.json());
app.use(router);

describe("Quiz API", () => {
  let quizId = 1;
  let questionIds = [];

  /** -----------------------------
   *  QUIZ CREATION
   * ----------------------------- */
  it("should create a new quiz", async () => {
    const res = await request(app)
      .post("/api/quiz")
      .send({ title: "Test Quiz", description: "A test", time_limit: 20 });

    expect(res.status).toBe(201);
    expect(res.body.quizId).toBeDefined();
    quizId = res.body.quizId;
  }, 20000);

  it("should fail to create a quiz without title", async () => {
    const res = await request(app)
      .post("/api/quiz")
      .send({ description: "Missing title" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });

  it("should fetch all quizzes", async () => {
    const res = await request(app).get("/api/quiz");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  /** -----------------------------
   *  QUESTIONS
   * ----------------------------- */
  it("should fail to add questions if not array", async () => {
    const res = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({ questions: "invalid" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Questions must be an array");
  });

  it("should add multiple questions to a quiz", async () => {
    const res = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({
        questions: [
          {
            text: "Q1",
            option1: "A",
            option2: "B",
            option3: "C",
            option4: "D",
            correct_option: 2,
          },
          {
            text: "Q2",
            option1: "A",
            option2: "B",
            option3: "C",
            option4: "D",
            correct_option: 3,
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Questions added successfully");
  });

  it("should fetch safe questions (totalQuestions only)", async () => {
    const res = await request(app).get(`/api/quiz/safe/${quizId}/questions`);
    expect(res.status).toBe(200);
    expect(res.body.totalQuestions).toBeGreaterThanOrEqual(2);
  });

  it("should fetch all questions for a quiz", async () => {
    const res = await request(app).get(`/api/quiz/${quizId}/questions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    questionIds = res.body.map((q) => q.id);
  });

  /** -----------------------------
   *  SUBMIT QUIZ
   * ----------------------------- */
  it("should submit answers and calculate score correctly", async () => {
    const answers = {};
    answers[questionIds[0]] = 2; // correct
    answers[questionIds[1]] = 1; // incorrect

    const res = await request(app)
      .post(`/api/quiz/${quizId}/submit`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.quizId).toBe(quizId);
    expect(res.body.score).toBe(1);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
    expect(res.body.results.length).toBeGreaterThanOrEqual(2);
    expect(res.body.results[0].isCorrect).toBe(true);
    expect(res.body.results[1].isCorrect).toBe(false);
  });

  it("should handle empty submission gracefully", async () => {
    const res = await request(app)
      .post(`/api/quiz/${quizId}/submit`)
      .send({ answers: {} });

    expect(res.status).toBe(200);
    expect(res.body.score).toBe(0);
  });

  it("should handle partial answers", async () => {
    const answers = {};
    answers[questionIds[0]] = 2;

    const res = await request(app)
      .post(`/api/quiz/${quizId}/submit`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.score).toBe(1);
    expect(res.body.results[0].userAnswer).toBe(2);
    expect(res.body.results[1].userAnswer).toBeNull();
  });
});
