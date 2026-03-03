import { auditLog } from "../models/index.js";
import { db } from "../config/database.js";

export const AuditLogsUtils = async (
  userId: string,
  tableId: number,
  action: string,
  tableName: string,
  oldData: JSON,
  newData: JSON
) => {
  const [newAuditLog] = await db.insert(auditLog).values({
    action,
    tableName,
    userId,
    newData,
    oldData,
    recordId: tableId.toString(),
    occurredAt: new Date().toISOString(),
  });
};
