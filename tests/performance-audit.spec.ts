import { test, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';

test.describe('Performance Audit — sunpyramids.vercel.app', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  });

  test.setTimeout(90000);

  test('homepage audit', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: { url: string; status: number }[] = [];
    const requestLog: { url: string; type: string; size: number }[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    page.on('response', async (response) => {
      const status = response.status();
      if (status >= 400) {
        failedRequests.push({ url: response.url(), status });
      }
      try {
        const headers = await response.allHeaders();
        const size = headers['content-length'] ? parseInt(headers['content-length'], 10) : 0;
        requestLog.push({
          url: response.url(),
          type: response.request().resourceType(),
          size,
        });
      } catch { /* ignore */ }
    });

    // Navigate without waiting for networkidle (widgets keep it alive forever)
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for main content to paint
    await page.waitForSelector('img[alt*="banner"], .main-banner, .hero, header', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // ── Lightweight scalar evaluations ──
    const htmlSize = await page.evaluate(() => document.documentElement.outerHTML.length);

    const domMetrics = await page.evaluate(() => ({
      elements: document.querySelectorAll('*').length,
      scripts: document.querySelectorAll('script').length,
      links: document.querySelectorAll('link').length,
      imgs: document.querySelectorAll('img').length,
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      noscriptStylesheets: document.querySelectorAll('noscript link[rel="stylesheet"]').length,
      modulePreloads: document.querySelectorAll('link[rel="modulepreload"]').length,
      inlineStyles: document.querySelectorAll('style').length,
    }));

    const heroInfo = await page.evaluate(() => {
      const img = document.querySelector('.main-banner img, [class*="main-banner"] img, .hero img') as HTMLImageElement | null;
      return img
        ? { src: img.currentSrc || img.src, width: img.width, height: img.height, naturalWidth: img.naturalWidth }
        : {};
    });

    const cwv = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint');
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const fcp = paint.find((p) => p.name === 'first-contentful-paint')?.startTime;
      return {
        fcp,
        ttfb: nav?.responseStart,
        lcp: (performance as any).getEntriesByType?.('largest-contentful-paint').at?.(-1)?.startTime,
      };
    });

    const longTasks = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let count = 0;
        const obs = new PerformanceObserver((list) => {
          count += list.getEntries().length;
        });
        obs.observe({ type: 'longtask', buffered: true });
        setTimeout(() => {
          obs.disconnect();
          resolve(count);
        }, 200);
      });
    });

    // ── Aggregate intercepted request sizes ──
    const totals = requestLog.reduce(
      (acc, r) => {
        acc.total += r.size;
        if (r.type === 'script' || r.url.endsWith('.js')) acc.js += r.size;
        else if (r.type === 'stylesheet' || r.url.endsWith('.css')) acc.css += r.size;
        else if (r.type === 'image' || /\.(webp|png|jpg|jpeg|gif|svg)$/.test(r.url)) acc.img += r.size;
        else if (r.type === 'font' || r.url.endsWith('.woff2')) acc.font += r.size;
        return acc;
      },
      { total: 0, js: 0, css: 0, img: 0, font: 0 }
    );

    // ── Report ──
    console.log('\n=== Performance Audit Report ===');
    console.log('URL:', page.url());
    console.log('Viewport: 390x844');
    console.log('---');
    console.log('HTML size:', (htmlSize / 1024).toFixed(1), 'KB');
    console.log('DOM elements:', domMetrics.elements);
    console.log('Script tags:', domMetrics.scripts);
    console.log('Link tags:', domMetrics.links);
    console.log('Img tags:', domMetrics.imgs);
    console.log('---');
    console.log('Render-blocking stylesheets:', domMetrics.stylesheets - domMetrics.noscriptStylesheets);
    console.log('Stylesheets inside <noscript>:', domMetrics.noscriptStylesheets);
    console.log('Inline <style> tags:', domMetrics.inlineStyles);
    console.log('Modulepreload links:', domMetrics.modulePreloads);
    console.log('---');
    console.log('FCP:', cwv.fcp?.toFixed(0) ?? 'N/A', 'ms');
    console.log('LCP:', cwv.lcp?.toFixed(0) ?? 'N/A', 'ms');
    console.log('TTFB:', cwv.ttfb?.toFixed(0) ?? 'N/A', 'ms');
    console.log('Long tasks (>50ms):', longTasks);
    console.log('---');
    console.log('Transfer sizes (intercepted):');
    console.log('  Total:', (totals.total / 1024).toFixed(1), 'KB');
    console.log('  JS:', (totals.js / 1024).toFixed(1), 'KB');
    console.log('  CSS:', (totals.css / 1024).toFixed(1), 'KB');
    console.log('  Images:', (totals.img / 1024).toFixed(1), 'KB');
    console.log('  Fonts:', (totals.font / 1024).toFixed(1), 'KB');
    console.log('  Resource count:', requestLog.length);
    console.log('---');
    console.log('Hero image:', JSON.stringify(heroInfo));
    console.log('---');
    console.log('Console errors:', consoleErrors.length);
    consoleErrors.slice(0, 5).forEach((e) => console.log('  -', e.substring(0, 200)));
    console.log('Failed requests:', failedRequests.length);
    failedRequests.slice(0, 5).forEach((r) => console.log('  -', r.status, r.url));
    console.log('================================\n');

    // ── Soft assertions ──
    expect.soft(domMetrics.stylesheets - domMetrics.noscriptStylesheets).toBeLessThanOrEqual(20);
    expect.soft(longTasks).toBeLessThanOrEqual(20);
    expect.soft(consoleErrors.length).toBeLessThanOrEqual(5);
    expect.soft(failedRequests.length).toBe(0);

    // ── Save JSON ──
    const results = {
      url: page.url(),
      timestamp: new Date().toISOString(),
      viewport: { width: 390, height: 844 },
      htmlSizeKb: parseFloat((htmlSize / 1024).toFixed(1)),
      domMetrics,
      stylesheets: {
        renderBlocking: domMetrics.stylesheets - domMetrics.noscriptStylesheets,
        noscript: domMetrics.noscriptStylesheets,
        inline: domMetrics.inlineStyles,
      },
      modulePreloads: domMetrics.modulePreloads,
      coreWebVitals: { fcp: cwv.fcp, lcp: cwv.lcp, ttfb: cwv.ttfb, longTasks },
      transferSizes: {
        totalKb: parseFloat((totals.total / 1024).toFixed(1)),
        jsKb: parseFloat((totals.js / 1024).toFixed(1)),
        cssKb: parseFloat((totals.css / 1024).toFixed(1)),
        imgKb: parseFloat((totals.img / 1024).toFixed(1)),
        fontKb: parseFloat((totals.font / 1024).toFixed(1)),
        resourceCount: requestLog.length,
      },
      heroImage: heroInfo,
      consoleErrors: consoleErrors.slice(0, 20),
      failedRequests,
    };

    writeFileSync('tests/performance-audit-results.json', JSON.stringify(results, null, 2));
  });
});
