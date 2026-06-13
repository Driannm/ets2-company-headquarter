import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as path from 'path';

// Pada CommonJS, __dirname langsung tersedia secara global.
// Kita tidak memerlukan import.meta atau URL parser.

const dbPath = process.env.DATABASE_URL || 'sqlite.db';
console.log(`Menjalankan migrasi pada database: ${dbPath}`);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

try {
  migrate(db, { 
    migrationsFolder: path.join(__dirname, 'migrations') 
  });
  console.log('Migrasi database berhasil diselesaikan.');
  process.exit(0);
} catch (error) {
  console.error('Gagal menjalankan migrasi database:', error);
  process.exit(1);
}