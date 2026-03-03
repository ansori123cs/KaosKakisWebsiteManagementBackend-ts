// // src/services/kaos-kaki-update.service

// import { eq } from "drizzle-orm";

// import { AppError } from "../../types/middleware/error.types";
// import {
//   KaosKakiUpdateInput,
//   KaosKakiExistingData,
//   UpdateKaosKakiData,
// } from "../../types/save/transaction/kaos_kaki.types";
// import { kaosKakiDetailMesin, kaosKaki } from "../../models/schema";
// import { db } from "../../config/database";

// export class KaosKakiUpdateService {
//   /**
//    * Validasi input update
//    */
//   private validateUpdateInput(payload: KaosKakiUpdateInput): void {
//     if (!payload?.id) {
//       throw new AppError("ID is required", 400);
//     }

//     // Check if at least one field is provided for update
//     const updateFields = [
//       "nama",
//       "keterangan",
//       "jenis_bahan",
//       "kode_kaos_kaki",
//       "last_order",
//       "status",
//       "mesin",
//       "foto",
//     ];
//     const hasUpdates = updateFields.some(
//       (field) => payload[field as keyof KaosKakiUpdateInput] !== undefined
//     );

//     if (!hasUpdates) {
//       throw new AppError("At least one field update is required", 400);
//     }
//   }

//   /**
//    * Get existing kaos kaki data with relations
//    */
//   async getExistingData(id: number): Promise<KaosKakiExistingData> {
//     const existingData = await db.query.kaosKaki.findFirst({
//       where: eq(kaosKaki.id, id),
//       with: {
//         jenisBahan: {
//           columns: {
//             id: true,
//             nama: true,
//           },
//         },
//         kaosKakiDetailFotos: {
//           columns: {
//             id: true,
//             isPrimary: true,
//             url: true,
//           },
//         },
//         kaosKakiDetailMesins: {
//           columns: {
//             id: true,
//           },
//           with: {
//             jenisMesin: {
//               columns: {
//                 id: true,
//                 nama: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!existingData) {
//       throw new AppError("Kaos kaki data not found", 404);
//     }

//     return existingData;
//   }

//   /**
//    * Build update data object based on changes
//    */
//   private buildUpdateData(
//     payload: KaosKakiUpdateInput,
//     existingData: KaosKakiExistingData
//   ): UpdateKaosKakiData {
//     const updateData: UpdateKaosKakiData = {
//       updatedAt: new Date().toISOString(),
//     };

//     // Helper function to check and add updates
//     const addUpdateIfChanged = <T>(
//       payloadField: T | undefined,
//       existingField: T,
//       updateKey: keyof UpdateKaosKakiData
//     ) => {
//       if (payloadField !== undefined && payloadField !== existingField) {
//         updateData[updateKey] = payloadField as any;
//       }
//     };

//     // Apply updates for each field
//     addUpdateIfChanged(payload.nama?.trim(), existingData.nama, "nama");
//     addUpdateIfChanged(
//       payload.keterangan?.trim(),
//       existingData.keterangan || "",
//       "keterangan"
//     );
//     addUpdateIfChanged(
//       payload.jenis_bahan,
//       existingData.jenisBahanId,
//       "jenisBahanId"
//     );
//     addUpdateIfChanged(
//       payload.kode_kaos_kaki?.trim(),
//       existingData.kodeKaosKaki,
//       "kodeKaosKaki"
//     );
//     addUpdateIfChanged(
//       payload.last_order,
//       existingData.lastOrderDate,
//       "lastOrderDate"
//     );
//     addUpdateIfChanged(payload.status, existingData.status, "status");

//     return updateData;
//   }

//   /**
//    * Extract machine IDs that need to be updated
//    */
//   private getMachineUpdates(
//     newMachineIds: string[] = [],
//     existingMachines: KaosKakiExistingData["kaosKakiDetailMesins"] = []
//   ): {
//     machinesToAdd: string[];
//     machinesToRemove: string[];
//   } {
//     const existingMachineIds = existingMachines.map((m) => m.id);

//     // Find machines to add (in new but not in existing)
//     const machinesToAdd = newMachineIds.filter(
//       (machineId) => !existingMachineIds.includes(Number(machineId))
//     );

//     // Find machines to remove (in existing but not in new)
//     const machinesToRemove = existingMachineIds.filter(
//       (machineId) => !newMachineIds.includes(machineId.toString())
//     );

//     return { machinesToAdd, machinesToRemove };
//   }

//   /**
//    * Extract photo URLs that need to be updated
//    */
//   private getPhotoUpdates(
//     newPhotos: Array<{ url: string; isPrimary?: boolean }> = [],
//     existingPhotos: KaosKakiExistingData["kaosKakiDetailFotos"] = []
//   ): {
//     photosToAdd: Array<{ url: string; isPrimary?: boolean }>;
//     photosToRemove: string[];
//   } {
//     const existingPhotoUrls = existingPhotos.map((p) => p.url);

//     // Find photos to add (in new but not in existing)
//     const photosToAdd = newPhotos.filter(
//       (photo) => !existingPhotoUrls.includes(photo.url)
//     );

//     // Find photos to remove (in existing but not in new)
//     const photosToRemove = existingPhotos
//       .filter((photo) => !newPhotos.some((p) => p.url === photo.url))
//       .map((photo) => photo.id);

//     return { photosToAdd, photosToRemove };
//   }

//   /**
//    * Execute the update transaction
//    */
//   async executeUpdate(
//     payload: KaosKakiUpdateInput,
//     existingData: KaosKakiExistingData,
//     updateData: UpdateKaosKakiData
//   ): Promise<{ nama: string }> {
//     const machineUpdates = this.getMachineUpdates(
//       payload.mesin,
//       existingData.kaosKakiDetailMesin
//     );

//     const photoUpdates = this.getPhotoUpdates(
//       payload.foto,
//       existingData.kaosKakiDetailFotos
//     );

//     return await db.transaction(async (tx) => {
//       // Update main kaos kaki data
//       const [updatedKaosKakiData] = await tx
//         .update(kaosKaki)
//         .set(updateData)
//         .where(eq(kaosKaki.id, payload.id))
//         .returning({ nama: kaosKaki.nama });

//       if (!updatedKaosKakiData) {
//         throw new AppError("Update failed", 400);
//       }

//       // Process machine updates if needed
//       if (payload.mesin !== undefined) {
//         await this.handleMachineUpdates(
//           tx,
//           payload.id,
//           machineUpdates.machinesToAdd,
//           machineUpdates.machinesToRemove
//         );
//       }

//       // Process photo updates if needed
//       if (payload.foto !== undefined) {
//         await this.handlePhotoUpdates(
//           tx,
//           payload.id,
//           photoUpdates.photosToAdd,
//           photoUpdates.photosToRemove
//         );
//       }

//       return updatedKaosKakiData;
//     });
//   }

//   /**
//    * Handle machine updates in transaction
//    */
//   private async handleMachineUpdates(
//     tx: any,
//     kaosKakiId: string,
//     machinesToAdd: string[],
//     machinesToRemove: string[]
//   ): Promise<void> {
//     // Remove old machines
//     if (machinesToRemove.length > 0) {
//       await tx
//         .delete(kaosKakiDetailMesin)
//         .where(
//           and(
//             eq(kaosKakiDetailMesin.kaosKakiId, kaosKakiId),
//             inArray(kaosKakiDetailMesin.jenisMesinId, machinesToRemove)
//           )
//         );
//     }

//     // Add new machines
//     if (machinesToAdd.length > 0) {
//       const machineInserts = machinesToAdd.map((machineId) => ({
//         kaosKakiId,
//         jenisMesinId: machineId,
//       }));

//       await tx.insert(kaosKakiDetailMesin).values(machineInserts);
//     }
//   }

//   /**
//    * Handle photo updates in transaction
//    */
//   private async handlePhotoUpdates(
//     tx: any,
//     kaosKakiId: string,
//     photosToAdd: Array<{ url: string; isPrimary?: boolean }>,
//     photosToRemove: string[]
//   ): Promise<void> {
//     // Remove old photos
//     if (photosToRemove.length > 0) {
//       await tx
//         .delete(kaosKakiDetailFotos)
//         .where(
//           and(
//             eq(kaosKakiDetailFotos.kaosKakiId, kaosKakiId),
//             inArray(kaosKakiDetailFotos.id, photosToRemove)
//           )
//         );
//     }

//     // Add new photos
//     if (photosToAdd.length > 0) {
//       const photoInserts = photosToAdd.map((photo) => ({
//         kaosKakiId,
//         url: photo.url,
//         isPrimary: photo.isPrimary || false,
//       }));

//       await tx.insert(kaosKakiDetailFotos).values(photoInserts);
//     }
//   }

//   /**
//    * Main method to update kaos kaki data
//    */
//   async updateKaosKaki(payload: KaosKakiUpdateInput): Promise<{
//     success: boolean;
//     message: string;
//     data: {
//       KaosKakiName: string;
//       updatedFields: string[];
//     };
//   }> {
//     // Validate input
//     this.validateUpdateInput(payload);

//     // Get existing data
//     const existingData = await this.getExistingData(payload.id);

//     // Build update data
//     const updateData = this.buildUpdateData(payload, existingData);

//     // Check if there are actual changes to main data
//     const hasMainDataChanges = Object.keys(updateData).length > 1; // More than just updatedAt

//     // Check if there are machine or photo changes
//     const hasMachineChanges = payload.mesin !== undefined;
//     const hasPhotoChanges = payload.foto !== undefined;

//     // If no changes at all, return early
//     if (!hasMainDataChanges && !hasMachineChanges && !hasPhotoChanges) {
//       return {
//         success: true,
//         message: "No changes detected",
//         data: {
//           KaosKakiName: existingData.nama,
//           updatedFields: [],
//         },
//       };
//     }

//     // Execute the update
//     const result = await this.executeUpdate(payload, existingData, updateData);

//     // Track which fields were updated
//     const updatedFields: string[] = [];
//     if (hasMainDataChanges) {
//       updatedFields.push("main_data");
//     }
//     if (hasMachineChanges) {
//       updatedFields.push("machines");
//     }
//     if (hasPhotoChanges) {
//       updatedFields.push("photos");
//     }

//     return {
//       success: true,
//       message: "Kaos kaki data updated successfully",
//       data: {
//         KaosKakiName: result.nama,
//         updatedFields,
//       },
//     };
//   }
// }
