import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.pg.ts",
  out: "./src/migrations/pg",
  dialect: "postgresql", // Wajib didefinisikan pada drizzle-kit v0.31+
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || "postgres://localhost:5432/db",
  },
});