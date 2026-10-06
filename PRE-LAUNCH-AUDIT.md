# Phase 1: pre-launch audit

Date: October 6, 2026

Verdict: local functional and production-template checks pass. Final approval of live canonical URLs and hosted responses is pending the actual GitHub Pages address. Nothing was published during this audit.

| Requirement | Result | Evidence / qualification |
| --- | --- | --- |
| All three calculator geometries are correct | PASS | Reviewed formulas and reran automated checks for rectangular, vertical cylinder and horizontal cylinder. Empty/full/half/quarter fills, partial-volume bounds, small-depth stability, unit equivalence and dip-chart progression pass. |
| Unique title, H1 and meta description on each page | PASS | Production build has three distinct titles, descriptions and H1 values, with exactly one H1 per calculator page. |
| Original, crawlable HTML content | PASS | Authored explanations, examples and FAQs are present directly in all three generated HTML files. The specialized pages have distinct task content. Browser verification also confirms content with JavaScript disabled. This is an editorial/source review, not an exhaustive internet plagiarism comparison. |
| Internal links and breadcrumbs | PASS locally | All relative page/asset destinations resolve in the production test build. All same-page section anchors exist. Both child breadcrumbs point home and their structured-data URLs match their intended pages. Actual-host HTTP responses remain to be checked after deployment. |
| Canonicals match actual GitHub Pages URL | PENDING | No GitHub account/repository URL has been selected. Production construction is tested with a repository-subpath fixture. The workflow obtains its base URL from actions/configure-pages. This does not verify an as-yet nonexistent live deployment. |
| Sitemap contains exactly the intended three pages | PASS template | Exact URL list equals homepage, horizontal cylinder and rectangular calculator; no duplicate, 404 or extra URL. Actual origin is pending. |
| No accidental noindex | PASS production template | All three production calculator pages have index, follow. The local preview deliberately has noindex, nofollow and robots Disallow; do not publish the preview output manually. The 404 page intentionally remains noindex and is absent from the sitemap. |
| Mobile layout, errors and conversions | PASS tested cases | Browser checks at 1440px, 390px and 320px widths on all routes; no document overflow. Blank/zero/invalid fill, reset, copy, CSV and unit switching pass. Core tests now check all five input units across all three shapes, for capacity and partial fill. |
| No public API keys or secrets | PASS scan/review | Common private-key, AWS, GitHub token and API-key/secret/password patterns yielded no matches in current project files. Reviewed public JavaScript and deployment configuration: no credential literals or external calculation APIs. This scan cannot establish the contents of any future commits or repository history. |

## Verification performed

- Node test suite: 13 passed, 0 failed, including strengthened unit-conversion, fragment-link, breadcrumb and exact-sitemap assertions.
- Playwright with installed Edge: all browser checks passed; no JavaScript page errors or failed asset requests reported.
- Browser evidence: `qa/browser-results.json` plus desktop/mobile screenshots and downloaded CSV.
- Production fixture: `qa/build-fixture/`, generated using `https://example.org/tank-volume-lab/` only as an isolated test address. It is not a proposed live URL and is not deployed.
- Current `dist/`: local preview, intentionally non-indexable. The deployment workflow creates fresh production output and publishes only that output.

## Remaining launch gate

Choose the GitHub repository, then use its actual Pages URL to generate production output. Before treating the launch as verified, inspect the final hosted title/description/H1, absolute canonicals, three sitemap URLs, robots/meta/header indexing directives, child-route refreshes and asset/link HTTP responses. The production build already refuses to run without an HTTPS base URL.

SEO opportunity validation is separate from this technical audit. The two supporting keyword targets remain provisional as recorded in `SEO-RESEARCH.md`; passing these checks does not establish search demand or predict rankings.
