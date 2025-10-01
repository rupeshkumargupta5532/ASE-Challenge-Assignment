import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to SQLite database
const db = new Database(path.join(__dirname, "quiz.db"));

// Create quiz table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS quiz (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 1800 -- time in seconds (default: 30 mins)
  )
`
).run();

// Create questions table (linked to quiz)
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quizId INTEGER NOT NULL,
    text TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    option4 TEXT NOT NULL,
    correct_option INTEGER NOT NULL,
    FOREIGN KEY (quizId) REFERENCES quiz(id) ON DELETE CASCADE
  )
`
).run();

export default db;



