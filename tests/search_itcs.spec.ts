import { test, expect } from "@playwright/test";

test("make sure ITCS can be found by Google", async ({ page }) => {
  await page.goto("https://google.de");

  await page.getByRole("button", { name: "Alle ablehnen" }).click();

  await page
    .getByLabel("Suche", { exact: true })
    .pressSequentially("itcs", { delay: 100 });

  const searchButtons = await page
    .getByRole("button", { name: "Google Suche" })
    .all();

  const clickableButtons = await Promise.all(
    searchButtons.map((locator) => locator.evaluate(willReceiveClickEvent))
  ).then((results) => searchButtons.filter((_, index) => results[index]));

  expect(clickableButtons).toHaveLength(1);
  await clickableButtons[0].click();

  await expect(
    page.getByRole("link", { name: "ITCS München", exact: true })
  ).toBeVisible();
});

function willReceiveClickEvent(element: HTMLElement | SVGElement): boolean {
  const bbox = element.getBoundingClientRect();
  const centerHorizontal = (bbox.left + bbox.right) / 2;
  const centerVertical = (bbox.top + bbox.bottom) / 2;
  return (
    element === document.elementFromPoint(centerHorizontal, centerVertical)
  );
}
