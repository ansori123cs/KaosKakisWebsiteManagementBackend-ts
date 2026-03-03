import {
  kaosKaki,
  kaosKakiStok,
  kaosKakiDetailVariasi,
} from "../../models/index.js";
import { db } from "../../config/database.js";
import type { Request, Response, NextFunction } from "express";
import { or, eq, count, and, like, arrayContains, inArray } from "drizzle-orm";
import { AppError } from "../../types/middleware/error.types.js";
import type {
  StockCreateInput,
  StockDeleteInput,
  StockQueryParams,
  StockUpdateInput,
} from "../../types/save/transaction/stock.types.js";

export const getStockData = async (
  req: Request<{}, {}, StockQueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query.kaosKakiStok.findMany({
      columns: {
        id: true,
        stok: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        kaosKaki: {
          columns: {
            nama: true,
          },
        },
        jenisUkuran: {
          columns: {
            nama: true,
          },
        },
        jenisWarna: {
          columns: {
            nama: true,
          },
        },
      },

      where: (kaosKakiStok, { eq }) => eq(kaosKakiStok.isDeleted, false),
      limit: limit,
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(kaosKakiStok)
      .where(eq(kaosKakiStok.isDeleted, false));

    const totalPages = Math.ceil(total / limit);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Stock Data Found !",
        data: {
          result: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Stocks Data Retrieved successfully",
      data: {
        result,
        pagination: {
          currentPage: page,
          itemsPerPage: offset,
          totalItems: total,
          totalPages,
          hasNetPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStockDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid Stock", 400);
    }

    const result = await db.query.kaosKakiStok.findFirst({
      where: eq(kaosKakiStok.id, id),
      columns: {
        id: true,
        stok: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        kaosKaki: {
          columns: {
            nama: true,
            lastOrderDate: true,
          },
          with: {
            jenisBahan: {
              columns: {
                nama: true,
              },
            },
            kaosKakiDetailFotos: {
              columns: {
                url: true,
              },
            },
          },
        },
        jenisUkuran: {
          columns: {
            nama: true,
          },
        },
        jenisWarna: {
          columns: {
            nama: true,
          },
        },
      },
    });
    if (!result) {
      throw new AppError("Invalid Stock Data Not Found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Success Retrieved Stock Data",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const FormDataStokKaosKaki = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50; // Default limit lebih besar untuk pencarian
    const offset = (page - 1) * limit;

    let whereCondition = undefined;
    if (search) {
      whereCondition = like(kaosKaki.nama, `%${search}%`);
    }

    const [totalResult] = await db
      .select({ count: count() })
      .from(kaosKaki)
      .where(whereCondition);

    const result = await db
      .select({ id: kaosKaki.id, nama: kaosKaki.nama })
      .from(kaosKaki)
      .where(whereCondition)
      .limit(limit)
      .offset(offset);

    const dropDown = await db.query.kaosKakiDetailVariasi.findMany({
      with: {
        jenisUkuran: {
          columns: {
            id: true,
            nama: true,
          },
        },
        jenisWarna: {
          columns: {
            id: true,
            nama: true,
          },
        },
      },
      where: inArray(
        kaosKakiDetailVariasi.kaosKakiId,
        result.map((r) => r.id)
      ),
    });
    res.status(200).json({
      success: true,
      message: "Success Load Form Data Kaos Kaki",
      data: {
        result,
        dropDown,
        pagination: {
          page,
          limit,
          total: totalResult.count,
          totalPages: Math.ceil(totalResult.count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newStockData = async (
  req: Request<{}, {}, StockCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload) {
      throw new AppError("Invalid Input", 400);
    }

    await db.transaction(async (tx) => {
      const [newStock] = await tx
        .insert(kaosKakiStok)
        .values({
          idKaos: payload.variasi.kodeKaos,
          idUkuran: payload.variasi.kodeUkuran,
          idWarna: payload.variasi.kodeWarna,
          stok: payload.stockAmmount,
        })
        .returning({
          idKaos: kaosKakiStok.idKaos,
        });

      if (newStock.idKaos) {
        const result = await tx
          .select({ nama: kaosKaki.nama })
          .from(kaosKaki)
          .where(eq(kaosKaki.id, newStock.idKaos));

        res.status(201).json({
          success: true,
          message: "New Stock data created successfully",
          data: { result },
        });
      }
      res.status(400).json({
        success: true,
        message: "Failed During Save",
        data: {},
      });
    });
  } catch (error) {
    next(error);
  }
};

export const updateStockData = async (
  req: Request<{}, {}, StockUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (payload.variasi) {
      const checkStockData = await db.query.kaosKakiStok.findFirst({
        where: and(
          eq(kaosKakiStok.idUkuran, payload.variasi?.kodeUkuran),
          eq(kaosKakiStok.idKaos, payload.variasi?.kodeKaos),
          eq(kaosKakiStok.idWarna, payload.variasi?.kodeWarna)
        ),
        columns: {
          id: true,
          stok: true,
          createdAt: true,
          isDeleted: true,
          deletedAt: true,
          updatedAt: true,
        },
      });

      if (checkStockData) {
        await db.transaction(async (tx) => {
          const updateData: Record<string, any> = {
            updatedAt: new Date().toISOString(),
          };

          if (payload.isDeleted) {
            updateData.isDeleted = true;
          }

          if (payload.stockAmmount && checkStockData.stok) {
            updateData.stok = payload.stockAmmount;
          }

          if (payload.variasi) {
            const [updatedStockData] = await db
              .update(kaosKakiStok)
              .set(updateData)
              .where(
                and(
                  eq(kaosKakiStok.idUkuran, payload.variasi?.kodeUkuran),
                  eq(kaosKakiStok.idKaos, payload.variasi?.kodeKaos),
                  eq(kaosKakiStok.idWarna, payload.variasi?.kodeWarna)
                )
              )
              .returning({ nama: kaosKakiStok.stok });

            res.status(200).json({
              success: true,
              message: `Order data updated successfully to ${updatedStockData.nama}`,
            });
          }
        });
      }
      throw new AppError("Stock data not found", 404);
    }

    throw new AppError("ID and at least one field update are required", 400);
  } catch (error) {
    next(error);
  }
};

export const deleteStockData = async (
  req: Request<{}, {}, StockDeleteInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || payload.id === undefined || payload.userId === undefined) {
      throw new AppError("Error During Delete", 404);
    }

    await db.transaction(async (tx) => {
      const checkDuplicate = await tx
        .select({ id: kaosKakiStok.id })
        .from(kaosKakiStok)
        .where(eq(kaosKakiStok.id, payload.id))
        .limit(1);

      if (checkDuplicate.length > 0) {
        throw new AppError("Data Doesnt exist", 404);
      }

      await tx
        .update(kaosKakiStok)
        .set({
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        })
        .where(eq(kaosKakiStok.id, payload.id));

      res.status(201).json({
        success: true,
        message: "Stock data deleted successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};
