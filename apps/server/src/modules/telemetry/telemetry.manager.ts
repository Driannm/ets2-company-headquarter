import { FastifyInstance } from 'fastify';
import { TelemetryProvider } from './telemetry.provider.js';
import { UdpNetworkProvider } from './providers/udp.provider.js';
import { LocalMemoryProvider } from './providers/local.provider.js';
import { TelemetryPayload } from '@ets2-company-headquarter/types';

export class TelemetryManager {
  private provider: TelemetryProvider;

  constructor(private fastify: FastifyInstance, source: 'local' | 'network' = 'network') {
    if (source === 'local') {
      this.provider = new LocalMemoryProvider(fastify);
    } else {
      this.provider = new UdpNetworkProvider(fastify);
    }
    
    this.fastify.log.info(`[Telemetry Manager] Diposisikan menggunakan Mode: ${source.toUpperCase()}`);
  }

  public async startStream() {
    await this.provider.start((payload: TelemetryPayload) => {
      // 1. Broadcast paket real-time ke semua client UI lewat WebSockets (60Hz)
      const wsClients = this.fastify.websocketServer?.clients;
      if (wsClients && wsClients.size > 0) {
        const payloadString = JSON.stringify(payload);
        for (const client of wsClients) {
          if (client.readyState === 1) {
            client.send(payloadString);
          }
        }
      }
    });
  }

  public async stopStream() {
    await this.provider.stop();
  }
}