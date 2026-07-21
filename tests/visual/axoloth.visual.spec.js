import { expect, test } from '@playwright/test';

const examples = [
  { id: 'app-shell', path: '/web_examples/examples/app-shell/' },
  { id: 'sidebar', path: '/web_examples/examples/fixed-sidebar/' },
  { id: 'bento', path: '/web_examples/examples/bento/' },
  { id: 'forms', path: '/web_examples/examples/semantic-form/' },
  { id: 'motion', path: '/web_examples/examples/motion-showcase/' },
  {
    id: 'kitchen-sink',
    path: '/web_examples/#utility-reference',
    fullPage: false,
  },
];
const viewportWidths = [320, 375, 768, 1024, 1440];

examples.forEach((example) => {
  test.describe(example.id, () => {
    viewportWidths.forEach((width) => {
      test(`${width}px`, async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (message) => {
          if (message.type() === 'error') consoleErrors.push(message.text());
        });
        page.on('pageerror', (error) => consoleErrors.push(error.message));

        await page.setViewportSize({ width, height: 900 });
        await page.goto(example.path, { waitUntil: 'networkidle' });
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              -webkit-font-smoothing: antialiased !important;
              caret-color: transparent !important;
              font-family: Arial, sans-serif !important;
              text-rendering: geometricPrecision !important;
            }

            #example-search::placeholder {
              color: transparent !important;
            }
          `,
        });

        if (example.id === 'kitchen-sink') {
          await expect(page.locator('#utility-count')).not.toHaveText('Loading utilities...');
          await expect(page.locator('#utilities-table-body tr')).not.toHaveCount(1);
          await page.locator('#utility-reference').evaluate((element) => {
            const topbarHeight =
              document.querySelector('.docs-topbar')?.getBoundingClientRect().height ?? 0;
            window.scrollTo({
              behavior: 'instant',
              top: Math.max(0, element.offsetTop - topbarHeight - 16),
            });
          });
        }

        await expect(page.locator('body')).toBeVisible();
        const pageWidth = await page.locator('html').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));

        expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth + 1);
        expect(consoleErrors).toEqual([]);
        const screenshotOptions = {
          fullPage: example.fullPage !== false,
        };
        if (example.id === 'kitchen-sink') {
          screenshotOptions.maxDiffPixelRatio = 0.04;
        }

        await expect(page).toHaveScreenshot(`${example.id}-${width}.png`, screenshotOptions);
      });
    });
  });
});
