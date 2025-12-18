import {
  kaosKaki,
  kaosKakiDetailFoto,
  kaosKakiDetailMesin,
} from "../../models/index.ts";
import { db } from "../../config/database.ts";
import type { Request, Response, NextFunction } from "express";
import { asc, eq, count } from "drizzle-orm";

export const getKaosKakiData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    console.log("========>");
    const result = await db.query.kaosKaki.findMany({
      with: {
        kaosKakiDetailFotos: true, // ⚠️ Pastikan nama 'foto' sesuai dengan relations
      },
      where: (kaosKaki, { eq }) => eq(kaosKaki.isDeleted, false),
      limit: 1,
    });

    console.log("========>" + result);

    const rows = await db
      .select()
      .from(kaosKaki)
      .leftJoin(
        kaosKakiDetailFoto,
        eq(kaosKaki.id, kaosKakiDetailFoto.kaosKakiId)
      )
      .leftJoin(
        kaosKakiDetailMesin,
        eq(kaosKaki.id, kaosKakiDetailMesin.kaosKakiId)
      )
      .where(eq(kaosKaki.isDeleted, false))
      .orderBy(asc(kaosKaki.nama))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(kaosKaki)
      .where(eq(kaosKaki.isDeleted, false));

    const totalPages = Math.ceil(total / limit);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Kaos Kaki Data Found !",
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
