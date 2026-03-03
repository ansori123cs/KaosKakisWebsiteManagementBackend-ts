"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderData = exports.updateOrderData = exports.newOrderData = exports.FormDataOrderDetailKaosKaki = exports.FormDataOrderKaosKaki = exports.getOrderDetails = exports.getOrderData = void 0;
const index_1 = require("../../models/index");
const database_1 = require("../../config/database");
const drizzle_orm_1 = require("drizzle-orm");
const error_types_1 = require("../../types/middleware/error.types");
const getOrderData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const result = await database_1.db.query.pesanan.findMany({
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
        const [{ total }] = await database_1.db
            .select({ total: (0, drizzle_orm_1.count)() })
            .from(index_1.pesanan)
            .where((0, drizzle_orm_1.eq)(index_1.pesanan.isDeleted, false));
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
exports.getOrderData = getOrderData;
const getOrderDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid Order", 400);
        }
        const result = await database_1.db.query.pesanan.findFirst({
            where: (0, drizzle_orm_1.eq)(index_1.pesanan.id, id),
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
            throw new error_types_1.AppError("Invalid Order Data Not Found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Success Retrieved Order Data",
            data: {
                result,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderDetails = getOrderDetails;
const FormDataOrderKaosKaki = async (req, res, next) => {
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
        res.status(200).json({
            success: true,
            message: "Success Load Form Data Order",
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
    }
    catch (error) {
        next(error);
    }
};
exports.FormDataOrderKaosKaki = FormDataOrderKaosKaki;
const FormDataOrderDetailKaosKaki = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            throw new error_types_1.AppError("Invalid Kaos Kaki", 400);
        }
        const result = await database_1.db.query.kaosKaki.findMany({
            where: (0, drizzle_orm_1.eq)(index_1.kaosKaki.id, id),
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
    }
    catch (error) {
        next(error);
    }
};
exports.FormDataOrderDetailKaosKaki = FormDataOrderDetailKaosKaki;
const newOrderData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.createdAt ||
            !payload.namaPemesan ||
            !payload.orderDetails?.length) {
            throw new error_types_1.AppError("Invalid Input - namaPemesan, createdAt, and orderDetails are required", 400);
        }
        await database_1.db.transaction(async (tx) => {
            if (payload.createdAt) {
                const checkDuplicate = await tx
                    .select({ id: index_1.pesanan.id })
                    .from(index_1.pesanan)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.pesanan.namaPemesan, payload.namaPemesan.trim()), (0, drizzle_orm_1.eq)(index_1.pesanan.createdAt, payload.createdAt.toISOString())))
                    .limit(1);
                if (checkDuplicate.length > 0) {
                    throw new error_types_1.AppError("Pesanan dengan nama dan tanggal yang sama ada kemungkinan duplicate order", 400);
                }
                const [newOrder] = await tx
                    .insert(index_1.pesanan)
                    .values({
                    namaPemesan: payload.namaPemesan.trim(),
                    catatan: payload.catatan.trim(),
                    createdAt: payload.createdAt.toISOString(),
                })
                    .returning({
                    id: index_1.pesanan.id,
                    nama: index_1.pesanan.namaPemesan,
                });
                if (payload.orderDetails?.length) {
                    for (const variasi of payload.orderDetails) {
                        await tx.insert(index_1.pesananDetail).values({
                            kaosKakiVariasiId: variasi.kodeKaosVariasi,
                            hargaSatuan: variasi.price,
                            jumlah: variasi.amount,
                            pesananId: newOrder.id,
                            deletedAt: null,
                            isDeleted: false,
                        });
                    }
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
    }
    catch (error) {
        next(error);
    }
};
exports.newOrderData = newOrderData;
const updateOrderData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload?.id) {
            throw new error_types_1.AppError("ID and at least one field update are required", 400);
        }
        const checkOrderData = await database_1.db.query.pesanan.findFirst({
            where: (0, drizzle_orm_1.eq)(index_1.pesanan.id, payload.id),
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
            throw new error_types_1.AppError("Order data not found", 404);
        }
        await database_1.db.transaction(async (tx) => {
            const updateData = {
                updatedAt: new Date().toISOString(),
            };
            if (payload.namaPemesan &&
                payload.namaPemesan !== checkOrderData.namaPemesan) {
                updateData.namaPemesan = payload.namaPemesan.trim();
            }
            if (payload.catatan && payload.catatan !== checkOrderData.catatan) {
                updateData.catatan = payload.catatan.trim();
            }
            if (payload.noTelpPemesan &&
                payload.noTelpPemesan !== checkOrderData.noTelp) {
                updateData.noTelp = payload.noTelpPemesan;
            }
            if (payload.status && payload.status !== checkOrderData.status) {
                updateData.status = payload.status;
            }
            if (payload.orderDetails) {
                for (const [index, detail] of payload.orderDetails.entries()) {
                    const isExist = checkOrderData.pesananDetails.some((m) => m?.kaosKakiVariasiId === detail.kodeKaosVariasi);
                    if (!isExist && !detail.isDeleted) {
                        await tx.insert(index_1.pesananDetail).values({
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
                            .update(index_1.pesananDetail)
                            .set({ isDeleted: true, deletedAt: new Date().toISOString() })
                            .where((0, drizzle_orm_1.eq)(index_1.pesananDetail.id, detail.id));
                    }
                }
            }
            if (Object.keys(updateData).length > 1) {
                await tx
                    .update(index_1.pesanan)
                    .set(updateData)
                    .where((0, drizzle_orm_1.eq)(index_1.pesanan.id, payload.id));
            }
        });
        res.status(200).json({
            success: true,
            message: "Order data updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderData = updateOrderData;
const deleteOrderData = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || payload.id === undefined || payload.userId === undefined) {
            throw new error_types_1.AppError("Error During Delete", 404);
        }
        await database_1.db.transaction(async (tx) => {
            const checkOrderExists = await tx
                .select({ id: index_1.pesanan.id })
                .from(index_1.pesanan)
                .where((0, drizzle_orm_1.eq)(index_1.pesanan.id, payload.id))
                .limit(1);
            if (checkOrderExists.length === 0) {
                throw new error_types_1.AppError("Data Doesn't exist", 404);
            }
            const [deletedOrderData] = await tx
                .update(index_1.pesanan)
                .set({
                status: 0,
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            })
                .where((0, drizzle_orm_1.eq)(index_1.pesanan.id, payload.id))
                .returning({
                id: index_1.pesanan.id,
                nama: index_1.pesanan.namaPemesan,
            });
            await tx
                .update(index_1.pesananDetail)
                .set({ isDeleted: true, deletedAt: new Date().toISOString() })
                .where((0, drizzle_orm_1.eq)(index_1.pesananDetail.pesananId, payload.id));
            res.status(201).json({
                success: true,
                message: "Order data deleted successfully",
                data: {
                    nama: deletedOrderData.nama,
                },
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrderData = deleteOrderData;
//# sourceMappingURL=order.transaction.controller.js.map