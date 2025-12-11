import { db } from "../../config/database.ts";
import { jenisMesin } from "../..//models/schema.ts";
import { asc, count } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

export const getMachineData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(jenisMesin)
      .orderBy(asc(jenisMesin.nama))
      .limit(limit)
      .offset(offset);

    // 3. Query total data
    const [{ total }] = await db.select({ total: count() }).from(jenisMesin);

    // 4. Hitung total halaman
    const totalPages = Math.ceil(total / limit);

    // Jika tidak ada data
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Data jenis bahan kosong",
        data: {
          rows: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
          },
        },
      });
    }

    // Response sukses
    res.status(200).json({
      success: true,
      message: "List Jenis Bahan berhasil diambil",
      data: {
        rows,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    // Error handling yang lebih spesifik
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Gagal mengambil data jenis bahan";
    }
    next(error);
  }
};
