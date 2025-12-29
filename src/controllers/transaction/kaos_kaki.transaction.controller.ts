import {
  jenisBahan,
  jenisMesin,
  kaosKaki,
  kaosKakiDetailFoto,
  kaosKakiDetailMesin,
} from "../../models/index.ts";
import { db } from "../../config/database.ts";
import type { Request, Response, NextFunction } from "express";
import { or, eq, count } from "drizzle-orm";
import { AppError } from "../../types/middleware/error.types.ts";
import type {
  KaosKakiCreateInput,
  KaosKakiUpdateInput1,
} from "../../types/save/transaction/kaos_kaki.types.ts";

export const getKaosKakiData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query.kaosKaki.findMany({
      columns: {
        id: true,
        nama: true,
      },

      with: {
        jenisBahan: {
          columns: {
            id: true,
            nama: true,
          },
        },
        kaosKakiDetailFotos: {
          columns: {
            id: true,
            isPrimary: true,
            url: true,
          },
        },
        kaosKakiDetailMesins: {
          columns: {
            id: true,
          },
          with: {
            jenisMesin: {
              columns: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },

      where: (kaosKaki, { eq }) => eq(kaosKaki.isDeleted, false),
      limit: limit,
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(kaosKaki)
      .where(eq(kaosKaki.isDeleted, false));

    const totalPages = Math.ceil(total / limit);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Kaos Kaki Data Found !",
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
      message: "Kaos Kaki Data Retrieved successfully",
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

export const getKaosKakiDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid Kaos Kaki", 400);
    }

    const result = await db.query.kaosKaki.findFirst({
      where: eq(kaosKaki.id, id),
      with: {
        jenisBahan: {
          columns: {
            id: true,
            nama: true,
          },
        },
        kaosKakiDetailFotos: {
          columns: {
            id: true,
            isPrimary: true,
            url: true,
          },
        },
        kaosKakiDetailMesins: {
          columns: {
            id: true,
          },
          with: {
            jenisMesin: {
              columns: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    });
    if (!result) {
      throw new AppError("Invalid Kaos Kaki", 404);
    }

    res.status(200).json({
      success: true,
      message: "Success Rtrieved Kaos Kaki Data",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const FormDataKaosKaki = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("here");
    const jenisMesinList = await db
      .select({
        kode: jenisMesin.id,
        nama: jenisMesin.nama,
      })
      .from(jenisMesin);

    const jenisBahanList = await db
      .select({
        kode: jenisBahan.id,
        nama: jenisBahan.nama,
      })
      .from(jenisBahan);

    res.status(200).json({
      success: true,
      message: "Success Load Form Data",
      data: {
        jenisMesinList,
        jenisBahanList,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newkaosKakiData = async (
  req: Request<{}, {}, KaosKakiCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload) {
      throw new AppError("Invalid Input", 400);
    }

    await db.transaction(async (tx) => {
      const checkDuplicate = await tx
        .select({ id: kaosKaki.id })
        .from(kaosKaki)
        .where(
          or(
            eq(kaosKaki.nama, payload.nama.trim()),
            eq(kaosKaki.kodeKaosKaki, payload.kode_kaos_kaki.trim())
          )
        )
        .limit(1);

      if (checkDuplicate.length > 0) {
        throw new AppError("Duplicate Name Or Kode", 400);
      }

      const [newKaosKaki] = await tx
        .insert(kaosKaki)
        .values({
          nama: payload.nama.trim(),
          kodeKaosKaki: payload.kode_kaos_kaki.trim(),
          keterangan: payload.keterangan?.trim(),
          lastOrderDate: payload.last_order.trim(),
          jenisBahanId: payload.jenis_bahan,
        })
        .returning({
          id: kaosKaki.id,
          nama: kaosKaki.nama,
        });

      if (payload.mesin?.length) {
        await tx.insert(kaosKakiDetailMesin).values(
          payload.mesin.map((idMesin) => ({
            kaosKakiId: newKaosKaki.id,
            jenisMesinId: idMesin,
          }))
        );
      }

      if (payload.foto?.length) {
        await tx.insert(kaosKakiDetailFoto).values(
          payload.foto.map((foto) => ({
            kaosKakiId: newKaosKaki.id,
            url: foto.url,
            isPrimary: foto.is_primary,
          }))
        );
      }

      res.status(201).json({
        success: true,
        message: "Kaos Kaki data created successfully",
        data: {
          nama: newKaosKaki.nama,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const updatekaosKakiData = async (
  req: Request<{}, {}, KaosKakiUpdateInput1>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.id) {
      throw new AppError("ID and at least one filed update are required", 400);
    }

    const checkKaosKakiData = await db.query.kaosKaki.findFirst({
      where: eq(kaosKaki.id, payload.id),
      with: {
        jenisBahan: {
          columns: {
            id: true,
            nama: true,
          },
        },
        kaosKakiDetailFotos: {
          columns: {
            id: true,
            isPrimary: true,
            url: true,
          },
        },
        kaosKakiDetailMesins: {
          columns: {
            id: true,
          },
          with: {
            jenisMesin: {
              columns: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    await db.transaction(async (tx) => {
      const updateData: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };

      if (
        payload.nama !== undefined &&
        payload.nama !== checkKaosKakiData?.nama
      ) {
        updateData.nama = payload.nama.trim();
      }
      if (
        payload.keterangan !== undefined &&
        payload.keterangan !== checkKaosKakiData?.keterangan
      ) {
        updateData.keterangan = payload.keterangan.trim();
      }

      if (
        payload.jenis_bahan !== undefined &&
        payload.jenis_bahan !== checkKaosKakiData?.jenisBahanId
      ) {
        updateData.jenisBahanId = payload.jenis_bahan;
      }

      if (
        payload.kode_kaos_kaki !== undefined &&
        payload.kode_kaos_kaki !== checkKaosKakiData?.kodeKaosKaki
      ) {
        updateData.kodeKaosKaki = payload.kode_kaos_kaki.trim();
      }

      if (
        payload.last_order !== undefined &&
        payload.last_order !== checkKaosKakiData?.lastOrderDate
      ) {
        updateData.lastOrderDate = payload.last_order;
      }

      if (
        payload.status !== undefined &&
        payload.status !== checkKaosKakiData?.status
      ) {
        updateData.status = payload.status;
      }

      if (payload.mesin !== undefined) {
        let arrayKodeMesin = [];
        payload.mesin.map((kode_mesin) => {
          if (
            checkKaosKakiData?.kaosKakiDetailMesins.find(
              (kodeMesin) => kodeMesin.id !== kode_mesin
            )
          ) {
            arrayKodeMesin.push(kode_mesin);
          }
        });
      }

      if (payload.foto !== undefined) {
        let fotoUpdate = [];
        payload.foto.map((foto) => {
          if (
            checkKaosKakiData?.kaosKakiDetailFotos.find(
              (checkFoto) => checkFoto.url !== foto.url
            )
          ) {
            fotoUpdate.push(foto);
          }
        });
      }
      const [updatedKaosKakiData] = await tx
        .update(kaosKaki)
        .set(updateData)
        .where(eq(kaosKaki.id, payload.id))
        .returning({ nama: kaosKaki.nama });

      if (!updatedKaosKakiData) throw new AppError("updated failed", 400);
      res.status(200).json({
        success: true,
        message: "Kaos Kaki Data updated successfully",
        data: {
          KaosKakiName: updatedKaosKakiData.nama,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const deletekaosKakiData = async (
  req: Request<{}, {}, KaosKakiCreateInput>,
  res: Response,
  next: NextFunction
) => {};
