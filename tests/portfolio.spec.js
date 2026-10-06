import { test, expect } from "@playwright/test";

test("selected work links to the real project repositories", async ({
  page,
}) => {
  await page.goto("/#work");
  await expect(
    page.getByRole("link", { name: "Color template", exact: true }),
  ).toHaveAttribute("href", "https://github.com/octovir/color_template");
  await page.getByRole("button", { name: "Show Thanaport" }).click();
  await expect(
    page.getByRole("link", { name: "Thanaport", exact: true }),
  ).toHaveAttribute("href", "https://github.com/octovir/thanaport");
  await page.getByRole("button", { name: "Show Basic calculator" }).click();
  await expect(
    page.getByRole("link", { name: "Basic calculator", exact: true }),
  ).toHaveAttribute("href", "https://github.com/octovir/basic-calculator");
});

test("mobile navigation opens, follows a section, and closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /menu/i });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("contact gives visible feedback on failure and allows retry", async ({
  page,
}) => {
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ success: false }),
    }),
  );
  await page.goto("/contact");
  await page.getByRole("button", { name: "Start a conversation" }).click();
  await page.getByLabel("Your name").fill("Portfolio visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page
    .getByLabel("Your message")
    .fill("I would like to discuss a project.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert")).toContainText("Please try again");
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
});

test("contact success resets the form and confirms submission", async ({
  page,
}) => {
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
  await page.goto("/contact");
  await page.getByRole("button", { name: "Start a conversation" }).click();
  await page.getByLabel("Your name").fill("Portfolio visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page
    .getByLabel("Your message")
    .fill("I would like to discuss a project.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByRole("form", { name: "Contact Thanakrit" }).getByRole("status"),
  ).toContainText("Message sent");
  await expect(page.getByLabel("Your name")).toHaveValue("");
});

test("the portfolio stays usable without WebGL and with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type.includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".glass-fallback")).toBeVisible();
  const cv = await page.request.get("/CV_Thanakrit_Rattanaumnuaysiri.pdf");
  expect(cv.headers()["content-type"]).toContain("application/pdf");
});

test("keyboard users can enter and dismiss the mobile menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Experience" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("small screens do not scroll sideways", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
