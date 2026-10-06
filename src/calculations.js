export const LENGTH_UNITS = Object.freeze({ mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 });
export const VOLUME_UNITS = Object.freeze({ liters: 1000, usGallons: 1 / 0.003785411784, imperialGallons: 1 / 0.00454609, cubicMeters: 1, cubicFeet: 1 / 0.028316846592 });

export function convertLength(value, from, to) {
  if (!(from in LENGTH_UNITS) || !(to in LENGTH_UNITS) || !Number.isFinite(value)) throw new Error('Choose a supported measurement unit and a finite value.');
  return value * LENGTH_UNITS[from] / LENGTH_UNITS[to];
}

function dimension(value, name, factor) {
  if (value === '' || value === null || value === undefined || typeof value === 'boolean') throw new Error(`Enter ${name}.`);
  const number = Number(value) * factor;
  if (!Number.isFinite(number) || number <= 0) throw new Error(`${name} must be a finite number greater than zero.`);
  return number;
}

export function horizontalFraction(depth, diameter) {
  const ratio = depth / diameter;
  if (ratio <= 0) return 0;
  if (ratio >= 1) return 1;
  if (ratio === 0.5) return 0.5;
  // Evaluate the smaller segment and use a series near zero to avoid cancellation.
  const lower = Math.min(ratio, 1 - ratio);
  const theta = 2 * Math.asin(Math.sqrt(lower));
  const segment = theta < 0.01
    ? theta ** 3 * (2 / 3 - 2 * theta ** 2 / 15 + 4 * theta ** 4 / 315 - 2 * theta ** 6 / 2835)
    : theta - Math.sin(theta) * Math.cos(theta);
  const fraction = Math.max(0, Math.min(0.5, segment / Math.PI));
  return ratio > 0.5 ? 1 - fraction : fraction;
}

export function calculateTank({ shape, unit = 'm', length, width, height, diameter, fill }) {
  if (!(unit in LENGTH_UNITS)) throw new Error('Choose a supported measurement unit.');
  if (!['vertical', 'horizontal', 'rectangular'].includes(shape)) throw new Error('Choose a supported tank shape.');
  const factor = LENGTH_UNITS[unit];
  let total, maxDepth;
  if (shape === 'rectangular') {
    const l = dimension(length, 'inside length', factor);
    const w = dimension(width, 'inside width', factor);
    maxDepth = dimension(height, 'inside height', factor);
    total = l * w * maxDepth;
  } else {
    const d = dimension(diameter, 'inside diameter', factor);
    const axis = dimension(shape === 'vertical' ? height : length, shape === 'vertical' ? 'inside height' : 'cylinder length', factor);
    maxDepth = shape === 'vertical' ? axis : d;
    total = Math.PI * (d / 2) ** 2 * axis;
  }
  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(total * 1000)) throw new Error('These dimensions are outside the supported numeric range.');
  const hasFill = fill !== '' && fill !== null && fill !== undefined;
  let filled = null;
  if (hasFill) {
    const depth = Number(fill) * factor;
    if (!Number.isFinite(depth) || depth < 0 || depth > maxDepth + maxDepth * 1e-12) throw new Error(`Liquid depth must be between 0 and ${maxDepth / factor} ${unit}.`);
    const bounded = Math.min(depth, maxDepth);
    const fraction = shape === 'horizontal' ? horizontalFraction(bounded, maxDepth) : bounded / maxDepth;
    filled = total * fraction;
  }
  return { total, filled, remaining: filled === null ? null : total - filled, percent: filled === null ? null : filled / total * 100, maxDepth: maxDepth / factor };
}

export function dipChart(input) {
  if (input.shape !== 'horizontal') throw new Error('Dip charts require a horizontal cylinder.');
  const base = calculateTank({ ...input, fill: '' });
  return Array.from({ length: 11 }, (_, i) => {
    const depth = base.maxDepth * i / 10;
    return { depth, ...calculateTank({ ...input, fill: depth }) };
  });
}

export function chartCsv(input) {
  return [`Depth (${input.unit}),Liters,US gallons,Percent full`, ...dipChart(input).map(row => [row.depth, row.filled * VOLUME_UNITS.liters, row.filled * VOLUME_UNITS.usGallons, row.percent].join(','))].join('\r\n');
}
