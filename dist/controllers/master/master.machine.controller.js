"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMachineDataPermanent = exports.deleteMachineData = exports.updateMachineData = exports.newMachineData = exports.getMachineDetails = exports.getMachineData = void 0;
const database_1 = require("../../config/database");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getMachineData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const rows = await database_1.db
            .select({
            nama: schema_1.jenisMesin.nama,
            kode: schema_1.jenisMesin.kodeMesin,
        })
            .from(schema_1.jenisMesin)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jenisMesin.isDeleted, false), (0, drizzle_orm_1.isNull)(schema_1.jenisMesin.deletedAt)))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.jenisMesin.nama))
            .limit(limit)
            .offset(offset);
        const [{ total }] = await database_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.jenisMesin);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMachineData = getMachineData;
const getMachineDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid machine ID", 400);
        }
        const [detailMasterData] = await database_1.db
            .select({
            nama: schema_1.jenisMesin.nama,
            kode: schema_1.jenisMesin.kodeMesin,
            createdAt: schema_1.jenisMesin.createdAt,
            updatedAt: schema_1.jenisMesin.updatedAt,
        })
            .from(schema_1.jenisMesin)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisMesin.id, id))
            .limit(1);
        if (!detailMasterData) {
            throw new error_types_1.AppError("Machine not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Machine details retrieved successfully",
            data: {
                detailMasterData,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMachineDetails = getMachineDetails;
const newMachineData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.nama || !payload.kode_mesin) {
            throw new error_types_1.AppError("All fields are required", 400);
        }
        const [newMasterData] = await database_1.db
            .insert(schema_1.jenisMesin)
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
            nama: schema_1.jenisMesin.nama,
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
    }
    catch (error) {
        next(error);
    }
};
exports.newMachineData = newMachineData;
const updateMachineData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.id ||
            (!payload.nama && !payload.kode_mesin && payload.status === undefined)) {
            throw new error_types_1.AppError("ID and at least one field to update are required", 400);
        }
        const updateData = {
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
        const [updatedMasterData] = await database_1.db
            .update(schema_1.jenisMesin)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisMesin.id, payload.id))
            .returning({
            nama: schema_1.jenisMesin.nama,
        });
        if (!updatedMasterData) {
            throw new error_types_1.AppError("Machine not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateMachineData = updateMachineData;
// Soft delete
const deleteMachineData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Machine ID is Not Valid", 400);
        }
        if (isNaN(payload.id)) {
            throw new error_types_1.AppError("Machine ID is Not Valid", 400);
        }
        const [deletedMasterData] = await database_1.db
            .update(schema_1.jenisMesin)
            .set({
            status: 0,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.jenisMesin.id, payload.id))
            .returning({
            nama: schema_1.jenisMesin.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Machine not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMachineData = deleteMachineData;
// Permanent delete
const deleteMachineDataPermanent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.id) {
            throw new error_types_1.AppError("Machine ID is required", 400);
        }
        const [deletedMasterData] = await database_1.db
            .delete(schema_1.jenisMesin)
            .where((0, drizzle_orm_1.eq)(schema_1.jenisMesin.id, payload.id))
            .returning({
            nama: schema_1.jenisMesin.nama,
        });
        if (!deletedMasterData) {
            throw new error_types_1.AppError("Machine not found", 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMachineDataPermanent = deleteMachineDataPermanent;
//# sourceMappingURL=master.machine.controller.js.map