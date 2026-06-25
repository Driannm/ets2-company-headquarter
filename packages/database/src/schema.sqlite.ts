import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================================
// KOMPONEN KATALOG
// Diisi dari data_path accessory — bukan dari savegame langsung.
// horsepower/torque/gearsCount nullable karena tidak ada di savegame.
// ============================================================

export const cabins = sqliteTable("cabins", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),  // ref id nameless dari savegame
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  dataPath: text("data_path"),              // /def/vehicle/truck/.../cabin/...
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const chassis = sqliteTable("chassis", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  dataPath: text("data_path"),
  // Tidak tersedia di savegame — diisi manual atau dari def files game
  fuelCapacityLiters: integer("fuel_capacity_liters"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const engines = sqliteTable("engines", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  dataPath: text("data_path"),
  // Nullable — tidak ada di savegame
  horsepower: integer("horsepower"),
  torque: integer("torque"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const transmissions = sqliteTable("transmissions", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  dataPath: text("data_path"),
  gearsCount: integer("gears_count"),
  hasRetarder: integer("has_retarder", { mode: "boolean" }).default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// GARAGES
// ============================================================

export const garages = sqliteTable("garages", {
  id: text("id").primaryKey(),
  // gameRefId = "garage.koln" dari savegame
  gameRefId: text("game_ref_id").unique(),
  city: text("city").notNull(),
  country: text("country").notNull().default("Europe"),
  upgradeLevel: integer("upgrade_level").default(1),
  maxCapacity: integer("max_capacity").default(1),
  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// TRUCKS
// ============================================================

export const trucks = sqliteTable("trucks", {
  id: text("id").primaryKey(),
  // gameRefId = "_nameless.213.1988.2d30" dari savegame
  gameRefId: text("game_ref_id").unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  name: text("name"),
  licensePlate: text("license_plate").notNull().unique(),

  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),

  // Component ref ids ke accessory blocks dari savegame
  cabinId: text("cabin_id").references(() => cabins.id, {
    onDelete: "set null",
  }),
  chassisId: text("chassis_id").references(() => chassis.id, {
    onDelete: "set null",
  }),
  engineId: text("engine_id").references(() => engines.id, {
    onDelete: "set null",
  }),
  transmissionId: text("transmission_id").references(() => transmissions.id, {
    onDelete: "set null",
  }),

  // Kondisi: 1.0 = sempurna, 0.0 = rusak total
  conditionCabin: real("condition_cabin").default(1),
  conditionChassis: real("condition_chassis").default(1),
  conditionEngine: real("condition_engine").default(1),
  conditionTransmission: real("condition_transmission").default(1),
  wearWheels: real("wear_wheels").default(1),        // rata-rata semua roda

  // fuel_relative dari savegame = rasio 0.0-1.0, bukan liter
  // fuelCapacityLiters diambil dari chassis def (tidak ada di savegame)
  // fuelLiters = fuelRatio * fuelCapacityLiters (dihitung setelah sync chassis)
  fuelRatio: real("fuel_ratio").default(0),
  fuelCapacityLiters: real("fuel_capacity_liters").default(0),
  fuelLiters: real("fuel_liters").default(0),

  odometerKm: real("odometer_km").default(0),
  isPlayerTruck: integer("is_player_truck", { mode: "boolean" }).default(false),

  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// DRIVERS
// ============================================================

export const drivers = sqliteTable("drivers", {
  id: text("id").primaryKey(),
  // gameRefId = "driver.308" dari savegame
  gameRefId: text("game_ref_id").unique(),

  // Nama di-generate oleh parser: "Driver #308 (Glasgow)" atau "Player"
  // ETS2 tidak menyimpan nama asli driver di savegame
  name: text("name").notNull(),

  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),

  // Status dari state field + cek job_info.cargo
  status: text("status").default("idle"),
  // "idle" | "resting" | "driving" | "on_delivery"

  // Data kota dari savegame
  hometown: text("hometown"),
  currentCity: text("current_city"),

  // XP dari savegame — bisa dipakai hitung level
  experiencePoints: integer("experience_points").default(0),

  // Skills dari driver_ai block (0 untuk player)
  adrSkill: integer("adr_skill").default(0),
  longDistanceSkill: integer("long_distance_skill").default(0),
  heavySkill: integer("heavy_skill").default(0),
  fragileSkill: integer("fragile_skill").default(0),
  urgentSkill: integer("urgent_skill").default(0),
  mechanicalSkill: integer("mechanical_skill").default(0),
  // eco tidak ada di savegame ETS2

  isPlayer: integer("is_player", { mode: "boolean" }).default(false),

  // rating & salaryPerKm tidak ada di savegame — nullable, bisa diisi manual
  rating: real("rating"),
  salaryPerKm: real("salary_per_km"),

  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// TRAILERS
// ============================================================

export const trailers = sqliteTable("trailers", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),

  brand: text("brand"),
  model: text("model"),

  // e.g., "trailer_def.scs.box.single_3.dryvan"
  trailerDefinition: text("trailer_definition"),
  // e.g., "cont_40" atau "dryvan"
  bodyType: text("body_type"),

  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),

  assignedDriverId: text("assigned_driver_id"),
  assignedTruckId: text("assigned_truck_id"),

  // Kondisi: 1.0 = sempurna, 0.0 = rusak
  condition: real("condition").default(1),

  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// JOBS
// ============================================================

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  cargoName: text("cargo_name").notNull(),
  originCity: text("origin_city").notNull(),
  destinationCity: text("destination_city").notNull(),
  payoutAmount: integer("payout_amount").notNull(),
  distanceKm: real("distance_km").default(0),
  cargoMassKg: real("cargo_mass_kg").default(0),
  fuelConsumedLiters: real("fuel_consumed_liters").default(0),
  cargoDamagePercent: real("cargo_damage_percent").default(0),
  latePenalty: integer("late_penalty").default(0),
  xpEarned: integer("xp_earned").default(0),
  driverId: text("driver_id").references(() => drivers.id, {
    onDelete: "cascade",
  }),
  truckId: text("truck_id").references(() => trucks.id, {
    onDelete: "cascade",
  }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ============================================================
// COMPANY STATS
// ============================================================

export const companyStats = sqliteTable("company_stats", {
  id: text("id").primaryKey(),
  money: integer("money").default(0),
  loanAmount: integer("loan_amount").default(0),
  totalGarages: integer("total_garages").default(0),
  totalDrivers: integer("total_drivers").default(0),
  totalTrucks: integer("total_trucks").default(0),
  totalTrailers: integer("total_trailers").default(0),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).notNull(),
  syncStatus: text("sync_status").default("pending"),
});

// ============================================================
// RELATIONS
// ============================================================

export const garageRelations = relations(garages, ({ many }) => ({
  trucks: many(trucks),
  drivers: many(drivers),
  trailers: many(trailers),
}));

export const truckRelations = relations(trucks, ({ one }) => ({
  garage: one(garages, {
    fields: [trucks.garageId],
    references: [garages.id],
  }),
  cabin: one(cabins, {
    fields: [trucks.cabinId],
    references: [cabins.id],
  }),
  chassis: one(chassis, {
    fields: [trucks.chassisId],
    references: [chassis.id],
  }),
  engine: one(engines, {
    fields: [trucks.engineId],
    references: [engines.id],
  }),
  transmission: one(transmissions, {
    fields: [trucks.transmissionId],
    references: [transmissions.id],
  }),
}));

export const driverRelations = relations(drivers, ({ one }) => ({
  garage: one(garages, {
    fields: [drivers.garageId],
    references: [garages.id],
  }),
}));

export const trailerRelations = relations(trailers, ({ one }) => ({
  garage: one(garages, {
    fields: [trailers.garageId],
    references: [garages.id],
  }),
}));

export const jobRelations = relations(jobs, ({ one }) => ({
  driver: one(drivers, {
    fields: [jobs.driverId],
    references: [drivers.id],
  }),
  truck: one(trucks, {
    fields: [jobs.truckId],
    references: [trucks.id],
  }),
}));