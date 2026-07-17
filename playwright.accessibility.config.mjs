import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4174';

export default defineConfig({
  testDir: './tests/accessibility',
  globalSetup: './tests/visual/global-setup.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    channel: 'chrome',
    colorScheme: 'light',
    launchOptions: {
      args: ['--disable-gpu'],
    },
    locale: 'en-US',
    reducedMotion: 'reduce',
    timezoneId: 'Asia/Jakarta',
  },
});
