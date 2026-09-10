import { CPUS, GPUS, POWER_CONSTANTS, RAM_OPTIONS, STANDARD_PSU_SIZES } from '../data/components';
import { CalculationResult, CalculatorInputs } from '../types/calculator';
import { CpuComponent, GpuComponent } from '../types/components';

/**
 * CALCULATION METHODOLOGY & DISCLAIMER:
 *
 * 1. Component Power Estimation:
 *    - CPU & GPU: Based on selectedCpu.powerWatts and selectedGpu.powerWatts specs from component database.
 *    - RAM: Estimated per total capacity (e.g., 8GB ~5W up to 128GB ~35W).
 *    - Storage: SSD ~5W peak per drive, HDD ~10W peak per drive.
 *    - Cooling: Air cooler ~5W (fan), AIO liquid cooler ~15W (pump + fans).
 *    - Case Fans: ~3W per fan.
 *    - Miscellaneous System Power: ~40W base allowance for motherboard chipset, RAM controller, USB devices, RGB, fan controllers, etc.
 *
 * 2. Overclocking:
 *    - When overclocking is active, a 15% increase is added to CPU + GPU base power draw to account for higher voltage/clock limits.
 *
 * 3. Recommendation & Headroom:
 *    - Headroom Factor (default 25% / 1.25 multiplier) guarantees PSUs run in their optimal efficiency curve (usually 50-80% load),
 *      prevents power spikes (transients) from triggering PSU protections (OPP/OCP), and leaves room for future upgrades.
 *    - Recommended Power = estimatedPower * 1.25
 *    - Standard PSU Size: Recommended power is rounded UP to the nearest standard PSU rating
 *      (e.g., 450W, 500W, 550W, 600W, 650W, 700W, 750W, 850W, 1000W, 1200W, 1300W, 1500W).
 *      If recommended power exceeds 1500W, it returns the minimum required wattage or the highest PSU step.
 *
 * NOTE: The result is an estimate based on peak load scenarios and standard component ratings.
 */

export function findCpu(cpuId: string): CpuComponent {
  const target = cpuId.toLowerCase().trim();
  const exact = CPUS.find((cpu) => cpu.id.toLowerCase() === target);
  if (exact) return exact;

  const cleaned = target.replace(/^(amd|intel)-/, '');
  const match = CPUS.find(
    (cpu) => cpu.id.includes(cleaned) || cpu.model.toLowerCase().replace(/\s+/g, '-').includes(cleaned)
  );
  return match || CPUS[0];
}

export function findGpu(gpuId: string): GpuComponent {
  const target = gpuId.toLowerCase().trim();
  const exact = GPUS.find((gpu) => gpu.id.toLowerCase() === target);
  if (exact) return exact;

  const cleaned = target.replace(/^(nvidia|amd)-/, '');
  const match = GPUS.find(
    (gpu) => gpu.id.includes(cleaned) || gpu.model.toLowerCase().replace(/\s+/g, '-').includes(cleaned)
  );
  return match || GPUS[0];
}

export function calculatePowerConsumption(inputs: CalculatorInputs): CalculationResult {
  // 1. CPU Power from component dataset
  const selectedCpu = findCpu(inputs.cpuId);
  const cpuPower = selectedCpu.powerWatts;

  // 2. GPU Power from component dataset
  const selectedGpu = findGpu(inputs.gpuId);
  const gpuPower = selectedGpu.powerWatts;

  // 3. RAM Power
  const selectedRam = RAM_OPTIONS.find((ram) => ram.capacityGB === inputs.ramGB) || RAM_OPTIONS[1]; // default 16GB
  const ramPower = selectedRam.estimatedPowerW;

  // 4. Storage Power
  const ssdPower = Math.max(0, inputs.ssdCount) * POWER_CONSTANTS.SSD_POWER_W;
  const hddPower = Math.max(0, inputs.hddCount) * POWER_CONSTANTS.HDD_POWER_W;

  // 5. Cooling Power
  const coolingPower = inputs.coolingType === 'aio' ? POWER_CONSTANTS.AIO_PUMP_POWER_W : POWER_CONSTANTS.AIR_COOLER_POWER_W;
  const fansPower = Math.max(0, inputs.fanCount) * POWER_CONSTANTS.CASE_FAN_POWER_W;

  // 6. Misc System Power
  const miscPower = POWER_CONSTANTS.MISC_SYSTEM_POWER_W;

  // 7. Overclocking
  let overclockBonus = 0;
  if (inputs.isOverclocked) {
    overclockBonus = Math.round((cpuPower + gpuPower) * POWER_CONSTANTS.OVERCLOCK_MULTIPLIER);
  }

  // Total Estimated Power
  const estimatedPowerW = cpuPower + gpuPower + ramPower + ssdPower + hddPower + coolingPower + fansPower + miscPower + overclockBonus;

  // Headroom & Recommendation
  const headroomFactor = inputs.headroomFactor ?? POWER_CONSTANTS.DEFAULT_HEADROOM_FACTOR;
  const recommendedPowerUnrounded = estimatedPowerW * (1 + headroomFactor);

  // Round UP to standard PSU wattage
  const standardPsuWattage = roundToStandardPsuSize(recommendedPowerUnrounded);

  return {
    estimatedPowerW,
    recommendedPowerW: Math.round(recommendedPowerUnrounded),
    standardPsuWattage,
    headroomPercent: Math.round(headroomFactor * 100),
    breakdown: {
      cpu: cpuPower,
      gpu: gpuPower,
      ram: ramPower,
      ssd: ssdPower,
      hdd: hddPower,
      cooling: coolingPower,
      fans: fansPower,
      misc: miscPower,
      overclockBonus,
    },
  };
}

export function roundToStandardPsuSize(recommendedWattage: number): number {
  for (const psuSize of STANDARD_PSU_SIZES) {
    if (psuSize >= recommendedWattage) {
      return psuSize;
    }
  }
  // If required wattage exceeds highest standard PSU (1500W), round up to nearest 100W increment
  return Math.ceil(recommendedWattage / 100) * 100;
}
