import assert from 'node:assert';
import test, { describe } from 'node:test';
import { calculatePowerConsumption, findCpu, findGpu, roundToStandardPsuSize } from './calculator';
import { CPUS, GPUS, POWER_CONSTANTS } from '../data/components';
import { filterItems, groupItemsByManufacturer } from '../components/SearchableSelect';
import { CalculatorInputs } from '../types/calculator';

describe('Power Calculator Database & Engine (STEP 5 QA & Validation)', () => {
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

    test('all GPUs have required fields and non-negative powerWatts', () => {
      for (const gpu of GPUS) {
        assert.ok(gpu.id, 'GPU missing id');
        assert.ok(
          gpu.manufacturer === 'NVIDIA' ||
            gpu.manufacturer === 'AMD' ||
            gpu.manufacturer === 'Intel' ||
            gpu.manufacturer === 'Integrierte Grafik',
          `Invalid manufacturer: ${gpu.manufacturer}`
        );
        assert.ok(gpu.model, 'GPU missing model');
        assert.ok(typeof gpu.powerWatts === 'number' && gpu.powerWatts >= 0, `Invalid powerWatts for ${gpu.id}`);
      }
    });
  });

  describe('Search & Component Filtering', () => {
    test('filters CPUs by model, brand, or query case-insensitively', () => {
      const amdCpus = filterItems(CPUS, 'AMD');
      assert.ok(amdCpus.length > 0);
      assert.ok(amdCpus.every((c) => c.manufacturer === 'AMD'));

      const ryzen7Cpus = filterItems(CPUS, 'Ryzen 7');
      assert.ok(ryzen7Cpus.length > 0);
      assert.ok(ryzen7Cpus.some((c) => c.model.includes('Ryzen 7')));

      const match9800 = filterItems(CPUS, '9800x3d');
      assert.strictEqual(match9800.length, 1);
      assert.strictEqual(match9800[0].id, 'amd-ryzen-7-9800x3d');

      const i7Cpus = filterItems(CPUS, 'Core i7');
      assert.ok(i7Cpus.length > 0);
      assert.ok(i7Cpus.some((c) => c.model.includes('Core i7')));

      const match14900 = filterItems(CPUS, '14900K');
      assert.strictEqual(match14900.length, 1);
      assert.strictEqual(match14900[0].id, 'intel-core-i9-14900k');
    });

    test('filters GPUs by model, series, or brand case-insensitively', () => {
      const match5070 = filterItems(GPUS, 'RTX 5070');
      assert.strictEqual(match5070.length, 1);
      assert.strictEqual(match5070[0].id, 'nvidia-geforce-rtx-5070');

      const match5080 = filterItems(GPUS, 'rtx 5080');
      assert.strictEqual(match5080.length, 1);
      assert.strictEqual(match5080[0].id, 'nvidia-geforce-rtx-5080');

      const match9070 = filterItems(GPUS, 'RX 9070');
      assert.ok(match9070.length >= 1);
      assert.ok(match9070.some((g) => g.id === 'amd-radeon-rx-9070'));

      const match7900 = filterItems(GPUS, 'RX 7900');
      assert.ok(match7900.length >= 3);

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
      assert.ok('Integrierte Grafik' in groupedGpus);
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
      assert.strictEqual(findGpu('integrated-graphics').powerWatts, 0);
    });
  });

  describe('STEP 5 Requirements & Calculation Pipeline Audit', () => {
    const baseInputs: CalculatorInputs = {
      cpuId: 'amd-ryzen-5-5600x', // 65W
      gpuId: 'nvidia-geforce-rtx-4060', // 115W
      ramGB: 16, // 10W
      ssdCount: 1, // 5W
      hddCount: 0, // 0W
      motherboardType: 'standard', // 25W
      coolingType: 'air', // 5W
      fanCount: 3, // 9W
      pcieCardCount: 0, // 0W
      usbLevel: 'normal', // 10W
      isOverclocked: false, // 0W
    };

    test('1. Standard motherboard power (25W)', () => {
      const res = calculatePowerConsumption({ ...baseInputs, motherboardType: 'standard' });
      assert.strictEqual(res.breakdown.motherboard, 25);
    });

    test('2. High-end motherboard power (50W)', () => {
      const res = calculatePowerConsumption({ ...baseInputs, motherboardType: 'high_end' });
      assert.strictEqual(res.breakdown.motherboard, 50);
    });

    test('3. Additional PCIe cards power (0, 1, 2, 3 cards)', () => {
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, pcieCardCount: 0 }).breakdown.pcieCards, 0);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, pcieCardCount: 1 }).breakdown.pcieCards, 10);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, pcieCardCount: 2 }).breakdown.pcieCards, 20);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, pcieCardCount: 3 }).breakdown.pcieCards, 30);
    });

    test('4. USB/peripheral levels (low 5W, normal 10W, high 20W)', () => {
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, usbLevel: 'low' }).breakdown.usbPeripherals, 5);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, usbLevel: 'normal' }).breakdown.usbPeripherals, 10);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, usbLevel: 'high' }).breakdown.usbPeripherals, 20);
    });

    test('5. Air cooling (5W)', () => {
      const res = calculatePowerConsumption({ ...baseInputs, coolingType: 'air' });
      assert.strictEqual(res.breakdown.cooling, 5);
    });

    test('6. AIO cooling (15W)', () => {
      const res = calculatePowerConsumption({ ...baseInputs, coolingType: 'aio' });
      assert.strictEqual(res.breakdown.cooling, 15);
    });

    test('7. Multiple case fans (0, 3, 6 fans)', () => {
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, fanCount: 0 }).breakdown.fans, 0);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, fanCount: 3 }).breakdown.fans, 9);
      assert.strictEqual(calculatePowerConsumption({ ...baseInputs, fanCount: 6 }).breakdown.fans, 18);
    });

    test('8. Overclocking disabled', () => {
      const res = calculatePowerConsumption({ ...baseInputs, isOverclocked: false });
      assert.strictEqual(res.breakdown.overclockBonus, 0);
    });

    test('9. Overclocking enabled (15% boost on CPU + GPU)', () => {
      // 65W CPU + 115W GPU = 180W -> 180 * 0.15 = 27W
      const res = calculatePowerConsumption({ ...baseInputs, isOverclocked: true });
      assert.strictEqual(res.breakdown.overclockBonus, 27);
    });

    test('10. Calculation breakdown total equals estimated consumption', () => {
      const res = calculatePowerConsumption(baseInputs);
      const breakdownSum =
        res.breakdown.cpu +
        res.breakdown.gpu +
        res.breakdown.ram +
        res.breakdown.ssd +
        res.breakdown.hdd +
        res.breakdown.motherboard +
        res.breakdown.cooling +
        res.breakdown.fans +
        res.breakdown.pcieCards +
        res.breakdown.usbPeripherals +
        res.breakdown.systemOverhead +
        res.breakdown.overclockBonus;

      assert.strictEqual(breakdownSum, res.estimatedPowerW);
    });

    test('11. 25% Safety reserve is applied exactly once', () => {
      const res = calculatePowerConsumption(baseInputs);
      const expectedRecommended = Math.round(res.estimatedPowerW * 1.25);
      assert.strictEqual(res.recommendedPowerW, expectedRecommended);
      assert.strictEqual(res.headroomPercent, 25);
    });

    describe('Double-Counting Audit', () => {
      test('AIO pump and radiator fans are not counted twice', () => {
        const airRes = calculatePowerConsumption({ ...baseInputs, coolingType: 'air', fanCount: 0 });
        const aioRes = calculatePowerConsumption({ ...baseInputs, coolingType: 'aio', fanCount: 0 });

        assert.strictEqual(airRes.breakdown.cooling, POWER_CONSTANTS.AIR_COOLER_POWER_W);
        assert.strictEqual(aioRes.breakdown.cooling, POWER_CONSTANTS.AIO_PUMP_POWER_W);
        assert.strictEqual(airRes.breakdown.fans, 0);
        assert.strictEqual(aioRes.breakdown.fans, 0);
      });

      test('Case fans are not counted twice', () => {
        const fan0 = calculatePowerConsumption({ ...baseInputs, fanCount: 0 });
        const fan3 = calculatePowerConsumption({ ...baseInputs, fanCount: 3 });
        assert.strictEqual(fan3.breakdown.fans - fan0.breakdown.fans, 3 * POWER_CONSTANTS.CASE_FAN_POWER_W);
      });

      test('Motherboard power is not duplicated inside system overhead', () => {
        const stdMob = calculatePowerConsumption({ ...baseInputs, motherboardType: 'standard' });
        const highMob = calculatePowerConsumption({ ...baseInputs, motherboardType: 'high_end' });

        assert.strictEqual(stdMob.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(highMob.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(highMob.breakdown.motherboard - stdMob.breakdown.motherboard, 25);
      });

      test('USB/peripheral power is not duplicated inside system overhead', () => {
        const lowUsb = calculatePowerConsumption({ ...baseInputs, usbLevel: 'low' });
        const highUsb = calculatePowerConsumption({ ...baseInputs, usbLevel: 'high' });

        assert.strictEqual(lowUsb.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(highUsb.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(highUsb.breakdown.usbPeripherals - lowUsb.breakdown.usbPeripherals, 15);
      });

      test('PCIe card power is not duplicated inside system overhead', () => {
        const pcie0 = calculatePowerConsumption({ ...baseInputs, pcieCardCount: 0 });
        const pcie2 = calculatePowerConsumption({ ...baseInputs, pcieCardCount: 2 });

        assert.strictEqual(pcie0.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(pcie2.breakdown.systemOverhead, POWER_CONSTANTS.SYSTEM_OVERHEAD_POWER_W);
        assert.strictEqual(pcie2.breakdown.pcieCards - pcie0.breakdown.pcieCards, 20);
      });

      test('Overclocking adjustment is not applied twice', () => {
        const ocOff = calculatePowerConsumption({ ...baseInputs, isOverclocked: false });
        const ocOn = calculatePowerConsumption({ ...baseInputs, isOverclocked: true });

        const cpuPower = ocOff.breakdown.cpu;
        const gpuPower = ocOff.breakdown.gpu;
        const expectedOcBonus = Math.round((cpuPower + gpuPower) * POWER_CONSTANTS.OVERCLOCK_MULTIPLIER);

        assert.strictEqual(ocOff.breakdown.overclockBonus, 0);
        assert.strictEqual(ocOn.breakdown.overclockBonus, expectedOcBonus);
        assert.strictEqual(ocOn.estimatedPowerW, ocOff.estimatedPowerW + expectedOcBonus);
      });

      test('Safety reserve is not applied twice', () => {
        const res = calculatePowerConsumption(baseInputs);
        const expectedRecommended = Math.round(res.estimatedPowerW * 1.25);
        assert.strictEqual(res.recommendedPowerW, expectedRecommended);
      });
    });

    describe('Real-World Test Scenarios (A through F)', () => {
      test('SCENARIO A — Basic Office PC (integrated graphics)', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-5-5600x', // 65W
          gpuId: 'integrated-graphics', // 0W
          ramGB: 8, // 5W
          ssdCount: 1, // 5W
          hddCount: 0, // 0W
          motherboardType: 'standard', // 25W
          coolingType: 'air', // 5W
          fanCount: 1, // 3W
          pcieCardCount: 0, // 0W
          usbLevel: 'low', // 5W
          isOverclocked: false, // 0W
        };
        const res = calculatePowerConsumption(inputs);

        // 65 + 0 + 5 + 5 + 0 + 25 + 5 + 3 + 0 + 5 + 15 (overhead) = 128 W
        assert.strictEqual(res.estimatedPowerW, 128);
        // 128 * 1.25 = 160 W requirement
        assert.strictEqual(res.recommendedPowerW, 160);
        assert.strictEqual(res.standardPsuWattage, 450); // Minimum standard PSU wattage
      });

      test('SCENARIO B — Gaming PC (mid-range dedicated GPU)', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-7-7800x3d', // 120W
          gpuId: 'nvidia-geforce-rtx-4070-super', // 220W
          ramGB: 32, // 15W
          ssdCount: 1, // 5W
          hddCount: 1, // 10W
          motherboardType: 'high_end', // 50W
          coolingType: 'aio', // 15W
          fanCount: 4, // 12W
          pcieCardCount: 1, // 10W
          usbLevel: 'normal', // 10W
          isOverclocked: false, // 0W
        };
        const res = calculatePowerConsumption(inputs);

        // 120 + 220 + 15 + 5 + 10 + 50 + 15 + 12 + 10 + 10 + 15 (overhead) = 482 W
        assert.strictEqual(res.estimatedPowerW, 482);
        // 482 * 1.25 = 602.5 -> 603 W
        assert.strictEqual(res.recommendedPowerW, 603);
        assert.strictEqual(res.standardPsuWattage, 650);
      });

      test('SCENARIO C — High-End Gaming PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'intel-core-i9-14900k', // 253W
          gpuId: 'nvidia-geforce-rtx-4090', // 450W
          ramGB: 32, // 15W
          ssdCount: 2, // 10W
          hddCount: 0, // 0W
          motherboardType: 'high_end', // 50W
          coolingType: 'aio', // 15W
          fanCount: 6, // 18W
          pcieCardCount: 0, // 0W
          usbLevel: 'normal', // 10W
          isOverclocked: false, // 0W
        };
        const res = calculatePowerConsumption(inputs);

        // 253 + 450 + 15 + 10 + 0 + 50 + 15 + 18 + 0 + 10 + 15 (overhead) = 836 W
        assert.strictEqual(res.estimatedPowerW, 836);
        // 836 * 1.25 = 1045 W
        assert.strictEqual(res.recommendedPowerW, 1045);
        assert.strictEqual(res.standardPsuWattage, 1200);
      });

      test('SCENARIO D — Creator / Workstation PC', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-9-9950x', // 230W
          gpuId: 'nvidia-geforce-rtx-5080', // 400W
          ramGB: 128, // 35W
          ssdCount: 4, // 20W
          hddCount: 2, // 20W
          motherboardType: 'high_end', // 50W
          coolingType: 'aio', // 15W
          fanCount: 6, // 18W
          pcieCardCount: 2, // 20W
          usbLevel: 'high', // 20W
          isOverclocked: false, // 0W
        };
        const res = calculatePowerConsumption(inputs);

        // 230 + 400 + 35 + 20 + 20 + 50 + 15 + 18 + 20 + 20 + 15 (overhead) = 843 W
        assert.strictEqual(res.estimatedPowerW, 843);
        // 843 * 1.25 = 1053.75 -> 1054 W
        assert.strictEqual(res.recommendedPowerW, 1054);
        assert.strictEqual(res.standardPsuWattage, 1200);
      });

      test('SCENARIO E — Overclocked Configuration', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'intel-core-i9-14900k', // 253W
          gpuId: 'nvidia-geforce-rtx-5090', // 600W
          ramGB: 64, // 25W
          ssdCount: 2, // 10W
          hddCount: 0, // 0W
          motherboardType: 'high_end', // 50W
          coolingType: 'aio', // 15W
          fanCount: 6, // 18W
          pcieCardCount: 1, // 10W
          usbLevel: 'high', // 20W
          isOverclocked: true, // (253+600)*0.15 = 128W
        };
        const res = calculatePowerConsumption(inputs);

        const baseTotal = 253 + 600 + 25 + 10 + 0 + 50 + 15 + 18 + 10 + 20 + 15; // 1016 W
        assert.strictEqual(res.breakdown.overclockBonus, 128);
        assert.strictEqual(res.estimatedPowerW, baseTotal + 128); // 1144 W
        // 1144 * 1.25 = 1430 W
        assert.strictEqual(res.recommendedPowerW, 1430);
        assert.strictEqual(res.standardPsuWattage, 1500);
      });

      test('SCENARIO F — Maximum / Large Extreme Configuration', () => {
        const inputs: CalculatorInputs = {
          cpuId: 'intel-core-i9-14900k', // 253W
          gpuId: 'nvidia-geforce-rtx-5090', // 600W
          ramGB: 128, // 35W
          ssdCount: 8, // 40W
          hddCount: 6, // 60W
          motherboardType: 'high_end', // 50W
          coolingType: 'aio', // 15W
          fanCount: 12, // 36W
          pcieCardCount: 3, // 30W
          usbLevel: 'high', // 20W
          isOverclocked: true, // 128W
        };
        const res = calculatePowerConsumption(inputs);

        // 253 + 600 + 35 + 40 + 60 + 50 + 15 + 36 + 30 + 20 + 15 + 128 = 1282 W
        assert.strictEqual(res.estimatedPowerW, 1282);
        // 1282 * 1.25 = 1602.5 -> 1603 W
        assert.strictEqual(res.recommendedPowerW, 1603);
        assert.strictEqual(res.standardPsuWattage, 1700); // Beyond 1500W, rounded up to 100W increment
      });
    });

    describe('PSU Rounding Boundary Validation', () => {
      test('comprehensive testing across all standard PSU boundaries', () => {
        // Standard sizes: 450, 500, 550, 600, 650, 700, 750, 850, 1000, 1200, 1300, 1500
        const boundaryTests: Array<[number, number]> = [
          [0, 450],
          [100, 450],
          [449, 450],
          [450, 450],
          [450.01, 500],
          [451, 500],
          [499, 500],
          [500, 500],
          [500.01, 550],
          [501, 550],
          [549, 550],
          [550, 550],
          [550.1, 600],
          [599, 600],
          [600, 600],
          [600.1, 650],
          [649, 650],
          [650, 650],
          [650.1, 700],
          [699, 700],
          [700, 700],
          [700.1, 750],
          [749, 750],
          [750, 750],
          [750.1, 850],
          [849, 850],
          [850, 850],
          [850.1, 1000],
          [999, 1000],
          [1000, 1000],
          [1000.1, 1200],
          [1199, 1200],
          [1200, 1200],
          [1200.1, 1300],
          [1299, 1300],
          [1300, 1300],
          [1300.1, 1500],
          [1499, 1500],
          [1500, 1500],
          [1500.1, 1600],
          [1650, 1700],
        ];

        for (const [inputReq, expectedPsu] of boundaryTests) {
          const result = roundToStandardPsuSize(inputReq);
          assert.strictEqual(
            result,
            expectedPsu,
            `roundToStandardPsuSize(${inputReq}) returned ${result}, expected ${expectedPsu}`
          );
          assert.ok(
            result >= inputReq,
            `PSU recommendation (${result}W) must never be lower than calculated requirement (${inputReq}W)`
          );
        }
      });
    });

    describe('Input Sanitization & Edge Cases', () => {
      test('handles NaN, negative numbers, and non-finite inputs safely', () => {
        const dirtyInputs: CalculatorInputs = {
          cpuId: 'amd-ryzen-5-5600x',
          gpuId: 'nvidia-geforce-rtx-4060',
          ramGB: 16,
          ssdCount: -5 as unknown as number,
          hddCount: NaN,
          fanCount: Infinity,
          pcieCardCount: undefined as unknown as number,
          coolingType: 'air',
          isOverclocked: false,
          headroomFactor: NaN,
        };

        const res = calculatePowerConsumption(dirtyInputs);

        assert.ok(Number.isFinite(res.estimatedPowerW), 'estimatedPowerW must be finite');
        assert.ok(res.estimatedPowerW > 0, 'estimatedPowerW must be positive');
        assert.ok(Number.isFinite(res.recommendedPowerW), 'recommendedPowerW must be finite');
        assert.ok(Number.isFinite(res.standardPsuWattage), 'standardPsuWattage must be finite');
        assert.ok(!isNaN(res.headroomPercent), 'headroomPercent must not be NaN');
      });

      test('roundToStandardPsuSize handles invalid numbers safely', () => {
        assert.strictEqual(roundToStandardPsuSize(NaN), 450);
        assert.strictEqual(roundToStandardPsuSize(-100), 450);
        assert.strictEqual(roundToStandardPsuSize(Infinity), 450);
      });
    });
  });
});
