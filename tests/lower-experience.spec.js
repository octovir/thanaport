import { test, expect } from "@playwright/test";

test("gallery navigation reveals each real project without leaving the page", async ({
  page,
}) => {
  await page.goto("/#work");
  await page.getByRole("button", { name: "Show Thanaport" }).click();
  await expect(
    page.getByRole("link", { name: "Thanaport", exact: true }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Show Basic calculator" }).click();
  await expect(
    page.getByRole("link", { name: "Basic calculator", exact: true }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Show Color template" }).click();
  await expect(
    page.getByRole("link", { name: "Color template", exact: true }),
  ).toBeInViewport();
});

test("contact opens as a focused dialog and Escape returns to its invitation", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const invitation = page.getByRole("button", { name: "Start a conversation" });
  await invitation.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(invitation).toBeFocused();
});

test("paused gallery keeps the sculpture in sync when pointer and scroll updates overlap", async ({
  page,
}) => {
  await page.goto("/#work");
  const canvas = page.locator('.gallery-canvas[data-ready="true"] canvas');
  await expect(canvas).toBeVisible();
  await page.getByRole("button", { name: "Pause gallery animation" }).click();
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    document
      .querySelector(".gallery-stage")
      .dispatchEvent(
        new PointerEvent("pointermove", { clientX: 500, clientY: 250 }),
      );
    const section = document.querySelector("#work");
    window.scrollTo({
      top: section.offsetTop + (section.offsetHeight - innerHeight) / 2,
      behavior: "instant",
    });
  });
  await expect(
    page.getByRole("button", { name: "Show Thanaport" }),
  ).toHaveAttribute("aria-current", "true");
  await page.waitForTimeout(650);
  const settled = await canvas.screenshot();
  await page
    .locator(".gallery-canvas")
    .evaluate((node) => node.dispatchEvent(new Event("settingschange")));
  await page.waitForTimeout(100);
  expect((await canvas.screenshot()).equals(settled)).toBe(true);
});

test("contact uses inline validation and clears corrected field errors", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://api.web3forms.com/submit", (route) => {
    requests++;
    return route.abort();
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Start a conversation" }).click();
  await page.getByRole("button", { name: "Send message" }).click();
  const name = page.getByLabel("Your name");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#contact-name-error")).toBeVisible();
  await name.fill("Alex");
  await expect(name).toHaveAttribute("aria-invalid", "false");
  await page.getByLabel("Email address").fill("invalid");
  await page.getByLabel("Your message").fill("   ");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("Email address")).toBeFocused();
  await expect(page.locator("#contact-email-error")).toHaveText(
    "Please enter a valid email address.",
  );
  await page.getByLabel("Your message").fill("Hey");
  await expect(page.locator("#contact-message-error")).toHaveText(
    "Please write at least 5 characters.",
  );
  expect(requests).toBe(0);
});

test("glass dialog can reverse its entrance, reopen, and skip motion when requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/contact");
  const trigger = page.getByRole("button", { name: "Start a conversation" });
  const dialog = page.getByRole("dialog");
  await trigger.click();
  await expect(dialog).toHaveAttribute("data-phase", "enter");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveAttribute("data-phase", "exit");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog).toHaveAttribute("data-phase", "idle");
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  await expect(dialog).toHaveAttribute("data-phase", "idle");
  expect(await dialog.evaluate((node) => node.getAnimations().length)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
