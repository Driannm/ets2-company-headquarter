import { eq } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.sqlite.js';

export type LocalGarage = typeof schema.garages.$inferSelect;
export type LocalTruck = typeof schema.trucks.$inferSelect;

export async function getPendingGarages(db: BetterSQLite3Database<typeof schema>): Promise<LocalGarage[]> {
  return db
    .select()
    .from(schema.garages)
    .where(eq(schema.garages.syncStatus, 'pending'));
}

export async function updateGarageSyncStatus(
  db: BetterSQLite3Database<typeof schema>,
  id: string,
  status: 'synced' | 'pending' | 'failed'
) {
  return db
    .update(schema.garages)
    .set({ syncStatus: status })
    .where(eq(schema.garages.id, id));
}

export async function getPendingTrucks(db: BetterSQLite3Database<typeof schema>): Promise<LocalTruck[]> {
  return db
    .select()
    .from(schema.trucks)
    .where(eq(schema.trucks.syncStatus, 'pending'));
}

export async function updateTruckSyncStatus(
  db: BetterSQLite3Database<typeof schema>,
  id: string,
  status: 'synced' | 'pending' | 'failed'
) {
  return db
    .update(schema.trucks)
    .set({ syncStatus: status })
    .where(eq(schema.trucks.id, id));
}