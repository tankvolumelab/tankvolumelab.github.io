import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTank, convertLength, dipChart, chartCsv, horizontalFraction, LENGTH_UNITS } from '../src/calculations.js';
const horizontal = { shape: 'horizontal', unit: 'm', diameter: 1, length: 2 };
const rectangular = { shape: 'rectangular', unit: 'm', length: 2, width: 1, height: 0.5 };
const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);

test('rectangular example: 2 x 1 x 0.5 m = 1000 L', () => close(calculateTank(rectangular).total * 1000, 1000));
test('cylinder example and horizontal half fill', () => {
  const result = calculateTank({ ...horizontal, fill: 0.5 });
  close(result.total * 1000, 1570.7963267948965);
  assert.equal(result.filled, result.total / 2);
  close(result.filled * 1000, 785.3981633974482);
});
test('all shapes distinguish empty, omitted and full depth', () => {
  for (const input of [horizontal, rectangular, { shape: 'vertical', unit: 'm', diameter: 1, height: 2 }]) {
    const capacity = calculateTank(input);
    assert.equal(capacity.filled, null);
    assert.equal(calculateTank({ ...input, fill: '' }).filled, null);
    assert.equal(calculateTank({ ...input, fill: 0 }).filled, 0);
    const full = calculateTank({ ...input, fill: capacity.maxDepth });
    assert.equal(full.filled, full.total);
    assert.equal(full.remaining, 0);
    assert.equal(full.percent, 100);
  }
});
test('every supported unit preserves physical capacity', () => {
  for (const tank of [{ ...rectangular, fill: 0.3 }, { ...horizontal, fill: 0.25 }, { shape: 'vertical', unit: 'm', diameter: 1, height: 2, fill: 0.7 }]) {
    const expected = calculateTank(tank);
    for (const unit of Object.keys(LENGTH_UNITS)) {
      const input = { ...tank, unit };
      for (const field of ['diameter', 'length', 'width', 'height', 'fill']) {
        if (field in tank) input[field] = convertLength(tank[field], 'm', unit);
      }
      const actual = calculateTank(input);
      close(actual.total, expected.total);
      close(actual.filled, expected.filled);
      close(actual.percent, expected.percent);
      close(convertLength(convertLength(2.718281828, 'm', unit), unit, 'm'), 2.718281828);
    }
  }
});
test('invalid dimensions and fill depths are rejected', () => {
  for (const invalid of [-1, 0, Infinity, NaN, '', null, undefined, 'abc', true]) assert.throws(() => calculateTank({ ...horizontal, diameter: invalid }));
  for (const fill of [-0.01, 1.01, Infinity, 'abc']) assert.throws(() => calculateTank({ ...horizontal, fill }));
  assert.throws(() => calculateTank({ ...horizontal, unit: 'yards' }));
  assert.throws(() => calculateTank({ ...horizontal, shape: 'sphere' }));
  assert.throws(() => calculateTank({ ...horizontal, length: 1e308, diameter: 1e308 }));
  assert.throws(() => calculateTank({ ...horizontal, length: 1e-300, diameter: 1e-300 }));
});
test('partial fills are bounded and increase monotonically, with symmetric complements', () => {
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const fill = i / 1000;
    const result = calculateTank({ ...horizontal, fill });
    assert.ok(result.filled >= previous && result.filled <= result.total);
    close(result.filled + calculateTank({ ...horizontal, fill: 1 - fill }).filled, result.total);
    previous = result.filled;
  }
});
test('quarter-depth circular segment agrees with analytic result', () => {
  close(horizontalFraction(0.25, 1), (Math.PI / 3 - Math.sqrt(3) / 4) / Math.PI);
});
test('very shallow fill stays positive and matches leading-order segment expansion', () => {
  const depth = 1e-12;
  const expected = 16 / (3 * Math.PI) * depth ** 1.5;
  const actual = horizontalFraction(depth, 1);
  assert.ok(actual > 0);
  assert.ok(Math.abs(actual / expected - 1) < 1e-9);
});
test('vertical and rectangular partial fills are linear', () => {
  close(calculateTank({ ...rectangular, fill: 0.3 }).filled * 1000, 600);
  const result = calculateTank({ shape: 'vertical', diameter: 1, height: 2, fill: 0.5 });
  close(result.percent, 25);
});
test('US customary example matches exact cubic-inch conversion', () => {
  const result = calculateTank({ shape: 'rectangular', unit: 'in', length: 48, width: 24, height: 20, fill: 12 });
  close(result.total / 0.003785411784, 23040 / 231);
  close(result.percent, 60);
});
test('dip chart has 11 monotonic entries including endpoints and CSV matches', () => {
  const chart = dipChart(horizontal);
  assert.equal(chart.length, 11);
  assert.equal(chart[0].filled, 0);
  assert.equal(chart.at(-1).filled, chart.at(-1).total);
  chart.slice(1).forEach((row, index) => assert.ok(row.filled > chart[index].filled));
  const csv = chartCsv(horizontal).split('\r\n');
  assert.equal(csv.length, 12);
  assert.equal(csv[0], 'Depth (m),Liters,US gallons,Percent full');
  assert.equal(Number(csv[6].split(',')[3]), 50);
});
