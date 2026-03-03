"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsUtils = void 0;
const index_1 = require("../models/index");
const database_1 = require("../config/database");
const AuditLogsUtils = async (userId, tableId, action, tableName, oldData, newData) => {
    const [newAuditLog] = await database_1.db.insert(index_1.auditLog).values({
        action,
        tableName,
        userId,
        newData,
        oldData,
        recordId: tableId.toString(),
        occurredAt: new Date().toISOString(),
    });
};
exports.AuditLogsUtils = AuditLogsUtils;
//# sourceMappingURL=audit.utils.js.map