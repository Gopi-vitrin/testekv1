import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
});

test('Manager View — WCAG 2.1 AA', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  if (results.violations.length > 0) {
    console.log('\n=== WCAG VIOLATIONS (Manager View) ===');
    for (const v of results.violations) {
      console.log(`\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
      console.log(`  Help: ${v.helpUrl}`);
      for (const node of v.nodes.slice(0, 2)) {
        console.log(`  Element: ${node.html.slice(0, 120)}`);
        console.log(`  Failure: ${node.failureSummary?.split('\n')[0]}`);
      }
    }
  }

  expect(results.violations).toEqual([]);
});

test('Technician View — WCAG 2.1 AA', async ({ page }) => {
  await page.click('nav button:nth-child(3)');
  await page.waitForTimeout(400);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  if (results.violations.length > 0) {
    console.log('\n=== WCAG VIOLATIONS (Technician View) ===');
    for (const v of results.violations) {
      console.log(`\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
      console.log(`  Help: ${v.helpUrl}`);
      for (const node of v.nodes.slice(0, 2)) {
        console.log(`  Element: ${node.html.slice(0, 120)}`);
        console.log(`  Failure: ${node.failureSummary?.split('\n')[0]}`);
      }
    }
  }

  expect(results.violations).toEqual([]);
});

test('Technician View — AI suggestion panel open — WCAG 2.1 AA', async ({ page }) => {
  await page.click('nav button:nth-child(3)');
  await page.waitForTimeout(400);

  const aiBtn = page.locator('button:has-text("AI Suggest Resolution")');
  if (await aiBtn.count() > 0) {
    await aiBtn.click();
    await page.waitForTimeout(1400);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('\n=== WCAG VIOLATIONS (AI Suggestion Panel) ===');
      for (const v of results.violations) {
        console.log(`\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        console.log(`  Help: ${v.helpUrl}`);
        for (const node of v.nodes.slice(0, 2)) {
          console.log(`  Element: ${node.html.slice(0, 120)}`);
          console.log(`  Failure: ${node.failureSummary?.split('\n')[0]}`);
        }
      }
    }

    expect(results.violations).toEqual([]);
  }
});
