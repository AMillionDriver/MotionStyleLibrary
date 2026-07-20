import { expect, test } from '@playwright/test';

const fixturePath = '/tests/fixtures/composition-primitives.html';

async function box(locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value;
}

test.describe('composition primitives', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixturePath, { waitUntil: 'networkidle' });
  });

  test('keeps flow rhythm and desktop regions predictable', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });

    const flowItems = page.locator('#flow > *');
    const firstFlowItem = await box(flowItems.nth(0));
    const secondFlowItem = await box(flowItems.nth(1));
    expect(secondFlowItem.y - (firstFlowItem.y + firstFlowItem.height)).toBeCloseTo(12, 0);

    const splitItems = page.locator('#split > *');
    const splitLeading = await box(splitItems.nth(0));
    const splitTrailing = await box(splitItems.nth(1));
    expect(splitLeading.y).toBeCloseTo(splitTrailing.y, 0);
    expect(splitTrailing.width).toBeGreaterThan(splitLeading.width);

    const sidebarItems = page.locator('#content-sidebar > *');
    const sidebar = await box(sidebarItems.nth(0));
    const content = await box(sidebarItems.nth(1));
    expect(sidebar.y).toBeCloseTo(content.y, 0);
    expect(content.width).toBeGreaterThan(sidebar.width);
  });

  test('wraps intrinsic regions and avoids horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });

    const splitItems = page.locator('#split > *');
    const splitLeading = await box(splitItems.nth(0));
    const splitTrailing = await box(splitItems.nth(1));
    expect(splitTrailing.y).toBeGreaterThan(splitLeading.y + splitLeading.height - 1);

    const sidebarItems = page.locator('#content-sidebar > *');
    const sidebar = await box(sidebarItems.nth(0));
    const content = await box(sidebarItems.nth(1));
    expect(content.y).toBeGreaterThan(sidebar.y + sidebar.height - 1);

    const pageWidth = await page.locator('html').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth + 1);
  });

  test('maintains frame, pile, bleed, and scroll-area contracts', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });

    const frame = await box(page.locator('#frame'));
    expect(frame.width / frame.height).toBeCloseTo(16 / 9, 1);

    const pile = await box(page.locator('#pile'));
    const pileBackground = await box(page.locator('#pile > :first-child'));
    const pileOverlay = await box(page.locator('#pile > :last-child'));
    expect(pileBackground.x).toBeCloseTo(pile.x, 0);
    expect(pileBackground.y).toBeCloseTo(pile.y, 0);
    expect(pileOverlay.x + pileOverlay.width / 2).toBeCloseTo(pile.x + pile.width / 2, 0);
    expect(pileOverlay.y + pileOverlay.height / 2).toBeCloseTo(pile.y + pile.height / 2, 0);

    const bleedParent = await box(page.locator('#bleed-parent'));
    const bleed = await box(page.locator('#bleed'));
    expect(Math.abs(bleed.x - bleedParent.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(bleed.width - bleedParent.width)).toBeLessThanOrEqual(2);

    const scrollContract = await page.locator('#scroll-area').evaluate((element) => ({
      clientHeight: element.clientHeight,
      overflowY: getComputedStyle(element).overflowY,
      scrollHeight: element.scrollHeight,
      scrollbarGutter: getComputedStyle(element).scrollbarGutter,
    }));
    expect(scrollContract.clientHeight).toBeLessThanOrEqual(128);
    expect(scrollContract.scrollHeight).toBeGreaterThan(scrollContract.clientHeight);
    expect(scrollContract.overflowY).toBe('auto');
    expect(scrollContract.scrollbarGutter).toContain('stable');
  });
});
