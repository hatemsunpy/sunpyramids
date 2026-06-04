import { test, expect } from '@playwright/test';

test.describe('Third-Party Script Deferral Verification', () => {
  test('T009d, T016b, T020-2: Initial Load (no third-party requests)', async ({ page }) => {
    const thirdPartyRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha') || url.includes('cdn.trustindex.io')) {
        thirdPartyRequests.push(url);
      }
    });

    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    expect(thirdPartyRequests.length, 'Expected no third-party requests on initial load').toBe(0);

    const hasNoscript = await page.evaluate(() => {
      const noscripts = document.querySelectorAll('noscript');
      return Array.from(noscripts).some(n => n.innerHTML.includes('googletagmanager.com'));
    });
    expect(hasNoscript).toBe(true);
  });

  test('T009d, T020-5: Interaction Trigger (scripts load after interaction)', async ({ page }) => {
    const thirdPartyRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha')) {
        thirdPartyRequests.push(url);
      }
    });

    await page.goto('/', { waitUntil: 'load' });
    expect(thirdPartyRequests.length).toBe(0);

    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      window.dispatchEvent(new Event('mousemove'));
      window.dispatchEvent(new Event('scroll'));
    });

    await expect.poll(() => thirdPartyRequests.length, { timeout: 10000 }).toBeGreaterThan(0);
    
    const hasGtm = thirdPartyRequests.some(url => url.includes('googletagmanager.com'));
    const hasRecaptcha = thirdPartyRequests.some(url => url.includes('google.com/recaptcha'));
    expect(hasGtm, 'Expected GTM request after interaction').toBe(true);
    expect(hasRecaptcha, 'Expected reCAPTCHA request after interaction').toBe(true);
  });

  test('T017a-c, T020-7: No Third-Party Query Param', async ({ page }) => {
    const thirdPartyRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha') || url.includes('cdn.trustindex.io')) {
        thirdPartyRequests.push(url);
      }
    });

    await page.goto('/?no-third-party', { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      window.dispatchEvent(new Event('mousemove'));
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(2000);

    expect(thirdPartyRequests.length, 'Expected ZERO third party requests when no-third-party is present').toBe(0);

    const hasNoscript = await page.evaluate(() => {
      const noscripts = document.querySelectorAll('noscript');
      return Array.from(noscripts).some(n => n.innerHTML.includes('googletagmanager.com'));
    });
    expect(hasNoscript).toBe(false);
  });

  test('T018a-d, T020-8: SPA Navigation & Deduplication', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    
    await page.evaluate(() => {
      window.dispatchEvent(new Event('mousemove'));
    });
    await page.waitForTimeout(2000);

    const aboutLink = page.locator('a[href="/about-us"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState('load');
    }

    const contactLink = page.locator('a[href="/contact-us"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForLoadState('load');
    }

    const gtmScripts = await page.locator('script[src*="googletagmanager.com/gtag/js"]').count();
    const recaptchaScripts = await page.locator('script[src*="google.com/recaptcha"]').count();

    expect(gtmScripts).toBe(1);
    expect(recaptchaScripts).toBe(1);
  });

  test('T016c: TrustIndex Specifics on About Us Page', async ({ page }) => {
    // Avoid /cart because the Nuxt server crashes due to a bug in useCookie
    const trustIndexRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('cdn.trustindex.io')) {
        trustIndexRequests.push(request.url());
      }
    });

    await page.goto('/about-us', { waitUntil: 'load' });
    
    await page.evaluate(() => {
      window.dispatchEvent(new Event('mousemove'));
    });
    await page.waitForTimeout(2000);

    expect(trustIndexRequests.length, 'Expected no TrustIndex requests on a page without the widget container').toBe(0);
  });
});
