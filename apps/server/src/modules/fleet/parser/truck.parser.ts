import { ParsedTruck } from "../types/savegame.types.js";
import { ReferenceResolver } from "./reference-resolver.js";
import {
  parseSiiFloat,
  parseArrayField,
  clamp01,
  cleanLicensePlate,
  extractBrandFromDataPath,
  extractModelFromDataPath,
  normalizeBrandName,
  normalizeModelName,
} from "./sii-parser.js";

/**
 * Hasil detect brand+model dari accessories truck.
 */
interface TruckIdentity {
  brand: string;
  model: string;
  cabinId?: string;
  chassisId?: string;
  engineId?: string;
  transmissionId?: string;
}

/**
 * Detect brand, model, dan component IDs dari accessories truck.
 *
 * Strategi:
 * 1. Loop semua accessory id dari vehicle block
 * 2. Resolve setiap accessory via ReferenceResolver
 * 3. Cek data_path → extract brand & model
 * 4. Untuk tipe cabin/chassis/engine/transmission, simpan ref id-nya
 *
 * Semua aksesori mengandung data_path, tapi hanya beberapa yang
 * ada di subfolder truck/<brand>.<model>/ — kita ambil yang pertama ketemu.
 */
function detectTruckIdentity(
  resolver: ReferenceResolver,
  accessoryIds: string[]
): TruckIdentity {
  let brand: string | undefined;
  let model: string | undefined;
  let cabinId: string | undefined;
  let chassisId: string | undefined;
  let engineId: string | undefined;
  let transmissionId: string | undefined;

  for (const accId of accessoryIds) {
    const accAttrs = resolver.get(accId);
    if (!accAttrs) continue;

    const dataPath = accAttrs.data_path;
    if (!dataPath) continue;

    // Hanya proses path truck (bukan trailer atau addon)
    if (!dataPath.includes("/truck/")) continue;

    // Extract brand & model dari path jika belum dapat
    if (!brand) {
      brand = extractBrandFromDataPath(dataPath);
      model = extractModelFromDataPath(dataPath);
    }

    // Identifikasi tipe komponen dari path
    const blockType = resolver.getType(accId);

    if (blockType === "vehicle_accessory") {
      if (dataPath.includes("/cabin/") && !cabinId) {
        cabinId = accId;
      } else if (dataPath.includes("/chassis/") && !chassisId) {
        chassisId = accId;
      } else if (dataPath.includes("/engine/") && !engineId) {
        engineId = accId;
      } else if (dataPath.includes("/transmission/") && !transmissionId) {
        transmissionId = accId;
      }
    }

    // Stop jika semua sudah dapat
    if (brand && cabinId && chassisId && engineId && transmissionId) break;
  }

  return {
    brand: brand ? normalizeBrandName(brand) : "Unknown",
    model: model ? normalizeModelName(model) : "Unknown",
    cabinId,
    chassisId,
    engineId,
    transmissionId,
  };
}

/**
 * Hitung rata-rata wear roda dari array wear values.
 */
function calcAvgWheelWear(
  attrs: Record<string, string>,
  wheels: string[]
): number {
  if (wheels.length === 0) return 0;

  const total = wheels.reduce(
    (sum, val) => sum + parseSiiFloat(val),
    0
  );

  return total / wheels.length;
}

export function parseTrucks(
  blocks: Record<string, Record<string, string>>,
  resolver: ReferenceResolver,
  truckGarageMap: Map<string, string>
): ParsedTruck[] {
  const trucks: ParsedTruck[] = [];

  for (const [blockName, attrs] of Object.entries(blocks)) {
    if (
      !blockName.startsWith("vehicle :") ||
      !attrs.license_plate
    ) {
      continue;
    }

    const id = blockName.split(":")[1].trim();
    const accessoryIds = parseArrayField(attrs, "accessories");

    const identity = detectTruckIdentity(resolver, accessoryIds);

    // wheels_wear adalah array — ambil semua dan rata-rata
    const wheelWears = parseArrayField(attrs, "wheels_wear");

    const avgWheelWear = calcAvgWheelWear(attrs, wheelWears);

    // fuel_relative adalah rasio 0-1, bukan liter
    // fuelCapacity tidak ada di savegame, disimpan 0 sampai ada sumber lain
    const fuelRatio = parseSiiFloat(attrs.fuel_relative ?? "0");

    trucks.push({
      id,
      garageId: truckGarageMap.get(id),

      brand: identity.brand,
      model: identity.model,

      licensePlate: cleanLicensePlate(attrs.license_plate),

      cabinId: identity.cabinId,
      chassisId: identity.chassisId,
      engineId: identity.engineId,
      transmissionId: identity.transmissionId,

      // fuel_relative = rasio, fuelCapacity = 0 karena tidak ada di savegame
      fuelLiters: fuelRatio,
      fuelCapacity: 0,

      odometerKm: Number(attrs.odometer ?? 0),

      conditionEngine: clamp01(
        1 - parseSiiFloat(attrs.engine_wear ?? "0")
      ),
      conditionChassis: clamp01(
        1 - parseSiiFloat(attrs.chassis_wear ?? "0")
      ),
      conditionCabin: clamp01(
        1 - parseSiiFloat(attrs.cabin_wear ?? "0")
      ),
      conditionTransmission: clamp01(
        1 - parseSiiFloat(attrs.transmission_wear ?? "0")
      ),

      wearWheels: clamp01(1 - avgWheelWear),
    });
  }

  return trucks;
}