import { TelemetryProvider } from '../telemetry.provider.js';
import { TelemetryPayload } from '@ets2-company-headquarter/types';
import { FastifyInstance } from 'fastify';

export class LocalMemoryProvider implements TelemetryProvider {
  private active = false;
  private intervalId: NodeJS.Timeout | null = null;
  private nativeBridge: any = null;

  constructor(
    private fastify: FastifyInstance,
    private pollIntervalMs: number = 16 // 60Hz polling
  ) {
    // Di masa depan / saat rilis di PC, kita menggunakan native bindings C++/Rust:
    // this.nativeBridge = require('ets2-shared-memory-native-addon');
  }

  async start(onDataReceived: (data: TelemetryPayload) => void): Promise<void> {
    this.active = true;
    this.fastify.log.info(`[Telemetry Local] Memulai pembacaan Shared Memory Windows natively di PC ini...`);

    // Mock native bridge pembaca memori jika native addon belum di-compile
    this.intervalId = setInterval(() => {
      if (!this.active) return;
      
      try {
        let payload: TelemetryPayload;

        if (this.nativeBridge) {
          // Membaca struct byte mentah dari "Local\\Ets2TelemetryServer" di Windows RAM
          payload = this.nativeBridge.readSharedMemory();
        } else {
          // Fallback data simulasi lokal jika game belum berjalan di PC
          payload = this.getMockLocalTelemetry();
        }

        onDataReceived(payload);
      } catch (err) {
        this.fastify.log.error(`[Telemetry Local] Gagal membaca shared memory map Windows: ${err}`);
      }
    }, this.pollIntervalMs);
  }

  async stop(): Promise<void> {
    this.active = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isConnected(): boolean {
    return this.active;
  }

  // Simulasi telemetry lokal untuk pengujian sebelum build native C++
  private getMockLocalTelemetry(): TelemetryPayload {
    return {
      timestamp: Date.now(),
      gameVersion: "1.50.1",
      isConnected: true,
      truck: {
        brandId: "volvo",
        brandName: "Volvo",
        modelId: "fh16",
        modelName: "FH16 Globetrotter",
        speedKmh: 90,
        engineRpm: 1350,
        gear: 12,
        cruiseControlSpeedKmh: 90,
        cruiseControlActive: true,
        fuelLiters: 600,
        fuelCapacity: 800,
        fuelAverageConsumptionLitersPerKm: 31.2,
        adBlueLiters: 52,
        airPressureBar: 12.0,
        engineTemperatureCelsius: 85,
        odometerKm: 84300,
        damage: { engine: 0, transmission: 0, cabin: 0, chassis: 0, wheels: 0 }
      },
      navigation: {
        estimatedTimeSeconds: 8400,
        estimatedDistanceMeters: 180000,
        speedLimitKmh: 90
      },
      job: {
        active: true,
        cargoName: "High-Tech Components",
        cargoMassKg: 18000,
        destinationCity: "London",
        destinationCountry: "UK",
        originCity: "Berlin",
        originCountry: "Germany",
        payoutAmount: 142390,
        timeRemainingSeconds: 12000
      },
      placement: {
        coordinate: { x: 120, y: 0, z: 80 },
        rotation: { x: 0, y: 12, z: 0 }
      }
    };
  }
}