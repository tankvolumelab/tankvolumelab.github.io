import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://localhost:4173/';
await mkdir('qa', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'], acceptDownloads: true });
const page = await context.newPage();
const errors = [];
const failedRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => failedRequests.push(request.url()));
const results = [];
try {
  for (const slug of ['', 'horizontal-cylinder-tank-calculator/', 'rectangular-tank-calculator/']) {
    await page.goto(base + slug);
    await page.waitForFunction(() => document.querySelector('#total-liters').textContent.includes('L'));
    const name = slug ? slug.split('-')[0] : 'home';
    await page.screenshot({ path: `qa/${name}-desktop.png`, fullPage: true });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#error').isVisible(), false);
    assert.ok(await page.locator('#copy').isEnabled());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `qa/${name}-mobile.png`, fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `${slug}: mobile overflow`);
    await page.setViewportSize({ width: 320, height: 740 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `${slug}: narrow mobile overflow`);
    await page.setViewportSize({ width: 1440, height: 1000 });
    results.push(`${name}: desktop, 390px and 320px layouts; no horizontal overflow`);
  }
  await page.goto(base);
  await page.locator('#shape-rectangular').check();
  await page.locator('#height').fill('0.5');
  await page.locator('#fill').fill('0.3');
  assert.match(await page.locator('#total-liters').textContent(), /1,000/);
  assert.match(await page.locator('#filled').textContent(), /600/);
  for (const unit of ['in', 'ft', 'mm', 'cm', 'm']) {
    await page.locator('#unit').selectOption(unit);
    assert.match(await page.locator('#total-liters').textContent(), /1,000/);
    assert.match(await page.locator('#filled').textContent(), /600/);
  }
  await page.locator('#fill').fill('');
  assert.equal(await page.locator('#partial-results').isVisible(), false);
  await page.locator('#fill').fill('0');
  assert.equal(await page.locator('#filled').textContent(), '0 L');
  await page.locator('#fill').fill('3');
  assert.equal(await page.locator('#error').isVisible(), true);
  assert.equal(await page.locator('#copy').isEnabled(), false);
  assert.equal(await page.locator('#total-liters').textContent(), '\u2014');
  await page.locator('#reset').click();
  assert.equal(await page.locator('#error').isVisible(), false);
  assert.equal(await page.locator('#shape-vertical').isChecked(), true);
  await page.locator('#copy').click();
  await page.waitForFunction(() => document.querySelector('#status').textContent === 'Results copied.');
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(clipboard.includes('Tank Volume Lab') && clipboard.includes('1,570.796'));
  results.push('Home: all units preserve values; blank/zero/invalid fill; reset; clipboard copy');

  await page.goto(base + 'horizontal-cylinder-tank-calculator/');
  await page.waitForFunction(() => document.querySelectorAll('#dip-body tr').length === 11);
  assert.equal(await page.locator('#dip-body tr').count(), 11);
  assert.match(await page.locator('#filled').textContent(), /785.398/);
  const pending = page.waitForEvent('download');
  await page.locator('#download').click();
  const download = await pending;
  assert.equal(download.suggestedFilename(), 'tank-volume-lab-dip-chart.csv');
  await download.saveAs('qa/downloaded-dip-chart.csv');
  await page.locator('#fill').fill('0.25');
  assert.match(await page.locator('#filled').textContent(), /307.092/);
  await page.locator('#diameter').fill('-1');
  assert.ok(await page.locator('#error').isVisible());
  assert.equal(await page.locator('#download').isEnabled(), false);
  results.push('Horizontal: half and quarter fill, 11-row table, CSV download, invalid dimensions disable export');

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base + 'rectangular-tank-calculator/');
  assert.ok(await staticPage.locator('h1').isVisible());
  assert.ok(await staticPage.locator('#formulas').isVisible());
  assert.ok((await staticPage.locator('a[href="../"]').count()) >= 1);
  await noJs.close();
  results.push('JavaScript disabled: page content, formulas and navigation present');
  assert.deepEqual(errors, []);
  assert.deepEqual(failedRequests, []);
  await writeFile('qa/browser-results.json', JSON.stringify({ base, results, errors, failedRequests }, null, 2));
  console.log(JSON.stringify({ results, errors, failedRequests }, null, 2));
} finally { await browser.close(); }
