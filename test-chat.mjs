import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:3000';
const SESSION_ID = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5';
const SCREENSHOT_DIR = 'G:\\iit\\hitaishi\\test-screenshots';

let stepNum = 0;
const results = [];
const timings = {};

async function screenshot(page, name) {
  stepNum++;
  const path = `${SCREENSHOT_DIR}\\${String(stepNum).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`  📸 ${path}`);
}

async function loginWait(page, email, password, label) {
  console.log(`\n🔑 Logging in ${label}...`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
  console.log(`  ${label} logged in → ${page.url()}`);
}

async function navSession(page, label) {
  console.log(`\n📍 ${label} → session...`);
  await page.goto(`${BASE_URL}/session/${SESSION_ID}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await screenshot(page, `session-${label}`);
}

async function sendMessage(page, text, label) {
  console.log(`\n✉️ ${label} sending: "${text}"`);
  const input = page.locator('input[placeholder*="Message"]');
  await input.waitFor({ state: 'visible', timeout: 8000 });
  await input.fill(text);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  await screenshot(page, `sent-${label}`);
}

async function waitForMessage(page, text, timeoutMs = 12000) {
  const start = Date.now();
  console.log(`  ⏳ Waiting for "${text}"...`);
  while (Date.now() - start < timeoutMs) {
    const visible = await page.locator(`text="${text}"`).first().isVisible().catch(() => false);
    if (visible) {
      const elapsed = Date.now() - start;
      console.log(`  ✅ Received in ${elapsed}ms`);
      return elapsed;
    }
    await setTimeout(300);
  }
  console.log(`  ❌ Timed out (${timeoutMs}ms)`);
  return -1;
}

async function main() {
  console.log('='.repeat(60));
  console.log('  HITAISHI CHAT E2E TEST');
  console.log('='.repeat(60));
  console.log(`Session: ${SESSION_ID}`);

  const { mkdirSync } = await import('fs');
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    // Login both users FIRST (each in their own context)
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const ctxC = await browser.newContext();
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await loginWait(pageA, 'mentor@demo.hitaishi.app', 'demo1234', 'Mentor');
    await loginWait(pageB, 'student@demo.hitaishi.app', 'demo1234', 'Student');

    // Now navigate BOTH to session (minimize idle time between them)
    await navSession(pageA, 'Mentor');
    await navSession(pageB, 'Student');
    await screenshot(pageA, 'mentor-ready');
    await screenshot(pageB, 'student-ready');

    // Send from mentor → check student receives
    await sendMessage(pageA, 'Hello from mentor', 'mentor');
    const t1 = await waitForMessage(pageB, 'Hello from mentor', 12000);
    results.push({ step: 'Send A → received B', status: t1 >= 0 ? 'PASS' : 'FAIL', ms: t1 });
    timings.mentor_to_student = t1;
    if (t1 >= 0) await screenshot(pageB, 'student-received-mentor');

    // Send from student → check mentor receives
    await sendMessage(pageB, 'Hello from student', 'student');
    const t2 = await waitForMessage(pageA, 'Hello from student', 12000);
    results.push({ step: 'Send B → received A', status: t2 >= 0 ? 'PASS' : 'FAIL', ms: t2 });
    timings.student_to_mentor = t2;
    if (t2 >= 0) await screenshot(pageA, 'mentor-received-student');

    // Refresh both → verify history
    console.log('\n🔄 Refresh test...');
    await pageA.reload({ waitUntil: 'networkidle' });
    await pageB.reload({ waitUntil: 'networkidle' });
    await pageA.waitForTimeout(3000);
    await pageB.waitForTimeout(3000);
    await screenshot(pageA, 'mentor-refresh');
    await screenshot(pageB, 'student-refresh');

    const t3 = await waitForMessage(pageA, 'Hello from mentor', 8000);
    const t4 = await waitForMessage(pageB, 'Hello from student', 8000);
    results.push({ step: 'History on refresh', status: (t3 >= 0 && t4 >= 0) ? 'PASS' : 'FAIL', ms: Math.max(t3, t4) });

    // Non-participant check
    console.log('\n🔒 Non-participant test...');
    const pageC = await ctxC.newPage();
    await pageC.goto(`${BASE_URL}/session/${SESSION_ID}`, { waitUntil: 'networkidle' });
    await pageC.waitForTimeout(2000);
    await screenshot(pageC, 'non-participant');
    const bodyText = await pageC.locator('body').innerText();
    const blocked = /403|unauthorized|forbidden|sign.?in|login/i.test(bodyText) || pageC.url().includes('/login');
    results.push({ step: 'Non-participant blocked', status: blocked ? 'PASS' : 'FAIL', ms: 0 });
    console.log(`  ${blocked ? '✅ Blocked' : '❌ Not blocked'} (${pageC.url()})`);

  } catch (err) {
    console.error('TEST ERROR:', err.message);
    results.push({ step: 'Test execution', status: 'ERROR', ms: -1 });
  } finally {
    await browser.close();
  }

  // Report
  console.log('\n\n' + '='.repeat(60));
  console.log('  TEST RESULTS');
  console.log('='.repeat(60));
  let allPass = true;
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`  ${icon} ${r.step}: ${r.status}${r.ms >= 0 ? ` (${r.ms}ms)` : ''}`);
    if (r.status !== 'PASS') allPass = false;
  }
  console.log('='.repeat(60));
  const avgMs = timings.mentor_to_student > 0 && timings.student_to_mentor > 0
    ? Math.round((timings.mentor_to_student + timings.student_to_mentor) / 2)
    : 'N/A';
  console.log(`  STATUS: ${allPass ? 'ALL-PASS' : 'PARTIAL-FAIL'}  |  Avg delivery: ${avgMs}ms`);
  console.log('='.repeat(60));
  process.exit(allPass ? 0 : 1);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
