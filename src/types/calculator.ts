import { CpuComponent, GpuComponent } from './components';

export type { CpuComponent, GpuComponent };

export interface RamOption {
  capacityGB: number;
  label: string;
  estimatedPowerW: number;
}

export type CoolingType = 'air' | 'aio';
export type MotherboardType = 'standard' | 'high_end';
export type UsbPeripheralLevel = 'low' | 'normal' | 'high';

export interface MotherboardOption {
  type: MotherboardType;
  label: string;
  estimatedPowerW: number;
}

export interface UsbOption {
  level: UsbPeripheralLevel;
  label: string;
  estimatedPowerW: number;
}

export interface CalculatorInputs {
  cpuId: string;
  gpuId: string;
  ramGB: number;
  ssdCount: number;
  hddCount: number;
  motherboardType?: MotherboardType;
  coolingType: CoolingType;
  fanCount: number;
  pcieCardCount?: number;
  usbLevel?: UsbPeripheralLevel;
  isOverclocked: boolean;
  headroomFactor?: number; // e.g. 0.25 for 25%
}

export interface PowerBreakdown {
  cpu: number;
  gpu: number;
  ram: number;
  ssd: number;
  hdd: number;
  motherboard: number;
  cooling: number;
  fans: number;
  pcieCards: number;
  usbPeripherals: number;
  systemOverhead: number;
  overclockBonus: number;
}

export interface CalculationResult {
  estimatedPowerW: number;
  recommendedPowerW: number; // estimatedPower * (1 + headroomFactor)
  standardPsuWattage: number; // rounded UP to standard PSU size
  headroomPercent: number; // e.g. 25
  breakdown: PowerBreakdown;
}
