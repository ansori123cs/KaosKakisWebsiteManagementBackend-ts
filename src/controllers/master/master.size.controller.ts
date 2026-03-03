import { db } from "../../config/database";
import { jenisUkuran } from "../../models/schema";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import type {
  SizeCreateInput,
  SizeUpdateInput,
} from "../../types/save/master/size.types ";
import { AppError } from "../../types/middleware/error.types";

export const getSizeData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        nama: jenisUkuran.nama,
        kode: jenisUkuran.kodeUkuran,
      })
      .from(jenisUkuran)
      .where(
        and(eq(jenisUkuran.isDeleted, false), isNull(jenisUkuran.deletedAt))
      )
      .orderBy(asc(jenisUkuran.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(jenisUkuran);

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Size data found",
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
      message: "Size data retrieved successfully",
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

export const getSizeDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid size ID", 400);
    }

    const [detailMasterData] = await db
      .select({
        nama: jenisUkuran.nama,
        kode: jenisUkuran.kodeUkuran,
        createdAt: jenisUkuran.createdAt,
        updatedAt: jenisUkuran.updatedAt,
      })
      .from(jenisUkuran)
      .where(eq(jenisUkuran.id, id))
      .limit(1);
    if (!detailMasterData) {
      throw new AppError("Size not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Size details retrieved successfully",
      data: {
        detailMasterData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newSizeData = async (
  req: Request<{}, {}, SizeCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.nama || !payload.kode_ukuran) {
      throw new AppError("All fields are required", 400);
    }

    const [newMasterData] = await db
      .insert(jenisUkuran)
      .values({
        nama: payload.nama.trim(),
        kodeUkuran: payload.kode_ukuran.trim(),
        status: payload.status ?? 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        deletedAt: null,
      })
      .returning({
        nama: jenisUkuran.nama,
      });

    res.status(201).json({
      success: true,
      message: "Size data created successfully",
      data: {
        size: {
          name: newMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSizeData = async (
  req: Request<{}, {}, SizeUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      !payload.id ||
      (!payload.nama && !payload.kode_ukuran && payload.status === undefined)
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

    if (payload.kode_ukuran !== undefined) {
      updateData.kode_ukuran = payload.kode_ukuran.trim();
    }

    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }
    if (payload.isDeleted) {
      updateData.isDeleted = payload.isDeleted;
      updateData.deletedAt = new Date().toISOString();
    }
    const [updatedMasterData] = await db
      .update(jenisUkuran)
      .set(updateData)
      .where(eq(jenisUkuran.id, payload.id))
      .returning({
        nama: jenisUkuran.nama,
      });

    if (!updatedMasterData) {
      throw new AppError("Size not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Size data updated successfully",
      data: {
        size: {
          name: updatedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete
export const deleteSizeData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Size ID is Not Valid", 400);
    }
    if (isNaN(payload.id)) {
      throw new AppError("Size ID is Not Valid", 400);
    }

    const [deletedMasterData] = await db
      .update(jenisUkuran)
      .set({
        status: 0,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      })
      .where(eq(jenisUkuran.id, payload.id))
      .returning({
        nama: jenisUkuran.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Size not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Size data deleted successfully",
      data: {
        size: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Permanent delete
export const deleteSizeDataPermanent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Size ID is required", 400);
    }

    const [deletedMasterData] = await db
      .delete(jenisUkuran)
      .where(eq(jenisUkuran.id, payload.id))
      .returning({
        nama: jenisUkuran.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Size not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Size data permanently deleted successfully",
      data: {
        size: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
