CREATE TABLE IF NOT EXISTS `counts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `counts` (key, value) VALUES ("primary", 0);
