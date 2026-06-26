import { ParsedTrailer } from "../types/savegame.types.js";
import { ReferenceResolver } from "./reference-resolver.js";
import {
  parseSiiFloat,
  parseArrayField,
  clamp01,
  extractBrandFromDataPath,
  extractModelFromDataPath,
  normalizeBrandName,
  normalizeModelName,
} from "./sii-parser.js";

/**
 * Detect brand dan model trailer dari accessories-nya.
 *
 * Trailer punya `vehicle_accessory` yang data_path-nya seperti:
 *   /def/vehicle/trailer_owned/scs.gooseneck/data.sii
 *   /def/vehicle/trailer_owned/scs.flatbed/body/...
 */
function detectTrailerIdentity(
  resolver: ReferenceResolver,
  accessoryIds: string[]
): { brand: string; model: string } {
  for (const accId of accessoryIds) {
    const accAttrs = resolver.get(accId);
    if (!accAttrs?.data_path) continue;

    const dataPath = accAttrs.data_path;

    // Cari path yang mengandung trailer_owned
    if (!dataPath.includes("/trailer_owned/") && !dataPath.includes("/trailer/")) {
      continue;
    }

    const brand = extractBrandFromDataPath(dataPath);
    const model = extractModelFromDataPath(dataPath);

    if (brand) {
      return {
        brand: normalizeBrandName(brand),
        model: model ? normalizeModelName(model) : "Trailer",
      };
    }
  }

  return { brand: "Unknown", model: "Trailer" };
}

export function parseTrailers(
  blocks: Record<string, Record<string, string>>,
  resolver: ReferenceResolver,
  trailerGarageMap: Map<string, string>
): ParsedTrailer[] {
  const trailers: ParsedTrailer[] = [];

  for (const [blockName, attrs] of Object.entries(blocks)) {
    if (!blockName.startsWith("trailer :")) continue;

    const id = blockName.split(":")[1].trim();
    const accessoryIds = parseArrayField(attrs, "accessories");

    const identity = detectTrailerIdentity(resolver, accessoryIds);

    trailers.push({
      id,
      garageId: trailerGarageMap.get(id),

      brand: identity.brand,
      model: identity.model,

      trailerDefinition: attrs.trailer_definition,
      bodyType: attrs.body_type,

      assignedDriverId:
        attrs.assigned_driver !== "null" ? attrs.assigned_driver : undefined,
      assignedTruckId:
        attrs.assigned_vehicle !== "null" ? attrs.assigned_vehicle : undefined,

      condition: clamp01(1 - parseSiiFloat(attrs.wear ?? "0")),
    });
  }

  return trailers;
}