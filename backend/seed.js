import db from "./db.js";

const sampleQuestions = [
  {
    text: "What is the capital of France?",
    option1: "London",
    option2: "Berlin",
    option3: "Paris",
    option4: "Madrid",
    correct_option: 3
  },
  {
    text: "Which planet is known as the Red Planet?",
    option1: "Venus",
    option2: "Jupiter",
    option3: "Mars",
    option4: "Saturn",
    correct_option: 3
  },
];

const stmt = db.prepare(`
  INSERT INTO questions (text, option1, option2, option3, option4, correct_option)
  VALUES (@text, @option1, @option2, @option3, @option4, @correct_option)
`);

for (const q of sampleQuestions) {
  stmt.run(q);
}

console.log("Seeded sample questions!");
