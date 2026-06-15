/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');

// Membaca file .env di direktori root monorepo
dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.NEON_DATABASE_URL) {
  console.warn("⚠️ Peringatan: Variabel lingkungan NEON_DATABASE_URL belum didefinisikan di .env");
}

module.exports = {
  schema: './src/schema.pg.ts', // Drizzle Kit tetap dapat membaca file TS skema dengan aman
  out: './src/migrations-pg',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL || '',
  },
};