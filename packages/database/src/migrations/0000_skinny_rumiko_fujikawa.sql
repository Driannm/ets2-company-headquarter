CREATE TABLE `drivers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`garage_id` text,
	`rating` real DEFAULT 1,
	`salary_per_km` real DEFAULT 3.5,
	`status` text DEFAULT 'idle',
	FOREIGN KEY (`garage_id`) REFERENCES `garages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `garages` (
	`id` text PRIMARY KEY NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`upgrade_level` integer DEFAULT 1,
	`max_capacity` integer DEFAULT 3
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`cargo_name` text NOT NULL,
	`origin_city` text NOT NULL,
	`destination_city` text NOT NULL,
	`payout_amount` integer NOT NULL,
	`driver_id` text,
	`truck_id` text,
	`fuel_consumed_liters` real DEFAULT 0,
	`completed_at` integer,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`truck_id`) REFERENCES `trucks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trucks` (
	`id` text PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`license_plate` text NOT NULL,
	`garage_id` text,
	`condition_engine` real DEFAULT 1,
	`condition_chassis` real DEFAULT 1,
	`odometer_km` real DEFAULT 0,
	FOREIGN KEY (`garage_id`) REFERENCES `garages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trucks_license_plate_unique` ON `trucks` (`license_plate`);