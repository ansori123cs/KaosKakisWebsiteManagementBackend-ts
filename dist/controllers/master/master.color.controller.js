"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColorDataPermanent = exports.deleteColorData = exports.updateColorData = exports.newColorData = exports.getColorDetails = exports.getColorData = void 0;
const database_1 = require("../../config/database");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getColorData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const rows = await database_1.db
            .select({
            nama: schema_1.jenisWarna.nama,
            kode: schema_1.jenisWarna.kodeWarna,
        })
            .from(schema_1.jenisWarna)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jenisWarna.isDeleted, false), (0, drizzle_orm_1.isNull)(schema_1.jenisWarna.deletedAt)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.jenisWarna.nama))
            .limit(limit)
            .offset(offset);
        const [{ total }] = await database_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.jenisWarna);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getColorData = getColorData;
const getColorDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid color ID", 400);
        }
        const [detailMasterData] = await database_1.db
            .select({
            nama: schema_1.jenisWarna.nama,
            kode: schema_1.jenisWarna.kodeWarna,
            createdAt: schema_1.jenisWarna.createdAt,
            updatedAt: schema_1.jenisWarna.updatedAt,
        })
            .from(schema_1.jenisWarna)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisWarna.id, id))
            .limit(1);
        if (!detailMasterData) {
            throw new error_types_1.AppError("Color not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Color details retrieved successfully",
            data: {
                detailMasterData,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getColorDetails = getColorDetails;
const newColorData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.nama || !payload.kode_warna) {
            throw new error_types_1.AppError("All fields are required", 400);
        }
        const [newMasterData] = await database_1.db
            .insert(schema_1.jenisWarna)
            .values({
            nama: payload.nama.trim(),
            kodeWarna: payload.kode_warna.trim(),
            status: payload.status ?? 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
            deletedAt: null,
        })
            .returning({
            nama: schema_1.jenisWarna.nama,
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
    }
    catch (error) {
        next(error);
    }
};
exports.newColorData = newColorData;
const updateColorData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.id ||
            (!payload.nama && !payload.kode_warna && payload.status === undefined)) {
            throw new error_types_1.AppError("ID and at least one field to update are required", 400);
        }
        const updateData = {
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
        if (payload.isDeleted) {
            updateData.isDeleted = payload.isDeleted;
            updateData.deletedAt = new Date().toISOString();
        }
        const [updatedMasterData] = await database_1.db
            .update(schema_1.jenisWarna)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisWarna.id, payload.id))
            .returning({
            nama: schema_1.jenisWarna.nama,
        });
        if (!updatedMasterData) {
            throw new error_types_1.AppError("Color not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateColorData = updateColorData;
// Soft delete
const deleteColorData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Color ID is Not Valid", 400);
        }
        if (isNaN(payload.id)) {
            throw new error_types_1.AppError("Color ID is Not Valid", 400);
        }
        const [deletedMasterData] = await database_1.db
            .update(schema_1.jenisWarna)
            .set({
            status: 0,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.jenisWarna.id, payload.id))
            .returning({
            nama: schema_1.jenisWarna.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Color not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteColorData = deleteColorData;
// Permanent delete
const deleteColorDataPermanent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Color ID is required", 400);
        }
        const [deletedMasterData] = await database_1.db
            .delete(schema_1.jenisWarna)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisWarna.id, payload.id))
            .returning({
            nama: schema_1.jenisWarna.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Color not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteColorDataPermanent = deleteColorDataPermanent;
//# sourceMappingURL=master.color.controller.js.map