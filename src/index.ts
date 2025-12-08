import express from "express";
import createError from "http-errors";
import { PORT } from "./config/env.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.ts";
import arcjetMiddleware from "./middlewares/arcjet.middleware.ts";
import errorMiddleware from "./middlewares/error.middleware.ts";
import authRouter from "./routes/auth.router.ts";

const app = express();

// Pasang CORS **sebelum** route lain
app.use(cors(corsOptions));

// Tangani preflight request untuk semua route
app.options("", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cookie parser
app.use(cookieParser());

//arcjet middleware
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/", async (req, res, next) => {
  const welcomeMessage = "Welcome To Website Kaos Kaki Management Backend";
  return res.status(200).json({
    success: true,
    message: welcomeMessage,
  });
});

//error handler middleware
app.use(errorMiddleware);

// handle 404 error
app.use((req, res, next) => {
  next(createError(404));
});

app.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
