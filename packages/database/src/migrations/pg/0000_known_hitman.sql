CREATE TABLE "cabins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chassis" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"fuel_tank" varchar,
	"brand" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_stats" (
	"id" varchar PRIMARY KEY NOT NULL,
	"money" integer DEFAULT 0,
	"company_value" integer DEFAULT 0,
	"loan_amount" integer DEFAULT 0,
	"total_distance_km" double precision DEFAULT 0,
	"total_drivers" integer DEFAULT 0,
	"total_garages" integer DEFAULT 0,
	"total_trucks" integer DEFAULT 0,
	"total_trailers" integer DEFAULT 0,
	"recorded_at" timestamp NOT NULL,
	"sync_status" varchar DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_ref_id" varchar,
	"name" varchar NOT NULL,
	"garage_id" varchar,
	"truck_id" varchar,
	"rating" double precision DEFAULT 1,
	"salary_per_km" double precision DEFAULT 3.5,
	"salary" double precision,
	"profit_ability" integer DEFAULT 0,
	"long_distance_skill" integer DEFAULT 0,
	"status" varchar DEFAULT 'idle',
	"training_skill" varchar,
	"distance_skill" integer DEFAULT 0,
	"eco_skill" integer DEFAULT 0,
	"fragile_skill" integer DEFAULT 0,
	"adr_skill" integer DEFAULT 0,
	"is_on_job" boolean DEFAULT false,
	"last_revenue" integer DEFAULT 0,
	"sync_status" varchar DEFAULT 'pending',
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "drivers_game_ref_id_unique" UNIQUE("game_ref_id")
);
--> statement-breakpoint
CREATE TABLE "engines" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"horsepower" integer NOT NULL,
	"torque" integer NOT NULL,
	"brand" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "garages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_ref_id" varchar,
	"city" varchar NOT NULL,
	"country" varchar NOT NULL,
	"location_token" varchar,
	"upgrade_level" integer DEFAULT 1,
	"max_capacity" integer DEFAULT 3,
	"vehicle_slots" integer DEFAULT 3,
	"driver_slots" integer DEFAULT 3,
	"sync_status" varchar DEFAULT 'pending',
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "garages_game_ref_id_unique" UNIQUE("game_ref_id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_ref_id" varchar,
	"cargo_name" varchar NOT NULL,
	"origin_city" varchar NOT NULL,
	"destination_city" varchar NOT NULL,
	"payout_amount" integer NOT NULL,
	"distance_km" double precision DEFAULT 0,
	"cargo_mass_kg" double precision DEFAULT 0,
	"fuel_consumed_liters" double precision DEFAULT 0,
	"cargo_damage_percent" double precision DEFAULT 0,
	"late_penalty" integer DEFAULT 0,
	"xp_earned" integer DEFAULT 0,
	"driver_id" varchar,
	"truck_id" varchar,
	"completed_at" timestamp,
	"sync_status" varchar DEFAULT 'pending',
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "jobs_game_ref_id_unique" UNIQUE("game_ref_id")
);
--> statement-breakpoint
CREATE TABLE "trailers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_ref_id" varchar,
	"brand" varchar,
	"model" varchar,
	"cargo" varchar,
	"license_plate" varchar,
	"trailer_definition" varchar,
	"body_type" varchar,
	"assigned_driver_id" varchar,
	"assigned_truck_id" varchar,
	"garage_id" varchar,
	"condition" double precision DEFAULT 1,
	"odometer_km" double precision DEFAULT 0,
	"updated_at" timestamp NOT NULL,
	"sync_status" varchar DEFAULT 'pending',
	CONSTRAINT "trailers_game_ref_id_unique" UNIQUE("game_ref_id")
);
--> statement-breakpoint
CREATE TABLE "transmissions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"gears_count" integer DEFAULT 12,
	"has_retarder" boolean DEFAULT true,
	"brand" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trucks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_ref_id" varchar,
	"brand" varchar NOT NULL,
	"model" varchar NOT NULL,
	"name" varchar,
	"license_plate" varchar NOT NULL,
	"garage_id" varchar,
	"cabin_id" varchar,
	"chassis_id" varchar,
	"engine_id" varchar,
	"transmission_id" varchar,
	"trailer_id" varchar,
	"condition_cabin" double precision DEFAULT 1,
	"condition_chassis" double precision DEFAULT 1,
	"condition_engine" double precision DEFAULT 1,
	"condition_transmission" double precision DEFAULT 1,
	"wear_wheels" double precision DEFAULT 1,
	"wear_paint" double precision DEFAULT 1,
	"fuel_liters" double precision DEFAULT 0,
	"fuel_capacity" double precision DEFAULT 0,
	"purchase_price" integer,
	"is_player_truck" boolean DEFAULT false,
	"odometer_km" double precision DEFAULT 0,
	"last_seen_at" timestamp,
	"sync_status" varchar DEFAULT 'pending',
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "trucks_game_ref_id_unique" UNIQUE("game_ref_id"),
	CONSTRAINT "trucks_license_plate_unique" UNIQUE("license_plate")
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_garage_id_garages_id_fk" FOREIGN KEY ("garage_id") REFERENCES "public"."garages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_truck_id_trucks_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_truck_id_trucks_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trailers" ADD CONSTRAINT "trailers_garage_id_garages_id_fk" FOREIGN KEY ("garage_id") REFERENCES "public"."garages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_garage_id_garages_id_fk" FOREIGN KEY ("garage_id") REFERENCES "public"."garages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_cabin_id_cabins_id_fk" FOREIGN KEY ("cabin_id") REFERENCES "public"."cabins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_chassis_id_chassis_id_fk" FOREIGN KEY ("chassis_id") REFERENCES "public"."chassis"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_transmission_id_transmissions_id_fk" FOREIGN KEY ("transmission_id") REFERENCES "public"."transmissions"("id") ON DELETE no action ON UPDATE no action;