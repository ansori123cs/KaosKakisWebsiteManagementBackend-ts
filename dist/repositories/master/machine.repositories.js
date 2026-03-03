// // src/repositories/machine.repository.ts
// import { eq, asc, desc, sql, count, like, or } from "drizzle-orm";
// import { jenisMesin } from "../../models/schema.ts";
// import { db } from "../../config/database.ts";
// import {
//   Machine,
//   MachineCreateInput,
//   MachineUpdateInput,
//   MachineQueryParams,
// } from "../../types/save/master/machine.types.ts";
// import { PaginationParams } from "../../types/save/master/base.master.types.ts";
export {};
// export class MachineRepository {
//   /**
//    * Find machine by ID
//    */
//   async findById(id: number): Promise<Machine | null> {
//     const [machine] = await db
//       .select()
//       .from(jenisMesin)
//       .where(eq(jenisMesin.id, id))
//       .limit(1);
//     return machine || null;
//   }
//   /**
//    * Find machine by code
//    */
//   async findByCode(kodeMesin: string): Promise<Machine | null> {
//     const [machine] = await db
//       .select()
//       .from(jenisMesin)
//       .where(eq(jenisMesin.kodeMesin, kodeMesin))
//       .limit(1);
//     return machine || null;
//   }
//   /**
//    * Find all machines with pagination and filtering
//    */
//   async findAll(
//     params: MachineQueryParams & PaginationParams
//   ): Promise<{ data: Machine[]; total: number }> {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       status,
//       sortBy = "nama",
//       sortOrder = "asc",
//     } = params;
//     const offset = (page - 1) * limit;
//     // Build query
//     let query = db.select().from(jenisMesin);
//     // Apply filters
//     if (search) {
//       query = query.where(
//         or(
//           like(jenisMesin.nama, `%${search}%`),
//           like(jenisMesin.kodeMesin, `%${search}%`)
//         )
//       );
//     }
//     if (status !== undefined) {
//       query = query.where(eq(jenisMesin.status, status));
//     }
//     // Apply sorting
//     const sortColumn = jenisMesin[sortBy as keyof typeof jenisMesin];
//     if (sortColumn) {
//       query = query.orderBy(
//         sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn)
//       );
//     }
//     // Apply pagination
//     const data = await query.limit(limit).offset(offset);
//     // Get total count (with same filters)
//     let countQuery = db.select({ count: count() }).from(jenisMesin);
//     if (search) {
//       countQuery = countQuery.where(
//         or(
//           like(jenisMesin.nama, `%${search}%`),
//           like(jenisMesin.kodeMesin, `%${search}%`)
//         )
//       );
//     }
//     if (status !== undefined) {
//       countQuery = countQuery.where(eq(jenisMesin.status, status));
//     }
//     const [{ total }] = await countQuery;
//     return { data, total };
//   }
//   /**
//    * Create new machine
//    */
//   async create(data: MachineCreateInput): Promise<Machine> {
//     const [machine] = await db
//       .insert(jenisMesin)
//       .values({
//         nama: data.nama.trim(),
//         kodeMesin: data.kode_mesin.trim(),
//         status: data.status || 1, // default active
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();
//     return machine;
//   }
//   /**
//    * Update machine
//    */
//   async update(id: number, data: MachineUpdateInput): Promise<Machine> {
//     const updateData: Record<string, any> = {
//       updatedAt: new Date(),
//     };
//     // Only include defined fields
//     if (data.nama !== undefined) updateData.nama = data.nama.trim();
//     if (data.kode_mesin !== undefined)
//       updateData.kodeMesin = data.kode_mesin.trim();
//     if (data.status !== undefined) updateData.status = data.status;
//     const [machine] = await db
//       .update(jenisMesin)
//       .set(updateData)
//       .where(eq(jenisMesin.id, id))
//       .returning();
//     if (!machine) {
//       throw new Error(`Machine with id ${id} not found`);
//     }
//     return machine;
//   }
//   /**
//    * Delete machine (soft delete if implemented)
//    */
//   async delete(id: number): Promise<boolean> {
//     const result = await db
//       .update(jenisMesin)
//       .set({
//         status: -1, // atau field deletedAt jika ada
//         updatedAt: new Date(),
//       })
//       .where(eq(jenisMesin.id, id));
//     return result.rowCount > 0;
//   }
//   /**
//    * Count all machines
//    */
//   async count(): Promise<number> {
//     const [{ total }] = await db.select({ total: count() }).from(jenisMesin);
//     return total;
//   }
//   /**
//    * Check if machine with code already exists (for validation)
//    */
//   async isCodeExists(kodeMesin: string, excludeId?: number): Promise<boolean> {
//     let query = db
//       .select({ count: count() })
//       .from(jenisMesin)
//       .where(eq(jenisMesin.kodeMesin, kodeMesin));
//     if (excludeId) {
//       query = query.where(sql`${jenisMesin.id} != ${excludeId}`);
//     }
//     const [{ count }] = await query;
//     return count > 0;
//   }
// }
// // Singleton instance
// export const machineRepository = new MachineRepository();
