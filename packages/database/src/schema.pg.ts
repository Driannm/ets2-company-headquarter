import { pgTable, varchar, integer, doublePrecision, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const cabinsPg = pgTable('cabins', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const chassisPg = pgTable('chassis', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  fuelTank: varchar('fuel_tank'),
  brand: varchar('brand', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const enginesPg = pgTable('engines', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  horsepower: integer('horsepower').notNull(),
  torque: integer('torque').notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const transmissionsPg = pgTable('transmissions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  gearsCount: integer('gears_count').default(12),
  hasRetarder: boolean('has_retarder').default(true),
  brand: varchar('brand', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const garagesPg = pgTable('garages', {
  id: varchar('id', { length: 255 }).primaryKey(),
  city: varchar('city', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  upgradeLevel: integer('upgrade_level').default(1),
  maxCapacity: integer('max_capacity').default(3),
  syncStatus: varchar('sync_status', { length: 50 }).default('synced'),
  updatedAt: timestamp('updated_at').notNull(),
});

export const trucksPg = pgTable('trucks', {
  id: varchar('id', { length: 255 }).primaryKey(),
  brand: varchar('brand', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  licensePlate: varchar('license_plate', { length: 50 }).notNull().unique(),
  garageId: varchar('garage_id', { length: 255 }).references(() => garagesPg.id, { onDelete: 'set null' }),
  
  cabinId: varchar('cabin_id', { length: 255 }).references(() => cabinsPg.id),
  chassisId: varchar('chassis_id', { length: 255 }).references(() => chassisPg.id),
  engineId: varchar('engine_id', { length: 255 }).references(() => enginesPg.id),
  transmissionId: varchar('transmission_id', { length: 255 }).references(() => transmissionsPg.id),

  conditionCabin: doublePrecision('condition_cabin').default(1.0),
  conditionChassis: doublePrecision('condition_chassis').default(1.0),
  conditionEngine: doublePrecision('condition_engine').default(1.0),
  conditionTransmission: doublePrecision('condition_transmission').default(1.0),
  
  odometerKm: doublePrecision('odometer_km').default(0.0),
  syncStatus: varchar('sync_status', { length: 50 }).default('synced'),
  updatedAt: timestamp('updated_at').notNull(),
});

export const driversPg = pgTable('drivers', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  garageId: varchar('garage_id', { length: 255 }).references(() => garagesPg.id, { onDelete: 'set null' }),
  rating: doublePrecision('rating').default(1.0),
  salaryPerKm: doublePrecision('salary_per_km').default(3.50),
  status: varchar('status', { length: 50 }).default('idle'),
  syncStatus: varchar('sync_status', { length: 50 }).default('synced'),
  updatedAt: timestamp('updated_at').notNull(),
});

export const jobsPg = pgTable('jobs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  cargoName: varchar('cargo_name', { length: 255 }).notNull(),
  originCity: varchar('origin_city', { length: 255 }).notNull(),
  destinationCity: varchar('destination_city', { length: 255 }).notNull(),
  payoutAmount: integer('payout_amount').notNull(),
  driverId: varchar('driver_id', { length: 255 }).references(() => driversPg.id, { onDelete: 'cascade' }),
  truckId: varchar('truck_id', { length: 255 }).references(() => trucksPg.id, { onDelete: 'cascade' }),
  fuelConsumedLiters: doublePrecision('fuel_consumed_liters').default(0.0),
  completedAt: timestamp('completed_at'),
  syncStatus: varchar('sync_status', { length: 50 }).default('synced'),
  updatedAt: timestamp('updated_at').notNull(),
});