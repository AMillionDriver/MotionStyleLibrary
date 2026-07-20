import { expect, test } from '@playwright/test';

const fixturePath = '/tests/fixtures/container-responsive.html';

async function box(locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value;
}

test.describe('container-responsive layouts', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 1000 });
    await page.goto(fixturePath, { waitUntil: 'networkidle' });
  });

  test('compacts header slots from parent width on a desktop viewport', async ({ page }) => {
    await expect(page.locator('#header-compact-nav')).toBeHidden();
    await expect(page.locator('#header-compact-menu')).toBeVisible();
    await expect(page.locator('#header-wide-nav')).toBeVisible();
    await expect(page.locator('#header-wide-menu')).toBeHidden();

    const compactDisplay = await page
      .locator('#header-compact-menu')
      .evaluate((element) => getComputedStyle(element).display);
    expect(compactDisplay).toBe('flex');
  });

  test('stacks form and app regions only when their containers are compact', async ({ page }) => {
    const compactFields = page.locator('#form-compact > *');
    const compactFieldOne = await box(compactFields.nth(0));
    const compactFieldTwo = await box(compactFields.nth(1));
    expect(compactFieldTwo.y).toBeGreaterThan(compactFieldOne.y + compactFieldOne.height - 1);

    const wideFields = page.locator('#form-wide > *');
    const wideFieldOne = await box(wideFields.nth(0));
    const wideFieldTwo = await box(wideFields.nth(1));
    expect(wideFieldTwo.y).toBeCloseTo(wideFieldOne.y, 0);

    const compactHeader = await box(page.locator('#app-compact > .axo-app-header'));
    const compactSidebar = await box(page.locator('#app-compact > .axo-app-sidebar'));
    expect(compactSidebar.y).toBeGreaterThanOrEqual(compactHeader.y + compactHeader.height - 1);

    const wideHeader = await box(page.locator('#app-wide > .axo-app-header'));
    const wideSidebar = await box(page.locator('#app-wide > .axo-app-sidebar'));
    expect(wideHeader.x).toBeGreaterThanOrEqual(wideSidebar.x + wideSidebar.width - 1);
  });

  test('switches vertical tabs from columns to a compact row', async ({ page }) => {
    const compactList = await box(page.locator('#tabs-compact > .axo-tab-list'));
    const compactPanel = await box(page.locator('#tabs-compact > .axo-tab-panel'));
    expect(compactPanel.y).toBeGreaterThanOrEqual(compactList.y + compactList.height - 1);
    await expect(page.locator('#tabs-compact > .axo-tab-list')).toHaveCSS('flex-direction', 'row');

    const wideList = await box(page.locator('#tabs-wide > .axo-tab-list'));
    const widePanel = await box(page.locator('#tabs-wide > .axo-tab-panel'));
    expect(widePanel.x).toBeGreaterThanOrEqual(wideList.x + wideList.width - 1);
    await expect(page.locator('#tabs-wide > .axo-tab-list')).toHaveCSS('flex-direction', 'column');

    const pageWidth = await page.locator('html').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth + 1);
  });
});
