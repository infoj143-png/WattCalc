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

  test('rounds standard PSU size properly', () => {
    assert.strictEqual(roundToStandardPsuSize(400), 450);
    assert.strictEqual(roundToStandardPsuSize(450), 450);
    assert.strictEqual(roundToStandardPsuSize(451), 500);
    assert.strictEqual(roundToStandardPsuSize(720), 750);
    assert.strictEqual(roundToStandardPsuSize(751), 850);
    assert.strictEqual(roundToStandardPsuSize(1150), 1200);
    assert.strictEqual(roundToStandardPsuSize(1600), 1600);
  });
});
