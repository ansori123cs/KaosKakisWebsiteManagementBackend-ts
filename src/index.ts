import express from "express";
import createError from "http-errors";
import { DB_URI, PORT } from "./config/env.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { jenisBahan, jenisMesin } from "./models/schema.ts";

const client = postgres(DB_URI!, { prepare: false });
const db = drizzle({ client });
const app = express();

app.use(express.json());

// TODO: Routing aplikasi akan kita tulis di sini

app.use("/", async (req, res, next) => {
  const dataMesin = await db.select().from(jenisMesin);
  return res.status(200).json({
    success: true,
    message: "Data Jenis Mesin",
    data: {
      jenisBahanList: dataMesin,
    },
  });
});
// handle 404 error
app.use((req, res, next) => {
  next(createError(404));
});

app.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
