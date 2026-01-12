import { db } from "../../config/database.ts";
import { jenisBahan } from "../../models/schema.ts";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import type {
  MaterialCreateInput,
  MaterialUpdateInput,
} from "../../types/save/master/material.types.ts";
import { AppError } from "../../types/middleware/error.types.ts";

export const getMaterialData = async (
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
        nama: jenisBahan.nama,
        kode: jenisBahan.kodeBahan,
      })
      .from(jenisBahan)
      .where(and(eq(jenisBahan.isDeleted, false), isNull(jenisBahan.deletedAt)))
      .orderBy(asc(jenisBahan.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(jenisBahan);

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Material data found",
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
      message: "Material data retrieved successfully",
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

export const getMaterialDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid material ID", 400);
    }

    const [detailMasterData] = await db
      .select({
        nama: jenisBahan.nama,
        kode: jenisBahan.kodeBahan,
        createdAt: jenisBahan.createdAt,
        updatedAt: jenisBahan.updatedAt,
      })
      .from(jenisBahan)
      .where(eq(jenisBahan.id, id))
      .limit(1);

    if (!detailMasterData) {
      throw new AppError("Material not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Material details retrieved successfully",
      data: {
        detailMasterData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newMaterialData = async (
  req: Request<{}, {}, MaterialCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.nama || !payload.kode_bahan) {
      throw new AppError("All fields are required", 400);
    }

    const [newMasterData] = await db
      .insert(jenisBahan)
      .values({
        nama: payload.nama.trim(),
        kodeBahan: payload.kode_bahan.trim(),
        status: payload.status ?? 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        deletedAt: null,
      })
      .returning({
        nama: jenisBahan.nama,
      });

    res.status(201).json({
      success: true,
      message: "material data created successfully",
      data: {
        material: {
          name: newMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaterialData = async (
  req: Request<{}, {}, MaterialUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      !payload.id ||
      (!payload.nama && !payload.kode_bahan && payload.status === undefined)
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

    if (payload.kode_bahan !== undefined) {
      updateData.kodeBahan = payload.kode_bahan.trim();
    }

    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }

    if (payload.isDeleted) {
      updateData.isDeleted = payload.isDeleted;
      updateData.deletedAt = new Date().toISOString();
    }

    const [updatedMasterData] = await db
      .update(jenisBahan)
      .set(updateData)
      .where(eq(jenisBahan.id, payload.id))
      .returning({
        nama: jenisBahan.nama,
      });

    if (!updatedMasterData) {
      throw new AppError("Material not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Material data updated successfully",
      data: {
        material: {
          name: updatedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete
export const deleteMaterialData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Material ID is Not Valid", 400);
    }

    if (isNaN(payload.id)) {
      throw new AppError("Material ID is Not Valid", 400);
    }

    const [deletedMasterData] = await db
      .update(jenisBahan)
      .set({
        status: 0,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      })
      .where(eq(jenisBahan.id, payload.id))
      .returning({
        nama: jenisBahan.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Material not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Material data deleted successfully",
      data: {
        material: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Permanent delete
export const deleteMaterialDataPermanent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("material ID is required", 400);
    }

    const [deletedMasterData] = await db
      .delete(jenisBahan)
      .where(eq(jenisBahan.id, payload.id))
      .returning({
        nama: jenisBahan.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("material not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "material data permanently deleted successfully",
      data: {
        material: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
