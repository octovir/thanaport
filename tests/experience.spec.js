import { test, expect } from "@playwright/test";

test("scrolling advances the pinned material story", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Go to Form chapter" }),
  ).toHaveAttribute("aria-current", "step");
  await page.evaluate(() => window.scrollTo(0, innerHeight * 1.15));
  await expect(
    page.getByRole("button", { name: "Go to Motion chapter" }),
  ).toHaveAttribute("aria-current", "step");
  await page.evaluate(() => window.scrollTo(0, innerHeight * 2.3));
  await expect(
    page.getByRole("button", { name: "Go to Play chapter" }),
  ).toHaveAttribute("aria-current", "step");
});

test("material controls update the scene and reset restores the defaults", async ({
  page,
}) => {
  await page.goto("/#lab");
  await page.getByRole("button", { name: "Customize material" }).click();
  await page.getByRole("button", { name: "Chrome", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Chrome", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("slider", { name: "Distortion" }).focus();
  await page.keyboard.press("End");
  for (let i = 0; i < 20; i++) await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("slider", { name: "Distortion" })).toHaveValue(
    "0.8",
  );
  await page.getByRole("button", { name: "Reset material" }).click();
  await expect(
    page.getByRole("button", { name: "Water", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("slider", { name: "Distortion" })).toHaveValue(
    "0.35",
  );
});

test("the glass scene recovers when the browser restores WebGL", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".glass-scene")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.evaluate(() => {
    window.testContextLoss = document
      .querySelector("canvas")
      .getContext("webgl2")
      .getExtension("WEBGL_lose_context");
    window.testContextLoss.loseContext();
  });
  await expect(page.locator(".glass-scene")).not.toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.evaluate(() => window.testContextLoss.restoreContext());
  await expect(page.locator(".glass-scene")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 10000 },
  );
});

test("landscape users can scroll the material tray into view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause animation" });
  await pause.scrollIntoViewIfNeeded();
  await expect(pause).toBeInViewport();
});

test("reduced-motion material changes and keyboard rotation actually repaint the glass", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".glass-scene")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const canvas = page.locator(".glass-scene canvas");
  const water = await canvas.screenshot();
  await page.getByRole("button", { name: "Customize material" }).click();
  await page.getByRole("button", { name: "Chrome", exact: true }).click();
  const chrome = await canvas.screenshot();
  expect(chrome.equals(water)).toBe(false);
  await page.locator(".glass-scene").focus();
  await page.keyboard.press("ArrowRight");
  const rotated = await canvas.screenshot();
  expect(rotated.equals(chrome)).toBe(false);
  expect(errors).toEqual([]);
});

test("material settings stay tucked away until requested and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Customize material" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("slider", { name: "Distortion" })).toHaveCount(0);
  await trigger.click();
  await expect(page.getByRole("slider", { name: "Distortion" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});
