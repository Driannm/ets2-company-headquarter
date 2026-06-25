import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// 1. Impor skema secara internal sebagai namespace lengkap
import * as sqliteSchema from './schema.sqlite.js';
import * as pgSchema from './schema.pg.js';

// Definisikan interface return type secara eksplisit untuk mencegah TS4058
export interface DatabaseClient {
  db: BetterSQLite3Database<typeof sqliteSchema>;
  sqlite: Database.Database;
}

export function createDatabaseClient(databasePath: string): DatabaseClient {
  const sqlite = new Database(databasePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  
  return {
    db: drizzle(sqlite, { schema: sqliteSchema }),
    sqlite,
  };
}

// 2. Ekspos tabel individu secara terpisah (untuk tipe & migrasi kit)
export * from './schema.sqlite.js';
export * from './schema.pg.js';
export * from './queries.js';

// 3. Ekspos objek skema terpadu (sqliteSchema dan pgSchema) untuk Drizzle client server
export { sqliteSchema, pgSchema };