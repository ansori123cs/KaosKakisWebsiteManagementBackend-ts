import { auditLog } from "../models/index.ts";
import { db } from "../config/database.ts";

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
