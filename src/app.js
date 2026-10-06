import { calculateTank, convertLength, VOLUME_UNITS, dipChart, chartCsv } from './calculations.js';

const form = document.querySelector('#tank-form');
const $ = id => document.getElementById(id);
const fields = ['diameter', 'length', 'width', 'height', 'fill'];
let previousUnit = 'm';
let current = null;
let announcement;
const format = number => new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(number);
const readable = number => number > 0 && number < 0.001 ? '< 0.001' : format(number);
const getInput = () => Object.fromEntries(new FormData(form));

function updateFields() {
  const { shape } = getInput();
  const active = shape === 'rectangular' ? ['length', 'width', 'height'] : shape === 'horizontal' ? ['diameter', 'length'] : ['diameter', 'height'];
  for (const id of fields.filter(id => id !== 'fill')) {
    $(`field-${id}`).hidden = !active.includes(id);
    $(id).disabled = !active.includes(id);
  }
}

function diagram(input, result) {
  const depth = result.filled === null ? 0 : Math.max(0, Math.min(1, Number(input.fill) / result.maxDepth));
  const fillY = 135 - depth * 100;
  let geometry;
  if (input.shape === 'horizontal') {
    geometry = `<defs><clipPath id="tank-clip"><circle cx="140" cy="85" r="50"/></clipPath></defs><circle cx="140" cy="85" r="50" fill="#fff" stroke="#65847a" stroke-width="2"/><rect x="90" y="${fillY}" width="100" height="${depth * 100}" fill="#9ed6c4" clip-path="url(#tank-clip)"/><circle cx="140" cy="85" r="50" fill="none" stroke="#65847a" stroke-width="2"/><path d="M207 35v100m-5-100h10m-10 100h10" stroke="#65847a" fill="none"/><text x="220" y="90">D = ${format(Number(input.diameter))} ${input.unit}</text><text x="92" y="160">End view</text><text x="220" y="112">L = ${format(Number(input.length))} ${input.unit}</text>`;
  } else if (input.shape === 'vertical') {
    geometry = `<defs><clipPath id="tank-clip"><path d="M115 40a50 12 0 0 1 100 0v90a50 12 0 0 1-100 0z"/></clipPath></defs><path d="M115 40a50 12 0 0 1 100 0v90a50 12 0 0 1-100 0z" fill="#fff" stroke="#65847a" stroke-width="2"/><rect x="114" y="${140 - depth * 110}" width="102" height="${depth * 110}" fill="#9ed6c4" clip-path="url(#tank-clip)"/><ellipse cx="165" cy="40" rx="50" ry="12" fill="#f3f7f6" stroke="#65847a" stroke-width="2"/><path d="M115 40v90a50 12 0 0 0 100 0V40M238 30v110m-5-110h10m-10 110h10" fill="none" stroke="#65847a" stroke-width="2"/><text x="248" y="88">H: ${format(Number(input.height))} ${input.unit}</text><text x="117" y="166">D: ${format(Number(input.diameter))} ${input.unit}</text>`;
  } else {
    geometry = `<rect x="85" y="35" width="170" height="100" fill="#fff" stroke="#65847a" stroke-width="2"/><rect x="86" y="${fillY}" width="168" height="${Math.max(0, depth * 100 - 1)}" fill="#9ed6c4"/><path d="M85 35l22-16h170v100l-22 16m0-100 22-16" fill="none" stroke="#65847a" stroke-width="2"/><text x="100" y="160">L: ${format(Number(input.length))} ${input.unit}</text><text x="284" y="84">H: ${format(Number(input.height))}</text><text x="284" y="103">${input.unit}</text><text x="100" y="12">W: ${format(Number(input.width))} ${input.unit}</text>`;
  }
  $('tank-diagram').innerHTML = `<title id="diagram-title">${input.shape} tank; schematic, not to scale${result.percent === null ? ', liquid depth not specified' : `, ${format(result.percent)} percent of capacity filled`}</title>${geometry}`;
}

function announce(text, immediate = false) {
  clearTimeout(announcement);
  if (immediate) $('status').textContent = text;
  else announcement = setTimeout(() => { $('status').textContent = text; }, 700);
}

function clearResults(message) {
  current = null;
  $('error').textContent = message;
  $('error').hidden = false;
  $('total-liters').textContent = '\u2014';
  $('total-gallons').textContent = 'Check your dimensions';
  for (const id of ['imperial', 'meters', 'feet']) $(id).textContent = '\u2014';
  $('partial-results').hidden = true;
  $('capacity-only').hidden = true;
  $('tank-diagram').innerHTML = '<title id="diagram-title">Enter valid dimensions to show a tank diagram</title>';
  $('copy').disabled = true;
  if ($('download')) $('download').disabled = true;
  if ($('dip-body')) $('dip-body').innerHTML = '<tr><td colspan="4">Enter valid dimensions to generate a chart.</td></tr>';
  clearTimeout(announcement);
  $('status').textContent = '';
}

function render({ silent = false } = {}) {
  updateFields();
  const input = getInput();
  document.querySelectorAll('.unit-suffix').forEach(el => { el.textContent = input.unit; });
  try {
    const result = calculateTank(input);
    current = { input, result };
    $('error').hidden = true;
    $('copy').disabled = false;
    $('total-liters').innerHTML = `${readable(result.total * 1000)} <span>L</span>`;
    $('total-gallons').textContent = `${readable(result.total * VOLUME_UNITS.usGallons)} US gallons`;
    $('imperial').textContent = readable(result.total * VOLUME_UNITS.imperialGallons);
    $('meters').textContent = readable(result.total);
    $('feet').textContent = readable(result.total * VOLUME_UNITS.cubicFeet);
    $('partial-results').hidden = result.filled === null;
    $('capacity-only').hidden = result.filled !== null;
    if (result.filled !== null) {
      $('filled').textContent = `${readable(result.filled * 1000)} L`;
      $('remaining').textContent = `${readable(result.remaining * 1000)} L`;
      $('filled-gallons').textContent = `${readable(result.filled * VOLUME_UNITS.usGallons)} US gal`;
      $('remaining-gallons').textContent = `${readable(result.remaining * VOLUME_UNITS.usGallons)} US gal`;
      $('fill-bar').style.width = `${result.percent}%`;
      $('percent').textContent = `${readable(result.percent)}% full`;
    }
    diagram(input, result);
    if ($('dip-body')) {
      $('depth-header').textContent = `Depth (${input.unit})`;
      $('dip-body').innerHTML = dipChart(input).map(row => `<tr ${Math.abs(row.percent - (result.percent ?? -1)) < 1e-7 ? 'class="dip-current"' : ''}><td>${readable(row.depth)}</td><td>${readable(row.filled * 1000)}</td><td>${readable(row.filled * VOLUME_UNITS.usGallons)}</td><td>${format(row.percent)}%</td></tr>`).join('');
      $('download').disabled = false;
    }
    if (!silent) announce(`Capacity: ${readable(result.total * 1000)} liters.${result.filled === null ? '' : ` Liquid: ${readable(result.filled * 1000)} liters, ${format(result.percent)} percent full.`}`);
  } catch (error) { clearResults(error.message); }
}

form.addEventListener('submit', event => { event.preventDefault(); render(); });
form.addEventListener('input', event => { if (event.target.id !== 'unit') render(); });
$('unit').addEventListener('change', () => {
  const next = $('unit').value;
  fields.forEach(id => {
    const field = $(id);
    if (field.value !== '' && Number.isFinite(Number(field.value))) field.value = String(convertLength(Number(field.value), previousUnit, next));
  });
  previousUnit = next;
  render();
});
$('reset').addEventListener('click', () => { HTMLFormElement.prototype.reset.call(form); previousUnit = 'm'; render(); announce('Example dimensions restored.', true); });
$('copy').addEventListener('click', async () => {
  if (!current) return;
  const { input, result } = current;
  const measurements = fields.filter(id => id !== 'fill' && !$(id).disabled).map(id => `${id}: ${input[id]} ${input.unit}`).join(', ');
  const text = `Tank Volume Lab\n${input.shape} tank (${measurements})\nTotal capacity: ${format(result.total * 1000)} L / ${format(result.total * VOLUME_UNITS.usGallons)} US gal / ${format(result.total * VOLUME_UNITS.imperialGallons)} Imperial gal / ${format(result.total)} m3 / ${format(result.total * VOLUME_UNITS.cubicFeet)} ft3${result.filled === null ? '' : `\nLiquid depth: ${input.fill} ${input.unit}\nLiquid volume: ${format(result.filled * 1000)} L / ${format(result.filled * VOLUME_UNITS.usGallons)} US gal\nRemaining: ${format(result.remaining * 1000)} L / ${format(result.remaining * VOLUME_UNITS.usGallons)} US gal\n${format(result.percent)}% full`}\nEstimate for ideal internal geometry.`;
  try { await navigator.clipboard.writeText(text); announce('Results copied.', true); }
  catch { announce('Clipboard unavailable. Select and copy the results directly.', true); }
});
$('download')?.addEventListener('click', () => {
  if (!current) return;
  const blob = new Blob([chartCsv(current.input)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'tank-volume-lab-dip-chart.csv';
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Dip chart downloaded.', true);
});
render({ silent: true });
