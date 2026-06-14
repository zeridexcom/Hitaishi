import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:3000';
const SESSION_ID = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5';
const SCREENSHOT_DIR = 'G:\\iit\\hitaishi\\test-screenshots';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('fetch') || msg.text().includes('api') || msg.text().includes('chat')) {
      console.log(`  [BROWSER ${msg.type()}] ${msg.text().substring(0, 300)}`);
    }
  });
  page.on('requestfailed', req => {
    console.log(`  [NET FAIL] ${req.url().substring(0, 100)}: ${req.failure()?.errorText}`);
  });
  page.on('response', resp => {
    if (resp.url().includes('/api/')) {
      console.log(`  [API ${resp.status()}] ${resp.url().substring(BASE_URL.length)}`);
    }
  });

  // Login as mentor
  console.log('Logging in as mentor...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.locator('input[name="email"]').fill('mentor@demo.hitaishi.app');
  await page.locator('input[name="password"]').fill('demo1234');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  console.log(`URL after login: ${page.url()}`);

  // Navigate to session
  console.log('\nNavigating to session...');
  await page.goto(`${BASE_URL}/session/${SESSION_ID}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check page content
  const bodyText = await page.locator('body').innerText();
  console.log(`\nPage body:\n${bodyText.substring(0, 500)}`);

  // Check if input is disabled
  const input = page.locator('input[placeholder*="Message"]');
  const isDisabled = await input.isDisabled();
  console.log(`\nChat input disabled: ${isDisabled}`);

  // Try to send a message
  if (!isDisabled) {
    console.log('\nSending message...');
    await input.fill('Hello from API test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Check if message appeared
    const msgs = await page.locator('text="Hello from API test"').all();
    console.log(`Messages found with text: ${msgs.length}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}\\debug-after-send.png` });
  } else {
    console.log('Cannot send — input is disabled. Checking init API...');
    // Manually call the init API to see what it returns
    const initResp = await page.evaluate(async () => {
      const r = await fetch('/api/session/ca93b97f-3bcb-4270-95f6-f31ec00b9ee5/chat');
      return { status: r.status, body: await r.text() };
    });
    console.log(`Init API: ${initResp.status} → ${initResp.body.substring(0, 200)}`);
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
