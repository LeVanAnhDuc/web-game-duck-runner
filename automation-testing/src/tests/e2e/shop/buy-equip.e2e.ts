import { test, expect } from "@/fixtures";
import { copy, fmt } from "@/data/copy";
import { CHARACTERS, save } from "@/data/test-data";

// FR-23 · FR-24 · FR-25 · FR-26 · US-04 · MASTER §7.1 · §7.6: four ducks with their skill and price; BUY only when the
// wallet covers the price (otherwise disabled AND saying how much is missing); buying takes the price once; CHOOSE
// switches the duck in use; all of it kept on this machine.

const { runner, bruiser, glider, drifter } = CHARACTERS;

test("cửa hàng có bốn nhân vật kèm kỹ năng, Lữ khách đang dùng", { tag: ["@TC-SHOP-001", "@smoke"] }, async ({
  menuPage,
  shopPage,
}) => {
  await menuPage.goto();
  await menuPage.openShop();
  await expect(shopPage.cards()).toHaveCount(4);
  for (const c of [runner, bruiser, glider, drifter]) {
    await expect(shopPage.card(c.name)).toBeVisible();
    await expect(shopPage.skillLine(c.name)).toHaveText(`${copy.shop.skillLabel}: ${c.skill}`);
  }
  await expect(shopPage.equippedLabel(runner.name)).toBeVisible();
});

test("ví vừa đủ giá thì MUA bật, ví thiếu thì MUA tắt và ghi còn thiếu bao nhiêu", { tag: ["@TC-SHOP-002", "@smoke"] }, async ({
  menuPage,
  shopPage,
}) => {
  await menuPage.seedSave(save({ coins: bruiser.price }));
  await menuPage.goto();
  await menuPage.openShop();
  await expect(shopPage.buyButton(bruiser.name)).toBeEnabled();
  await expect(shopPage.price(bruiser.name)).toHaveText(fmt(bruiser.price));
  await expect(shopPage.buyButton(glider.name)).toBeDisabled();
  await expect(shopPage.shortfall(glider.name, glider.price - bruiser.price)).toBeVisible();
});

test("ví thiếu đúng một xu thì nút MUA tắt và ghi Còn thiếu 1", { tag: ["@TC-SHOP-003"] }, async ({
  menuPage,
  shopPage,
}) => {
  await menuPage.seedSave(save({ coins: bruiser.price - 1 }));
  await menuPage.goto();
  await menuPage.openShop();
  await expect(shopPage.buyButton(bruiser.name)).toBeDisabled();
  await expect(shopPage.shortfall(bruiser.name, 1)).toBeVisible();
});

test("mua trừ đúng giá khỏi ví và thẻ chuyển sang CHỌN", { tag: ["@TC-SHOP-004", "@smoke"] }, async ({
  menuPage,
  shopPage,
}) => {
  await menuPage.seedSave(save({ coins: 100 }));
  await menuPage.goto();
  await menuPage.openShop();
  await shopPage.buyButton(bruiser.name).click();
  await expect(shopPage.wallet()).toHaveText(fmt(100 - bruiser.price));
  await expect(shopPage.equipButton(bruiser.name)).toBeVisible();
  await expect(shopPage.buyButton(bruiser.name)).toHaveCount(0);
  const stored = await shopPage.storedSave();
  expect(stored?.coins).toBe(100 - bruiser.price);
  expect(stored?.ownedCharacters).toContain(bruiser.id);
});

test("bấm MUA hai lần thật nhanh chỉ trừ tiền một lần", { tag: ["@TC-SHOP-005"] }, async ({ menuPage, shopPage }) => {
  await menuPage.seedSave(save({ coins: 500 }));
  await menuPage.goto();
  await menuPage.openShop();
  await shopPage.buyButton(bruiser.name).dblclick();
  await expect(shopPage.wallet()).toHaveText(fmt(500 - bruiser.price));
  expect((await shopPage.storedSave())?.coins).toBe(500 - bruiser.price);
});

test("CHỌN đổi nhân vật đang dùng và lựa chọn còn sau khi tải lại", { tag: ["@TC-SHOP-006"] }, async ({
  menuPage,
  shopPage,
}) => {
  await menuPage.seedSave(save({ ownedCharacters: ["runner", "glider"] }));
  await menuPage.goto();
  await menuPage.openShop();
  await shopPage.equipButton(glider.name).click();
  await expect(shopPage.equippedLabel(glider.name)).toBeVisible();
  await expect(shopPage.equipButton(runner.name)).toBeVisible();
  await menuPage.reload();
  await menuPage.openShop();
  await expect(shopPage.equippedLabel(glider.name)).toBeVisible();
});

test("quay lại màn chính thì ví đã trừ tiền mua", { tag: ["@TC-SHOP-007"] }, async ({ menuPage, shopPage }) => {
  await menuPage.seedSave(save({ coins: 1000 }));
  await menuPage.goto();
  await menuPage.openShop();
  await shopPage.buyButton(drifter.name).click();
  await shopPage.backButton().click();
  await expect(menuPage.wallet()).toHaveText(fmt(1000 - drifter.price));
});

test("save chọn nhân vật lạ thì cửa hàng về Lữ khách đang dùng", { tag: ["@TC-SHOP-008"] }, async ({
  menuPage,
  shopPage,
}) => {
  // BUG: defects/shop.md#bug-shop-01
  test.fail();
  await menuPage.seedSave(save({ ownedCharacters: ["runner", "ghost"], selectedCharacter: "ghost" }));
  await menuPage.goto();
  await menuPage.openShop();
  await expect(shopPage.cards()).toHaveCount(4);
  await expect(shopPage.equippedLabel(runner.name)).toBeVisible();
});
