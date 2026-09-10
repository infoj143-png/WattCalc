import assert from 'node:assert';
import test, { describe } from 'node:test';
import { calculatePowerConsumption, findCpu, findGpu, roundToStandardPsuSize } from './calculator';
import { CPUS, GPUS } from '../data/components';
import { filterItems, groupItemsByManufacturer } from '../components/SearchableSelect';
import { CalculatorInputs } from '../types/calculator';

describe('Power Calculator Database & Engine', () => {
  describe('Dataset Integrity', () => {
    test('all CPU IDs are unique', () => {
      const cpuIds = CPUS.map((c) => c.id);
      const uniqueIds = new Set(cpuIds);
      assert.strictEqual(cpuIds.length, uniqueIds.size, 'CPU dataset contains duplicate IDs');
    });

    test('all GPU IDs are unique', () => {
      const gpuIds = GPUS.map((g) => g.id);
      const uniqueIds = new Set(gpuIds);
      assert.strictEqual(gpuIds.length, uniqueIds.size, 'GPU dataset contains duplicate IDs');
    });

    test('all CPUs have required fields and positive powerWatts', () => {
      for (const cpu of CPUS) {
        assert.ok(cpu.id, 'CPU missing id');
        assert.ok(cpu.manufacturer === 'AMD' || cpu.manufacturer === 'Intel', `Invalid manufacturer: ${cpu.manufacturer}`);
        assert.ok(cpu.model, 'CPU missing model');
        assert.ok(typeof cpu.powerWatts === 'number' && cpu.powerWatts > 0, `Invalid powerWatts for ${cpu.id}`);
      }
    });

    test('all GPUs have required fields and positive powerWatts', () => {
      for (const gpu of GPUS) {
        assert.ok(gpu.id, 'GPU missing id');
        assert.ok(
          gpu.manufacturer === 'NVIDIA' || gpu.manufacturer === 'AMD' || gpu.manufacturer === 'Intel',
          `Invalid manufacturer: ${gpu.manufacturer}`
        );
        assert.ok(gpu.model, 'GPU missing model');
        assert.ok(typeof gpu.powerWatts === 'number' && gpu.powerWatts > 0, `Invalid powerWatts for ${gpu.id}`);
      }
    });
  });

  describe('Search & Component Filtering', () => {
    test('filters CPUs by model, brand, or query case-insensitively', () => {
      // AMD query
      const amdCpus = filterItems(CPUS, 'AMD');
      assert.ok(amdCpus.length > 0);
      assert.ok(amdCpus.every((c) => c.manufacturer === 'AMD'));

      // Ryzen 7 query
      const ryzen7Cpus = filterItems(CPUS, 'Ryzen 7');
      assert.ok(ryzen7Cpus.length > 0);
      assert.ok(ryzen7Cpus.some((c) => c.model.includes('Ryzen 7')));

      // 9800X3D case-insensitive query
      const match9800 = filterItems(CPUS, '9800x3d');
      assert.strictEqual(match9800.length, 1);
      assert.strictEqual(match9800[0].id, 'amd-ryzen-7-9800x3d');

      // Core i7 query
      const i7Cpus = filterItems(CPUS, 'Core i7');
      assert.ok(i7Cpus.length > 0);
      assert.ok(i7Cpus.some((c) => c.model.includes('Core i7')));

      // 14900K query
      const match14900 = filterItems(CPUS, '14900K');
      assert.strictEqual(match14900.length, 1);
      assert.strictEqual(match14900[0].id, 'intel-core-i9-14900k');
    });

    test('filters GPUs by model, series, or brand case-insensitively', () => {
      // RTX 5070 query
      const match5070 = filterItems(GPUS, 'RTX 5070');
      assert.strictEqual(match5070.length, 1);
      assert.strictEqual(match5070[0].id, 'nvidia-geforce-rtx-5070');

      // RTX 5080 query
      const match5080 = filterItems(GPUS, 'rtx 5080');
      assert.strictEqual(match5080.length, 1);
      assert.strictEqual(match5080[0].id, 'nvidia-geforce-rtx-5080');

      // RX 9070 query
      const match9070 = filterItems(GPUS, 'RX 9070');
      assert.ok(match9070.length >= 1);
      assert.ok(match9070.some((g) => g.id === 'amd-radeon-rx-9070'));

      // RX 7900 query
      const match7900 = filterItems(GPUS, 'RX 7900');
      assert.ok(match7900.length >= 3); // GRE, XT, XTX

      // NVIDIA query
      const nvidiaGpus = filterItems(GPUS, 'NVIDIA');
      assert.ok(nvidiaGpus.length > 0);
      assert.ok(nvidiaGpus.every((g) => g.manufacturer === 'NVIDIA'));
    });

    test('returns empty list for non-matching queries', () => {
      const cpuNoMatch = filterItems(CPUS, 'NonExistentCpuModel999');
      assert.strictEqual(cpuNoMatch.length, 0);

      const gpuNoMatch = filterItems(GPUS, 'NonExistentGpuModel999');
      assert.strictEqual(gpuNoMatch.length, 0);
    });

    test('groups items correctly by manufacturer', () => {
      const groupedCpus = groupItemsByManufacturer(CPUS);
      assert.ok('AMD' in groupedCpus);
      assert.ok('Intel' in groupedCpus);
      assert.strictEqual(groupedCpus.AMD.length + groupedCpus.Intel.length, CPUS.length);

      const groupedGpus = groupItemsByManufacturer(GPUS);
      assert.ok('NVIDIA' in groupedGpus);
      assert.ok('AMD' in groupedGpus);
    });
  });

  describe('Component Lookup Helper (findCpu / findGpu)', () => {
    test('finds CPU by exact ID or shorthand ID', () => {
      assert.strictEqual(findCpu('amd-ryzen-7-9800x3d').powerWatts, 120);
      assert.strictEqual(findCpu('intel-core-i9-14900k').powerWatts, 253);
      assert.strictEqual(findCpu('amd-7800x3d').powerWatts, 120);
      assert.strictEqual(findCpu('intel-14900k').powerWatts, 253);
    });

    test('finds GPU by exact ID or shorthand ID', () => {
      assert.strictEqual(findGpu('nvidia-geforce-rtx-5070').powerWatts, 250);
      assert.strictEqual(findGpu('nvidia-geforce-rtx-4090').powerWatts, 450);
      assert.strictEqual(findGpu('rtx-4070-super').powerWatts, 220);
      assert.strictEqual(findGpu('rx-7900-xtx').powerWatts, 355);
    });
  });

  describe('Power Calculation Engine', () => {
    test('calculates correct base estimated power and standard PSU recommendation', () => {
      // Ryzen 7 7800X3D (120W) + RTX 4070 Super (220W) + 16GB RAM (10W) + 1 SSD (5W) + 0 HDD + Air Cooler (5W) + 3 Fans (9W) + Misc (40W) = 409W
      const inputs: CalculatorInputs = {
        cpuId: 'amd-ryzen-7-7800x3d',
        gpuId: 'nvidia-geforce-rtx-4070-super',
        ramGB: 16,
        ssdCount: 1,
        hddCount: 0,
        coolingType: 'air',
        fanCount: 3,
        isOverclocked: false,
      };

      const result = calculatePowerConsumption(inputs);

      assert.strictEqual(result.estimatedPowerW, 409);
      // 409 * 1.25 = 511.25 W -> recommendedPowerW = 511 W
      assert.strictEqual(result.recommendedPowerW, 511);
      // Rounded UP to standard PSU size -> 550 W
      assert.strictEqual(result.standardPsuWattage, 550);
      assert.strictEqual(result.headroomPercent, 25);
    });

    test('applies 15% overclocking boost to CPU and GPU', () => {
      // Intel i9-14900K (253W) + RTX 4090 (450W)
      // Overclock bonus: round((253 + 450) * 0.15) = round(703 * 0.15) = round(105.45) = 105W
      const inputs: CalculatorInputs = {
        cpuId: 'intel-core-i9-14900k',
        gpuId: 'nvidia-geforce-rtx-4090',
        ramGB: 32, // 15W
        ssdCount: 2, // 10W
        hddCount: 1, // 10W
        coolingType: 'aio', // 15W
        fanCount: 6, // 18W
        isOverclocked: true,
      };

      const result = calculatePowerConsumption(inputs);

      // Base: 253 + 450 + 15 + 10 + 10 + 15 + 18 + 40 = 811W
      // OC bonus: 105W
      // Total estimated: 916W
      assert.strictEqual(result.estimatedPowerW, 916);
      assert.strictEqual(result.breakdown.overclockBonus, 105);
      // 916 * 1.25 = 1145W -> standard PSU -> 1200W
      assert.strictEqual(result.standardPsuWattage, 1200);
    });

    test('calculates power for Next-Gen High-End System (Ryzen 9 9950X + RTX 5090)', () => {
      // Ryzen 9 9950X (230W) + RTX 5090 (600W) + 64GB RAM (25W) + 2 SSDs (10W) + 0 HDDs + AIO (15W) + 6 Fans (18W) + Misc (40W)
      // Base = 230 + 600 + 25 + 10 + 0 + 15 + 18 + 40 = 938W
      const inputs: CalculatorInputs = {
        cpuId: 'amd-ryzen-9-9950x',
        gpuId: 'nvidia-geforce-rtx-5090',
        ramGB: 64,
        ssdCount: 2,
        hddCount: 0,
        coolingType: 'aio',
        fanCount: 6,
        isOverclocked: false,
      };

      const res = calculatePowerConsumption(inputs);
      assert.strictEqual(res.estimatedPowerW, 938);
      // 938 * 1.25 = 1172.5 -> 1173 W -> standard PSU 1200 W
      assert.strictEqual(res.recommendedPowerW, 1173);
      assert.strictEqual(res.standardPsuWattage, 1200);
    });

    test('rounds standard PSU size properly across all required boundary values', () => {
      const boundaryExpectedMap: Record<number, number> = {
        449: 450,
        450: 450,
        451: 500,
        499: 500,
        500: 500,
        501: 550,
        549: 550,
        550: 550,
        551: 600,
        599: 600,
        600: 600,
        601: 650,
        649: 650,
        650: 650,
        651: 700,
        749: 750,
        750: 750,
        751: 850,
        849: 850,
        850: 850,
        851: 1000,
      };

      for (const [input, expected] of Object.entries(boundaryExpectedMap)) {
        const inputWattage = Number(input);
        assert.strictEqual(
          roundToStandardPsuSize(inputWattage),
          expected,
          `Expected roundToStandardPsuSize(${inputWattage}) to equal ${expected}`
        );
      }
    });

    describe('System Configurations (A through E)', () => {
      test('A. Low-end PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-5-5600x',
          gpuId: 'nvidia-geforce-rtx-4060',
          ramGB: 16,
          ssdCount: 1,
          hddCount: 0,
          coolingType: 'air',
          fanCount: 3,
          isOverclocked: false,
        };
        const res = calculatePowerConsumption(inputs);

        // 65 (CPU) + 115 (GPU) + 10 (RAM) + 5 (SSD) + 0 + 5 (Air) + 9 (Fans) + 40 (Misc) = 249 W
        assert.strictEqual(res.estimatedPowerW, 249);
        // 249 * 1.25 = 311.25 -> 311 W
        assert.strictEqual(res.recommendedPowerW, 311);
        assert.strictEqual(res.standardPsuWattage, 450);

        // Breakdown sum check
        const bSum =
          res.breakdown.cpu +
          res.breakdown.gpu +
          res.breakdown.ram +
          res.breakdown.ssd +
          res.breakdown.hdd +
          res.breakdown.cooling +
          res.breakdown.fans +
          res.breakdown.misc +
          res.breakdown.overclockBonus;
        assert.strictEqual(bSum, res.estimatedPowerW);
      });

      test('B. Gaming PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-7-7800x3d',
          gpuId: 'nvidia-geforce-rtx-4070-super',
          ramGB: 32,
          ssdCount: 1,
          hddCount: 0,
          coolingType: 'air',
          fanCount: 4,
          isOverclocked: false,
        };
        const res = calculatePowerConsumption(inputs);

        // 120 (CPU) + 220 (GPU) + 15 (RAM) + 5 (SSD) + 0 + 5 (Air) + 12 (Fans) + 40 (Misc) = 417 W
        assert.strictEqual(res.estimatedPowerW, 417);
        // 417 * 1.25 = 521.25 -> 521 W
        assert.strictEqual(res.recommendedPowerW, 521);
        assert.strictEqual(res.standardPsuWattage, 550);

        const bSum =
          res.breakdown.cpu +
          res.breakdown.gpu +
          res.breakdown.ram +
          res.breakdown.ssd +
          res.breakdown.hdd +
          res.breakdown.cooling +
          res.breakdown.fans +
          res.breakdown.misc +
          res.breakdown.overclockBonus;
        assert.strictEqual(bSum, res.estimatedPowerW);
      });

      test('C. High-end PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'intel-core-i9-14900k',
          gpuId: 'nvidia-geforce-rtx-4090',
          ramGB: 64,
          ssdCount: 2,
          hddCount: 1,
          coolingType: 'aio',
          fanCount: 6,
          isOverclocked: false,
        };
        const res = calculatePowerConsumption(inputs);

        // 253 + 450 + 25 + 10 + 10 + 15 + 18 + 40 = 821 W
        assert.strictEqual(res.estimatedPowerW, 821);
        // 821 * 1.25 = 1026.25 -> 1026 W
        assert.strictEqual(res.recommendedPowerW, 1026);
        assert.strictEqual(res.standardPsuWattage, 1200);

        const bSum =
          res.breakdown.cpu +
          res.breakdown.gpu +
          res.breakdown.ram +
          res.breakdown.ssd +
          res.breakdown.hdd +
          res.breakdown.cooling +
          res.breakdown.fans +
          res.breakdown.misc +
          res.breakdown.overclockBonus;
        assert.strictEqual(bSum, res.estimatedPowerW);
      });

      test('D. Overclocked PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'intel-core-i9-14900k',
          gpuId: 'nvidia-geforce-rtx-4090',
          ramGB: 64,
          ssdCount: 2,
          hddCount: 1,
          coolingType: 'aio',
          fanCount: 6,
          isOverclocked: true,
        };
        const res = calculatePowerConsumption(inputs);

        // Base 821 W + OC (105 W) = 926 W
        assert.strictEqual(res.estimatedPowerW, 926);
        assert.strictEqual(res.breakdown.overclockBonus, 105);
        // 926 * 1.25 = 1158 W
        assert.strictEqual(res.recommendedPowerW, 1158);
        assert.strictEqual(res.standardPsuWattage, 1200);

        const bSum =
          res.breakdown.cpu +
          res.breakdown.gpu +
          res.breakdown.ram +
          res.breakdown.ssd +
          res.breakdown.hdd +
          res.breakdown.cooling +
          res.breakdown.fans +
          res.breakdown.misc +
          res.breakdown.overclockBonus;
        assert.strictEqual(bSum, res.estimatedPowerW);
      });

      test('E. Minimal PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-5-5600x',
          gpuId: 'nvidia-geforce-rtx-4060',
          ramGB: 8,
          ssdCount: 0,
          hddCount: 0,
          coolingType: 'air',
          fanCount: 0,
          isOverclocked: false,
        };
        const res = calculatePowerConsumption(inputs);

        // 65 + 115 + 5 + 0 + 0 + 5 + 0 + 40 = 230 W
        assert.strictEqual(res.estimatedPowerW, 230);
        // 230 * 1.25 = 287.5 -> 288 W
        assert.strictEqual(res.recommendedPowerW, 288);
        assert.strictEqual(res.standardPsuWattage, 450);

        const bSum =
          res.breakdown.cpu +
          res.breakdown.gpu +
          res.breakdown.ram +
          res.breakdown.ssd +
          res.breakdown.hdd +
          res.breakdown.cooling +
          res.breakdown.fans +
          res.breakdown.misc +
          res.breakdown.overclockBonus;
        assert.strictEqual(bSum, res.estimatedPowerW);
      });
    });
  });
});
