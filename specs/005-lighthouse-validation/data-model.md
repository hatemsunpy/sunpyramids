# Data Model: Lighthouse Performance & SEO Validation

**Feature**: 005-lighthouse-validation | **Date**: 2026-05-12

## Entities

### LighthouseAudit

A single Lighthouse run against one URL.

| Field | Type | Description |
|-------|------|-------------|
| url | string | Target URL (e.g., `https://sunpyramidstours.com/fr`) |
| locale | string | Locale code (en, fr, de, it, pt, es, zh) |
| pageType | enum | `homepage` \| `tour-detail` \| `static-page` |
| deviceProfile | enum | `mobile` \| `desktop` |
| throttling | string | `simulated-4g` \| `slow-4g` \| `none` |
| thirdPartyMode | enum | `enabled` \| `disabled` (via `?no-third-party=1`) |
| seoScore | integer | 0-100 Lighthouse SEO score |
| lcp | number | Largest Contentful Paint in seconds |
| tbt | number | Total Blocking Time in milliseconds |
| cls | number | Cumulative Layout Shift score |
| performanceScore | integer | 0-100 Lighthouse Performance score |
| timestamp | ISO 8601 | When the audit was run |
| rawFlags | object | Map of individual Lighthouse audit pass/fail flags |
| notes | string | Transient failures, reruns, observations |

Validation: `seoScore` ∈ [0, 100]; `lcp` ≥ 0; `tbt` ≥ 0; `cls` ≥ 0.

### AuditComparison

Pairs a current audit result with its baseline for the same URL.

| Field | Type | Description |
|-------|------|-------------|
| url | string | Page URL (shared key) |
| baseline | LighthouseAudit | Pre-fix audit result (nullable if missing) |
| current | LighthouseAudit | Post-fix audit result |
| seoDelta | integer | `current.seoScore - baseline.seoScore` (nullable if no baseline) |
| lcpDeltaPercent | number | `(current.lcp - baseline.lcp) / baseline.lcp * 100` (nullable) |
| tbtDeltaMs | number | `current.tbt - baseline.tbt` (nullable) |
| passFail | enum | `pass` \| `fail` \| `pass-with-caveat` |

Pass/fail determination (from FR-003, FR-015):
- **pass**: SEO score = 100, OR `seoDelta ≥ +5`, AND no CWV regression exceeding thresholds
- **pass-with-caveat**: with-scripts fails but without-scripts passes (FR-015 case b); third-party impact documented
- **fail**: SEO score below baseline, OR `seoDelta` in [+1,+4] without reaching 100, OR CWV regression exceeds thresholds, OR both with-scripts and without-scripts fail (FR-015 case c)

### ValidationReport

The aggregate output document.

| Field | Type | Description |
|-------|------|-------------|
| auditDate | string | ISO 8601 date of audit session |
| environment | string | URL of tested environment |
| comparisons | AuditComparison[] | All 17 page-locale comparisons (plus diagnostic runs) |
| totalPages | integer | Total audited combinations |
| passedCount | integer | Count of passing comparisons |
| failedCount | integer | Count of failing comparisons |
| caveatCount | integer | Count of pass-with-caveat comparisons |
| gate12Verdict | enum | `pass` \| `fail` |
| outputPath | string | `docs/seo-validation/phase-5-lighthouse-validation-report.md` |

Gate verdict: **pass** only if `failedCount = 0` and `passedCount + caveatCount = totalPages`.

### PrefetchAudit

Homepage network waterfall verification (subset of US3 validation).

| Field | Type | Description |
|-------|------|-------------|
| url | string | Homepage URL |
| docHtmlRequestCount | integer | Count of text/html document requests on initial load |
| expectCount | integer | Always 1 |
| crawlableLinksVerified | integer | Count of verified `<a href>` elements |
| totalCardLinks | integer | Total card/listing links inspected |
| passFail | enum | `pass` \| `fail` |

Pass: `docHtmlRequestCount = 1` AND `crawlableLinksVerified = totalCardLinks`.

## Relationships

```
ValidationReport 1 ─── * AuditComparison
AuditComparison  1 ─── 1  LighthouseAudit (baseline, nullable)
AuditComparison  1 ─── 1  LighthouseAudit (current)
PrefetchAudit    standalone (part of homepage AuditComparison)
```
