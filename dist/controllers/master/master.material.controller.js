"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaterialDataPermanent = exports.deleteMaterialData = exports.updateMaterialData = exports.newMaterialData = exports.getMaterialDetails = exports.getMaterialData = void 0;
const database_1 = require("../../config/database");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getMaterialData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const rows = await database_1.db
            .select({
            nama: schema_1.jenisBahan.nama,
            kode: schema_1.jenisBahan.kodeBahan,
        })
            .from(schema_1.jenisBahan)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jenisBahan.isDeleted, false), (0, drizzle_orm_1.isNull)(schema_1.jenisBahan.deletedAt)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.jenisBahan.nama))
            .limit(limit)
            .offset(offset);
        const [{ total }] = await database_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.jenisBahan);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMaterialData = getMaterialData;
const getMaterialDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid material ID", 400);
        }
        const [detailMasterData] = await database_1.db
            .select({
            nama: schema_1.jenisBahan.nama,
            kode: schema_1.jenisBahan.kodeBahan,
            createdAt: schema_1.jenisBahan.createdAt,
            updatedAt: schema_1.jenisBahan.updatedAt,
        })
            .from(schema_1.jenisBahan)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisBahan.id, id))
            .limit(1);
        if (!detailMasterData) {
            throw new error_types_1.AppError("Material not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Material details retrieved successfully",
            data: {
                detailMasterData,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMaterialDetails = getMaterialDetails;
const newMaterialData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.nama || !payload.kode_bahan) {
            throw new error_types_1.AppError("All fields are required", 400);
        }
        const [newMasterData] = await database_1.db
            .insert(schema_1.jenisBahan)
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
            nama: schema_1.jenisBahan.nama,
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
    }
    catch (error) {
        next(error);
    }
};
exports.newMaterialData = newMaterialData;
const updateMaterialData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.id ||
            (!payload.nama && !payload.kode_bahan && payload.status === undefined)) {
            throw new error_types_1.AppError("ID and at least one field to update are required", 400);
        }
        const updateData = {
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
        const [updatedMasterData] = await database_1.db
            .update(schema_1.jenisBahan)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisBahan.id, payload.id))
            .returning({
            nama: schema_1.jenisBahan.nama,
        });
        if (!updatedMasterData) {
            throw new error_types_1.AppError("Material not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateMaterialData = updateMaterialData;
// Soft delete
const deleteMaterialData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Material ID is Not Valid", 400);
        }
        if (isNaN(payload.id)) {
            throw new error_types_1.AppError("Material ID is Not Valid", 400);
        }
        const [deletedMasterData] = await database_1.db
            .update(schema_1.jenisBahan)
            .set({
            status: 0,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.jenisBahan.id, payload.id))
            .returning({
            nama: schema_1.jenisBahan.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Material not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMaterialData = deleteMaterialData;
// Permanent delete
const deleteMaterialDataPermanent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("material ID is required", 400);
        }
        const [deletedMasterData] = await database_1.db
            .delete(schema_1.jenisBahan)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisBahan.id, payload.id))
            .returning({
            nama: schema_1.jenisBahan.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("material not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMaterialDataPermanent = deleteMaterialDataPermanent;
//# sourceMappingURL=master.material.controller.js.map