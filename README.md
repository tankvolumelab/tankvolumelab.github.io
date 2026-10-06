# Tank Volume Lab

A lightweight static tank-capacity website for GitHub Pages. All calculations run in the browser. No runtime dependencies, tracking, backend, accounts or API calls.

## Current delivery status

The three working tools and local preview are complete. The intended organization site is `https://tankvolumelab.github.io/`, backed by `tankvolumelab/tankvolumelab.github.io`. That origin is configured for production builds; public deployment remains pending repository creation and publishing. The homepage keyword cluster is provisionally supported by the supplied Semrush snapshot. Both supporting SEO targets remain provisional; see [SEO-RESEARCH.md](SEO-RESEARCH.md).

## Project structure

```text
src/
  calculations.js       Shared geometry and unit conversions
  app.js                Calculator interactions, SVG diagrams, copy and CSV
  pages.mjs             Static content, metadata and research status
  styles.css            Responsive and accessible styles
  assets/               Original diagrams/favicon and licensed Lucide icons
scripts/
  build.mjs             Static HTML, metadata, sitemap and robots generator
  serve.mjs             Local-only preview server
  browser-qa.mjs        Optional Playwright browser verification
tests/
  calculations.test.mjs Math, validation, units and dip-chart tests
  build.test.mjs        Metadata, schema and subpath-link checks
.github/workflows/pages.yml
site.config.json        Central production URL and optional verification token
dist/                   Generated preview or production output (gitignored)
qa/                     Local QA evidence (gitignored)
```

## Run locally

Requires Node.js 20 or newer. There are no package dependencies to install.

```sh
npm test
npm run preview:build
npm start
```

Open http://localhost:4173/. The local build has `noindex, nofollow` and localhost canonicals. Do not upload that preview build as a production site. A production build deliberately fails until a real HTTPS base URL is configured.

If port 4173 is occupied, select a free port using `PORT` for the server and `PREVIEW_BASE_URL` for the preview build. Do not stop unrelated servers. The preview should be served over HTTP because browsers restrict local-file JavaScript modules.

## Included functionality

- Vertical and horizontal flat-ended cylinders and rectangular tanks.
- Dimensions in mm, cm, m, inches or feet; switching units converts existing values.
- Total capacity in liters, US gallons, Imperial gallons, cubic meters and cubic feet.
- Optional liquid volume, remaining capacity and percentage full; explicit zero means empty.
- Live results, calculate button, reset, clipboard copy and schematic fill diagrams.
- Horizontal dip chart at eleven depths and CSV export.
- Input errors clear stale results and disable copy/export.
- Distinct static explanations, worked examples, FAQs, internal links and methodology.
- Keyboard controls, visible focus, native form labels, delayed result announcements and mobile layouts.

Only ideal rectangular prisms and level, flat-ended circular cylinders are supported. Rounded ends, tilt, fittings, baffles and freeboard are not modeled. Numerical results are rounded only for display. Positive values below 0.001 display as `< 0.001`; CSV values preserve numerical precision.

## Deploy to GitHub Pages

1. Under the `tankvolumelab` organization, create the public repository `tankvolumelab.github.io` for the root organization site.
2. Add this project's source files to the repository on the `main` branch. Do not upload `qa/`, local logs or the local preview `dist/`.
3. In repository Settings > Pages, select **GitHub Actions** as the build/deployment source.
4. Push to `main`, or run **Publish Tank Volume Lab** from the Actions tab.
5. The workflow runs the tests, obtains the actual Pages base URL from `actions/configure-pages`, creates fresh production HTML and publishes only `dist/`.
6. Use the successful deployment's actual URL. Check the homepage and both child routes directly and after refreshing. Verify HTTPS, canonicals, assets and sitemap on that real host.

No fake GitHub username or speculative custom domain appears in production metadata. Production URLs are derived from `SITE_BASE_URL`, falling back to `site.config.json`'s `baseUrl`. The workflow supplies the real value automatically. For a manual production build in PowerShell:

```powershell
$env:SITE_BASE_URL = 'YOUR_ACTUAL_HTTPS_PAGES_URL_WITH_TRAILING_SLASH'
npm run build
```

Replace the example value with the real site URL before running. This is a configuration example, not a claimed deployment URL.

## Page titles and canonicals

Let `BASE_URL` be the real configured URL including its trailing slash and, for a project site, its repository subpath.

| Route | Exact title | Production canonical |
| --- | --- | --- |
| `/` | Tank Volume Calculator - Gallons, Litres & Capacity | `BASE_URL` |
| `/horizontal-cylinder-tank-calculator/` | Horizontal Tank Volume Calculator - Liquid Fill & Gallons | `BASE_URL` + `horizontal-cylinder-tank-calculator/` |
| `/rectangular-tank-calculator/` | Rectangular Tank Calculator - Litres, Gallons & Volume | `BASE_URL` + `rectangular-tank-calculator/` |

The configured production canonical URLs are `https://tankvolumelab.github.io/`, `https://tankvolumelab.github.io/horizontal-cylinder-tank-calculator/` and `https://tankvolumelab.github.io/rectangular-tank-calculator/`. Hosting is not yet verified. Every build writes an absolute self-canonical to each page, Open Graph URL and a three-URL sitemap. Relative asset/navigation paths also work under a repository subpath. Child pages are real directories with `index.html`, so refreshing does not rely on an SPA fallback.

For a later custom domain, change the host configuration/base URL and run the build again; no calculator/source rewrite is needed. Regenerating static canonicals and the sitemap is necessary when the origin changes. No domain has been purchased or configured.

## SEO implementation checklist

- [x] Static meaningful HTML with one H1, unique title and description per calculator.
- [x] Crawlable navigation and contextual links; breadcrumbs on child pages.
- [x] Central absolute canonical and social metadata generation.
- [x] Production pages indexable; local preview intentionally noindex.
- [x] Three canonical calculator URLs in sitemap; no invented lastmod timestamps.
- [x] WebSite/WebApplication JSON-LD and child BreadcrumbList; no fake ratings or FAQ rich-result promises.
- [x] No external fonts, libraries, analytics or rendering-blocking third-party calls.
- [x] Original, task-specific examples and explicit geometry/privacy limitations.
- [x] Host-root limitation documented for robots.txt: a repository-level file cannot control the entire github.io host.
- [ ] Actual production origin, deployment and real-host route checks.
- [ ] External Schema.org/Rich Results validation on the deployed pages. Local tests parse JSON-LD and check key values; they do not replace external validators.
- [ ] Search Console verification and indexing inspection.
- [ ] Final competitor-validated selection of the two additional SEO targets.

The generated 404 document is noindex and excluded from the sitemap. Google may choose a different canonical; tags and sitemaps do not guarantee indexing or ranking. See [Google's canonical documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Verification

On October 6, 2026, all 13 Node tests passed. Playwright with installed Edge verified all three routes at 1440px, 390px and 320px widths with no document overflow, tested unit switching, blank/zero/invalid fill, reset, clipboard copy, dip-chart download and JavaScript-disabled content. It reported no page errors or failed asset requests. Desktop/mobile screenshots are in `qa/`.

Browser QA is optional development tooling, not a runtime dependency. With Playwright available, run `node scripts/browser-qa.mjs`. Set `PLAYWRIGHT_MODULE` to its module path if it is not installed in this repository and `BROWSER_EXECUTABLE` to a browser executable if needed. The server must be running. Use `QA_BASE_URL` to check a different local origin or repository prefix.

The build test uses an isolated `https://example.org/tank-volume-lab/` fixture under `qa/`; that is not production metadata and is never deployed. Live GitHub Pages testing remains pending until a repository is selected.

## Google Search Console

1. After successful publishing, copy the final HTTPS URL including the project subpath.
2. Add that address as a **URL-prefix property** in Search Console.
3. Choose HTML meta-tag verification. Place only Google's supplied token in `site.config.json` under `verificationToken`, rebuild and deploy, then click Verify. No token has been invented or prefilled.
4. Submit the deployed `sitemap.xml` URL.
5. Inspect each of the three intended page URLs with URL Inspection and check Google's selected canonical, crawl access and rendered content. Request indexing where appropriate.
6. Monitor Page indexing and Performance after data appears. Compare query-to-page impressions, clicks, CTR and position; filter to the US when assessing this market.
7. Watch for the same query cluster splitting across pages without a useful intent difference. Consolidate when evidence favors it, rather than creating more pages for synonyms.

Search Console is not connected. No rankings, traffic or rich results are guaranteed. Use observed query demand and usage feedback to decide future improvements; no automated backlink building or SEO page expansion is included.
