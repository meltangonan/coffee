const { defineConfig } = require('@playwright/test');

const port = process.env.PORT || '4173';
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: '.',
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL
  },
  webServer: {
    command: `python3 -m http.server ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI
  }
});
