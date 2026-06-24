import dgram from 'dgram';
import { TelemetryProvider } from '../telemetry.provider.js';
import { TelemetryPayload } from '@ets2-company-headquarter/types';
import { FastifyInstance } from 'fastify';

export class UdpNetworkProvider implements TelemetryProvider {
  private socket: dgram.Socket | null = null;
  private active = false;

  constructor(
    private fastify: FastifyInstance,
    private port: number = 45613
  ) {}

  async start(onDataReceived: (data: TelemetryPayload) => void): Promise<void> {
    this.socket = dgram.createSocket('udp4');
    this.active = true;

    this.socket.on('message', (msg) => {
      try {
        const payload = JSON.parse(msg.toString()) as TelemetryPayload;
        onDataReceived(payload);
      } catch (_err) {
        // Abaikan paket rusak di jaringan Wi-Fi
      }
    });

    this.socket.on('listening', () => {
      const address = this.socket?.address();
      this.fastify.log.info(`[Telemetry UDP] Mendengarkan paket di LAN ${address?.address}:${address?.port}`);
    });

    this.socket.on('error', (err) => {
      this.fastify.log.error(`[Telemetry UDP] Socket error: ${err.message}`);
    });

    this.socket.bind(this.port, '0.0.0.0');
  }

  async stop(): Promise<void> {
    this.active = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.active;
  }
}