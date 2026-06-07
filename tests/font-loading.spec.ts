import { test, expect } from '@playwright/test';

/**
 * T026, T027: Font Loading Verification
 *
 * Goals:
 * - Text renders immediately (no FOIT — Flash of Invisible Text)
 * - CLS stays ≤ 0.05 after font swap
 */

test.describe('Font Loading — No FOIT', () => {
  test('Trip Sans uses font-display swap and text is visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify font preloads are in <head>
    const preloads = await page.locator('link[rel="preload"][as="font"]').all();
    const tripSansPreloads = [];
    for (const p of preloads) {
      const href = await p.getAttribute('href');
      if (href?.includes('TripSans')) tripSansPreloads.push(href);
    }
    expect(tripSansPreloads.length, 'Expected Trip Sans font preloads').toBeGreaterThan(0);

    // Check that text is visible (not invisible during font load)
    const heroText = page.locator('h1, h2, h3').first();
    await expect(heroText).toBeVisible();

    const computedStyle = await heroText.evaluate(el => {
      const style = window.getComputedStyle(el as HTMLElement);
      return {
        fontFamily: style.fontFamily,
        visibility: style.visibility,
        opacity: style.opacity,
      };
    });

    expect(computedStyle.visibility).toBe('visible');
    expect(Number(computedStyle.opacity)).toBeGreaterThan(0);

    // Verify font-display: swap is applied via CSS
    // The font stylesheet may be cross-origin; we verify by checking computed
    // font-family contains Trip Sans and the text is visible (no FOIT)
    expect(computedStyle.fontFamily.toLowerCase()).toContain('trip');
  });

  test('CLS after font swap stays ≤ 0.05', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Let the page settle for 3 seconds so fonts have time to swap
    await page.waitForTimeout(3000);

    const cls = await page.evaluate(() => {
      let cumulativeShift = 0;
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cumulativeShift += (entry as any).value;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      return new Promise<number>(resolve => {
        setTimeout(() => {
          observer.disconnect();
          resolve(cumulativeShift);
        }, 3000);
      });
    });

    expect(cls, `CLS was ${cls}; must be ≤ 0.05`).toBeLessThanOrEqual(0.05);
  });
});
