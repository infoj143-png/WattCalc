import { CPUS as CPUS_DATA } from './cpus';
import { GPUS as GPUS_DATA } from './gpus';
import { CpuComponent, GpuComponent } from '../types/components';
import { MotherboardOption, RamOption, UsbOption } from '../types/calculator';

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

export const MOTHERBOARD_OPTIONS: MotherboardOption[] = [
  { type: 'standard', label: 'Standard (ca. 25 W)', estimatedPowerW: 25 },
  { type: 'high_end', label: 'High-End (ca. 50 W)', estimatedPowerW: 50 },
];

export const USB_OPTIONS: UsbOption[] = [
  { level: 'low', label: 'Keine / Wenig (ca. 5 W)', estimatedPowerW: 5 },
  { level: 'normal', label: 'Normal (ca. 10 W)', estimatedPowerW: 10 },
  { level: 'high', label: 'Viele (ca. 20 W)', estimatedPowerW: 20 },
];

export const POWER_CONSTANTS = {
  SSD_POWER_W: 5,            // M.2 NVMe / SATA SSD estimate under load
  HDD_POWER_W: 10,           // 3.5" HDD spin/load estimate
  AIR_COOLER_POWER_W: 5,     // Air cooler fan power
  AIO_PUMP_POWER_W: 15,      // Liquid cooling pump + radiator fans
  CASE_FAN_POWER_W: 3,       // Standard 120mm/140mm case fan
  PCIE_CARD_POWER_W: 10,     // Estimated power draw per additional PCIe expansion card (sound, capture, network)
  SYSTEM_OVERHEAD_POWER_W: 15, // Baseline residual system overhead (VRM losses, fan controller logic, RGB, misc board electronics not in base motherboard)
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
