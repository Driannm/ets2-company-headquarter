import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// --- KATALOG KOMPONEN JALUR UTAMA (1:N) ---

export const cabins = sqliteTable("cabins", {
  id: text("id").primaryKey(), // e.g. "scania_highline"
  name: text("name").notNull(), // e.g. "Highline Sleeper"
  brand: text("brand").notNull(), // e.g. "Scania"
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const chassis = sqliteTable("chassis", {
  id: text("id").primaryKey(), // e.g. "scania_6x2"
  name: text("name").notNull(), // e.g. "6x2 Taglift"
  fuelTank: text("fuel_tank"),
  brand: text("brand").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const engines = sqliteTable("engines", {
  id: text("id").primaryKey(), // e.g. "scania_v8_730"
  name: text("name").notNull(), // e.g. "DC16 117 730 Euro 6"
  horsepower: integer("horsepower").notNull(), // e.g. 730
  torque: integer("torque").notNull(), // e.g. 3500 (Nm)
  brand: text("brand").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const transmissions = sqliteTable("transmissions", {
  id: text("id").primaryKey(), // e.g. "opticruise_12_r"
  name: text("name").notNull(), // e.g. "Opticruise GRSO 925R"
  gearsCount: integer("gears_count").default(12), // e.g. 12
  hasRetarder: integer("has_retarder", { mode: "boolean" }).default(true),
  brand: text("brand").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// --- TABEL UTAMA ---

export const garages = sqliteTable("garages", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  locationToken: text("location_token"),
  upgradeLevel: integer("upgrade_level").default(1),
  maxCapacity: integer("max_capacity").default(3),
  vehicleSlots: integer("vehicle_slots").default(3),
  driverSlots: integer("driver_slots").default(3),
  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

export const trucks = sqliteTable("trucks", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  name: text("name"),
  licensePlate: text("license_plate").notNull().unique(),
  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),
  cabinId: text("cabin_id").references(() => cabins.id),
  chassisId: text("chassis_id").references(() => chassis.id),
  engineId: text("engine_id").references(() => engines.id),
  transmissionId: text("transmission_id").references(() => transmissions.id),
  trailerId: text("trailer_id"),
  conditionCabin: real("condition_cabin").default(1),
  conditionChassis: real("condition_chassis").default(1),
  conditionEngine: real("condition_engine").default(1),
  conditionTransmission: real("condition_transmission").default(1),
  wearWheels: real("wear_wheels").default(1),
  wearPaint: real("wear_paint").default(1),
  fuelLiters: real("fuel_liters").default(0),
  fuelCapacity: real("fuel_capacity").default(0),
  purchasePrice: integer("purchase_price"),
  isPlayerTruck: integer("is_player_truck", { mode: "boolean" }).default(false),
  odometerKm: real("odometer_km").default(0),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

export const drivers = sqliteTable("drivers", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  name: text("name").notNull(),
  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),
  truckId: text("truck_id").references(() => trucks.id, {
    onDelete: "set null",
  }),
  rating: real("rating").default(1),
  salaryPerKm: real("salary_per_km").default(3.5),
  salary: real("salary"),
  profitAbility: integer("profit_ability").default(0),
  longDistanceSkill: integer("long_distance_skill").default(0),
  status: text("status").default("idle"),
  trainingSkill: text("training_skill"),
  distanceSkill: integer("distance_skill").default(0),
  ecoSkill: integer("eco_skill").default(0),
  fragileSkill: integer("fragile_skill").default(0),
  adrSkill: integer("adr_skill").default(0),
  isOnJob: integer("is_on_job", { mode: "boolean" }).default(false),
  lastRevenue: integer("last_revenue").default(0),
  syncStatus: text("sync_status").default("pending"),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

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
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

export const trailers = sqliteTable("trailers", {
  id: text("id").primaryKey(),
  gameRefId: text("game_ref_id").unique(),
  brand: text("brand"),
  model: text("model"),
  cargo: text("cargo"),
  licensePlate: text("license_plate"),
  trailerDefinition: text("trailer_definition"),
  bodyType: text("body_type"),
  assignedDriverId: text("assigned_driver_id"),
  assignedTruckId: text("assigned_truck_id"),
  garageId: text("garage_id").references(() => garages.id, {
    onDelete: "set null",
  }),
  condition: real("condition").default(1),
  odometerKm: real("odometer_km").default(0),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
  syncStatus: text("sync_status").default("pending"),
});

export const companyStats = sqliteTable("company_stats", {
  id: text("id").primaryKey(),
  money: integer("money").default(0),
  loanAmount: integer("loan_amount").default(0),
  totalDistanceKm: real("total_distance_km").default(0),
  companyValue: integer("company_value").default(0),
  totalDrivers: integer("total_drivers").default(0),
  totalGarages: integer("total_garages").default(0),
  totalTrucks: integer("total_trucks").default(0),
  totalTrailers: integer("total_trailers").default(0),
  recordedAt: integer("recorded_at", {
    mode: "timestamp",
  }).notNull(),
  syncStatus: text("sync_status").default("pending"),
});

// --- RELATION DEFINITIONS ---
export const driverRelations = relations(drivers, ({ one }) => ({
  garage: one(garages, {
    fields: [drivers.garageId],
    references: [garages.id],
  }),

  truck: one(trucks, {
    fields: [drivers.truckId],
    references: [trucks.id],
  }),
}));

export const truckRelations = relations(trucks, ({ one }) => ({
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

  garage: one(garages, {
    fields: [trucks.garageId],
    references: [garages.id],
  }),
}));
