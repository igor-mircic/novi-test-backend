import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user";
import authorizationTest from "./routes/authorizationTest";

import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/authorizationTest", authorizationTest);

const port = process.env.PORT;
if (!port) throw Error("PORT env variable missing!");

const dbURI = process.env.DB_URI;
if (!dbURI) throw Error("DB_URI env variable missing!");

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is connected to database`);
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
