import assert from 'node:assert';
import test, { describe } from 'node:test';
import { calculatePowerConsumption, roundToStandardPsuSize } from './calculator';
import { CalculatorInputs } from '../types/calculator';

describe('Power Calculator Engine', () => {
  test('calculates correct base estimated power and standard PSU recommendation', () => {
    // Ryzen 7 7800X3D (120W) + RTX 4070 Super (220W) + 16GB RAM (10W) + 1 SSD (5W) + 0 HDD + Air Cooler (5W) + 3 Fans (9W) + Misc (40W) = 409W
    const inputs: CalculatorInputs = {
      cpuId: 'amd-7800x3d',
      gpuId: 'rtx-4070-super',
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
      cpuId: 'intel-14900k',
      gpuId: 'rtx-4090',
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
        cpuId: 'amd-5600x',
        gpuId: 'rtx-4060',
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
      const bSum = res.breakdown.cpu + res.breakdown.gpu + res.breakdown.ram +
        res.breakdown.ssd + res.breakdown.hdd + res.breakdown.cooling +
        res.breakdown.fans + res.breakdown.misc + res.breakdown.overclockBonus;
      assert.strictEqual(bSum, res.estimatedPowerW);
    });

    test('B. Gaming PC', () => {
      const inputs: CalculatorInputs = {
        cpuId: 'amd-7800x3d',
        gpuId: 'rtx-4070-super',
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

      const bSum = res.breakdown.cpu + res.breakdown.gpu + res.breakdown.ram +
        res.breakdown.ssd + res.breakdown.hdd + res.breakdown.cooling +
        res.breakdown.fans + res.breakdown.misc + res.breakdown.overclockBonus;
      assert.strictEqual(bSum, res.estimatedPowerW);
    });

    test('C. High-end PC', () => {
      const inputs: CalculatorInputs = {
        cpuId: 'intel-14900k',
        gpuId: 'rtx-4090',
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

      const bSum = res.breakdown.cpu + res.breakdown.gpu + res.breakdown.ram +
        res.breakdown.ssd + res.breakdown.hdd + res.breakdown.cooling +
        res.breakdown.fans + res.breakdown.misc + res.breakdown.overclockBonus;
      assert.strictEqual(bSum, res.estimatedPowerW);
    });

    test('D. Overclocked PC', () => {
      const inputs: CalculatorInputs = {
        cpuId: 'intel-14900k',
        gpuId: 'rtx-4090',
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
      // 926 * 1.25 = 1157.5 -> 1158 W
      assert.strictEqual(res.recommendedPowerW, 1158);
      assert.strictEqual(res.standardPsuWattage, 1200);

      const bSum = res.breakdown.cpu + res.breakdown.gpu + res.breakdown.ram +
        res.breakdown.ssd + res.breakdown.hdd + res.breakdown.cooling +
        res.breakdown.fans + res.breakdown.misc + res.breakdown.overclockBonus;
      assert.strictEqual(bSum, res.estimatedPowerW);
    });

    test('E. Minimal PC', () => {
      const inputs: CalculatorInputs = {
        cpuId: 'amd-5600x',
        gpuId: 'rtx-4060',
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

      const bSum = res.breakdown.cpu + res.breakdown.gpu + res.breakdown.ram +
        res.breakdown.ssd + res.breakdown.hdd + res.breakdown.cooling +
        res.breakdown.fans + res.breakdown.misc + res.breakdown.overclockBonus;
      assert.strictEqual(bSum, res.estimatedPowerW);
    });
  });
});
