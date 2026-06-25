import {
  pgTable,
  varchar,
  integer,
  doublePrecision,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// COMPONENT TABLES
// Diisi dari data_path accessory — bukan dari savegame langsung
// ============================================================

export const cabinsPg = pgTable("cabins", {
  id: varchar("id", { length: 255 }).primaryKey(),
  // Ref id dari savegame (e.g., "_nameless.213.19ab.5730")
  gameRefId: varchar("game_ref_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  dataPath: varchar("data_path", { length: 512 }),
  updatedAt: timestamp("updated_at").notNull(),
});

export const chassisPg = pgTable("chassis", {
  id: varchar("id", { length: 255 }).primaryKey(),
  gameRefId: varchar("game_ref_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  dataPath: varchar("data_path", { length: 512 }),
  // Fuel tank tidak tersedia di savegame, bisa diisi manual atau dari def files
  fuelCapacityLiters: integer("fuel_capacity_liters"),
  updatedAt: timestamp("updated_at").notNull(),
});

export const enginesPg = pgTable("engines", {
  id: varchar("id", { length: 255 }).primaryKey(),
  gameRefId: varchar("game_ref_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  horsepower: integer("horsepower"),
  torque: integer("torque"),
  brand: varchar("brand", { length: 255 }).notNull(),
  dataPath: varchar("data_path", { length: 512 }),
  updatedAt: timestamp("updated_at").notNull(),
});

export const transmissionsPg = pgTable("transmissions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  gameRefId: varchar("game_ref_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  gearsCount: integer("gears_count"),
  hasRetarder: boolean("has_retarder").default(false),
  brand: varchar("brand", { length: 255 }).notNull(),
  dataPath: varchar("data_path", { length: 512 }),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// GARAGES
// ============================================================

export const garagesPg = pgTable("garages", {
  id: varchar("id").primaryKey(),
  // gameRefId = id di savegame (e.g., "garage.koln")
  gameRefId: varchar("game_ref_id").unique(),
  city: varchar("city").notNull(),
  country: varchar("country").notNull().default("Europe"),
  upgradeLevel: integer("upgrade_level").default(1),
  maxCapacity: integer("max_capacity").default(1),
  syncStatus: varchar("sync_status").default("pending"),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// TRUCKS
// ============================================================

export const trucksPg = pgTable("trucks", {
  id: varchar("id").primaryKey(),
  // gameRefId = nameless id dari savegame
  gameRefId: varchar("game_ref_id").unique(),
  brand: varchar("brand").notNull(),
  model: varchar("model").notNull(),
  name: varchar("name"),
  licensePlate: varchar("license_plate").notNull().unique(),

  garageId: varchar("garage_id").references(() => garagesPg.id, {
    onDelete: "set null",
  }),

  // Component refs — nullable karena tidak selalu bisa dideteksi
  cabinId: varchar("cabin_id").references(() => cabinsPg.id, {
    onDelete: "set null",
  }),
  chassisId: varchar("chassis_id").references(() => chassisPg.id, {
    onDelete: "set null",
  }),
  engineId: varchar("engine_id").references(() => enginesPg.id, {
    onDelete: "set null",
  }),
  transmissionId: varchar("transmission_id").references(
    () => transmissionsPg.id,
    { onDelete: "set null" }
  ),

  // Wear: 0.0 = rusak total, 1.0 = sempurna
  conditionCabin: doublePrecision("condition_cabin").default(1),
  conditionChassis: doublePrecision("condition_chassis").default(1),
  conditionEngine: doublePrecision("condition_engine").default(1),
  conditionTransmission: doublePrecision("condition_transmission").default(1),
  wearWheels: doublePrecision("wear_wheels").default(1),

  // fuel_relative dari savegame adalah rasio 0-1, bukan liter
  // fuelRatio: rasio aktual dari savegame
  // fuelCapacityLiters: diambil dari chassis def (tidak ada di savegame)
  // fuelLiters: hasil kalkulasi fuelRatio * fuelCapacityLiters
  fuelRatio: doublePrecision("fuel_ratio").default(0),
  fuelCapacityLiters: doublePrecision("fuel_capacity_liters").default(0),
  fuelLiters: doublePrecision("fuel_liters").default(0),

  odometerKm: doublePrecision("odometer_km").default(0),
  isPlayerTruck: boolean("is_player_truck").default(false),

  syncStatus: varchar("sync_status").default("pending"),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// DRIVERS
// ============================================================

export const driversPg = pgTable("drivers", {
  id: varchar("id").primaryKey(),
  // gameRefId = "driver.308" dari savegame
  gameRefId: varchar("game_ref_id").unique(),

  // ETS2 tidak menyimpan nama asli driver di savegame
  // name di-generate: "Driver #308 (Glasgow)" atau "Player"
  name: varchar("name").notNull(),

  garageId: varchar("garage_id").references(() => garagesPg.id, {
    onDelete: "set null",
  }),

  // status dari state field + cek job_info.cargo
  status: varchar("status").default("idle"),
  // "idle" | "resting" | "driving" | "on_delivery"

  hometown: varchar("hometown"),
  currentCity: varchar("current_city"),

  // Experience dari savegame — bisa dipakai untuk menghitung level
  experiencePoints: integer("experience_points").default(0),

  // Skills — dari driver_ai block, 0 jika player
  adrSkill: integer("adr_skill").default(0),
  longDistanceSkill: integer("long_distance_skill").default(0),
  heavySkill: integer("heavy_skill").default(0),
  fragileSkill: integer("fragile_skill").default(0),
  urgentSkill: integer("urgent_skill").default(0),
  mechanicalSkill: integer("mechanical_skill").default(0),
  // eco tidak ada di savegame (field tidak exist di driver_ai)

  // rating & salary TIDAK ada di savegame ETS2
  // Kolom ini bisa dipakai untuk nilai manual / override
  rating: doublePrecision("rating"),
  salaryPerKm: doublePrecision("salary_per_km"),

  isPlayer: boolean("is_player").default(false),

  syncStatus: varchar("sync_status").default("pending"),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// TRAILERS
// ============================================================

export const trailersPg = pgTable("trailers", {
  id: varchar("id").primaryKey(),
  gameRefId: varchar("game_ref_id").unique(),

  brand: varchar("brand"),
  model: varchar("model"),

  // e.g., "trailer_def.scs.box.single_3.dryvan"
  trailerDefinition: varchar("trailer_definition"),
  // e.g., "cont_40" atau "dryvan"
  bodyType: varchar("body_type"),

  garageId: varchar("garage_id").references(() => garagesPg.id, {
    onDelete: "set null",
  }),

  assignedDriverId: varchar("assigned_driver_id"),
  assignedTruckId: varchar("assigned_truck_id"),

  // Wear: 1.0 = sempurna, 0.0 = rusak
  condition: doublePrecision("condition").default(1),

  syncStatus: varchar("sync_status").default("pending"),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// COMPANY STATS
// ============================================================

export const companyStatsPg = pgTable("company_stats", {
  id: varchar("id").primaryKey(),
  money: integer("money").default(0),
  loanAmount: integer("loan_amount").default(0),
  totalGarages: integer("total_garages").default(0),
  totalDrivers: integer("total_drivers").default(0),
  totalTrucks: integer("total_trucks").default(0),
  totalTrailers: integer("total_trailers").default(0),
  recordedAt: timestamp("recorded_at").notNull(),
  syncStatus: varchar("sync_status").default("pending"),
});

// ============================================================
// JOBS
// ============================================================

export const jobsPg = pgTable("jobs", {
  id: varchar("id").primaryKey(),
  gameRefId: varchar("game_ref_id").unique(),
  cargoName: varchar("cargo_name").notNull(),
  originCity: varchar("origin_city").notNull(),
  destinationCity: varchar("destination_city").notNull(),
  payoutAmount: integer("payout_amount").notNull(),
  distanceKm: doublePrecision("distance_km").default(0),
  cargoMassKg: doublePrecision("cargo_mass_kg").default(0),
  fuelConsumedLiters: doublePrecision("fuel_consumed_liters").default(0),
  cargoDamagePercent: doublePrecision("cargo_damage_percent").default(0),
  latePenalty: integer("late_penalty").default(0),
  xpEarned: integer("xp_earned").default(0),
  driverId: varchar("driver_id").references(() => driversPg.id, {
    onDelete: "cascade",
  }),
  truckId: varchar("truck_id").references(() => trucksPg.id, {
    onDelete: "cascade",
  }),
  completedAt: timestamp("completed_at"),
  syncStatus: varchar("sync_status").default("pending"),
  updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const garagesRelations = relations(garagesPg, ({ many }) => ({
  trucks: many(trucksPg),
  drivers: many(driversPg),
  trailers: many(trailersPg),
}));

export const trucksRelations = relations(trucksPg, ({ one }) => ({
  garage: one(garagesPg, {
    fields: [trucksPg.garageId],
    references: [garagesPg.id],
  }),
  cabin: one(cabinsPg, {
    fields: [trucksPg.cabinId],
    references: [cabinsPg.id],
  }),
  chassis: one(chassisPg, {
    fields: [trucksPg.chassisId],
    references: [chassisPg.id],
  }),
  engine: one(enginesPg, {
    fields: [trucksPg.engineId],
    references: [enginesPg.id],
  }),
  transmission: one(transmissionsPg, {
    fields: [trucksPg.transmissionId],
    references: [transmissionsPg.id],
  }),
}));

export const driversRelations = relations(driversPg, ({ one }) => ({
  garage: one(garagesPg, {
    fields: [driversPg.garageId],
    references: [garagesPg.id],
  }),
}));

export const trailersRelations = relations(trailersPg, ({ one }) => ({
  garage: one(garagesPg, {
    fields: [trailersPg.garageId],
    references: [garagesPg.id],
  }),
}));

export const jobsRelations = relations(jobsPg, ({ one }) => ({
  driver: one(driversPg, {
    fields: [jobsPg.driverId],
    references: [driversPg.id],
  }),
  truck: one(trucksPg, {
    fields: [jobsPg.truckId],
    references: [trucksPg.id],
  }),
}));