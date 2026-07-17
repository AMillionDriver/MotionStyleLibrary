import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4174';

export default defineConfig({
  testDir: './tests/visual',
  globalSetup: './tests/visual/global-setup.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.015,
      threshold: 0.3,
    },
  },
  use: {
    baseURL,
    channel: 'chrome',
    colorScheme: 'light',
    launchOptions: {
      args: ['--disable-gpu', '--disable-lcd-text', '--font-render-hinting=none'],
    },
    locale: 'en-US',
    reducedMotion: 'reduce',
    timezoneId: 'Asia/Jakarta',
  },
});
