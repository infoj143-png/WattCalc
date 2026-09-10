import { CpuComponent } from '../types/components';

/**
 * CPU POWER SPECIFICATION DOCUMENTATION:
 * The powerWatts values represent estimated peak/load power consumption in Watts based on:
 * - AMD: Processor Base Power (TDP) or PPT (Package Power Tracking) limits under full load.
 * - Intel: Maximum Turbo Power (MTP / PL2) or Base TDP for peak PSU sizing estimation.
 *
 * NOTE: These figures are provided solely as estimates for PSU capacity estimation
 * and do not constitute exact laboratory power measurements.
 */
export const CPUS: CpuComponent[] = [
  // AMD Ryzen 5000 / 7000 / 9000 Series
  { id: 'amd-ryzen-5-5600x', manufacturer: 'AMD', model: 'Ryzen 5 5600X', powerWatts: 65 },
  { id: 'amd-ryzen-5-7600', manufacturer: 'AMD', model: 'Ryzen 5 7600', powerWatts: 65 },
  { id: 'amd-ryzen-5-7600x', manufacturer: 'AMD', model: 'Ryzen 5 7600X', powerWatts: 105 },
  { id: 'amd-ryzen-5-9600x', manufacturer: 'AMD', model: 'Ryzen 5 9600X', powerWatts: 65 },
  { id: 'amd-ryzen-7-5700x3d', manufacturer: 'AMD', model: 'Ryzen 7 5700X3D', powerWatts: 105 },
  { id: 'amd-ryzen-7-5800x3d', manufacturer: 'AMD', model: 'Ryzen 7 5800X3D', powerWatts: 105 },
  { id: 'amd-ryzen-7-7700x', manufacturer: 'AMD', model: 'Ryzen 7 7700X', powerWatts: 105 },
  { id: 'amd-ryzen-7-7800x3d', manufacturer: 'AMD', model: 'Ryzen 7 7800X3D', powerWatts: 120 },
  { id: 'amd-ryzen-7-9700x', manufacturer: 'AMD', model: 'Ryzen 7 9700X', powerWatts: 65 },
  { id: 'amd-ryzen-7-9800x3d', manufacturer: 'AMD', model: 'Ryzen 7 9800X3D', powerWatts: 120 },
  { id: 'amd-ryzen-9-7900x', manufacturer: 'AMD', model: 'Ryzen 9 7900X', powerWatts: 170 },
  { id: 'amd-ryzen-9-7950x', manufacturer: 'AMD', model: 'Ryzen 9 7950X', powerWatts: 170 },
  { id: 'amd-ryzen-9-7950x3d', manufacturer: 'AMD', model: 'Ryzen 9 7950X3D', powerWatts: 162 },
  { id: 'amd-ryzen-9-9900x', manufacturer: 'AMD', model: 'Ryzen 9 9900X', powerWatts: 120 },
  { id: 'amd-ryzen-9-9950x', manufacturer: 'AMD', model: 'Ryzen 9 9950X', powerWatts: 230 },

  // Intel Core 12th / 13th / 14th Gen & Core Ultra Series
  { id: 'intel-core-i5-12400f', manufacturer: 'Intel', model: 'Core i5-12400F', powerWatts: 117 },
  { id: 'intel-core-i5-13400f', manufacturer: 'Intel', model: 'Core i5-13400F', powerWatts: 148 },
  { id: 'intel-core-i5-13600k', manufacturer: 'Intel', model: 'Core i5-13600K', powerWatts: 181 },
  { id: 'intel-core-i5-14600k', manufacturer: 'Intel', model: 'Core i5-14600K', powerWatts: 181 },
  { id: 'intel-core-i7-13700k', manufacturer: 'Intel', model: 'Core i7-13700K', powerWatts: 253 },
  { id: 'intel-core-i7-14700k', manufacturer: 'Intel', model: 'Core i7-14700K', powerWatts: 253 },
  { id: 'intel-core-i9-13900k', manufacturer: 'Intel', model: 'Core i9-13900K', powerWatts: 253 },
  { id: 'intel-core-i9-14900k', manufacturer: 'Intel', model: 'Core i9-14900K', powerWatts: 253 },
  { id: 'intel-core-ultra-5-245k', manufacturer: 'Intel', model: 'Core Ultra 5 245K', powerWatts: 159 },
  { id: 'intel-core-ultra-7-265k', manufacturer: 'Intel', model: 'Core Ultra 7 265K', powerWatts: 250 },
  { id: 'intel-core-ultra-9-285k', manufacturer: 'Intel', model: 'Core Ultra 9 285K', powerWatts: 250 },
];
