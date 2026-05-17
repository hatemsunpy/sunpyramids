# ⚡ Playwright Web Speed Test Report — Sun Pyramids Tours

**Date**: 2026-05-17
**Environment**: Vercel Production Edge CDN (https://sunpyramids.vercel.app)
**Audit Engine**: Playwright Chromium (CDP + Resource Timings)

---

## 1. Executive Summary

This report analyses the web performance of **15 page categories** on the local Docker build of Sun Pyramids Tours. Measurements represent direct **lab metrics** with simulated fresh browser visits (no browser caching).

### 📈 Performance Scorecard

| Category | URL | TTFB | FCP | LCP | CLS | Hydration Mismatch | Total Weight | Requests |
|----------|-----|------|-----|-----|-----|--------------------|--------------|----------|
| **Homepage** | `/` | 🟡 1245ms | 🟡 2439ms | 🟡 3811ms | 🔴 0.6502 | ✅ No | **8,306 KB** | 225 |
| **About Us** | `/about-us` | 🟡 1103ms | 🔴 3388ms | 🔴 4518ms | 🟢 0.0862 | ❌ Yes | **6,501 KB** | 213 |
| **Accessible Travel** | `/accessible-travel` | 🟡 1115ms | 🟢 1711ms | 🟡 2645ms | 🟡 0.1457 | ✅ No | **8,693 KB** | 174 |
| **Blogs List** | `/blogs/all-blogs` | 🟡 1076ms | 🟢 1587ms | 🟢 2089ms | 🟢 0.0763 | ❌ Yes | **3,635 KB** | 176 |
| **Blog Detail** | `/blog/best-easter-destinations` | 🔴 2506ms | 🔴 3370ms | 🔴 5324ms | 🟢 0.0011 | ✅ No | **20,396 KB** | 130 |
| **Contact Us** | `/contact-us` | 🟡 1265ms | 🟡 2269ms | 🟢 2465ms | 🟢 0.0021 | ✅ No | **3,593 KB** | 184 |
| **Egypt Tours Category** | `/egypt-tours/one-day-tours` | 🟡 975ms | 🟢 1776ms | 🟢 2214ms | 🟢 0.0034 | ❌ Yes | **4,340 KB** | 182 |
| **Egypt Travel Guide** | `/egypt-travel-guide` | 🟢 799ms | 🟢 1765ms | 🟢 2009ms | 🟢 0.0006 | ✅ No | **3,199 KB** | 169 |
| **Events** | `/events` | 🟢 792ms | 🟢 1483ms | 🟡 2855ms | 🟢 0.0026 | ❌ Yes | **10,277 KB** | 170 |
| **FAQs** | `/faqs` | 🟡 987ms | 🟢 1798ms | 🔴 7200ms | 🟢 0.0008 | ✅ No | **2,622 KB** | 100 |
| **Rent Car** | `/rent-car` | 🟡 1121ms | 🟡 1883ms | 🟡 2695ms | 🟢 0.0265 | ✅ No | **2,992 KB** | 161 |
| **Sustainability** | `/sustainability` | 🟡 909ms | 🟡 2613ms | 🔴 4598ms | 🟡 0.1648 | ✅ No | **4,874 KB** | 170 |
| **Terms and Conditions** | `/terms-and-conditions` | 🟢 765ms | 🟡 1856ms | 🟢 2015ms | 🟢 0.0014 | ❌ Yes | **3,056 KB** | 163 |
| **Privacy and Cookies** | `/privacy-and-cookies` | 🟡 805ms | 🟢 1664ms | 🟢 1804ms | 🟢 0.0009 | ❌ Yes | **3,071 KB** | 162 |
| **Tour Detail** | `/tour/pyramids-nile-cruise-by-train` | 🟡 1777ms | 🟡 2412ms | 🟡 3759ms | 🟢 0.0084 | ❌ Yes | **5,728 KB** | 231 |

> [!NOTE]
> **Legend**: 🟢 Good | 🟡 Needs Improvement | 🔴 Poor
> Metrics align with Google's Core Web Vitals thresholds.

---

## 2. Resource Breakdown by Page Category

Analyzing page weight is critical. High page weights delay paints, inflate bandwidth costs, and slow down hydration.

| Category | Total Weight | HTML | JS | CSS | Images | Fonts | API | Requests |
|----------|--------------|------|----|-----|--------|-------|-----|----------|
| **Homepage** | **8,306 KB** | 966 KB | 2,368 KB | 77 KB | 4,773 KB | 118 KB | 0 KB | 225 |
| **About Us** | **6,501 KB** | 359 KB | 2,345 KB | 77 KB | 3,599 KB | 118 KB | 0 KB | 213 |
| **Accessible Travel** | **8,693 KB** | 398 KB | 2,368 KB | 79 KB | 5,727 KB | 118 KB | 0 KB | 174 |
| **Blogs List** | **3,635 KB** | 324 KB | 2,335 KB | 77 KB | 479 KB | 118 KB | 298 KB | 176 |
| **Blog Detail** | **20,396 KB** | 716 KB | 1,888 KB | 68 KB | 17,604 KB | 118 KB | 0 KB | 130 |
| **Contact Us** | **3,593 KB** | 307 KB | 2,408 KB | 158 KB | 304 KB | 118 KB | 296 KB | 184 |
| **Egypt Tours Category** | **4,340 KB** | 332 KB | 2,336 KB | 77 KB | 1,474 KB | 118 KB | 0 KB | 182 |
| **Egypt Travel Guide** | **3,199 KB** | 266 KB | 2,336 KB | 78 KB | 395 KB | 118 KB | 3 KB | 169 |
| **Events** | **10,277 KB** | 336 KB | 2,356 KB | 77 KB | 7,387 KB | 118 KB | 0 KB | 170 |
| **FAQs** | **2,622 KB** | 339 KB | 1,894 KB | 59 KB | 253 KB | 74 KB | 0 KB | 100 |
| **Rent Car** | **2,992 KB** | 279 KB | 2,336 KB | 77 KB | 203 KB | 94 KB | 0 KB | 161 |
| **Sustainability** | **4,874 KB** | 312 KB | 2,406 KB | 78 KB | 1,957 KB | 118 KB | 0 KB | 170 |
| **Terms and Conditions** | **3,056 KB** | 278 KB | 2,341 KB | 77 KB | 239 KB | 118 KB | 0 KB | 163 |
| **Privacy and Cookies** | **3,071 KB** | 274 KB | 2,334 KB | 77 KB | 264 KB | 118 KB | 0 KB | 162 |
| **Tour Detail** | **5,728 KB** | 853 KB | 2,428 KB | 167 KB | 1,722 KB | 203 KB | 348 KB | 231 |

---

## 3. Key Findings & Performance Anomalies

### ⚠️ Hydration Mismatches Detected
The following categories contain **Hydration Mismatches**:
- **About Us**
- **Blogs List**
- **Egypt Tours Category**
- **Events**
- **Terms and Conditions**
- **Privacy and Cookies**
- **Tour Detail**

**Impact**: A hydration mismatch causes the browser to discard the server-rendered DOM nodes and recreate them on the client. This leads to flashing layouts (worsening **CLS**), breaks dynamic functionality, and wastes CPU cycles on main-thread work, pushing **TBT** up.

### 🐘 Heavyweight Pages (Over 3 MB)
The following page categories transfer excessive payloads:
- **Homepage** (8,306 KB across 225 requests)
- **About Us** (6,501 KB across 213 requests)
- **Accessible Travel** (8,693 KB across 174 requests)
- **Blogs List** (3,635 KB across 176 requests)
- **Blog Detail** (20,396 KB across 130 requests)
- **Contact Us** (3,593 KB across 184 requests)
- **Egypt Tours Category** (4,340 KB across 182 requests)
- **Egypt Travel Guide** (3,199 KB across 169 requests)
- **Events** (10,277 KB across 170 requests)
- **Sustainability** (4,874 KB across 170 requests)
- **Terms and Conditions** (3,056 KB across 163 requests)
- **Privacy and Cookies** (3,071 KB across 162 requests)
- **Tour Detail** (5,728 KB across 231 requests)

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