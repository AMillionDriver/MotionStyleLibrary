import { expect, test } from '@playwright/test';

const recipes = [
  {
    id: 'media-hero',
    selector: '.recipe-media-hero',
  },
  {
    id: 'editorial-split',
    selector: '.recipe-editorial',
  },
  {
    id: 'gallery-dialog',
    selector: '.recipe-gallery-live',
  },
];

const viewports = [
  { name: 'mobile', width: 375, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
];

async function waitForRecipeMedia(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', reject, { once: true });
        });
      })
    );
  });
}

recipes.forEach((recipe) => {
  test.describe(recipe.id, () => {
    viewports.forEach((viewport) => {
      test(`${viewport.name} composition`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/web_examples/recipes/${recipe.id}/`, { waitUntil: 'networkidle' });
        await waitForRecipeMedia(page);

        if (recipe.id === 'gallery-dialog') {
          await expect(page.locator('[data-gallery-status]')).toHaveText(
            'Dialog behavior initialized.'
          );
        }

        const pageWidth = await page.locator('html').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
        expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth + 1);

        await page.locator('.docs-topbar').evaluate((element) => element.remove());
        await expect(page.locator(recipe.selector)).toHaveScreenshot(
          `${recipe.id}-${viewport.name}.png`
        );
      });
    });
  });
});

test.describe('gallery dialog visual state', () => {
  viewports.forEach((viewport) => {
    test(`${viewport.name} open dialog`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/web_examples/recipes/gallery-dialog/', { waitUntil: 'networkidle' });
      await expect(page.locator('[data-gallery-status]')).toHaveText(
        'Dialog behavior initialized.'
      );
      await page.getByRole('button', { name: 'Open details for Cobalt balance' }).click();
      await expect(page.locator('#gallery-object-dialog')).toHaveClass(/axo-dialog-open/);

      await expect(page).toHaveScreenshot(`gallery-dialog-open-${viewport.name}.png`);
    });
  });
});
