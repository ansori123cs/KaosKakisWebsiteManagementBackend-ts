"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStockData = exports.updateStockData = exports.newStockData = exports.FormDataStokKaosKaki = exports.getStockDetails = exports.getStockData = void 0;
const index_1 = require("../../models/index");
const database_1 = require("../../config/database");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getStockData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const result = await database_1.db.query.kaosKakiStok.findMany({
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
        const [{ total }] = await database_1.db
            .select({ total: (0, drizzle_orm_1.count)() })
            .from(index_1.kaosKakiStok)
            .where((0, drizzle_orm_1.eq)(index_1.kaosKakiStok.isDeleted, false));
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
    }
    catch (error) {
        next(error);
    }
};
exports.getStockData = getStockData;
const getStockDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid Stock", 400);
        }
        const result = await database_1.db.query.kaosKakiStok.findFirst({
            where: (0, drizzle_orm_1.eq)(index_1.kaosKakiStok.id, id),
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
            throw new error_types_1.AppError("Invalid Stock Data Not Found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Success Retrieved Stock Data",
            data: {
                result,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStockDetails = getStockDetails;
const FormDataStokKaosKaki = async (req, res, next) => {
    try {
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // Default limit lebih besar untuk pencarian
        const offset = (page - 1) * limit;
        let whereCondition = undefined;
        if (search) {
            whereCondition = (0, drizzle_orm_1.like)(index_1.kaosKaki.nama, `%${search}%`);
        }
        const [totalResult] = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(index_1.kaosKaki)
            .where(whereCondition);
        const result = await database_1.db
            .select({ id: index_1.kaosKaki.id, nama: index_1.kaosKaki.nama })
            .from(index_1.kaosKaki)
            .where(whereCondition)
            .limit(limit)
            .offset(offset);
        const dropDown = await database_1.db.query.kaosKakiDetailVariasi.findMany({
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
            where: (0, drizzle_orm_1.inArray)(index_1.kaosKakiDetailVariasi.kaosKakiId, result.map((r) => r.id)),
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
    }
    catch (error) {
        next(error);
    }
};
exports.FormDataStokKaosKaki = FormDataStokKaosKaki;
const newStockData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload) {
            throw new error_types_1.AppError("Invalid Input", 400);
        }
        await database_1.db.transaction(async (tx) => {
            const [newStock] = await tx
                .insert(index_1.kaosKakiStok)
                .values({
                idKaos: payload.variasi.kodeKaos,
                idUkuran: payload.variasi.kodeUkuran,
                idWarna: payload.variasi.kodeWarna,
                stok: payload.stockAmmount,
            })
                .returning({
                idKaos: index_1.kaosKakiStok.idKaos,
            });
            if (newStock.idKaos) {
                const result = await tx
                    .select({ nama: index_1.kaosKaki.nama })
                    .from(index_1.kaosKaki)
                    .where((0, drizzle_orm_1.eq)(index_1.kaosKaki.id, newStock.idKaos));
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
    }
    catch (error) {
        next(error);
    }
};
exports.newStockData = newStockData;
const updateStockData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (payload.variasi) {
            const checkStockData = await database_1.db.query.kaosKakiStok.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idUkuran, payload.variasi?.kodeUkuran), (0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idKaos, payload.variasi?.kodeKaos), (0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idWarna, payload.variasi?.kodeWarna)),
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
                await database_1.db.transaction(async (tx) => {
                    const updateData = {
                        updatedAt: new Date().toISOString(),
                    };
                    if (payload.isDeleted) {
                        updateData.isDeleted = true;
                    }
                    if (payload.stockAmmount && checkStockData.stok) {
                        updateData.stok = payload.stockAmmount;
                    }
                    if (payload.variasi) {
                        const [updatedStockData] = await database_1.db
                            .update(index_1.kaosKakiStok)
                            .set(updateData)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idUkuran, payload.variasi?.kodeUkuran), (0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idKaos, payload.variasi?.kodeKaos), (0, drizzle_orm_1.eq)(index_1.kaosKakiStok.idWarna, payload.variasi?.kodeWarna)))
                            .returning({ nama: index_1.kaosKakiStok.stok });
                        res.status(200).json({
                            success: true,
                            message: `Order data updated successfully to ${updatedStockData.nama}`,
                        });
                    }
                });
            }
            throw new error_types_1.AppError("Stock data not found", 404);
        }
        throw new error_types_1.AppError("ID and at least one field update are required", 400);
    }
    catch (error) {
        next(error);
    }
};
exports.updateStockData = updateStockData;
const deleteStockData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || payload.id === undefined || payload.userId === undefined) {
            throw new error_types_1.AppError("Error During Delete", 404);
        }
        await database_1.db.transaction(async (tx) => {
            const checkDuplicate = await tx
                .select({ id: index_1.kaosKakiStok.id })
                .from(index_1.kaosKakiStok)
                .where((0, drizzle_orm_1.eq)(index_1.kaosKakiStok.id, payload.id))
                .limit(1);
            if (checkDuplicate.length > 0) {
                throw new error_types_1.AppError("Data Doesnt exist", 404);
            }
            await tx
                .update(index_1.kaosKakiStok)
                .set({
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            })
                .where((0, drizzle_orm_1.eq)(index_1.kaosKakiStok.id, payload.id));
            res.status(201).json({
                success: true,
                message: "Stock data deleted successfully",
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStockData = deleteStockData;
//# sourceMappingURL=stock.transaction.controller.js.map