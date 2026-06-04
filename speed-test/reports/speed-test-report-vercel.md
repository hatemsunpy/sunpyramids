# ⚡ Playwright Web Speed Test Report — Sun Pyramids Tours (Live Vercel)

**Date**: 2026-05-25
**Environment**: Vercel Production Edge CDN (https://sunpyramids.vercel.app)
**Audit Engine**: Playwright Chromium (CDP + Resource Timings)

---

## 1. Executive Summary

This report analyses the web performance of **15 page categories** on the live Vercel production deployment of Sun Pyramids Tours. Measurements represent direct **lab metrics** with simulated fresh browser visits (no browser caching).

### 📈 Performance Scorecard

| Category | URL | TTFB | FCP | LCP | CLS | Hydration Mismatch | Total Weight | Requests |
|----------|-----|------|-----|-----|-----|--------------------|--------------|----------|
| **Homepage** | `/` | 🟢 66ms | 🟡 3698ms | 🟡 3644ms | 🟢 0 | ✅ No | **8,219 KB** | 193 |
| **About Us** | `/about-us` | 🟢 69ms | 🟡 2920ms | 🟡 3036ms | 🟢 0 | ✅ No | **4,652 KB** | 124 |
| **Accessible Travel** | `/accessible-travel` | 🟢 65ms | 🟡 3715ms | 🟡 3826ms | 🟢 0 | ✅ No | **2,754 KB** | 101 |
| **Blogs List** | `/blogs/all-blogs` | 🟢 61ms | 🟡 2913ms | 🟢 2717ms | 🟢 0 | ✅ No | **3,013 KB** | 116 |
| **Blog Detail** | `/blog/why-choose-egypt-desert-tours` | 🟢 62ms | 🟡 3371ms | 🟡 3898ms | 🟢 0 | ✅ No | **15,506 KB** | 108 |
| **Contact Us** | `/contact-us` | 🟢 61ms | 🟡 2917ms | 🟡 2839ms | 🟢 0 | ✅ No | **2,558 KB** | 116 |
| **Egypt Tours Category** | `/egypt-tours/one-day-tours` | 🟢 68ms | 🟡 3513ms | 🟡 3363ms | 🟢 0 | ✅ No | **2,999 KB** | 112 |
| **Egypt Travel Guide** | `/egypt-travel-guide` | 🟢 68ms | 🟡 2327ms | 🟢 2275ms | 🟢 0 | ✅ No | **1,685 KB** | 84 |
| **Events** | `/events` | 🟢 79ms | 🟡 3003ms | 🟡 2844ms | 🟢 0 | ✅ No | **8,192 KB** | 93 |
| **FAQs** | `/faqs` | 🟢 63ms | 🟡 2802ms | 🟡 2802ms | 🟢 0 | ✅ No | **1,700 KB** | 85 |
| **Rent Car** | `/rent-car` | 🟢 72ms | 🟡 2888ms | 🟡 2888ms | 🟢 0 | ✅ No | **2,119 KB** | 92 |
| **Sustainability** | `/sustainability` | 🟢 62ms | 🟡 2893ms | 🟡 2893ms | 🟢 0 | ✅ No | **3,416 KB** | 100 |
| **Terms and Conditions** | `/terms-and-conditions` | 🟢 64ms | 🟡 2812ms | 🟡 3152ms | 🟢 0 | ✅ No | **1,668 KB** | 83 |
| **Privacy and Cookies** | `/privacy-and-cookies` | 🟢 61ms | 🟡 2482ms | 🟡 2856ms | 🟢 0 | ✅ No | **1,582 KB** | 82 |
| **Tour Detail** | `/tour/pyramids-nile-cruise-by-train` | 🟢 72ms | 🟡 3062ms | 🟡 3542ms | 🟢 0 | ✅ No | **5,381 KB** | 155 |

> [!NOTE]
> **Legend**: 🟢 Good (< 1.8s FCP, < 2.5s LCP, < 0.1 CLS) | 🟡 Needs Improvement | 🔴 Poor
> Metrics align with Google Core Web Vitals thresholds.

---

## 2. Resource Breakdown by Page Category

| Category | Total Weight | HTML | JS | CSS | Images | Fonts | API | Requests |
|----------|--------------|------|----|-----|--------|-------|-----|----------|
| **Homepage** | **8,219 KB** | 1,350 KB | 1,185 KB | 64 KB | 5,301 KB | 74 KB | 243 KB | 193 |
| **About Us** | **4,652 KB** | 891 KB | 787 KB | 37 KB | 2,756 KB | 74 KB | 105 KB | 124 |
| **Accessible Travel** | **2,754 KB** | 844 KB | 801 KB | 40 KB | 872 KB | 74 KB | 121 KB | 101 |
| **Blogs List** | **3,013 KB** | 667 KB | 774 KB | 38 KB | 1,051 KB | 74 KB | 407 KB | 116 |
| **Blog Detail** | **15,506 KB** | 809 KB | 784 KB | 40 KB | **13,526 KB** | 74 KB | 270 KB | 108 |
| **Contact Us** | **2,558 KB** | 965 KB | 849 KB | 118 KB | 117 KB | 74 KB | 434 KB | 116 |
| **Egypt Tours Category** | **2,999 KB** | 747 KB | 766 KB | 39 KB | 1,253 KB | 74 KB | 118 KB | 112 |
| **Egypt Travel Guide** | **1,685 KB** | 539 KB | 733 KB | 38 KB | 240 KB | 74 KB | 60 KB | 84 |
| **Events** | **8,192 KB** | 758 KB | 702 KB | 40 KB | 6,539 KB | 74 KB | 77 KB | 93 |
| **FAQs** | **1,700 KB** | 694 KB | 759 KB | 37 KB | 61 KB | 74 KB | 73 KB | 85 |
| **Rent Car** | **2,119 KB** | 715 KB | 1,094 KB | 61 KB | 48 KB | 74 KB | 126 KB | 92 |
| **Sustainability** | **3,416 KB** | 819 KB | 841 KB | 39 KB | 1,538 KB | 74 KB | 102 KB | 100 |
| **Terms and Conditions** | **1,668 KB** | 619 KB | 757 KB | 37 KB | 84 KB | 74 KB | 95 KB | 83 |
| **Privacy and Cookies** | **1,582 KB** | 510 KB | 757 KB | 37 KB | 109 KB | 74 KB | 93 KB | 82 |
| **Tour Detail** | **5,381 KB** | 841 KB | 1,144 KB | 151 KB | 2,428 KB | 74 KB | 736 KB | 155 |

---

## 3. Key Findings & Performance Anomalies

### 🟢 TTFB Is Excellent Across the Board
All pages show TTFB between **61–79ms**. This confirms Vercel Edge CDN is doing its job. HTML is cached and served quickly. The performance bottleneck is **not** the server — it is client-side rendering and asset weight.

### 🟡 FCP / LCP Are the Main Bottlenecks
FCP ranges from **2.3s** (Egypt Travel Guide) to **3.7s** (Homepage, Accessible Travel). LCP ranges from **2.3s** to **3.9s** (Blog Detail). No page passes the < 1.8s FCP threshold. This is primarily driven by:
- Heavy image payloads
- Blocking JavaScript execution
- Large HTML documents

### 🐘 Heavyweight Pages (Over 3 MB)
The following pages transfer excessive payloads:
- **Homepage** (8,219 KB — images: 5,301 KB)
- **About Us** (4,652 KB — images: 2,756 KB)
- **Blog Detail** (15,506 KB — images: **13,526 KB**)
- **Events** (8,192 KB — images: 6,539 KB)
- **Sustainability** (3,416 KB — images: 1,538 KB)
- **Tour Detail** (5,381 KB — images: 2,428 KB)

**Impact**: High payload weights delay paints and inflate bandwidth, particularly on mobile or slower connections.

### 🟢 CLS Is Fixed
All audited pages report **CLS = 0**. The severe layout shift issues from the previous audit (e.g., homepage CLS 0.65) appear to be resolved. This is a major improvement.

### ✅ No Hydration Mismatches
Zero hydration mismatches were detected across all 15 pages. Another significant improvement from the previous audit.

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

### 1. Optimize Blog Detail Images (Critical)
Blog Detail pages transfer **15.5 MB**, with images alone accounting for **13.5 MB**. These are almost certainly full-resolution photos served without compression or responsive sizing. Ensure `@nuxt/image` is applied to **all** blog content images with WebP/AVIF conversion and breakpoint-based srcsets.

### 2. Optimize Homepage & Events Hero Images (Critical)
Homepage (5.3 MB images) and Events (6.5 MB images) are the next heaviest. Audit hero banners, carousel images, and gallery thumbnails. Compress to quality 80, serve WebP/AVIF, and ensure `sizes` attribute matches the rendered width.

### 3. Reduce Blocking JavaScript
Every page loads **700–1,100 KB of JavaScript**. While not catastrophic, it still delays interactivity. Audit the bundle with Nuxt DevTools:
- Lazy-load below-the-fold components (tour cards, maps, accordions)
- Code-split heavy libraries (Swiper, Lottie, Google Maps)
- Defer non-critical third-party scripts (analytics, pixels)

### 4. Reduce HTML Payload
Homepage HTML is **1,350 KB**. This is unusually large for an HTML document and suggests the server is embedding massive JSON data or inline images. Audit the SSR output for embedded base64 images or bloated API responses inlined in the HTML.

### 5. Implement Resource Hints for API Calls
Tour Detail loads **736 KB of API responses**. Add `preconnect` hints to the API origin (`sunpyramidtours.com`) and consider SWR/stale-while-revalidate caching for repeated tour data.

### 6. Keep Monitoring CLS & Hydration
Both metrics are now clean (0 CLS, no mismatches). Ensure any future component changes preserve this by:
- Adding explicit `width`/`height` or `aspect-ratio` to all images
- Avoiding client-only state inside server-rendered markup

---

*Report automatically generated using Playwright Performance Audit Runner.*
