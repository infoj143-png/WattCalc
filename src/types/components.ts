export type CpuManufacturer = 'AMD' | 'Intel';
export type GpuManufacturer = 'NVIDIA' | 'AMD' | 'Intel' | 'Integrierte Grafik';

/**
 * CPU Data Model
 * Note: powerWatts is the manufacturer thermal design power (TDP) / max power limit (PL2/MTP)
 * in Watts suitable for peak load PSU calculation estimation.
 */
export interface CpuComponent {
  id: string;
  manufacturer: CpuManufacturer;
  model: string;
  powerWatts: number;
  /** Optional computed display name helper */
  name?: string;
  /** Legacy compatibility helper */
  estimatedPowerW?: number;
}

/**
 * GPU Data Model
 * Note: powerWatts is the total graphics power (TGP / TDP) in Watts suitable for peak load PSU calculation estimation.
 */
export interface GpuComponent {
  id: string;
  manufacturer: GpuManufacturer;
  model: string;
  powerWatts: number;
  /** Optional computed display name helper */
  name?: string;
  /** Legacy compatibility helper */
  estimatedPowerW?: number;
}
