import { chromium } from 'playwright';

async function test(url) {
  console.log(`\n=== Auditing Console Logs for: ${url} ===`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning' || text.includes('hydration') || text.includes('mismatch')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(2000);
  } catch (err) {
    console.log(`Navigation failed: ${err.message}`);
  } finally {
    await browser.close();
  }
}

async function run() {
  await test('http://localhost:3000');
  console.log('\n--- Checking Live Site ---');
  await test('https://sunpyramids.vercel.app');
}

run();
