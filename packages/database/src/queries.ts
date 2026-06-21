import { eq } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as sqliteSchema from './schema.sqlite.js';
import * as pgSchema from './schema.pg.js';

export type LocalGarage = typeof sqliteSchema.garages.$inferSelect;
export type LocalTruck = typeof sqliteSchema.trucks.$inferSelect;

export async function getPendingGarages(db: BetterSQLite3Database<typeof sqliteSchema>): Promise<LocalGarage[]> {
  return db
    .select()
    .from(sqliteSchema.garages)
    .where(eq(sqliteSchema.garages.syncStatus, 'pending'));
}

export async function updateGarageSyncStatus(
  db: BetterSQLite3Database<typeof sqliteSchema>,
  id: string,
  status: 'synced' | 'pending' | 'failed'
) {
  return db
    .update(sqliteSchema.garages)
    .set({ syncStatus: status })
    .where(eq(sqliteSchema.garages.id, id));
}

export async function getPendingTrucks(db: BetterSQLite3Database<typeof sqliteSchema>): Promise<LocalTruck[]> {
  return db
    .select()
    .from(sqliteSchema.trucks)
    .where(eq(sqliteSchema.trucks.syncStatus, 'pending'));
}

export async function updateTruckSyncStatus(
  db: BetterSQLite3Database<typeof sqliteSchema>,
  id: string,
  status: 'synced' | 'pending' | 'failed'
) {
  return db
    .update(sqliteSchema.trucks)
    .set({ syncStatus: status })
    .where(eq(sqliteSchema.trucks.id, id));
}

// --- FUNGSI SINKRONISASI CLOUD TERPADU (Postgres & SQLite berada di tsconfig yang sama) ---

export async function syncGaragesToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await localDb
    .select()
    .from(sqliteSchema.garages)
    .where(eq(sqliteSchema.garages.syncStatus, 'pending'));

  if (pending.length === 0) return;

  for (const garage of pending) {
    await cloudDb.insert(pgSchema.garagesPg).values({
      id: garage.id,
      city: garage.city,
      country: garage.country,
      upgradeLevel: garage.upgradeLevel ?? 1,
      maxCapacity: garage.maxCapacity ?? 3,
      syncStatus: 'synced',
      updatedAt: garage.updatedAt,
    }).onConflictDoUpdate({
      target: pgSchema.garagesPg.id,
      set: {
        city: garage.city,
        country: garage.country,
        upgradeLevel: garage.upgradeLevel ?? 1,
        maxCapacity: garage.maxCapacity ?? 3,
        updatedAt: garage.updatedAt,
      }
    });

    // Tandai status lokal di SQLite menjadi synced
    await localDb
      .update(sqliteSchema.garages)
      .set({ syncStatus: 'synced' })
      .where(eq(sqliteSchema.garages.id, garage.id));
  }
}

export async function syncTrucksToCloud(
  localDb: BetterSQLite3Database<typeof sqliteSchema>,
  cloudDb: NeonHttpDatabase<typeof pgSchema>
) {
  const pending = await localDb
    .select()
    .from(sqliteSchema.trucks)
    .where(eq(sqliteSchema.trucks.syncStatus, 'pending'));

  if (pending.length === 0) return;

  for (const truck of pending) {
    await cloudDb.insert(pgSchema.trucksPg).values({
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
      trailerId: truck.trailerId,
      conditionCabin: truck.conditionCabin ?? 1.0,
      conditionChassis: truck.conditionChassis ?? 1.0,
      conditionEngine: truck.conditionEngine ?? 1.0,
      conditionTransmission: truck.conditionTransmission ?? 1.0,
      wearWheels: truck.wearWheels ?? 1.0,
      wearPaint: truck.wearPaint ?? 1.0,
      fuelLiters: truck.fuelLiters ?? 0.0,
      fuelCapacity: truck.fuelCapacity ?? 0.0,
      purchasePrice: truck.purchasePrice,
      isPlayerTruck: truck.isPlayerTruck ?? false,
      odometerKm: truck.odometerKm ?? 0.0,
      lastSeenAt: truck.lastSeenAt, // Sekarang aman dilewatkan sebagai Date | null
      syncStatus: 'synced',
      updatedAt: truck.updatedAt,
    }).onConflictDoUpdate({
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
        trailerId: truck.trailerId,
        conditionCabin: truck.conditionCabin ?? 1.0,
        conditionChassis: truck.conditionChassis ?? 1.0,
        conditionEngine: truck.conditionEngine ?? 1.0,
        conditionTransmission: truck.conditionTransmission ?? 1.0,
        wearWheels: truck.wearWheels ?? 1.0,
        wearPaint: truck.wearPaint ?? 1.0,
        fuelLiters: truck.fuelLiters ?? 0.0,
        fuelCapacity: truck.fuelCapacity ?? 0.0,
        purchasePrice: truck.purchasePrice,
        isPlayerTruck: truck.isPlayerTruck ?? false,
        odometerKm: truck.odometerKm ?? 0.0,
        lastSeenAt: truck.lastSeenAt,
        updatedAt: truck.updatedAt,
      }
    });

    // Tandai status lokal di SQLite menjadi synced
    await localDb
      .update(sqliteSchema.trucks)
      .set({ syncStatus: 'synced' })
      .where(eq(sqliteSchema.trucks.id, truck.id));
  }
}