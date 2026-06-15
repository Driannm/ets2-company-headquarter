import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// --- KATALOG KOMPONEN JALUR UTAMA (1:N) ---

export const cabins = sqliteTable('cabins', {
  id: text('id').primaryKey(), // e.g. "scania_highline"
  name: text('name').notNull(), // e.g. "Highline Sleeper"
  brand: text('brand').notNull(), // e.g. "Scania"
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const chassis = sqliteTable('chassis', {
  id: text('id').primaryKey(), // e.g. "scania_6x2"
  name: text('name').notNull(), // e.g. "6x2 Taglift"
  fuelTank: text('fuel_tank'),
  brand: text('brand').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const engines = sqliteTable('engines', {
  id: text('id').primaryKey(), // e.g. "scania_v8_730"
  name: text('name').notNull(), // e.g. "DC16 117 730 Euro 6"
  horsepower: integer('horsepower').notNull(), // e.g. 730
  torque: integer('torque').notNull(), // e.g. 3500 (Nm)
  brand: text('brand').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const transmissions = sqliteTable('transmissions', {
  id: text('id').primaryKey(), // e.g. "opticruise_12_r"
  name: text('name').notNull(), // e.g. "Opticruise GRSO 925R"
  gearsCount: integer('gears_count').default(12), // e.g. 12
  hasRetarder: integer('has_retarder', { mode: 'boolean' }).default(true),
  brand: text('brand').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// --- TABEL UTAMA ---

export const garages = sqliteTable('garages', {
  id: text('id').primaryKey(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  upgradeLevel: integer('upgrade_level').default(1),
  maxCapacity: integer('max_capacity').default(3),
  syncStatus: text('sync_status').default('pending'), // 'synced', 'pending', 'failed'
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trucks = sqliteTable('trucks', {
  id: text('id').primaryKey(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  licensePlate: text('license_plate').notNull().unique(),
  garageId: text('garage_id').references(() => garages.id, { onDelete: 'set null' }),
  
  // Relasi Katalog Komponen
  cabinId: text('cabin_id').references(() => cabins.id),
  chassisId: text('chassis_id').references(() => chassis.id),
  engineId: text('engine_id').references(() => engines.id),
  transmissionId: text('transmission_id').references(() => transmissions.id),

  // Wear (Kerusakan) Unik masing-masing unit Truk (0.0 sampai 1.0)
  conditionCabin: real('condition_cabin').default(1.0),
  conditionChassis: real('condition_chassis').default(1.0),
  conditionEngine: real('condition_engine').default(1.0),
  conditionTransmission: real('condition_transmission').default(1.0),
  
  odometerKm: real('odometer_km').default(0.0),
  syncStatus: text('sync_status').default('pending'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const drivers = sqliteTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  garageId: text('garage_id').references(() => garages.id, { onDelete: 'set null' }),
  rating: real('rating').default(1.0),
  salaryPerKm: real('salary_per_km').default(3.50),
  status: text('status').default('idle'),
  syncStatus: text('sync_status').default('pending'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  cargoName: text('cargo_name').notNull(),
  originCity: text('origin_city').notNull(),
  destinationCity: text('destination_city').notNull(),
  payoutAmount: integer('payout_amount').notNull(),
  driverId: text('driver_id').references(() => drivers.id, { onDelete: 'cascade' }),
  truckId: text('truck_id').references(() => trucks.id, { onDelete: 'cascade' }),
  fuelConsumedLiters: real('fuel_consumed_liters').default(0.0),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  syncStatus: text('sync_status').default('pending'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// --- RELATION DEFINITIONS ---
export const truckRelations = relations(trucks, ({ one }) => ({
  cabin: one(cabins, { fields: [trucks.cabinId], references: [cabins.id] }),
  chassis: one(chassis, { fields: [trucks.chassisId], references: [chassis.id] }),
  engine: one(engines, { fields: [trucks.engineId], references: [engines.id] }),
  transmission: one(transmissions, { fields: [trucks.transmissionId], references: [transmissions.id] }),
  garage: one(garages, { fields: [trucks.garageId], references: [garages.id] }),
}));