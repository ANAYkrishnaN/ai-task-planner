import { expect, test } from "@playwright/test";

test("user enters a task and sees prioritized output", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Task input").fill("Finish project report tomorrow");
  await page.getByRole("button", { name: "Prioritize Task" }).click();

  await expect(page.getByTestId("start-this-next")).toContainText(
    "Finish project report tomorrow",
  );
  await expect(page.getByTestId("priority-bucket")).toContainText("Do Now");
  await expect(page.getByTestId("priority-explanation")).toContainText(
    "near deadline",
  );
});
