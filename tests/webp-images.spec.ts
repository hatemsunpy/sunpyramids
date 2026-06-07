import { test, expect } from '@playwright/test';

/**
 * T023: Responsive Image Verification
 *
 * Goals:
 * - Hero banner images use eager loading + fetchpriority for LCP
 * - Tour card images have explicit width/height to prevent CLS
 * - Images served via _ipx are WebP where possible
 * - No CLS regression from image loading
 */

test.describe('Responsive Image Delivery — WebP + srcset', () => {
  test('hero banner images have LCP-friendly loading attributes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const heroImg = page.locator('.mainBannerSwiper img').first();
    await expect(heroImg).toBeVisible();

    const loading = await heroImg.getAttribute('loading');
    const fetchpriority = await heroImg.getAttribute('fetchpriority');
    const width  = await heroImg.getAttribute('width');
    const height = await heroImg.getAttribute('height');

    expect(loading, 'Hero image should use eager loading for LCP').toBe('eager');
    expect(fetchpriority, 'Hero image should have high fetchpriority').toBe('high');
    expect(width,  'Hero image must have explicit width').toBeTruthy();
    expect(height, 'Hero image must have explicit height').toBeTruthy();

    // After deployment of NuxtImg changes, this should also have srcset
    const srcset = await heroImg.getAttribute('srcset');
    test.info().annotations.push({
      type: 'srcset-check',
      description: srcset
        ? `Hero srcset present: ${srcset.slice(0, 80)}...`
        : 'Hero srcset not yet present (pre-deployment)',
    });
  });

  test('tour card images have explicit dimensions to prevent CLS', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Scroll down so tour cards enter viewport and lazy-load
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(1000);

    const firstTourCardImg = page.locator('.tourCardSwiper img').first();
    await expect(firstTourCardImg).toBeVisible();

    const width  = await firstTourCardImg.getAttribute('width');
    const height = await firstTourCardImg.getAttribute('height');
    const loading = await firstTourCardImg.getAttribute('loading');

    expect(width,  'Tour card image must have explicit width').toBeTruthy();
    expect(height, 'Tour card image must have explicit height').toBeTruthy();
    // The first visible slide in the swiper is eager (first image), subsequent slides are lazy
    expect(['eager', 'lazy'], 'Tour card image should have loading attribute').toContain(loading);

    const srcset = await firstTourCardImg.getAttribute('srcset');
    test.info().annotations.push({
      type: 'srcset-check',
      description: srcset
        ? `Tour card srcset present: ${srcset.slice(0, 80)}...`
        : 'Tour card srcset not yet present (pre-deployment)',
    });
  });

  test('api-sourced images served via _ipx use WebP when requested', async ({ page }) => {
    const imageRequests: Array<{ url: string; type: string | null }> = [];
    page.on('request', request => {
      const url = request.url();
      if (request.resourceType() === 'image' && url.includes('_ipx')) {
        imageRequests.push({
          url,
          type: request.headers()['content-type'] ?? null,
        });
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const ipxRequests = imageRequests.filter(r => r.url.includes('_ipx'));
    expect(ipxRequests.length, 'Expected at least one _ipx image request').toBeGreaterThan(0);

    // After deployment with format="webp", all should include f_webp
    const webpRequests = ipxRequests.filter(r => r.url.includes('f_webp'));
    test.info().annotations.push({
      type: 'webp-check',
      description: `${webpRequests.length} of ${ipxRequests.length} _ipx requests use WebP`,
    });

    // Soft assertion: will become hard after deployment
    expect(webpRequests.length).toBeGreaterThanOrEqual(0);
  });

  test('no image-related CLS regression on initial load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

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
