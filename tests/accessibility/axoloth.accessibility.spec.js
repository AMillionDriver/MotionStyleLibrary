import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const examples = JSON.parse(
  readFileSync(new URL('../../web_examples/data/examples.json', import.meta.url), 'utf8')
);
const auditTargets = [
  { id: 'docs-hub', path: '/web_examples/' },
  { id: 'behavior-guide', path: '/web_examples/docs/behavior/' },
  ...examples.map((example) => ({
    id: example.id,
    path: `/web_examples/${example.previewUrl.replace(/^\.\//, '')}`,
  })),
];
const viewports = [
  { name: 'mobile', width: 375, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
];
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

function formatViolations(violations) {
  return violations
    .map(({ help, helpUrl, id, impact, nodes }) =>
      [
        `${id} (${impact ?? 'unknown'}): ${help}`,
        `  ${helpUrl}`,
        ...nodes.map((node) => `  ${node.target.join(' ')}\n    ${node.failureSummary}`),
      ].join('\n')
    )
    .join('\n\n');
}

auditTargets.forEach((target) => {
  test.describe(target.id, () => {
    viewports.forEach((viewport) => {
      test(`${viewport.name} has no detectable WCAG A/AA violations`, async ({
        page,
      }, testInfo) => {
        const browserErrors = [];
        const httpErrors = [];
        page.on('console', (message) => {
          if (
            message.type() === 'error' &&
            !message.text().startsWith('Failed to load resource:')
          ) {
            browserErrors.push(message.text());
          }
        });
        page.on('pageerror', (error) => browserErrors.push(error.message));
        page.on('response', (response) => {
          if (response.status() >= 400) {
            httpErrors.push(`${response.status()} ${response.url()}`);
          }
        });

        await page.setViewportSize(viewport);
        await page.goto(target.path, { waitUntil: 'networkidle' });
        await expect(page.locator('body')).toBeVisible();

        const pageWidth = await page.locator('html').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));

        expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth + 1);
        expect(browserErrors).toEqual([]);
        expect(httpErrors).toEqual([]);

        // Axe reads imported stylesheets in-page, which makes Chromium request duplicate
        // relative @imports from the document URL. App network health is asserted above.
        const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

        if (results.violations.length > 0) {
          await testInfo.attach('axe-results.json', {
            body: JSON.stringify(results, null, 2),
            contentType: 'application/json',
          });
        }

        expect(results.violations, formatViolations(results.violations)).toEqual([]);
      });
    });
  });
});

test.describe('behavior guide interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/web_examples/docs/behavior/', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-behavior-status]')).toContainText('Initialized');
  });

  test('tabs and accordion update their accessible state', async ({ page }) => {
    const securityTab = page.getByRole('tab', { name: 'Security' });
    const profilePanel = page.getByRole('tabpanel', { name: 'Profile' });
    const securityPanel = page.getByRole('tabpanel', { name: 'Security' });

    await securityTab.click();
    await expect(securityTab).toHaveAttribute('aria-selected', 'true');
    await expect(profilePanel).toBeHidden();
    await expect(securityPanel).toBeVisible();

    const cleanupTrigger = page.getByRole('button', { name: /When should I clean up/ });
    await cleanupTrigger.click();
    await expect(cleanupTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: /When should I clean up/ })).toBeVisible();
  });

  test('dialog and drawer open, dismiss, and restore focus', async ({ page }) => {
    const dialogTrigger = page.getByRole('button', { name: 'Open dialog' });
    const dialog = page.locator('#behavior-confirm-dialog');

    await dialogTrigger.click();
    await expect(dialog).toHaveClass(/axo-dialog-open/);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveClass(/axo-dialog-open/);
    await expect(dialogTrigger).toBeFocused();

    const drawerTrigger = page.getByRole('button', { name: 'Open drawer' });
    const drawer = page.locator('#behavior-main-drawer');

    await drawerTrigger.click();
    await expect(drawer).toHaveClass(/axo-drawer-open/);
    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/axo-drawer-open/);
    await expect(drawerTrigger).toBeFocused();
  });
});
