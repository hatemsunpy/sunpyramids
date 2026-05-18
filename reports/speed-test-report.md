# ⚡ Playwright Web Speed Test Report — Sun Pyramids Tours

**Date**: 2026-05-17
**Environment**: Docker container connected to default Nuxt 3 stack (http://localhost:3000)
**Audit Engine**: Playwright Chromium (CDP + Resource Timings)

---

## 1. Executive Summary

This report analyses the web performance of **15 page categories** on the local Docker build of Sun Pyramids Tours. Measurements represent direct **lab metrics** with simulated fresh browser visits (no browser caching).

### 📈 Performance Scorecard

| Category | URL | TTFB | FCP | LCP | CLS | Hydration Mismatch | Total Weight | Requests |
|----------|-----|------|-----|-----|-----|--------------------|--------------|----------|
| **Homepage** | `/` | 🟢 61ms | 🟢 283ms | 🔴 7532ms | 🟢 0.0014 | ❌ Yes | **17,528 KB** | 596 |
| **About Us** | `/about-us` | 🔴 3076ms | 🔴 3364ms | 🟡 3533ms | 🟢 0.0877 | ❌ Yes | **15,742 KB** | 554 |
| **Accessible Travel** | `/accessible-travel` | 🔴 3776ms | 🔴 4177ms | 🔴 4177ms | 🟡 0.1592 | ❌ Yes | **18,140 KB** | 535 |
| **Blogs List** | `/blogs/all-blogs` | 🔴 2421ms | 🔴 3174ms | 🟡 3174ms | 🟢 0.0758 | ❌ Yes | **15,885 KB** | 537 |
| **Blog Detail** | `/blog/egypt%20desert%20tours` | 🔴 3296ms | 🔴 4057ms | 🔴 4057ms | 🟢 0.0008 | ❌ Yes | **28,813 KB** | 557 |
| **Contact Us** | `/contact-us` | 🔴 2533ms | 🔴 3118ms | 🟡 3813ms | 🟢 0.0024 | ❌ Yes | **14,256 KB** | 508 |
| **Egypt Tours Category** | `/egypt-tours/one-day-tours` | 🔴 2567ms | 🟡 2937ms | 🟡 3658ms | 🟢 0.0013 | ❌ Yes | **15,748 KB** | 569 |
| **Egypt Travel Guide** | `/egypt-travel-guide` | 🟡 1787ms | 🟡 2183ms | 🟡 3035ms | 🟢 0.0004 | ❌ Yes | **13,443 KB** | 485 |
| **Events** | `/events` | 🔴 2013ms | 🟡 2715ms | 🟡 3333ms | 🟢 0.0026 | ❌ Yes | **15,346 KB** | 567 |
| **FAQs** | `/faqs` | 🔴 6142ms | 🔴 7067ms | 🔴 8828ms | 🟢 0.0008 | ❌ Yes | **13,917 KB** | 484 |
| **Rent Car** | `/rent-car` | 🔴 2848ms | 🔴 3640ms | 🟡 3709ms | 🟢 0.0262 | ❌ Yes | **14,204 KB** | 492 |
| **Sustainability** | `/sustainability` | 🔴 2091ms | 🔴 3061ms | 🔴 4845ms | 🟡 0.1729 | ❌ Yes | **16,743 KB** | 561 |
| **Terms and Conditions** | `/terms-and-conditions` | 🟡 1657ms | 🟡 2418ms | 🔴 5394ms | 🟢 0.0009 | ❌ Yes | **13,638 KB** | 490 |
| **Privacy and Cookies** | `/privacy-and-cookies` | 🔴 1972ms | 🟡 2793ms | 🟡 3395ms | 🟢 0.0009 | ❌ Yes | **13,688 KB** | 488 |
| **Tour Detail** | `/tour/pyramids-nile-cruise-by-train` | 🔴 4510ms | 🔴 5014ms | 🔴 5014ms | 🟢 0.0083 | ❌ Yes | **17,489 KB** | 622 |

> [!NOTE]
> **Legend**: 🟢 Good | 🟡 Needs Improvement | 🔴 Poor
> Metrics align with Google's Core Web Vitals thresholds.

---

## 2. Resource Breakdown by Page Category

Analyzing page weight is critical. High page weights delay paints, inflate bandwidth costs, and slow down hydration.

| Category | Total Weight | HTML | JS | CSS | Images | Fonts | API | Requests |
|----------|--------------|------|----|-----|--------|-------|-----|----------|
| **Homepage** | **17,528 KB** | 956 KB | 15,550 KB | 502 KB | 439 KB | 74 KB | 4 KB | 596 |
| **About Us** | **15,742 KB** | 225 KB | 14,592 KB | 507 KB | 332 KB | 74 KB | 9 KB | 554 |
| **Accessible Travel** | **18,140 KB** | 275 KB | 14,656 KB | 545 KB | 2,579 KB | 74 KB | 9 KB | 535 |
| **Blogs List** | **15,885 KB** | 215 KB | 14,531 KB | 557 KB | 198 KB | 74 KB | 307 KB | 537 |
| **Blog Detail** | **28,813 KB** | 522 KB | 14,641 KB | 577 KB | 12,987 KB | 74 KB | 9 KB | 557 |
| **Contact Us** | **14,256 KB** | 184 KB | 12,800 KB | 660 KB | 230 KB | 74 KB | 305 KB | 508 |
| **Egypt Tours Category** | **15,748 KB** | 216 KB | 14,504 KB | 599 KB | 342 KB | 74 KB | 9 KB | 569 |
| **Egypt Travel Guide** | **13,443 KB** | 167 KB | 12,445 KB | 608 KB | 133 KB | 74 KB | 13 KB | 485 |
| **Events** | **15,346 KB** | 224 KB | 14,234 KB | 635 KB | 167 KB | 74 KB | 9 KB | 567 |
| **FAQs** | **13,917 KB** | 225 KB | 12,646 KB | 641 KB | 320 KB | 74 KB | 9 KB | 484 |
| **Rent Car** | **14,204 KB** | 143 KB | 13,231 KB | 653 KB | 117 KB | 49 KB | 9 KB | 492 |
| **Sustainability** | **16,743 KB** | 192 KB | 15,247 KB | 663 KB | 555 KB | 74 KB | 9 KB | 561 |
| **Terms and Conditions** | **13,638 KB** | 156 KB | 12,592 KB | 672 KB | 132 KB | 74 KB | 9 KB | 490 |
| **Privacy and Cookies** | **13,688 KB** | 154 KB | 12,596 KB | 683 KB | 170 KB | 74 KB | 9 KB | 488 |
| **Tour Detail** | **17,489 KB** | 853 KB | 15,352 KB | 810 KB | 72 KB | 74 KB | 326 KB | 622 |

---

## 3. Key Findings & Performance Anomalies

### ⚠️ Hydration Mismatches Detected
The following categories contain **Hydration Mismatches**:
- **Homepage**
- **About Us**
- **Accessible Travel**
- **Blogs List**
- **Blog Detail**
- **Contact Us**
- **Egypt Tours Category**
- **Egypt Travel Guide**
- **Events**
- **FAQs**
- **Rent Car**
- **Sustainability**
- **Terms and Conditions**
- **Privacy and Cookies**
- **Tour Detail**

**Impact**: A hydration mismatch causes the browser to discard the server-rendered DOM nodes and recreate them on the client. This leads to flashing layouts (worsening **CLS**), breaks dynamic functionality, and wastes CPU cycles on main-thread work, pushing **TBT** up.

### 🐘 Heavyweight Pages (Over 3 MB)
The following page categories transfer excessive payloads:
- **Homepage** (17,528 KB across 596 requests)
- **About Us** (15,742 KB across 554 requests)
- **Accessible Travel** (18,140 KB across 535 requests)
- **Blogs List** (15,885 KB across 537 requests)
- **Blog Detail** (28,813 KB across 557 requests)
- **Contact Us** (14,256 KB across 508 requests)
- **Egypt Tours Category** (15,748 KB across 569 requests)
- **Egypt Travel Guide** (13,443 KB across 485 requests)
- **Events** (15,346 KB across 567 requests)
- **FAQs** (13,917 KB across 484 requests)
- **Rent Car** (14,204 KB across 492 requests)
- **Sustainability** (16,743 KB across 561 requests)
- **Terms and Conditions** (13,638 KB across 490 requests)
- **Privacy and Cookies** (13,688 KB across 488 requests)
- **Tour Detail** (17,489 KB across 622 requests)

**Impact**: High payload weights slow down loading speeds (worsening **FCP** and **LCP**), particularly on mobile or slower connections.

### 📸 Visual Reference Map
Screenshots captured during audits are available under:
- **Homepage**: `screenshots/homepage.png`
- **About Us**: `screenshots/about.png`
- **Accessible Travel**: `screenshots/accessible_travel.png`
- **Blogs List**: `screenshots/blogs_list.png`
- **Blog Detail**: `screenshots/blog_detail.png`
- **Contact Us**: `screenshots/contact.png`
- **Egypt Tours Category**: `screenshots/egypt_tours_cat.png`
- **Egypt Travel Guide**: `screenshots/egypt_travel_guide.png`
- **Events**: `screenshots/events.png`
- **FAQs**: `screenshots/faqs.png`
- **Rent Car**: `screenshots/rent_car.png`
- **Sustainability**: `screenshots/sustainability.png`
- **Terms and Conditions**: `screenshots/terms.png`
- **Privacy and Cookies**: `screenshots/privacy.png`
- **Tour Detail**: `screenshots/tour_detail.png`

---

## 4. Priority Recommendation Action Plan

### 1. Fix Layout Shifts (CLS) on dynamic cards
Dynamic card grids (Tours, Blogs) cause severe layout shifts because their image heights are undefined before loading. Add CSS `aspect-ratio` or reserve spaces with explicit skeleton loaders.

### 2. Optimize Social & Badges Assets Weight
Many footers and card headers load large PNG icons (`tiktok.png`, `shorts.png`) which consume close to **800 KB** of transfer. Replace all custom PNG social media icons with **optimized inline SVGs** or lightweight SVG sprites.

### 3. Defer CSS chunk loading
Nuxt outputs 11+ blocking CSS link tags, delaying FCP and LCP. Configure Vite inside `nuxt.config.ts` to inline critical above-the-fold styling and load component-specific styles asynchronously.

### 4. Hydration Mismatch Resolution
Audit components with dynamic state (e.g. date formats, user profiles, or browser-specific fields) and wrap them with `<ClientOnly>` to prevent Vue from mismatching server-rendered elements.

---

*Report automatically generated using Playwright Performance Audit Runner.*