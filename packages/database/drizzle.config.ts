import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './src/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'sqlite.db',
  },
});