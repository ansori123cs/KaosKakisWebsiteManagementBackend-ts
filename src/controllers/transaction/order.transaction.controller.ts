import {
  kaosKaki,
  kaosKakiDetailFoto,
  kaosKakiDetailMesin,
  kaosKakiDetailVariasi,
  pesanan,
  pesananDetail,
} from "../../models/index.ts";
import { db } from "../../config/database.ts";
import type { Request, Response, NextFunction } from "express";
import { or, eq, count, and, like, arrayContains, inArray } from "drizzle-orm";
import { AppError } from "../../types/middleware/error.types.ts";
import type {
  KaosKakiDeleteInput,
  KaosKakiUpdateInput1,
} from "../../types/save/transaction/kaos_kaki.types.ts";
import type {
  OrderCreateInput,
  OrderDeleteInput,
  OrderQueryParams,
  OrderUpdateInput,
} from "../../types/save/transaction/order.types.ts";

export const getOrderData = async (
  req: Request<{}, {}, OrderQueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query.pesanan.findMany({
      columns: {
        id: true,
        namaPemesan: true,
      },
      with: {
        pesananDetails: {
          columns: {
            id: true,
            jumlah: true,
          },
          with: {
            kaosKakiDetailVariasi: {
              columns: {
                id: true,
              },
              with: {
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
                kaosKaki: {
                  columns: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },

      where: (pesanan, { eq }) => eq(pesanan.isDeleted, false),
      limit: limit,
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(pesanan)
      .where(eq(pesanan.isDeleted, false));

    const totalPages = Math.ceil(total / limit);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Orders Data Found !",
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
      message: "Order Data Retrieved successfully",
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

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError("Invalid Order", 400);
    }

    const result = await db.query.pesanan.findFirst({
      where: eq(pesanan.id, id),
      with: {
        pesananDetails: {
          columns: {
            id: true,
            jumlah: true,
          },
          with: {
            kaosKakiDetailVariasi: {
              columns: {
                id: true,
              },
              with: {
                jenisUkuran: {
                  columns: {
                    nama: true,
                    kodeUkuran: true,
                  },
                },
                jenisWarna: {
                  columns: {
                    nama: true,
                    kodeWarna: true,
                  },
                },
                kaosKaki: {
                  columns: {
                    nama: true,
                  },
                  with: {
                    kaosKakiDetailFotos: {
                      columns: {
                        url: true,
                      },
                    },
                    kaosKakiStoks: {
                      columns: {
                        stok: true,
                      },
                      with: {
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
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!result) {
      throw new AppError("Invalid Order Data Not Found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Success Retrieved Order Data",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const FormDataOrderKaosKaki = async (
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

    res.status(200).json({
      success: true,
      message: "Success Load Form Data Kaos Kaki",
      data: {
        result,
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

export const FormDataOrderDetailKaosKaki = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new AppError("Invalid Kaos Kaki", 400);
    }

    const result = await db.query.kaosKaki.findMany({
      where: eq(kaosKaki.id, id),
      limit: 1,
      columns: {
        id: true,
      },
      with: {
        kaosKakiDetailVariasis: {
          columns: {
            id: true,
          },
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
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Success Load Form Data Kaos Kaki",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newOrderData = async (
  req: Request<{}, {}, OrderCreateInput>,
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
        .select({ id: pesanan.id })
        .from(pesanan)
        .where(
          and(
            eq(pesanan.namaPemesan, payload.namaPemesan.trim()),
            eq(pesanan.createdAt, payload.createdAt.toISOString())
          )
        )
        .limit(1);

      if (checkDuplicate.length > 0) {
        throw new AppError(
          "Pesanan dengan nama dan tanggal yang sama ada kemungkinan duplicate order",
          400
        );
      }

      const [newOrder] = await tx
        .insert(pesanan)
        .values({
          namaPemesan: payload.namaPemesan.trim(),
          catatan: payload.catatan.trim(),
          createdAt: payload.createdAt.toISOString(),
        })
        .returning({
          id: pesanan.id,
          nama: pesanan.namaPemesan,
        });

      if (payload.orderDetails?.length) {
        // const variasiArray = payload.orderDetails.map((m) => m.kodeKaosVariasi);

        // const selectedVariasi = await db
        //   .select({ kodeVariasiDetail: kaosKakiDetailVariasi.id })
        //   .from(kaosKakiDetailVariasi)
        //   .where(inArray(kaosKakiDetailVariasi.id, variasiArray));

        for (const variasi of payload.orderDetails) {
          await tx.insert(pesananDetail).values({
            kaosKakiVariasiId: variasi.kodeKaosVariasi,
            hargaSatuan: variasi.price,
            jumlah: variasi.amount,
            pesananId: newOrder.id,
            deletedAt: null,
            isDeleted: false,
          });
        }

        res.status(201).json({
          success: true,
          message: "New Order data created successfully",
          data: {
            nama: newOrder.nama,
          },
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderData = async (
  req: Request<{}, {}, OrderUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload?.id) {
      throw new AppError("ID and at least one field update are required", 400);
    }

    const checkOrderData = await db.query.pesanan.findFirst({
      where: eq(pesanan.id, payload.id),
      columns: {
        id: true,
        catatan: true,
        namaPemesan: true,
        noTelp: true,
        status: true,
        createdAt: true,
        isDeleted: true,
        deletedAt: true,
        updatedAt: true,
      },
      with: {
        pesananDetails: {
          columns: {
            isDeleted: true,
            deletedAt: true,
            kaosKakiVariasiId: true,
          },
        },
      },
    });

    if (!checkOrderData) {
      throw new AppError("Order data not found", 404);
    }

    await db.transaction(async (tx) => {
      const updateData: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };

      if (
        payload.namaPemesan &&
        payload.namaPemesan !== checkOrderData.namaPemesan
      ) {
        updateData.namaPemesan = payload.namaPemesan.trim();
      }

      if (payload.catatan && payload.catatan !== checkOrderData.catatan) {
        updateData.catatan = payload.catatan.trim();
      }

      if (
        payload.noTelpPemesan &&
        payload.noTelpPemesan !== checkOrderData.noTelp
      ) {
        updateData.noTelp = payload.noTelpPemesan;
      }

      if (payload.status && payload.status !== checkOrderData.status) {
        updateData.status = payload.status;
      }

      if (payload.orderDetails) {
        for (const [index, detail] of payload.orderDetails.entries()) {
          const isExist = checkOrderData.pesananDetails.some(
            (m: any) => m?.kaosKakiVariasiId === detail.kodeKaosVariasi
          );

          if (!isExist && !detail.isDeleted) {
            await tx.insert(pesananDetail).values({
              pesananId: payload.id,
              hargaSatuan: payload.orderDetails[index].price,
              jumlah: payload.orderDetails[index].amount,
              kaosKakiVariasiId: payload.orderDetails[index].kodeKaosVariasi,
              deletedAt: null,
              isDeleted: false,
            });
          }

          if (isExist && detail.isDeleted) {
            await tx
              .update(pesananDetail)
              .set({ isDeleted: true, deletedAt: new Date().toISOString() })
              .where(eq(pesananDetail.id, detail.id));
          }
        }
      }

      if (Object.keys(updateData).length > 1) {
        await tx
          .update(pesanan)
          .set(updateData)
          .where(eq(pesanan.id, payload.id));
      }
    });

    res.status(200).json({
      success: true,
      message: "Order data updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrderData = async (
  req: Request<{}, {}, OrderDeleteInput>,
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
        .select({ id: pesanan.id })
        .from(pesanan)
        .where(eq(pesanan.id, payload.id))
        .limit(1);

      if (checkDuplicate.length > 0) {
        throw new AppError("Data Doesnt exist", 404);
      }

      const [deletedOrderData] = await tx
        .update(pesanan)
        .set({
          status: 0,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        })
        .where(eq(pesanan.id, payload.id))
        .returning({
          id: pesanan.id,
          nama: pesanan.namaPemesan,
        });

      await tx
        .update(pesananDetail)
        .set({ isDeleted: true, deletedAt: new Date().toISOString() })
        .where(eq(pesanan.id, payload.id));

      res.status(201).json({
        success: true,
        message: "Kaos Kaki data deleted successfully",
        data: {
          nama: deletedOrderData.nama,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};
