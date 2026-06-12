import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';

export * from './schema.js';

export function createDatabaseClient(databasePath: string) {
  const sqlite = new Database(databasePath);
  // Aktifkan Write-Ahead Logging untuk performa write-heavy concurrency
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  
  return {
    db: drizzle(sqlite, { schema }),
    sqlite,
  };
}