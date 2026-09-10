import { GpuComponent } from '../types/components';

/**
 * GPU POWER SPECIFICATION DOCUMENTATION:
 * The powerWatts values represent estimated Total Graphics Power (TGP) or Total Desktop Power (TDP)
 * in Watts specified by chip manufacturers (NVIDIA, AMD) for peak board load scenarios.
 *
 * NOTE: These figures are provided solely as estimates for PSU capacity estimation
 * and do not constitute exact laboratory power measurements.
 */
export const GPUS: GpuComponent[] = [
  // NVIDIA GeForce RTX 30 / 40 / 50 Series
  { id: 'nvidia-geforce-rtx-3060', manufacturer: 'NVIDIA', model: 'GeForce RTX 3060', powerWatts: 170 },
  { id: 'nvidia-geforce-rtx-4060', manufacturer: 'NVIDIA', model: 'GeForce RTX 4060', powerWatts: 115 },
  { id: 'nvidia-geforce-rtx-4060-ti', manufacturer: 'NVIDIA', model: 'GeForce RTX 4060 Ti', powerWatts: 160 },
  { id: 'nvidia-geforce-rtx-4070', manufacturer: 'NVIDIA', model: 'GeForce RTX 4070', powerWatts: 200 },
  { id: 'nvidia-geforce-rtx-4070-super', manufacturer: 'NVIDIA', model: 'GeForce RTX 4070 Super', powerWatts: 220 },
  { id: 'nvidia-geforce-rtx-4070-ti-super', manufacturer: 'NVIDIA', model: 'GeForce RTX 4070 Ti Super', powerWatts: 285 },
  { id: 'nvidia-geforce-rtx-4080-super', manufacturer: 'NVIDIA', model: 'GeForce RTX 4080 Super', powerWatts: 320 },
  { id: 'nvidia-geforce-rtx-4090', manufacturer: 'NVIDIA', model: 'GeForce RTX 4090', powerWatts: 450 },
  { id: 'nvidia-geforce-rtx-5070', manufacturer: 'NVIDIA', model: 'GeForce RTX 5070', powerWatts: 250 },
  { id: 'nvidia-geforce-rtx-5080', manufacturer: 'NVIDIA', model: 'GeForce RTX 5080', powerWatts: 400 },
  { id: 'nvidia-geforce-rtx-5090', manufacturer: 'NVIDIA', model: 'GeForce RTX 5090', powerWatts: 600 },

  // AMD Radeon RX 6000 / 7000 / 9000 Series
  { id: 'amd-radeon-rx-6600', manufacturer: 'AMD', model: 'Radeon RX 6600', powerWatts: 132 },
  { id: 'amd-radeon-rx-7600', manufacturer: 'AMD', model: 'Radeon RX 7600', powerWatts: 165 },
  { id: 'amd-radeon-rx-7700-xt', manufacturer: 'AMD', model: 'Radeon RX 7700 XT', powerWatts: 245 },
  { id: 'amd-radeon-rx-7800-xt', manufacturer: 'AMD', model: 'Radeon RX 7800 XT', powerWatts: 263 },
  { id: 'amd-radeon-rx-7900-gre', manufacturer: 'AMD', model: 'Radeon RX 7900 GRE', powerWatts: 268 },
  { id: 'amd-radeon-rx-7900-xt', manufacturer: 'AMD', model: 'Radeon RX 7900 XT', powerWatts: 315 },
  { id: 'amd-radeon-rx-7900-xtx', manufacturer: 'AMD', model: 'Radeon RX 7900 XTX', powerWatts: 355 },
  { id: 'amd-radeon-rx-9070', manufacturer: 'AMD', model: 'Radeon RX 9070', powerWatts: 220 },
  { id: 'amd-radeon-rx-9070-xt', manufacturer: 'AMD', model: 'Radeon RX 9070 XT', powerWatts: 300 },
];
