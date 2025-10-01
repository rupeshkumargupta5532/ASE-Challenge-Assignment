# Quiz Application

This is a **full-stack quiz application** built with:

- **Backend**: Node.js (`node v22.20.0`), Express, SQLite (with `better-sqlite3`)
- **Frontend**: React + Vite + TailwindCSS
- **Environment Variables**: Managed via `.env`

The app allows users to select quizzes, answer multiple-choice questions, skip/attempt questions, and get instant results with detailed performance tracking.

---

## 🚀 Features

- Interactive quiz system with multiple quizzes
- Timer-based questions with skip and review functionality
- SQLite database for storing quiz data
- Clean UI with TailwindCSS
- Instant results with correct/incorrect/attempted tracking

---

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rupeshkumargupta5532/ASE-Challenge-Assignment
cd ASE-Challenge-Assignment
```

## 2. Setup Backend (Try to use node v22.20.0)

```bash
cd backend
npm install
```

# Create .env file inside backend/

```bash
PORT=9001
```

# Run Backend (Backend will be started on http://localhost:9001)

```bash
npm run dev
```

## 3. Setup Frontend

```bash
cd frontend
npm install
```

# Create .env file inside frontend/

```bash
VITE_API_BASE_URL=http://localhost:9001/api
```

# Run Frontend (Frontend will be started on http://localhost:5173)

```bash
npm run dev
```

## 4. Database (The app will automatically create quiz.db with required tables if not found.)

```sql

CREATE TABLE IF NOT EXISTS quiz (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 1800
)

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

```

## 5. Sample Data (Add Data either by sql or postman )

# Add Data using the sql terminal

```sql

INSERT INTO quiz (title, description, time_limit) VALUES
('General Quiz', 'Test your general knowledge with 10 multiple-choice questions.', 1800),
('Science Quiz', 'Challenge your science knowledge with fun questions.', 1500);

INSERT INTO questions (quizId, text, option1, option2, option3, option4, correct_option) VALUES
(1, 'What is the capital of France?', 'Berlin', 'Madrid', 'Paris', 'Rome', 3),
(1, 'Which planet is known as the Red Planet?', 'Earth', 'Mars', 'Jupiter', 'Venus', 2),
(2, 'What is H2O commonly known as?', 'Oxygen', 'Hydrogen', 'Water', 'Helium', 3);

```

# Add data using Postman

1. Create a new quiz

- Method: POST
- URL: `http://localhost:9001/api/quiz`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "title": "General Quiz",
  "description": "General knowledge with 10 multiple-choice questions.",
  "time_limit": 1200
}
```

Example response (201 Created):

```json
{
  "id": 1,
  "title": "General Quiz",
  "description": "General knowledge with 10 multiple-choice questions.",
  "time_limit": 10
}
```

2. Create a another quiz

- Method: POST
- URL: `http://localhost:9001/api/quiz`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "title": "Assessment Quiz",
  "description": "This assessment is regarding the future of engineering and software developer role"
}
```

3. Add multiple questions to a quiz

After creating a quiz note the returned `id` (e.g. `1`) and use it in the URL below.

- Method: POST
- URL: `http://localhost:9001/api/quiz/{quizId}/questions` (example: `http://localhost:9001/api/quiz/1/questions`)
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "questions": [
    {
      "text": "Theory of relativity?",
      "option1": "Isaac Newton",
      "option2": "Albert Einstein",
      "option3": "Galileo Galilei",
      "option4": "Nikola Tesla",
      "correct_option": 2
    },
    {
      "text": "Who developed the theory of black holes?",
      "option1": "Stephen Hawking",
      "option2": "Albert Einstein",
      "option3": "Galileo Galilei",
      "option4": "Nikola Tesla",
      "correct_option": 1
    },
    {
      "text": "What is the chemical symbol for water?",
      "option1": "O2",
      "option2": "H2O",
      "option3": "CO2",
      "option4": "HO",
      "correct_option": 2
    },
    {
      "text": "Which planet is known as the Red Planet?",
      "option1": "Earth",
      "option2": "Venus",
      "option3": "Mars",
      "option4": "Jupiter",
      "correct_option": 3
    }
  ]
}
```

Example response (200 OK):

```json
{
  "success": true,
  "inserted": 4
}
```

Notes:

- Ensure the quiz `id` in the URL matches the quiz you created.
- `correct_option` should be an integer (1-4) pointing to the correct choice.
- If you prefer Postman, import the JSON as a raw body and set the header above. Alternatively use the SQL inserts earlier in this file for quick seeding.

## 6. Running Test Cases

# Run backend test cases

```bash
cd backend
npm run test

```

# Run frontend test cases

```bash
cd frontend
npm run test || npm run test:coverage

```

### Assumptions. (Schema Architecture --> Data Flow Table)

```bash
+-----------+      1   ---------  *      +------------+
|   quiz    |-------------------------->|  questions |
+-----------+                          +------------+
| id        |                          | id         |
| title     |                          | quizId     |
| description|                         | text       |
| time_limit|                          | option1    |
+-----------+                          | option2    |
                                       | option3    |
                                       | option4    |
                                       | correct_option |
                                       +------------+


```
