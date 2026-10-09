import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pages } from '../src/pages.mjs';

test('production build requires a real configured origin', () => {
  const run = spawnSync(process.execPath, ['scripts/build.mjs'], { encoding: 'utf8', env: { ...process.env, SITE_BASE_URL: '', BUILD_OUT: 'qa/missing-origin' } });
  const configured = JSON.parse(readFileSync('site.config.json', 'utf8')).baseUrl;
  if (!configured) { assert.notEqual(run.status, 0); assert.match(run.stderr, /Production base URL is not configured/); }
});
test('static output has distinct metadata, crawlable content, schema, and working subpath links', () => {
  const base = 'https://example.org/tank-volume-lab/';
  const run = spawnSync(process.execPath, ['scripts/build.mjs'], { encoding: 'utf8', env: { ...process.env, SITE_BASE_URL: base, BUILD_OUT: 'qa/build-fixture' } });
  assert.equal(run.status, 0, run.stderr);
  const titles = new Set();
  const descriptions = new Set();
  const headings = new Set();
  for (const page of pages) {
    const html = readFileSync(`qa/build-fixture/${page.slug}index.html`, 'utf8');
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    titles.add(html.match(/<title>(.*?)<\/title>/s)[1]);
    descriptions.add(html.match(/<meta name="description" content="(.*?)">/)[1]);
    headings.add(html.match(/<h1>(.*?)<\/h1>/)[1]);
    assert.ok(html.includes(`rel="canonical" href="${base}${page.slug}"`));
    assert.ok(!html.includes('noindex'));
    assert.equal(html.includes('Methodology &amp; Limitations'), page.type !== 'content');
    assert.equal(html.includes('Frequently Asked Questions'), page.type !== 'content');
    assert.ok(!html.includes('{{'), 'Unresolved content placeholder');
    for (const match of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(html.includes(`id="${match[1]}"`), `Missing section target: ${match[1]} on ${page.slug}`);
    }
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.ok(data.some(entry => entry['@type'] === (page.type === 'content' ? 'WebPage' : 'WebApplication') && entry.url === base + page.slug));
    const breadcrumb = data.find(entry => entry['@type'] === 'BreadcrumbList');
    assert.equal(Boolean(breadcrumb), Boolean(page.slug));
    if (breadcrumb) {
      assert.deepEqual(breadcrumb.itemListElement.map(item => item.item), [base, base + page.slug]);
      assert.ok(html.includes('class="crumbs"><a href="../">Home</a>'));
    }
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const target = match[1];
      if (target.startsWith('http')) continue;
      const path = resolve('qa/build-fixture', page.slug, target);
      assert.ok(existsSync(path), `Missing local target: ${target} on ${page.slug}`);
    }
  }
  assert.equal(titles.size, pages.length); assert.equal(descriptions.size, pages.length); assert.equal(headings.size, pages.length);
  const sitemap = readFileSync('qa/build-fixture/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length);
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), pages.map(page => base + page.slug));
  assert.ok(!sitemap.includes('<lastmod>'));
  assert.ok(readFileSync('qa/build-fixture/robots.txt', 'utf8').includes(`Sitemap: ${base}sitemap.xml`));
});
