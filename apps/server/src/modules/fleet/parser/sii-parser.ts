/**
 * Konverter IEEE-754 Hex ke Desimal Float
 * e.g., "&3f30e9bd" -> 0.6909...
 */
export function parseSiiFloat(val: string): number {
  if (!val) return 0;

  if (!val.startsWith("&")) {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }

  try {
    const hex = val.substring(1);
    const intVal = parseInt(hex, 16);
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, intVal, false);
    const floatVal = view.getFloat32(0, false);
    return isNaN(floatVal) ? 0 : floatVal;
  } catch {
    return 0;
  }
}

/**
 * Parse semua blok SiiNunit dari konten file .sii
 * Mendukung nested braces dan array fields.
 */
export function parseSiiBlocks(
  content: string
): Record<string, Record<string, string>> {
  const blocks: Record<string, Record<string, string>> = {};
  const lines = content.split(/\r?\n/);

  let currentBlockName: string | null = null;
  let currentBlockData: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    if (trimmed.endsWith("{")) {
      const header = trimmed.slice(0, -1).trim();
      currentBlockName = header;
      currentBlockData = {};
      continue;
    }

    if (trimmed === "}") {
      if (currentBlockName) {
        blocks[currentBlockName] = currentBlockData;
      }
      currentBlockName = null;
      continue;
    }

    if (currentBlockName && trimmed.includes(":")) {
      const separatorIdx = trimmed.indexOf(":");
      const key = trimmed.substring(0, separatorIdx).trim();
      let value = trimmed.substring(separatorIdx + 1).trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      currentBlockData[key] = value;
    }
  }

  return blocks;
}

/**
 * Parse array field dari attrs.
 * e.g., vehicles[0], vehicles[1], ...
 */
export function parseArrayField(
  attrs: Record<string, string>,
  field: string
): string[] {
  const count = parseInt(attrs[field] || "0", 10);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const val = attrs[`${field}[${i}]`];
    if (val) result.push(val);
  }

  return result;
}

/**
 * Clamp nilai ke range 0-1.
 */
export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * Cari block berdasarkan ref id (bagian setelah `:` di header).
 */
export function getBlockById(
  blocks: Record<string, Record<string, string>>,
  id: string
): Record<string, string> | undefined {
  const fullHeader = Object.keys(blocks).find((key) => key.endsWith(id));
  if (!fullHeader) return undefined;
  return blocks[fullHeader];
}

/**
 * Extract brand dari data_path accessory.
 *
 * Contoh paths:
 *   /def/vehicle/truck/scania.r/engine/dc13_730.sii       → scania
 *   /def/vehicle/truck/volvo.fh/chassis/6x2.sii           → volvo
 *   /def/vehicle/trailer_owned/scs.gooseneck/data.sii     → scs
 *
 * Return undefined jika path tidak mengandung pola yang dikenal.
 */
export function extractBrandFromDataPath(
  dataPath: string | undefined
): string | undefined {
  if (!dataPath) return undefined;

  // Match /truck/<brand>.<model>/ atau /trailer_owned/<brand>.<model>/
  const match = dataPath.match(
    /\/(?:truck|trailer_owned|trailer)\/([a-z0-9_]+)\.[a-z0-9_]+\//i
  );

  if (!match) return undefined;

  return normalizeBrandName(match[1]);
}

/**
 * Extract model dari data_path accessory.
 *
 * Contoh: /def/vehicle/truck/scania.r/... → "r"
 */
export function extractModelFromDataPath(
  dataPath: string | undefined
): string | undefined {
  if (!dataPath) return undefined;

  const match = dataPath.match(
    /\/(?:truck|trailer_owned|trailer)\/[a-z0-9_]+\.([a-z0-9_]+)\//i
  );

  if (!match) return undefined;

  return match[1];
}

/**
 * Normalisasi nama brand dari token game ke display name.
 */
export function normalizeBrandName(raw: string): string {
  const map: Record<string, string> = {
    scania: "Scania",
    volvo: "Volvo",
    daf: "DAF",
    iveco: "Iveco",
    mercedes: "Mercedes-Benz",
    man: "MAN",
    renault: "Renault",
    ford: "Ford",
    mack: "Mack",
    peterbilt: "Peterbilt",
    kenworth: "Kenworth",
    freightliner: "Freightliner",
    western_star: "Western Star",
    scs: "SCS",
  };

  return map[raw.toLowerCase()] ?? raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Normalisasi nama model dari token game ke display name.
 * e.g., "new_r" → "New R", "actros" → "Actros"
 */
export function normalizeModelName(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Bersihkan license plate dari markup ETS2.
 * e.g., "B<img ...>JG 211|germany" → "BJG 211"
 */
export function cleanLicensePlate(raw: string): string {
  if (!raw) return "";

  // Hapus semua tag XML/markup ETS2
  let plate = raw.replace(/<[^>]+>/g, "");

  // Ambil bagian sebelum "|" (country suffix)
  if (plate.includes("|")) {
    plate = plate.split("|")[0];
  }

  return plate.replace(/\s+/g, " ").trim();
}