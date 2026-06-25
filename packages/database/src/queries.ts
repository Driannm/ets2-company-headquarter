import { eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as sqliteSchema from "./schema.sqlite.js";
import * as pgSchema from "./schema.pg.js";

export type LocalGarage = typeof sqliteSchema.garages.$inferSelect;
export type LocalTruck = typeof sqliteSchema.trucks.$inferSelect;
export type LocalDriver = typeof sqliteSchema.drivers.$inferSelect;
export type LocalTrailer = typeof sqliteSchema.trailers.$inferSelect;

// ============================================================
// GARAGES
// ============================================================

export async function getPendingGarages(
  db: BetterSQLite3Database<typeof sqliteSchema>
): Promise<LocalGarage[]> {
  return db
    .select()
    .from(sqliteSchema.garages)
    .where(eq(sqliteSchema.garages.syncStatus, "pending"));
}

export async function syncGaragesToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await getPendingGarages(localDb);
  if (pending.length === 0) return;

  for (const garage of pending) {
    await cloudDb
      .insert(pgSchema.garagesPg)
      .values({
        id: garage.id,
        gameRefId: garage.gameRefId,
        city: garage.city,
        country: garage.country,
        upgradeLevel: garage.upgradeLevel ?? 1,
        maxCapacity: garage.maxCapacity ?? 1,
        syncStatus: "synced",
        updatedAt: garage.updatedAt,
      })
      .onConflictDoUpdate({
        target: pgSchema.garagesPg.id,
        set: {
          gameRefId: garage.gameRefId,
          city: garage.city,
          country: garage.country,
          upgradeLevel: garage.upgradeLevel ?? 1,
          maxCapacity: garage.maxCapacity ?? 1,
          updatedAt: garage.updatedAt,
        },
      });

    await localDb
      .update(sqliteSchema.garages)
      .set({ syncStatus: "synced" })
      .where(eq(sqliteSchema.garages.id, garage.id));
  }
}

// ============================================================
// TRUCKS
// ============================================================

export async function getPendingTrucks(
  db: BetterSQLite3Database<typeof sqliteSchema>
): Promise<LocalTruck[]> {
  return db
    .select()
    .from(sqliteSchema.trucks)
    .where(eq(sqliteSchema.trucks.syncStatus, "pending"));
}

export async function syncTrucksToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await getPendingTrucks(localDb);
  if (pending.length === 0) return;

  for (const truck of pending) {
    await cloudDb
      .insert(pgSchema.trucksPg)
      .values({
        id: truck.id,
        gameRefId: truck.gameRefId,
        brand: truck.brand,
        model: truck.model,
        name: truck.name,
        licensePlate: truck.licensePlate,
        garageId: truck.garageId,
        cabinId: truck.cabinId,
        chassisId: truck.chassisId,
        engineId: truck.engineId,
        transmissionId: truck.transmissionId,
        conditionCabin: truck.conditionCabin ?? 1,
        conditionChassis: truck.conditionChassis ?? 1,
        conditionEngine: truck.conditionEngine ?? 1,
        conditionTransmission: truck.conditionTransmission ?? 1,
        wearWheels: truck.wearWheels ?? 1,
        fuelRatio: truck.fuelRatio ?? 0,
        fuelCapacityLiters: truck.fuelCapacityLiters ?? 0,
        fuelLiters: truck.fuelLiters ?? 0,
        odometerKm: truck.odometerKm ?? 0,
        isPlayerTruck: truck.isPlayerTruck ?? false,
        syncStatus: "synced",
        updatedAt: truck.updatedAt,
      })
      .onConflictDoUpdate({
        target: pgSchema.trucksPg.id,
        set: {
          gameRefId: truck.gameRefId,
          brand: truck.brand,
          model: truck.model,
          name: truck.name,
          licensePlate: truck.licensePlate,
          garageId: truck.garageId,
          cabinId: truck.cabinId,
          chassisId: truck.chassisId,
          engineId: truck.engineId,
          transmissionId: truck.transmissionId,
          conditionCabin: truck.conditionCabin ?? 1,
          conditionChassis: truck.conditionChassis ?? 1,
          conditionEngine: truck.conditionEngine ?? 1,
          conditionTransmission: truck.conditionTransmission ?? 1,
          wearWheels: truck.wearWheels ?? 1,
          fuelRatio: truck.fuelRatio ?? 0,
          fuelCapacityLiters: truck.fuelCapacityLiters ?? 0,
          fuelLiters: truck.fuelLiters ?? 0,
          odometerKm: truck.odometerKm ?? 0,
          isPlayerTruck: truck.isPlayerTruck ?? false,
          updatedAt: truck.updatedAt,
        },
      });

    await localDb
      .update(sqliteSchema.trucks)
      .set({ syncStatus: "synced" })
      .where(eq(sqliteSchema.trucks.id, truck.id));
  }
}

// ============================================================
// DRIVERS
// ============================================================

export async function getPendingDrivers(
  db: BetterSQLite3Database<typeof sqliteSchema>
): Promise<LocalDriver[]> {
  return db
    .select()
    .from(sqliteSchema.drivers)
    .where(eq(sqliteSchema.drivers.syncStatus, "pending"));
}

export async function syncDriversToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await getPendingDrivers(localDb);
  if (pending.length === 0) return;

  for (const driver of pending) {
    await cloudDb
      .insert(pgSchema.driversPg)
      .values({
        id: driver.id,
        gameRefId: driver.gameRefId,
        name: driver.name,
        garageId: driver.garageId,
        status: driver.status ?? "idle",
        hometown: driver.hometown,
        currentCity: driver.currentCity,
        experiencePoints: driver.experiencePoints ?? 0,
        adrSkill: driver.adrSkill ?? 0,
        longDistanceSkill: driver.longDistanceSkill ?? 0,
        heavySkill: driver.heavySkill ?? 0,
        fragileSkill: driver.fragileSkill ?? 0,
        urgentSkill: driver.urgentSkill ?? 0,
        mechanicalSkill: driver.mechanicalSkill ?? 0,
        isPlayer: driver.isPlayer ?? false,
        rating: driver.rating,
        salaryPerKm: driver.salaryPerKm,
        syncStatus: "synced",
        updatedAt: driver.updatedAt,
      })
      .onConflictDoUpdate({
        target: pgSchema.driversPg.id,
        set: {
          gameRefId: driver.gameRefId,
          name: driver.name,
          garageId: driver.garageId,
          status: driver.status ?? "idle",
          hometown: driver.hometown,
          currentCity: driver.currentCity,
          experiencePoints: driver.experiencePoints ?? 0,
          adrSkill: driver.adrSkill ?? 0,
          longDistanceSkill: driver.longDistanceSkill ?? 0,
          heavySkill: driver.heavySkill ?? 0,
          fragileSkill: driver.fragileSkill ?? 0,
          urgentSkill: driver.urgentSkill ?? 0,
          mechanicalSkill: driver.mechanicalSkill ?? 0,
          isPlayer: driver.isPlayer ?? false,
          rating: driver.rating,
          salaryPerKm: driver.salaryPerKm,
          updatedAt: driver.updatedAt,
        },
      });

    await localDb
      .update(sqliteSchema.drivers)
      .set({ syncStatus: "synced" })
      .where(eq(sqliteSchema.drivers.id, driver.id));
  }
}

// ============================================================
// TRAILERS
// ============================================================

export async function getPendingTrailers(
  db: BetterSQLite3Database<typeof sqliteSchema>
): Promise<LocalTrailer[]> {
  return db
    .select()
    .from(sqliteSchema.trailers)
    .where(eq(sqliteSchema.trailers.syncStatus, "pending"));
}

export async function syncTrailersToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await getPendingTrailers(localDb);
  if (pending.length === 0) return;

  for (const trailer of pending) {
    await cloudDb
      .insert(pgSchema.trailersPg)
      .values({
        id: trailer.id,
        gameRefId: trailer.gameRefId,
        brand: trailer.brand,
        model: trailer.model,
        trailerDefinition: trailer.trailerDefinition,
        bodyType: trailer.bodyType,
        garageId: trailer.garageId,
        assignedDriverId: trailer.assignedDriverId,
        assignedTruckId: trailer.assignedTruckId,
        condition: trailer.condition ?? 1,
        syncStatus: "synced",
        updatedAt: trailer.updatedAt,
      })
      .onConflictDoUpdate({
        target: pgSchema.trailersPg.id,
        set: {
          gameRefId: trailer.gameRefId,
          brand: trailer.brand,
          model: trailer.model,
          trailerDefinition: trailer.trailerDefinition,
          bodyType: trailer.bodyType,
          garageId: trailer.garageId,
          assignedDriverId: trailer.assignedDriverId,
          assignedTruckId: trailer.assignedTruckId,
          condition: trailer.condition ?? 1,
          updatedAt: trailer.updatedAt,
        },
      });

    await localDb
      .update(sqliteSchema.trailers)
      .set({ syncStatus: "synced" })
      .where(eq(sqliteSchema.trailers.id, trailer.id));
  }
}

// ============================================================
// SYNC ALL — jalankan semua sync sekaligus
// ============================================================

export async function syncAllToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  await syncGaragesToCloud(localDb, cloudDb);
  await syncTrucksToCloud(localDb, cloudDb);
  await syncDriversToCloud(localDb, cloudDb);
  await syncTrailersToCloud(localDb, cloudDb);
}