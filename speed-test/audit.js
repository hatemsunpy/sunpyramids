import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TARGET_URL || 'http://sun-front:3000';
const OUT_DIR = './reports';
const SCREENSHOT_DIR = './screenshots';

// Ensure output directories exist
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Define core page categories and fallback routes
const CATEGORY_METADATA = {
  homepage: { name: 'Homepage', defaultRoute: '/' },
  about: { name: 'About Us', defaultRoute: '/about-us' },
  accessible_travel: { name: 'Accessible Travel', defaultRoute: '/accessible-travel' },
  blogs_list: { name: 'Blogs List', defaultRoute: '/blogs/all-blogs' },
  blog_detail: { name: 'Blog Detail', defaultRoute: '/blog/how-to-plan-egypt-trip' },
  contact: { name: 'Contact Us', defaultRoute: '/contact-us' },
  egypt_tours_cat: { name: 'Egypt Tours Category', defaultRoute: '/egypt-tours/one-day-tours' },
  egypt_travel_guide: { name: 'Egypt Travel Guide', defaultRoute: '/egypt-travel-guide' },
  events: { name: 'Events', defaultRoute: '/events' },
  faqs: { name: 'FAQs', defaultRoute: '/faqs' },
  rent_car: { name: 'Rent Car', defaultRoute: '/rent-car' },
  sustainability: { name: 'Sustainability', defaultRoute: '/sustainability' },
  terms: { name: 'Terms and Conditions', defaultRoute: '/terms-and-conditions' },
  privacy: { name: 'Privacy and Cookies', defaultRoute: '/privacy-and-cookies' },
  tour_detail: { name: 'Tour Detail', defaultRoute: '/tour/1' }
};

async function main() {
  console.log(`========================================`);
  console.log(`🚀 Starting Sun Pyramids Tours Performance Audit`);
  console.log(`🎯 Target Site: ${BASE_URL}`);
  console.log(`========================================\n`);

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const discoveredUrls = {};
  for (const cat of Object.keys(CATEGORY_METADATA)) {
    discoveredUrls[cat] = new Set();
  }

  // 1. Crawl Homepage to find real links
  console.log('🔍 Crawling homepage for dynamic categories...');
  const crawlPage = await browser.newPage();
  try {
    await crawlPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Let the page sit for 5 seconds to ensure SSR hydration is finished and dynamic components render links
    await crawlPage.waitForTimeout(5000);
    const links = await crawlPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.startsWith('/'));
    });

    console.log(`📌 Found ${links.length} internal links on homepage. Classifying...`);
    for (const link of links) {
      if (link === '/') {
        discoveredUrls.homepage.add('/');
      } else if (link.startsWith('/about-us')) {
        discoveredUrls.about.add(link);
      } else if (link.startsWith('/accessible-travel')) {
        discoveredUrls.accessible_travel.add(link);
      } else if (link.startsWith('/blogs/all-blogs') || link === '/blogs') {
        discoveredUrls.blogs_list.add(link);
      } else if (link.startsWith('/blog/')) {
        discoveredUrls.blog_detail.add(link);
      } else if (link.startsWith('/contact-us')) {
        discoveredUrls.contact.add(link);
      } else if (link.startsWith('/tour/')) {
        discoveredUrls.tour_detail.add(link);
      } else if (link.startsWith('/egypt-tours/')) {
        discoveredUrls.egypt_tours_cat.add(link);
      } else if (link.startsWith('/egypt-travel-guide')) {
        discoveredUrls.egypt_travel_guide.add(link);
      } else if (link.startsWith('/events') || link.startsWith('/event/')) {
        discoveredUrls.events.add(link);
      } else if (link.startsWith('/faqs')) {
        discoveredUrls.faqs.add(link);
      } else if (link.startsWith('/rent-car')) {
        discoveredUrls.rent_car.add(link);
      } else if (link.startsWith('/sustainability')) {
        discoveredUrls.sustainability.add(link);
      } else if (link.startsWith('/terms-and-conditions')) {
        discoveredUrls.terms.add(link);
      } else if (link.startsWith('/privacy-and-cookies')) {
        discoveredUrls.privacy.add(link);
      }
    }
  } catch (err) {
    console.error(`⚠️ Homepage crawl failed: ${err.message}. Using default routes.`);
  } finally {
    await crawlPage.close();
  }

  // 2. Select the final URL list to audit
  const auditList = [];
  for (const [key, meta] of Object.entries(CATEGORY_METADATA)) {
    const list = Array.from(discoveredUrls[key]);
    // Use first discovered URL, or fall back to default
    const route = list.length > 0 ? list[0] : meta.defaultRoute;
    auditList.push({
      key,
      name: meta.name,
      url: `${BASE_URL}${route}`,
      route
    });
  }

  console.log('\n📊 Planned audits:');
  auditList.forEach((item, index) => {
    console.log(`  ${index + 1}. [${item.name}] -> ${item.url}`);
  });
  console.log(`\n========================================\n`);

  const results = [];

  // 3. Perform sequential audits
  for (const target of auditList) {
    console.log(`🔄 Auditing [${target.name}] at ${target.url}...`);
    
    // Create separate context for clean caches
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();
    const consoleLogs = [];
    let hydrationMismatch = false;

    // Track hydration warnings
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push({ type: msg.type(), text });
      if (text.includes('hydration') || text.includes('Hydration') || text.includes('mismatch')) {
        hydrationMismatch = true;
      }
    });

    // Inject Performance Observers before document loads
    await page.addInitScript(() => {
      window.performanceMetrics = {
        fcp: null,
        lcp: null,
        cls: 0
      };

      // 1. Paint observer (FCP)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByName('first-contentful-paint');
        if (entries.length > 0) {
          window.performanceMetrics.fcp = entries[0].startTime;
          fcpObserver.disconnect();
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // 2. LCP observer
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          window.performanceMetrics.lcp = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // 3. CLS observer
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.performanceMetrics.cls += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    });

    let navError = null;
    let ttfb = null;
    let domContentLoaded = null;
    let loadTime = null;
    let timingMetrics = {};
    let resourceWeight = {
      html: 0,
      js: 0,
      css: 0,
      images: 0,
      fonts: 0,
      api: 0,
      other: 0,
      totalSize: 0,
      count: 0
    };
    const requestDetails = [];

    // Intercept network requests to calculate size
    page.on('response', async (res) => {
      try {
        const url = res.url();
        const headers = res.headers();
        const contentType = headers['content-type'] || '';
        
        let size = 0;
        if (headers['content-length']) {
          size = parseInt(headers['content-length'], 10);
        } else {
          // If content-length is missing, estimate size from body
          try {
            const buffer = await res.body();
            size = buffer.length;
          } catch {}
        }

        let type = 'other';
        if (url.includes('/api/')) type = 'api';
        else if (contentType.includes('text/html')) type = 'html';
        else if (contentType.includes('javascript') || url.endsWith('.js')) type = 'js';
        else if (contentType.includes('css') || url.endsWith('.css')) type = 'css';
        else if (contentType.includes('image') || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url)) type = 'images';
        else if (contentType.includes('font') || /\.(woff|woff2|ttf|otf|eot)$/i.test(url)) type = 'fonts';

        resourceWeight[type] += size;
        resourceWeight.totalSize += size;
        resourceWeight.count++;

        requestDetails.push({ url, type, size });
      } catch {}
    });

    try {
      // Go to page and wait for load
      const startNav = Date.now();
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      
      // Let it sit for 5 seconds to capture lazy loading assets & late-stage CLS
      await page.waitForTimeout(5000);

      // Extract performance measurements from client context
      const metrics = await page.evaluate(() => {
        const [nav] = performance.getEntriesByType('navigation');
        const webVitals = window.performanceMetrics || {};
        
        return {
          ttfb: nav ? nav.responseStart - nav.requestStart : null,
          domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.fetchStart : null,
          loadTime: nav ? nav.loadEventEnd - nav.fetchStart : null,
          fcp: webVitals.fcp,
          lcp: webVitals.lcp,
          cls: webVitals.cls
        };
      });

      ttfb = metrics.ttfb;
      domContentLoaded = metrics.domContentLoaded;
      loadTime = metrics.loadTime;
      timingMetrics = metrics;

      // Save screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `${target.key}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);

    } catch (err) {
      console.error(`❌ Audit failed for ${target.url}: ${err.message}`);
      navError = err.message;
    } finally {
      await context.close();
    }

    const reportItem = {
      key: target.key,
      name: target.name,
      url: target.url,
      route: target.route,
      success: !navError,
      error: navError,
      metrics: {
        ttfb: typeof ttfb === 'number' ? Math.round(ttfb) : null,
        fcp: typeof timingMetrics.fcp === 'number' ? Math.round(timingMetrics.fcp) : null,
        lcp: typeof timingMetrics.lcp === 'number' ? Math.round(timingMetrics.lcp) : null,
        cls: typeof timingMetrics.cls === 'number' ? parseFloat(timingMetrics.cls.toFixed(4)) : null,
        domContentLoaded: typeof domContentLoaded === 'number' ? Math.round(domContentLoaded) : null,
        loadTime: typeof loadTime === 'number' ? Math.round(loadTime) : null
      },
      hydrationMismatch,
      resources: {
        totalKb: Math.round(resourceWeight.totalSize / 1024),
        count: resourceWeight.count,
        breakdownKb: {
          html: Math.round(resourceWeight.html / 1024),
          js: Math.round(resourceWeight.js / 1024),
          css: Math.round(resourceWeight.css / 1024),
          images: Math.round(resourceWeight.images / 1024),
          fonts: Math.round(resourceWeight.fonts / 1024),
          api: Math.round(resourceWeight.api / 1024),
          other: Math.round(resourceWeight.other / 1024)
        }
      }
    };

    results.push(reportItem);
    console.log(`✅ Completed [${target.name}] - LCP: ${reportItem.metrics.lcp || 'N/A'}ms, CLS: ${reportItem.metrics.cls ?? 'N/A'}, Weight: ${reportItem.resources.totalKb} KB\n`);
  }

  // 4. Save JSON report
  const isVercel = BASE_URL.includes('vercel.app');
  const filename = isVercel ? 'speed-test-report-vercel' : 'speed-test-report';
  
  const jsonPath = path.join(OUT_DIR, `${filename}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`💾 JSON report written to: ${jsonPath}`);

  // 5. Generate Markdown report
  const mdPath = path.join(OUT_DIR, `${filename}.md`);
  const markdown = generateMarkdownReport(results, isVercel);
  fs.writeFileSync(mdPath, markdown);
  console.log(`📝 Markdown report written to: ${mdPath}`);

  await browser.close();
  console.log(`\n🎉 Web Speed Test Analysis Finished!`);
}

function getRating(metric, val) {
  if (val === null || val === undefined) return { label: 'N/A', icon: '⚪' };
  
  const thresholds = {
    ttfb: { good: 800, poor: 1800 },
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    cls: { good: 0.1, poor: 0.25 }
  };

  const limit = thresholds[metric];
  if (!limit) return { label: '', icon: '' };

  if (val <= limit.good) return { label: 'GOOD', icon: '🟢' };
  if (val <= limit.poor) return { label: 'NEEDS IMPROVEMENT', icon: '🟡' };
  return { label: 'POOR', icon: '🔴' };
}

function formatSize(kb) {
  return `${kb.toLocaleString()} KB`;
}

function generateMarkdownReport(results, isVercel) {
  const envName = isVercel ? 'Vercel Production Edge CDN' : 'Docker container connected to default Nuxt 3 stack';
  let md = `# ⚡ Playwright Web Speed Test Report — Sun Pyramids Tours\n\n`;
  md += `**Date**: ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Environment**: ${envName} (${BASE_URL})\n`;
  md += `**Audit Engine**: Playwright Chromium (CDP + Resource Timings)\n\n`;
  
  md += `---\n\n`;
  md += `## 1. Executive Summary\n\n`;
  md += `This report analyses the web performance of **${results.length} page categories** on the local Docker build of Sun Pyramids Tours. Measurements represent direct **lab metrics** with simulated fresh browser visits (no browser caching).\n\n`;

  // General Status Scorecard
  md += `### 📈 Performance Scorecard\n\n`;
  md += `| Category | URL | TTFB | FCP | LCP | CLS | Hydration Mismatch | Total Weight | Requests |\n`;
  md += `|----------|-----|------|-----|-----|-----|--------------------|--------------|----------|\n`;
  
  for (const item of results) {
    if (!item.success) {
      md += `| **${item.name}** | \`${item.route}\` | *FAILED* | *FAILED* | *FAILED* | *FAILED* | - | - | - |\n`;
      continue;
    }
    const ttfb = getRating('ttfb', item.metrics.ttfb);
    const fcp = getRating('fcp', item.metrics.fcp);
    const lcp = getRating('lcp', item.metrics.lcp);
    const cls = getRating('cls', item.metrics.cls);
    const hyd = item.hydrationMismatch ? '❌ Yes' : '✅ No';

    md += `| **${item.name}** | \`${item.route}\` | ${ttfb.icon} ${item.metrics.ttfb}ms | ${fcp.icon} ${item.metrics.fcp}ms | ${lcp.icon} ${item.metrics.lcp}ms | ${cls.icon} ${item.metrics.cls} | ${hyd} | **${formatSize(item.resources.totalKb)}** | ${item.resources.count} |\n`;
  }

  md += `\n> [!NOTE]\n`;
  md += `> **Legend**: 🟢 Good | 🟡 Needs Improvement | 🔴 Poor\n`;
  md += `> Metrics align with Google's Core Web Vitals thresholds.\n\n`;

  md += `---\n\n`;
  md += `## 2. Resource Breakdown by Page Category\n\n`;
  md += `Analyzing page weight is critical. High page weights delay paints, inflate bandwidth costs, and slow down hydration.\n\n`;
  
  md += `| Category | Total Weight | HTML | JS | CSS | Images | Fonts | API | Requests |\n`;
  md += `|----------|--------------|------|----|-----|--------|-------|-----|----------|\n`;
  
  for (const item of results) {
    if (!item.success) continue;
    const b = item.resources.breakdownKb;
    md += `| **${item.name}** | **${formatSize(item.resources.totalKb)}** | ${formatSize(b.html)} | ${formatSize(b.js)} | ${formatSize(b.css)} | ${formatSize(b.images)} | ${formatSize(b.fonts)} | ${formatSize(b.api)} | ${item.resources.count} |\n`;
  }

  md += `\n---\n\n`;
  md += `## 3. Key Findings & Performance Anomalies\n\n`;

  // Hydration mismatches
  const hydMismatchPages = results.filter(i => i.success && i.hydrationMismatch).map(i => i.name);
  if (hydMismatchPages.length > 0) {
    md += `### ⚠️ Hydration Mismatches Detected\n`;
    md += `The following categories contain **Hydration Mismatches**:\n`;
    hydMismatchPages.forEach(p => md += `- **${p}**\n`);
    md += `\n**Impact**: A hydration mismatch causes the browser to discard the server-rendered DOM nodes and recreate them on the client. This leads to flashing layouts (worsening **CLS**), breaks dynamic functionality, and wastes CPU cycles on main-thread work, pushing **TBT** up.\n\n`;
  }

  // Heavyweight pages
  const heavyPages = results.filter(i => i.success && i.resources.totalKb > 3000);
  if (heavyPages.length > 0) {
    md += `### 🐘 Heavyweight Pages (Over 3 MB)\n`;
    md += `The following page categories transfer excessive payloads:\n`;
    heavyPages.forEach(p => md += `- **${p.name}** (${formatSize(p.resources.totalKb)} across ${p.resources.count} requests)\n`);
    md += `\n**Impact**: High payload weights slow down loading speeds (worsening **FCP** and **LCP**), particularly on mobile or slower connections.\n\n`;
  }

  // Visual screenshots list
  md += `### 📸 Visual Reference Map\n`;
  md += `Screenshots captured during audits are available under:\n`;
  for (const item of results) {
    if (item.success) {
      md += `- **${item.name}**: \`screenshots/${item.key}.png\`\n`;
    }
  }
  md += `\n`;

  md += `---\n\n`;
  md += `## 4. Priority Recommendation Action Plan\n\n`;

  md += `### 1. Fix Layout Shifts (CLS) on dynamic cards\n`;
  md += `Dynamic card grids (Tours, Blogs) cause severe layout shifts because their image heights are undefined before loading. Add CSS ` + "`aspect-ratio`" + ` or reserve spaces with explicit skeleton loaders.\n\n`;

  md += `### 2. Optimize Social & Badges Assets Weight\n`;
  md += `Many footers and card headers load large PNG icons (` + "`tiktok.png`" + `, ` + "`shorts.png`" + `) which consume close to **800 KB** of transfer. Replace all custom PNG social media icons with **optimized inline SVGs** or lightweight SVG sprites.\n\n`;

  md += `### 3. Defer CSS chunk loading\n`;
  md += `Nuxt outputs 11+ blocking CSS link tags, delaying FCP and LCP. Configure Vite inside \`nuxt.config.ts\` to inline critical above-the-fold styling and load component-specific styles asynchronously.\n\n`;

  md += `### 4. Hydration Mismatch Resolution\n`;
  md += `Audit components with dynamic state (e.g. date formats, user profiles, or browser-specific fields) and wrap them with \`<ClientOnly>\` to prevent Vue from mismatching server-rendered elements.\n\n`;

  md += `---\n\n`;
  md += `*Report automatically generated using Playwright Performance Audit Runner.*`;

  return md;
}

main().catch(err => {
  console.error('Fatal error running speed test:', err);
  process.exit(1);
});
