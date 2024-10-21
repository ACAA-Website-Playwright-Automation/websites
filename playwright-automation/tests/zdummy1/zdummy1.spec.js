import { test, expect } from '@playwright/test';



test('example test', async ({ page }) => {
    test.setTimeout(1000000);
  await page.goto('https://flypittsburgh.com/dining/');
  const url="https://flypittsburgh.com/dining/";

 //Take body height for scrolling
//  const bodyHandle = await page.$('body');
//  const bodyBoundingBox = await bodyHandle.boundingBox();
//  await bodyHandle.dispose();

//  const fullHeight = bodyBoundingBox.height;
//  const viewportHeight = 720;
//  const scrollStep = viewportHeight;


//  for (let scrollY = fullHeight; scrollY >= 0; scrollY -= scrollStep) {
//    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), scrollY);
//    await page.waitForTimeout(3000);
//  }

await page.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 200) {
    window.scrollTo(0, i);
    await new Promise(resolve => setTimeout(resolve, 200)); 
  }
});

  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const fileName = url.split('/').filter(Boolean).pop();
  await expect(screenshotBuffer).toMatchSnapshot(`${fileName}.png`);


});