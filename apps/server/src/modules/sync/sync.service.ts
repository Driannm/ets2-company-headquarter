/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgSchema, syncGaragesToCloud, syncTrucksToCloud } from '@ets2-company-headquarter/database';

export function startBackgroundSyncService(
  fastify: FastifyInstance,
  neonConnectionString: string,
  intervalMs: number = 30000
) {
  const sql = neon(neonConnectionString);
  const cloudDb = drizzle(sql, { schema: pgSchema });

  setInterval(async () => {
    try {
      // 1. Verifikasi koneksi internet ke Neon cloud
      await sql`SELECT 1`;
      
      // 2. Jalankan fungsi sinkronisasi cloud terpadu
      await syncGaragesToCloud(fastify.db as any, cloudDb as any);
      await syncTrucksToCloud(fastify.db as any, cloudDb as any);

    } catch (err) {
      fastify.log.warn(
        `[Sync Service] Sinkronisasi ditunda. Alasan: ${err instanceof Error ? err.message : 'Koneksi internet offline'}`
      );
    }
  }, intervalMs);
}