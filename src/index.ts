import express from "express";
import createError from "http-errors";
import { PORT } from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import arcjetMiddleware from "./middlewares/arcjet.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth/auth.router";
import machineRouter from "./routes/master/machine.router";
import colorRouter from "./routes/master/color.router";
import sizeRouter from "./routes/master/size.router";
import materialRouter from "./routes/master/material.router";
import kaosKakiRouter from "./routes/transaction/kaos_kaki.router";
import orderRouter from "./routes/transaction/order.router";
import stockRouter from "./routes/transaction/stock.routes";

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

//auth router
app.use("/api/v1/auth", authRouter);

//master router
app.use("/api/v1/machine", machineRouter);
app.use("/api/v1/color", colorRouter);
app.use("/api/v1/size", sizeRouter);
app.use("/api/v1/material", materialRouter);

//transaction router
app.use("/api/v1/kaos-kaki", kaosKakiRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/stock", stockRouter);

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

// app.listen(PORT, () =>
//   console.log(`[server]: Server is running at http://localhost:${PORT}`)
// );

export default app
// prompt tolong

// context:
// sebuah relational database utama kaos-kaki yang memiliki relasi
// 1.bahan = satu dari nilon atau spandek atau campuran
// 2. mesin = bisa lebih dari 1 yaitu ths,manula,yaushen
// 3.ukuran = bisa lebih dari 1 mulai dari ss hingga xxxl
// 4.variasi = bisa lebih dari 1 mulai dari putih polos,ptih 1/2 telapak,telapak hitam full,hitam ,dan warna custom
// 5. dari setiap kaos kaki yang terikat variasi terdapat gambar sampel

// saya ingin membuat sebuah sistem scalabel
// dari context diatas master nya berupa bahan,mesin,ukuran,variasi sedangkan gambar terikat pada kaos kaki dan variasi yang dimiliki

// tolong buatkan menggunakn express.js menggunakan typescript, auth jwt, drizzle orm, rate limiting, tolong buat scalabel

// fitur
// 1. crud dasar pada setiap tabel
// 2. struktur folder didalam src berupa config=konfigurasi file, controller,database = drizzle orm client, middlewares = auth middleware dan error handling middleware,  models = schema drizzle,repositories = layer data, routes,service= logika bisnis , types,utils
