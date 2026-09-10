import { CpuComponent, GpuComponent } from './components';

export type { CpuComponent, GpuComponent };

export interface RamOption {
  capacityGB: number;
  label: string;
  estimatedPowerW: number;
}

export type CoolingType = 'air' | 'aio';

export interface CalculatorInputs {
  cpuId: string;
  gpuId: string;
  ramGB: number;
  ssdCount: number;
  hddCount: number;
  coolingType: CoolingType;
  fanCount: number;
  isOverclocked: boolean;
  headroomFactor?: number; // e.g. 0.25 for 25%
}

export interface PowerBreakdown {
  cpu: number;
  gpu: number;
  ram: number;
  ssd: number;
  hdd: number;
  cooling: number;
  fans: number;
  misc: number;
  overclockBonus: number;
}

export interface CalculationResult {
  estimatedPowerW: number;
  recommendedPowerW: number; // estimatedPower * (1 + headroomFactor)
  standardPsuWattage: number; // rounded UP to standard PSU size
  headroomPercent: number; // e.g. 25
  breakdown: PowerBreakdown;
}
