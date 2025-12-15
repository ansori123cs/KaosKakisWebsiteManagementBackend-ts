import { db } from "../../config/database.ts";
import { jenisMesin } from "../..//models/schema.ts";
import { asc, count, eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import type {
  MachineCreateInput,
  MachineUpdateInput,
} from "../../types/save/master/machine.types.ts";
import { AppError } from "../../types/middleware/error.types.ts";

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
      .select()
      .from(jenisMesin)
      .orderBy(asc(jenisMesin.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(jenisMesin);

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Data jenis Mesin kosong",
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
      message: "List Jenis Mesin berhasil diambil",
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
    const params = req.params.id;
    const detailMasterData = await db
      .select({ nama: jenisMesin.nama, kode_mesin: jenisMesin.kodeMesin })
      .from(jenisMesin)
      .where(eq(jenisMesin.id, Number(params)));
    res.status(200).json({
      success: true,
      message: "Detail Jenis Mesin berhasil diambil",
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
      throw new AppError("All Fields are Required ", 400);
    }

    const newMasterData = await db.transaction(async (tx) => {
      const [insertedMasterData] = await tx
        .insert(jenisMesin)
        .values({
          nama: payload.nama.trim(),
          kodeMesin: payload.kode_mesin.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning({
          nama: jenisMesin.nama,
        });
      return insertedMasterData;
    });

    res.status(201).json({
      success: true,
      message: "Master Data Success Created",
      data: {
        master: {
          name: newMasterData.nama,
        },
      },
    });
  } catch (errror) {
    next(errror);
  }
};

export const updateMachineData = async (
  req: Request<{}, {}, MachineUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.nama || !payload.kode_mesin) {
      throw new AppError("There must be a column that is changed", 400);
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

    const updateMasterData = await db.transaction(async (tx) => {
      const [updateddMasterData] = await tx
        .update(jenisMesin)
        .set(updateData)
        .where(eq(jenisMesin.id, payload.id))
        .returning({
          nama: jenisMesin.nama,
        });
      return updateddMasterData;
    });

    res.status(201).json({
      success: true,
      message: "Master Data Success Created",
      data: {
        master: {
          name: updateMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMachineData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    const deleteMasterData = await db.transaction(async (tx) => {
      const [deletedddMasterData] = await tx
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
      return deletedddMasterData;
    });

    res.status(201).json({
      success: true,
      message: "Master Data Success Created",
      data: {
        master: {
          name: deleteMasterData.nama,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
