import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.sqlite.ts",
  out: "./src/migrations/sqlite",
  dialect: "sqlite", // Wajib didefinisikan pada drizzle-kit v0.31+
  dbCredentials: {
    url: process.env.DATABASE_URL || "sqlite.db",
  },
});