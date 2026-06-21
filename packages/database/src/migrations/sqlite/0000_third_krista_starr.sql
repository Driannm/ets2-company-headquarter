CREATE TABLE `cabins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chassis` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`fuel_tank` text,
	`brand` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `company_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`money` integer DEFAULT 0,
	`loan_amount` integer DEFAULT 0,
	`total_distance_km` real DEFAULT 0,
	`company_value` integer DEFAULT 0,
	`total_drivers` integer DEFAULT 0,
	`total_garages` integer DEFAULT 0,
	`total_trucks` integer DEFAULT 0,
	`total_trailers` integer DEFAULT 0,
	`recorded_at` integer NOT NULL,
	`sync_status` text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` text PRIMARY KEY NOT NULL,
	`game_ref_id` text,
	`name` text NOT NULL,
	`garage_id` text,
	`truck_id` text,
	`rating` real DEFAULT 1,
	`salary_per_km` real DEFAULT 3.5,
	`salary` real,
	`profit_ability` integer DEFAULT 0,
	`long_distance_skill` integer DEFAULT 0,
	`status` text DEFAULT 'idle',
	`training_skill` text,
	`distance_skill` integer DEFAULT 0,
	`eco_skill` integer DEFAULT 0,
	`fragile_skill` integer DEFAULT 0,
	`adr_skill` integer DEFAULT 0,
	`is_on_job` integer DEFAULT false,
	`last_revenue` integer DEFAULT 0,
	`sync_status` text DEFAULT 'pending',
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`garage_id`) REFERENCES `garages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`truck_id`) REFERENCES `trucks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_game_ref_id_unique` ON `drivers` (`game_ref_id`);--> statement-breakpoint
CREATE TABLE `engines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`horsepower` integer NOT NULL,
	`torque` integer NOT NULL,
	`brand` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `garages` (
	`id` text PRIMARY KEY NOT NULL,
	`game_ref_id` text,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`location_token` text,
	`upgrade_level` integer DEFAULT 1,
	`max_capacity` integer DEFAULT 3,
	`vehicle_slots` integer DEFAULT 3,
	`driver_slots` integer DEFAULT 3,
	`sync_status` text DEFAULT 'pending',
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `garages_game_ref_id_unique` ON `garages` (`game_ref_id`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`game_ref_id` text,
	`cargo_name` text NOT NULL,
	`origin_city` text NOT NULL,
	`destination_city` text NOT NULL,
	`payout_amount` integer NOT NULL,
	`distance_km` real DEFAULT 0,
	`cargo_mass_kg` real DEFAULT 0,
	`fuel_consumed_liters` real DEFAULT 0,
	`cargo_damage_percent` real DEFAULT 0,
	`late_penalty` integer DEFAULT 0,
	`xp_earned` integer DEFAULT 0,
	`driver_id` text,
	`truck_id` text,
	`completed_at` integer,
	`sync_status` text DEFAULT 'pending',
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`truck_id`) REFERENCES `trucks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_game_ref_id_unique` ON `jobs` (`game_ref_id`);--> statement-breakpoint
CREATE TABLE `trailers` (
	`id` text PRIMARY KEY NOT NULL,
	`game_ref_id` text,
	`brand` text,
	`model` text,
	`cargo` text,
	`license_plate` text,
	`trailer_definition` text,
	`body_type` text,
	`assigned_driver_id` text,
	`assigned_truck_id` text,
	`garage_id` text,
	`condition` real DEFAULT 1,
	`odometer_km` real DEFAULT 0,
	`updated_at` integer NOT NULL,
	`sync_status` text DEFAULT 'pending',
	FOREIGN KEY (`garage_id`) REFERENCES `garages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trailers_game_ref_id_unique` ON `trailers` (`game_ref_id`);--> statement-breakpoint
CREATE TABLE `transmissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`gears_count` integer DEFAULT 12,
	`has_retarder` integer DEFAULT true,
	`brand` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trucks` (
	`id` text PRIMARY KEY NOT NULL,
	`game_ref_id` text,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`name` text,
	`license_plate` text NOT NULL,
	`garage_id` text,
	`cabin_id` text,
	`chassis_id` text,
	`engine_id` text,
	`transmission_id` text,
	`trailer_id` text,
	`condition_cabin` real DEFAULT 1,
	`condition_chassis` real DEFAULT 1,
	`condition_engine` real DEFAULT 1,
	`condition_transmission` real DEFAULT 1,
	`wear_wheels` real DEFAULT 1,
	`wear_paint` real DEFAULT 1,
	`fuel_liters` real DEFAULT 0,
	`fuel_capacity` real DEFAULT 0,
	`purchase_price` integer,
	`is_player_truck` integer DEFAULT false,
	`odometer_km` real DEFAULT 0,
	`last_seen_at` integer,
	`sync_status` text DEFAULT 'pending',
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`garage_id`) REFERENCES `garages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chassis_id`) REFERENCES `chassis`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`engine_id`) REFERENCES `engines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transmission_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trucks_game_ref_id_unique` ON `trucks` (`game_ref_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `trucks_license_plate_unique` ON `trucks` (`license_plate`);