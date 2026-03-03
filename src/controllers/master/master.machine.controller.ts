import { db } from "../../config/database.js";
import { jenisMesin } from "../../models/schema.js";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import type {
  MachineCreateInput,
  MachineUpdateInput,
} from "../../types/save/master/machine.types.js";
import { AppError } from "../../types/middleware/error.types.js";

export const getMachineData = async (
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
        nama: jenisMesin.nama,
        kode: jenisMesin.kodeMesin,
      })
      .from(jenisMesin)
      .where(and(eq(jenisMesin.isDeleted, false), isNull(jenisMesin.deletedAt)))
      .orderBy(asc(jenisMesin.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(jenisMesin);

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No machine data found",
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
      message: "Machine data retrieved successfully",
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

export const getMachineDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid machine ID", 400);
    }

    const [detailMasterData] = await db
      .select({
        nama: jenisMesin.nama,
        kode: jenisMesin.kodeMesin,
        createdAt: jenisMesin.createdAt,
        updatedAt: jenisMesin.updatedAt,
      })
      .from(jenisMesin)
      .where(eq(jenisMesin.id, id))
      .limit(1);

    if (!detailMasterData) {
      throw new AppError("Machine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Machine details retrieved successfully",
      data: {
        detailMasterData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newMachineData = async (
  req: Request<{}, {}, MachineCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.nama || !payload.kode_mesin) {
      throw new AppError("All fields are required", 400);
    }

    const [newMasterData] = await db
      .insert(jenisMesin)
      .values({
        nama: payload.nama.trim(),
        kodeMesin: payload.kode_mesin.trim(),
        status: payload.status ?? 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        deletedAt: null,
      })
      .returning({
        nama: jenisMesin.nama,
      });

    res.status(201).json({
      success: true,
      message: "Machine data created successfully",
      data: {
        machine: {
          name: newMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMachineData = async (
  req: Request<{}, {}, MachineUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      !payload.id ||
      (!payload.nama && !payload.kode_mesin && payload.status === undefined)
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

    if (payload.kode_mesin !== undefined) {
      updateData.kodeMesin = payload.kode_mesin.trim();
    }

    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }
    if (payload.isDeleted) {
      updateData.isDeleted = payload.isDeleted;
      updateData.deletedAt = new Date().toISOString();
    }

    const [updatedMasterData] = await db
      .update(jenisMesin)
      .set(updateData)
      .where(eq(jenisMesin.id, payload.id))
      .returning({
        nama: jenisMesin.nama,
      });

    if (!updatedMasterData) {
      throw new AppError("Machine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Machine data updated successfully",
      data: {
        machine: {
          name: updatedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete
export const deleteMachineData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Machine ID is Not Valid", 400);
    }
    if (isNaN(payload.id)) {
      throw new AppError("Machine ID is Not Valid", 400);
    }
    const [deletedMasterData] = await db
      .update(jenisMesin)
      .set({
        status: 0,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      })
      .where(eq(jenisMesin.id, payload.id))
      .returning({
        nama: jenisMesin.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Machine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Machine data deleted successfully",
      data: {
        machine: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Permanent delete
export const deleteMachineDataPermanent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("Machine ID is required", 400);
    }

    const [deletedMasterData] = await db
      .delete(jenisMesin)
      .where(eq(jenisMesin.id, payload.id))
      .returning({
        nama: jenisMesin.nama,
      });

    if (!deletedMasterData) {
      throw new AppError("Machine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Machine data permanently deleted successfully",
      data: {
        machine: {
          name: deletedMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
