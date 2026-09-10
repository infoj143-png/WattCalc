import { CPUS as CPUS_DATA } from './cpus';
import { GPUS as GPUS_DATA } from './gpus';
import { CpuComponent, GpuComponent } from '../types/components';
import { RamOption } from '../types/calculator';

// Enrich CPUS with helper getter/properties for name and estimatedPowerW
export const CPUS: CpuComponent[] = CPUS_DATA.map((cpu) => ({
  ...cpu,
  name: `${cpu.manufacturer} ${cpu.model}`,
  estimatedPowerW: cpu.powerWatts,
}));

// Enrich GPUS with helper getter/properties for name and estimatedPowerW
export const GPUS: GpuComponent[] = GPUS_DATA.map((gpu) => ({
  ...gpu,
  name: `${gpu.manufacturer} ${gpu.model}`,
  estimatedPowerW: gpu.powerWatts,
}));

export const RAM_OPTIONS: RamOption[] = [
  { capacityGB: 8, label: '8 GB', estimatedPowerW: 5 },
  { capacityGB: 16, label: '16 GB', estimatedPowerW: 10 },
  { capacityGB: 32, label: '32 GB', estimatedPowerW: 15 },
  { capacityGB: 64, label: '64 GB', estimatedPowerW: 25 },
  { capacityGB: 128, label: '128 GB', estimatedPowerW: 35 },
];

export const POWER_CONSTANTS = {
  SSD_POWER_W: 5,        // M.2 NVMe / SATA SSD estimate under load
  HDD_POWER_W: 10,       // 3.5" HDD spin/load estimate
  AIR_COOLER_POWER_W: 5, // Air cooler fan power
  AIO_PUMP_POWER_W: 15,  // Liquid cooling pump + radiator fans
  CASE_FAN_POWER_W: 3,   // Standard 120mm/140mm case fan
  MISC_SYSTEM_POWER_W: 40, // Motherboard chipset, USB devices, RGB, network card
  OVERCLOCK_MULTIPLIER: 0.15, // 15% increase on CPU and GPU when overclocked
  DEFAULT_HEADROOM_FACTOR: 0.25, // 25% safety reserve
};

export const STANDARD_PSU_SIZES: number[] = [
  450,
  500,
  550,
  600,
  650,
  700,
  750,
  850,
  1000,
  1200,
  1300,
  1500,
];
