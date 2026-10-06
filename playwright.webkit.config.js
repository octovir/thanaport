import { defineConfig } from "@playwright/test";
import base from "./playwright.config.js";

export default defineConfig({
  ...base,
  testMatch: "mobile-rendering.spec.js",
  use: { ...base.use, browserName: "webkit", channel: undefined },
});
