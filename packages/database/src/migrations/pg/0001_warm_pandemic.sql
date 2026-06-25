ALTER TABLE "drivers" DROP CONSTRAINT "drivers_truck_id_trucks_id_fk";
--> statement-breakpoint
ALTER TABLE "trucks" DROP CONSTRAINT "trucks_cabin_id_cabins_id_fk";
--> statement-breakpoint
ALTER TABLE "trucks" DROP CONSTRAINT "trucks_chassis_id_chassis_id_fk";
--> statement-breakpoint
ALTER TABLE "trucks" DROP CONSTRAINT "trucks_engine_id_engines_id_fk";
--> statement-breakpoint
ALTER TABLE "trucks" DROP CONSTRAINT "trucks_transmission_id_transmissions_id_fk";
--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "rating" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "salary_per_km" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "engines" ALTER COLUMN "horsepower" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "engines" ALTER COLUMN "torque" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "garages" ALTER COLUMN "country" SET DEFAULT 'Europe';--> statement-breakpoint
ALTER TABLE "garages" ALTER COLUMN "max_capacity" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "transmissions" ALTER COLUMN "gears_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transmissions" ALTER COLUMN "has_retarder" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "cabins" ADD COLUMN "game_ref_id" varchar(255);--> statement-breakpoint
ALTER TABLE "cabins" ADD COLUMN "data_path" varchar(512);--> statement-breakpoint
ALTER TABLE "chassis" ADD COLUMN "game_ref_id" varchar(255);--> statement-breakpoint
ALTER TABLE "chassis" ADD COLUMN "data_path" varchar(512);--> statement-breakpoint
ALTER TABLE "chassis" ADD COLUMN "fuel_capacity_liters" integer;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "hometown" varchar;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "current_city" varchar;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "experience_points" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "heavy_skill" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "urgent_skill" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "mechanical_skill" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "is_player" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "engines" ADD COLUMN "game_ref_id" varchar(255);--> statement-breakpoint
ALTER TABLE "engines" ADD COLUMN "data_path" varchar(512);--> statement-breakpoint
ALTER TABLE "transmissions" ADD COLUMN "game_ref_id" varchar(255);--> statement-breakpoint
ALTER TABLE "transmissions" ADD COLUMN "data_path" varchar(512);--> statement-breakpoint
ALTER TABLE "trucks" ADD COLUMN "fuel_ratio" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "trucks" ADD COLUMN "fuel_capacity_liters" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_cabin_id_cabins_id_fk" FOREIGN KEY ("cabin_id") REFERENCES "public"."cabins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_chassis_id_chassis_id_fk" FOREIGN KEY ("chassis_id") REFERENCES "public"."chassis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_transmission_id_transmissions_id_fk" FOREIGN KEY ("transmission_id") REFERENCES "public"."transmissions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chassis" DROP COLUMN "fuel_tank";--> statement-breakpoint
ALTER TABLE "company_stats" DROP COLUMN "company_value";--> statement-breakpoint
ALTER TABLE "company_stats" DROP COLUMN "total_distance_km";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "truck_id";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "salary";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "profit_ability";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "training_skill";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "distance_skill";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "eco_skill";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "is_on_job";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "last_revenue";--> statement-breakpoint
ALTER TABLE "garages" DROP COLUMN "location_token";--> statement-breakpoint
ALTER TABLE "garages" DROP COLUMN "vehicle_slots";--> statement-breakpoint
ALTER TABLE "garages" DROP COLUMN "driver_slots";--> statement-breakpoint
ALTER TABLE "trailers" DROP COLUMN "cargo";--> statement-breakpoint
ALTER TABLE "trailers" DROP COLUMN "license_plate";--> statement-breakpoint
ALTER TABLE "trailers" DROP COLUMN "odometer_km";--> statement-breakpoint
ALTER TABLE "trucks" DROP COLUMN "trailer_id";--> statement-breakpoint
ALTER TABLE "trucks" DROP COLUMN "wear_paint";--> statement-breakpoint
ALTER TABLE "trucks" DROP COLUMN "fuel_capacity";--> statement-breakpoint
ALTER TABLE "trucks" DROP COLUMN "purchase_price";--> statement-breakpoint
ALTER TABLE "trucks" DROP COLUMN "last_seen_at";--> statement-breakpoint
ALTER TABLE "cabins" ADD CONSTRAINT "cabins_game_ref_id_unique" UNIQUE("game_ref_id");--> statement-breakpoint
ALTER TABLE "chassis" ADD CONSTRAINT "chassis_game_ref_id_unique" UNIQUE("game_ref_id");--> statement-breakpoint
ALTER TABLE "engines" ADD CONSTRAINT "engines_game_ref_id_unique" UNIQUE("game_ref_id");--> statement-breakpoint
ALTER TABLE "transmissions" ADD CONSTRAINT "transmissions_game_ref_id_unique" UNIQUE("game_ref_id");