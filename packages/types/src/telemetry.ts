export interface TelemetryVector3D {
    x: number;
    y: number;
    z: number;
  }
  
  export interface TelemetryPlacement {
    coordinate: TelemetryVector3D;
    rotation: TelemetryVector3D; // Pitch, Yaw, Roll
  }
  
  export interface TelemetryTruck {
    brandId: string;
    brandName: string;
    modelId: string;
    modelName: string;
    
    // Real-time Dynamics
    speedKmh: number;
    engineRpm: number;
    gear: number;
    cruiseControlSpeedKmh: number;
    cruiseControlActive: boolean;
    
    // Consumables & Systems
    fuelLiters: number;
    fuelCapacity: number;
    fuelAverageConsumptionLitersPerKm: number;
    adBlueLiters: number;
    airPressureBar: number;
    engineTemperatureCelsius: number;
    odometerKm: number;
    
    // Wear / Damages (0.0 to 1.0)
    damage: {
      engine: number;
      transmission: number;
      cabin: number;
      chassis: number;
      wheels: number;
    };
  }
  
  export interface TelemetryNavigation {
    estimatedTimeSeconds: number;
    estimatedDistanceMeters: number;
    speedLimitKmh: number;
  }
  
  export interface TelemetryJob {
    active: boolean;
    cargoName: string;
    cargoMassKg: number;
    destinationCity: string;
    destinationCountry: string;
    originCity: string;
    originCountry: string;
    payoutAmount: number;
    timeRemainingSeconds: number;
  }
  
  export interface TelemetryPayload {
    timestamp: number;
    gameVersion: string;
    isConnected: boolean;
    truck: TelemetryTruck;
    navigation: TelemetryNavigation;
    job: TelemetryJob;
    placement: TelemetryPlacement;
  }