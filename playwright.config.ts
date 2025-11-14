import type { PlaywrightTestConfig } from '@playwright/test';

const isCI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev:backend',
      port: 4000,
      stdout: 'pipe',
      stderr: 'pipe',
      reuseExistingServer: !isCI,
      cwd: __dirname,
      env: {
        NODE_ENV: 'test',
        DATABASE_URL: 'file:./playwright.db',
        JWT_SECRET: 'playwright-secret',
        TOKEN_EXPIRES_IN: '1d',
        UPLOAD_DIR: 'playwright-uploads',
        CLIENT_URL: 'http://127.0.0.1:5173',
        MODEL_OVERLOAD_CHANCE: '0',
      },
    },
    {
      command: 'npm run dev:frontend:playwright',
      port: 5173,
      stdout: 'pipe',
      stderr: 'pipe',
      reuseExistingServer: !isCI,
      cwd: __dirname,
    },
  ],
};

export default config;
