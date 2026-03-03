"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSizeDataPermanent = exports.deleteSizeData = exports.updateSizeData = exports.newSizeData = exports.getSizeDetails = exports.getSizeData = void 0;
const database_1 = require("../../config/database");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getSizeData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const rows = await database_1.db
            .select({
            nama: schema_1.jenisUkuran.nama,
            kode: schema_1.jenisUkuran.kodeUkuran,
        })
            .from(schema_1.jenisUkuran)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jenisUkuran.isDeleted, false), (0, drizzle_orm_1.isNull)(schema_1.jenisUkuran.deletedAt)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.jenisUkuran.nama))
            .limit(limit)
            .offset(offset);
        const [{ total }] = await database_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.jenisUkuran);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSizeData = getSizeData;
const getSizeDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid size ID", 400);
        }
        const [detailMasterData] = await database_1.db
            .select({
            nama: schema_1.jenisUkuran.nama,
            kode: schema_1.jenisUkuran.kodeUkuran,
            createdAt: schema_1.jenisUkuran.createdAt,
            updatedAt: schema_1.jenisUkuran.updatedAt,
        })
            .from(schema_1.jenisUkuran)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisUkuran.id, id))
            .limit(1);
        if (!detailMasterData) {
            throw new error_types_1.AppError("Size not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Size details retrieved successfully",
            data: {
                detailMasterData,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSizeDetails = getSizeDetails;
const newSizeData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.nama || !payload.kode_ukuran) {
            throw new error_types_1.AppError("All fields are required", 400);
        }
        const [newMasterData] = await database_1.db
            .insert(schema_1.jenisUkuran)
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
            nama: schema_1.jenisUkuran.nama,
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
    }
    catch (error) {
        next(error);
    }
};
exports.newSizeData = newSizeData;
const updateSizeData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.id ||
            (!payload.nama && !payload.kode_ukuran && payload.status === undefined)) {
            throw new error_types_1.AppError("ID and at least one field to update are required", 400);
        }
        const updateData = {
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
        const [updatedMasterData] = await database_1.db
            .update(schema_1.jenisUkuran)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisUkuran.id, payload.id))
            .returning({
            nama: schema_1.jenisUkuran.nama,
        });
        if (!updatedMasterData) {
            throw new error_types_1.AppError("Size not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateSizeData = updateSizeData;
// Soft delete
const deleteSizeData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Size ID is Not Valid", 400);
        }
        if (isNaN(payload.id)) {
            throw new error_types_1.AppError("Size ID is Not Valid", 400);
        }
        const [deletedMasterData] = await database_1.db
            .update(schema_1.jenisUkuran)
            .set({
            status: 0,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.jenisUkuran.id, payload.id))
            .returning({
            nama: schema_1.jenisUkuran.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Size not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSizeData = deleteSizeData;
// Permanent delete
const deleteSizeDataPermanent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Size ID is required", 400);
        }
        const [deletedMasterData] = await database_1.db
            .delete(schema_1.jenisUkuran)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisUkuran.id, payload.id))
            .returning({
            nama: schema_1.jenisUkuran.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Size not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSizeDataPermanent = deleteSizeDataPermanent;
//# sourceMappingURL=master.size.controller.js.map