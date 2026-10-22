import { defineConfig } from "@playwright/test";

// Testuje statický export (`npm run build` -> out/). Lokálně stačí `npm run build && npm run e2e`.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "e2e",
  outputDir: "e2e/.results",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: executablePath ? { executablePath } : {},
    reducedMotion: "reduce",
  },
  webServer: {
    command: "python3 -m http.server 4173 -d out --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "ignore",
  },
});
