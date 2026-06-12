import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const garages = sqliteTable('garages', {
  id: text('id').primaryKey(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  upgradeLevel: integer('upgrade_level').default(1),
  maxCapacity: integer('max_capacity').default(3),
});

export const trucks = sqliteTable('trucks', {
  id: text('id').primaryKey(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  licensePlate: text('license_plate').notNull().unique(),
  garageId: text('garage_id').references(() => garages.id, { onDelete: 'set null' }),
  conditionEngine: real('condition_engine').default(1.0),
  conditionChassis: real('condition_chassis').default(1.0),
  odometerKm: real('odometer_km').default(0.0),
});

export const drivers = sqliteTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  garageId: text('garage_id').references(() => garages.id, { onDelete: 'set null' }),
  rating: real('rating').default(1.0),
  salaryPerKm: real('salary_per_km').default(3.50),
  status: text('status').default('idle'), // idle, resting, on_delivery
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
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
});

export const garageRelations = relations(garages, ({ many }) => ({
  trucks: many(trucks),
  drivers: many(drivers),
}));

export const truckRelations = relations(trucks, ({ one }) => ({
  garage: one(garages, { fields: [trucks.garageId], references: [garages.id] }),
}));

export const driverRelations = relations(drivers, ({ one }) => ({
  garage: one(garages, { fields: [drivers.garageId], references: [garages.id] }),
}));