import { CpuComponent, GpuComponent, RamOption } from '../types/calculator';

export const CPUS: CpuComponent[] = [
  // AMD
  { id: 'amd-7800x3d', name: 'AMD Ryzen 7 7800X3D', estimatedPowerW: 120, brand: 'AMD' },
  { id: 'amd-7950x3d', name: 'AMD Ryzen 9 7950X3D', estimatedPowerW: 162, brand: 'AMD' },
  { id: 'amd-7600x', name: 'AMD Ryzen 5 7600X', estimatedPowerW: 105, brand: 'AMD' },
  { id: 'amd-5700x3d', name: 'AMD Ryzen 7 5700X3D', estimatedPowerW: 105, brand: 'AMD' },
  { id: 'amd-5600x', name: 'AMD Ryzen 5 5600X', estimatedPowerW: 65, brand: 'AMD' },
  { id: 'amd-9800x3d', name: 'AMD Ryzen 7 9800X3D', estimatedPowerW: 120, brand: 'AMD' },
  { id: 'amd-9950x', name: 'AMD Ryzen 9 9950X', estimatedPowerW: 230, brand: 'AMD' },

  // Intel
  { id: 'intel-14900k', name: 'Intel Core i9-14900K', estimatedPowerW: 253, brand: 'Intel' },
  { id: 'intel-14700k', name: 'Intel Core i7-14700K', estimatedPowerW: 253, brand: 'Intel' },
  { id: 'intel-14600k', name: 'Intel Core i5-14600K', estimatedPowerW: 181, brand: 'Intel' },
  { id: 'intel-13900k', name: 'Intel Core i9-13900K', estimatedPowerW: 253, brand: 'Intel' },
  { id: 'intel-13600k', name: 'Intel Core i5-13600K', estimatedPowerW: 181, brand: 'Intel' },
  { id: 'intel-12400f', name: 'Intel Core i5-12400F', estimatedPowerW: 117, brand: 'Intel' },
  { id: 'intel-285k', name: 'Intel Core Ultra 9 285K', estimatedPowerW: 250, brand: 'Intel' },
  { id: 'intel-265k', name: 'Intel Core Ultra 7 265K', estimatedPowerW: 250, brand: 'Intel' },
];

export const GPUS: GpuComponent[] = [
  // NVIDIA
  { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', estimatedPowerW: 450, brand: 'NVIDIA' },
  { id: 'rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super', estimatedPowerW: 320, brand: 'NVIDIA' },
  { id: 'rtx-4070-ti-super', name: 'NVIDIA GeForce RTX 4070 Ti Super', estimatedPowerW: 285, brand: 'NVIDIA' },
  { id: 'rtx-4070-super', name: 'NVIDIA GeForce RTX 4070 Super', estimatedPowerW: 220, brand: 'NVIDIA' },
  { id: 'rtx-4060-ti', name: 'NVIDIA GeForce RTX 4060 Ti', estimatedPowerW: 160, brand: 'NVIDIA' },
  { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060', estimatedPowerW: 115, brand: 'NVIDIA' },
  { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060', estimatedPowerW: 170, brand: 'NVIDIA' },
  { id: 'rtx-5090', name: 'NVIDIA GeForce RTX 5090', estimatedPowerW: 600, brand: 'NVIDIA' },
  { id: 'rtx-5080', name: 'NVIDIA GeForce RTX 5080', estimatedPowerW: 400, brand: 'NVIDIA' },

  // AMD
  { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', estimatedPowerW: 355, brand: 'AMD' },
  { id: 'rx-7900-xt', name: 'AMD Radeon RX 7900 XT', estimatedPowerW: 315, brand: 'AMD' },
  { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT', estimatedPowerW: 263, brand: 'AMD' },
  { id: 'rx-7700-xt', name: 'AMD Radeon RX 7700 XT', estimatedPowerW: 245, brand: 'AMD' },
  { id: 'rx-6600', name: 'AMD Radeon RX 6600', estimatedPowerW: 132, brand: 'AMD' },
];

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
