import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("❌ Gagal menjalankan migrasi: NEON_DATABASE_URL tidak ditemukan di file .env");
  process.exit(1);
}

console.log('Menghubungkan ke Neon.com PostgreSQL database...');

const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient);

try {
  console.log('Menjalankan migrasi skema ke Neon...');
  await migrate(db, {
    migrationsFolder: path.join(__dirname, 'migrations-pg')
  });
  console.log('✅ Migrasi skema database di Neon.com berhasil diselesaikan!');
  await migrationClient.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Terjadi kesalahan saat menjalankan migrasi:', error);
  await migrationClient.end();
  process.exit(1);
}