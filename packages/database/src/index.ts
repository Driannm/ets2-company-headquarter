import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';

export * from './schema.js';

// Definisikan interface return type secara eksplisit untuk mencegah TS4058
export interface DatabaseClient {
  db: BetterSQLite3Database<typeof schema>;
  sqlite: Database.Database;
}

export function createDatabaseClient(databasePath: string): DatabaseClient {
  const sqlite = new Database(databasePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  
  return {
    db: drizzle(sqlite, { schema }),
    sqlite,
  };
}