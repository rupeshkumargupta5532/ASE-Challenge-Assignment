import express from "express";
import quizRoutes from "./routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(quizRoutes);

const port = process.env.PORT || 9001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
