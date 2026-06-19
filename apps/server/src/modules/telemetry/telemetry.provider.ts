import { TelemetryPayload } from '@ets2-dashboard/types';

export interface TelemetryProvider {
  /**
   * Menginisialisasi koneksi / socket pendengar
   */
  start(onDataReceived: (data: TelemetryPayload) => void): Promise<void>;
  
  /**
   * Menghentikan koneksi secara bersih untuk mencegah kebocoran memori / port terkunci
   */
  stop(): Promise<void>;
  
  /**
   * Mengembalikan status koneksi penyedia telemetri saat ini
   */
  isConnected(): boolean;
}