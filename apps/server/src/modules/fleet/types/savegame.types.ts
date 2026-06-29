export interface ParsedGarage {
  id: string;
  city: string;
  country: string;
  upgradeLevel: number;
  maxCapacity: number;
  vehicleIds: string[];
  driverIds: string[];
  trailerIds: string[];
}

export interface ParsedTruck {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  garageId?: string;

  // Ref ids ke accessory blocks — ada jika terdeteksi dari data_path
  cabinId?: string;
  chassisId?: string;
  engineId?: string;
  transmissionId?: string;

  // fuel_relative dari savegame adalah rasio 0.0-1.0
  // fuelCapacity tidak ada di savegame — 0 sampai diisi dari sumber lain
  fuelLiters: number;    // = fuelRatio (rasio, bukan liter aktual)
  fuelCapacity: number;  // = 0 (tidak tersedia di savegame)

  odometerKm: number;

  // Kondisi: 1.0 = sempurna, 0.0 = rusak total
  conditionEngine: number;
  conditionChassis: number;
  conditionCabin: number;
  conditionTransmission: number;
  wearWheels: number;  // rata-rata semua roda
}

export interface ParsedDriver {
  id: string;
  name: string;     // di-generate, bukan dari savegame
  garageId?: string;

  // ETS2 tidak menyimpan rating dan salary di savegame
  rating: number;       // default 1.0
  salaryPerKm: number;  // default 0 (tidak tersedia)

  status: "idle" | "resting" | "driving" | "on_delivery" | "unknown";

  // Skills — dari driver_ai, 0 untuk player
  profitAbility: number;  // tidak ada di savegame, selalu 0
  longDistanceSkill: number;
  ecoSkill: number;       // tidak ada di savegame, selalu 0
  fragileSkill: number;
  adrSkill: number;
  heavySkill: number;
  urgentSkill: number;
  mechanicalSkill: number;
}

export interface ParsedTrailer {
  id: string;
  brand: string;
  model: string;
  garageId?: string;

  trailerDefinition?: string;
  bodyType?: string;

  assignedDriverId?: string;
  assignedTruckId?: string;

  // 1.0 = sempurna, 0.0 = rusak
  condition: number;
}

export interface ParsedCompanyStats {
  money: number;
  loanAmount: number;
  totalGarages: number;
  totalDrivers: number;
  totalTrucks: number;
  totalTrailers: number;
}

export interface ParsedSavegame {
  garages: ParsedGarage[];
  trucks: ParsedTruck[];
  drivers: ParsedDriver[];
  trailers: ParsedTrailer[];
  companyStats: ParsedCompanyStats;
}