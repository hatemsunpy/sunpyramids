# ⚡ Playwright Web Speed Test Report — Sun Pyramids Tours

**Date**: 2026-05-17
**Environment**: Docker container connected to default Nuxt 3 stack
**Audit Engine**: Playwright Chromium (CDP + Resource Timings)

---

## 1. Executive Summary

This report analyses the web performance of **15 page categories** on the local Docker build of Sun Pyramids Tours. Measurements represent direct **lab metrics** with simulated fresh browser visits (no browser caching).

### 📈 Performance Scorecard

| Category | URL | TTFB | FCP | LCP | CLS | Hydration Mismatch | Total Weight | Requests |
|----------|-----|------|-----|-----|-----|--------------------|--------------|----------|
| **Homepage** | `/` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **About Us** | `/about-us` | 🔴 3353ms | 🔴 4096ms | 🔴 4637ms | 🟢 0.0062 | ❌ Yes | **4,921 KB** | 135 |
| **Accessible Travel** | `/accessible-travel` | 🔴 2753ms | 🔴 4242ms | 🔴 4280ms | 🟡 0.1657 | ❌ Yes | **7,071 KB** | 86 |
| **Blogs List** | `/blogs/all-blogs` | 🔴 3347ms | 🔴 4526ms | 🔴 4767ms | 🟢 0.0046 | ❌ Yes | **1,986 KB** | 103 |
| **Blog Detail** | `/blog/how-to-plan-egypt-trip` | 🔴 3772ms | 🔴 4027ms | 🔴 4027ms | 🟢 0 | ✅ No | **4 KB** | 1 |
| **Contact Us** | `/contact-us` | 🔴 3703ms | 🔴 4681ms | 🔴 4590ms | 🟢 0.0043 | ❌ Yes | **1,858 KB** | 91 |
| **Egypt Tours Category** | `/egypt-tours/one-day-tours` | 🔴 5199ms | 🔴 6489ms | 🔴 6489ms | 🟢 0.0019 | ❌ Yes | **3,257 KB** | 103 |
| **Egypt Travel Guide** | `/egypt-travel-guide` | 🔴 2837ms | 🔴 3720ms | 🟡 3720ms | 🟢 0.0014 | ❌ Yes | **1,656 KB** | 76 |
| **Events** | `/events` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **FAQs** | `/faqs` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **Rent Car** | `/rent-car` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **Sustainability** | `/sustainability` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **Terms and Conditions** | `/terms-and-conditions` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **Privacy and Cookies** | `/privacy-and-cookies` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |
| **Tour Detail** | `/tour/1` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |

> [!NOTE]
> **Legend**: 🟢 Good | 🟡 Needs Improvement | 🔴 Poor
> Metrics align with Google's Core Web Vitals thresholds.

---

## 2. Resource Breakdown by Page Category

Analyzing page weight is critical. High page weights delay paints, inflate bandwidth costs, and slow down hydration.

| Category | Total Weight | HTML | JS | CSS | Images | Fonts | API | Requests |
|----------|--------------|------|----|-----|--------|-------|-----|----------|
| **About Us** | **4,921 KB** | 361 KB | 1,224 KB | 8 KB | 3,255 KB | 74 KB | 0 KB | 135 |
| **Accessible Travel** | **7,071 KB** | 375 KB | 1,230 KB | 10 KB | 5,383 KB | 74 KB | 0 KB | 86 |
| **Blogs List** | **1,986 KB** | 328 KB | 1,225 KB | 9 KB | 350 KB | 74 KB | 0 KB | 103 |
| **Blog Detail** | **4 KB** | 4 KB | 0 KB | 0 KB | 0 KB | 0 KB | 0 KB | 1 |
| **Contact Us** | **1,858 KB** | 286 KB | 1,295 KB | 8 KB | 192 KB | 74 KB | 3 KB | 91 |
| **Egypt Tours Category** | **3,257 KB** | 334 KB | 1,398 KB | 9 KB | 1,442 KB | 74 KB | 0 KB | 103 |
| **Egypt Travel Guide** | **1,656 KB** | 270 KB | 1,209 KB | 8 KB | 96 KB | 74 KB | 0 KB | 76 |

---

## 3. Key Findings & Performance Anomalies

### ⚠️ Hydration Mismatches Detected
The following categories contain **Hydration Mismatches**:
- **About Us**
- **Accessible Travel**
- **Blogs List**
- **Contact Us**
- **Egypt Tours Category**
- **Egypt Travel Guide**

**Impact**: A hydration mismatch causes the browser to discard the server-rendered DOM nodes and recreate them on the client. This leads to flashing layouts (worsening **CLS**), breaks dynamic functionality, and wastes CPU cycles on main-thread work, pushing **TBT** up.

### 🐘 Heavyweight Pages (Over 3 MB)
The following page categories transfer excessive payloads:
- **About Us** (4,921 KB across 135 requests)
- **Accessible Travel** (7,071 KB across 86 requests)
- **Egypt Tours Category** (3,257 KB across 103 requests)

**Impact**: High payload weights slow down loading speeds (worsening **FCP** and **LCP**), particularly on mobile or slower connections.

### 📸 Visual Reference Map
Screenshots captured during audits are available under:
- **About Us**: `screenshots/about.png`
- **Accessible Travel**: `screenshots/accessible_travel.png`
- **Blogs List**: `screenshots/blogs_list.png`
- **Blog Detail**: `screenshots/blog_detail.png`
- **Contact Us**: `screenshots/contact.png`
- **Egypt Tours Category**: `screenshots/egypt_tours_cat.png`
- **Egypt Travel Guide**: `screenshots/egypt_travel_guide.png`

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