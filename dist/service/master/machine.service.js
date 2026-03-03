// // src/services/machine.service.ts
// import { machineRepository } from "@/repositories/machine.repository";
// import { AppError } from "../../types/middleware/error.types.ts";
// import {
//   Machine,
//   MachineCreateInput,
//   MachineUpdateInput,
//   MachineQueryParams,
// } from "../../types/save/master/machine.types.ts";
// import { PaginationParams } from "../../types/save/master/base.master.types.ts";
// import { PaginatedResponse } from "../../types/api/response.types.ts";
export {};
// export class MachineService {
//   /**
//    * Get machine by ID
//    */
//   async getMachineById(id: number): Promise<Machine> {
//     const machine = await machineRepository.findById(id);
//     if (!machine) {
//       throw AppError.notFound(`Machine with ID ${id} not found`);
//     }
//     return machine;
//   }
//   /**
//    * Get all machines with pagination
//    */
//   async getAllMachines(params: MachineQueryParams & PaginationParams) {
//     const { data, total } = await machineRepository.findAll(params);
//     const { page = 1, limit = 10 } = params;
//     const totalPages = Math.ceil(total / limit);
//     return {
//       data,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasNext: page < totalPages,
//         hasPrev: page > 1,
//       },
//     };
//   }
//   /**
//    * Create new machine
//    */
//   async createMachine(data: MachineCreateInput): Promise<Machine> {
//     // Validate required fields
//     if (!data.nama || !data.kode_mesin) {
//       throw AppError.badRequest("Name and machine code are required");
//     }
//     // Check if code already exists
//     const codeExists = await machineRepository.isCodeExists(data.kode_mesin);
//     if (codeExists) {
//       throw AppError.conflict(
//         `Machine with code ${data.kode_mesin} already exists`
//       );
//     }
//     // Create machine
//     return await machineRepository.create(data);
//   }
//   /**
//    * Update machine
//    */
//   async updateMachine(id: number, data: MachineUpdateInput): Promise<Machine> {
//     // Check if machine exists
//     const existingMachine = await machineRepository.findById(id);
//     if (!existingMachine) {
//       throw AppError.notFound(`Machine with ID ${id} not found`);
//     }
//     // Validate at least one field is provided
//     const hasUpdateData =
//       data.nama !== undefined ||
//       data.kode_mesin !== undefined ||
//       data.status !== undefined;
//     if (!hasUpdateData) {
//       throw AppError.badRequest(
//         "At least one field must be provided for update"
//       );
//     }
//     // If updating code, check for duplicates
//     if (
//       data.kode_mesin !== undefined &&
//       data.kode_mesin !== existingMachine.kodeMesin
//     ) {
//       const codeExists = await machineRepository.isCodeExists(
//         data.kode_mesin,
//         id
//       );
//       if (codeExists) {
//         throw AppError.conflict(
//           `Machine with code ${data.kode_mesin} already exists`
//         );
//       }
//     }
//     // Check if there are actual changes
//     let hasChanges = false;
//     if (data.nama !== undefined && data.nama.trim() !== existingMachine.nama) {
//       hasChanges = true;
//     }
//     if (
//       data.kode_mesin !== undefined &&
//       data.kode_mesin.trim() !== existingMachine.kodeMesin
//     ) {
//       hasChanges = true;
//     }
//     if (data.status !== undefined && data.status !== existingMachine.status) {
//       hasChanges = true;
//     }
//     if (!hasChanges) {
//       throw AppError.badRequest("No changes detected");
//     }
//     // Update machine
//     return await machineRepository.update(id, data);
//   }
//   /**
//    * Delete machine
//    */
//   async deleteMachine(id: number): Promise<void> {
//     const machine = await machineRepository.findById(id);
//     if (!machine) {
//       throw AppError.notFound(`Machine with ID ${id} not found`);
//     }
//     // Check if machine can be deleted (business rules)
//     if (machine.status === -1) {
//       throw AppError.badRequest("Machine is already deleted");
//     }
//     // Perform soft delete or actual delete based on requirements
//     const deleted = await machineRepository.delete(id);
//     if (!deleted) {
//       throw AppError.internal("Failed to delete machine");
//     }
//   }
//   /**
//    * Search machines
//    */
//   async searchMachines(searchTerm: string, params: PaginationParams) {
//     return await this.getAllMachines({
//       ...params,
//       search: searchTerm,
//     });
//   }
//   /**
//    * Get machine statistics
//    */
//   async getMachineStats() {
//     const total = await machineRepository.count();
//     // You can add more statistics here
//     return {
//       total,
//       // active: await this.countByStatus(1),
//       // inactive: await this.countByStatus(0),
//       // etc.
//     };
//   }
//   /**
//    * Export machines data
//    */
//   async exportMachines(params: MachineQueryParams & PaginationParams) {
//     const { data } = await machineRepository.findAll({
//       ...params,
//       limit: params.limit || 1000, // Larger limit for export
//     });
//     // Transform data for export
//     return data.map((machine) => ({
//       ID: machine.id,
//       Name: machine.nama,
//       Code: machine.kodeMesin,
//       Status:
//         machine.status === 1
//           ? "Active"
//           : machine.status === 0
//           ? "Inactive"
//           : "Deleted",
//       "Created Date": machine.createdAt,
//       "Updated Date": machine.updatedAt,
//     }));
//   }
// }
// // Singleton instance
// export const machineService = new MachineService();
