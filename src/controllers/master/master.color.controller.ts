import { db } from "../../config/database.ts";
import { jenisWarna } from "../../models/schema.ts";
import { asc, count, eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../types/middleware/error.types.ts";
import type {
  ColorCreateInput,
  ColorUpdateInput,
} from "../../types/save/master/color.types.ts";

export const getColorData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(jenisWarna)
      .where(eq(jenisWarna.isDeleted, false))
      .orderBy(asc(jenisWarna.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(jenisWarna);

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No color data found",
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

    res.status(200).json({
      success: true,
      message: "Color data retrieved successfully",
      data: {
        rows,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getColorDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid color ID", 400);
    }

    const [detailMasterData] = await db
      .select({ nama: jenisWarna.nama, kode_warna: jenisWarna.kodeWarna })
      .from(jenisWarna)
      .where(eq(jenisWarna.id, id))
      .limit(1);

    if (!detailMasterData) {
      throw new AppError("Color not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Color details retrieved successfully",
      data: {
        detailMasterData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newColorData = async (
  req: Request<{}, {}, ColorCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.nama || !payload.kode_warna) {
      throw new AppError("All fields are required", 400);
    }

    const [newMasterData] = await db
      .insert(jenisWarna)
      .values({
        nama: payload.nama.trim(),
        kodeWarna: payload.kode_warna.trim(),
        status: payload.status ?? 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({
        nama: jenisWarna.nama,
      });

    res.status(201).json({
      success: true,
      message: "Color data created successfully",
      data: {
        color: {
          name: newMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateColorData = async (
  req: Request<{}, {}, ColorUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      !payload.id ||
      (!payload.nama && !payload.kode_warna && payload.status === undefined)
    ) {
      throw new AppError(
        "ID and at least one field to update are required",
        400
      );
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (payload.nama !== undefined) {
      updateData.nama = payload.nama.trim();
    }

    if (payload.kode_warna !== undefined) {
      updateData.kodeWarna = payload.kode_warna.trim();
    }

    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }

    const [updatedMasterData] = await db
      .update(jenisWarna)
      .set(updateData)
      .where(eq(jenisWarna.id, payload.id))
      .returning({
        nama: jenisWarna.nama,
      });

    if (!updatedMasterData) {
      throw new AppError("Color not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Color data updated successfully",
      data: {
        color: {
          name: updatedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete
export const deleteColorData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Color ID is required", 400);
    }

    const [deletedMasterData] = await db
      .update(jenisWarna)
      .set({
        status: 0,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      })
      .where(eq(jenisWarna.id, payload.id))
      .returning({
        nama: jenisWarna.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Color not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Color data deleted successfully",
      data: {
        color: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Permanent delete
export const deleteColorDataPermanent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Color ID is required", 400);
    }

    const [deletedMasterData] = await db
      .delete(jenisWarna)
      .where(eq(jenisWarna.id, payload.id))
      .returning({
        nama: jenisWarna.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Color not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Color data permanently deleted successfully",
      data: {
        color: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
