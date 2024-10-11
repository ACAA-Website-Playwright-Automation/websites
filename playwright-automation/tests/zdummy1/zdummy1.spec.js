import { test, expect } from '@playwright/test';



test('example test', async ({ page }) => {
    test.setTimeout(1000000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/parking/parking-reservations/');
  const url="https://flypittsburgh.com/pittsburgh-international-airport/parking/parking-reservations/";

 //Take body height for scrolling
 const bodyHandle = await page.$('body');
 const bodyBoundingBox = await bodyHandle.boundingBox();
 await bodyHandle.dispose();

 const fullHeight = bodyBoundingBox.height;
 const viewportHeight = 720;
 const scrollStep = viewportHeight;


 for (let scrollY = fullHeight; scrollY >= 0; scrollY -= scrollStep) {
   await page.evaluate((scrollY) => window.scrollTo(0, scrollY), scrollY);
   await page.waitForTimeout(3000);
 }

  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const fileName = url.split('/').filter(Boolean).pop();
  await expect(screenshotBuffer).toMatchSnapshot(`${fileName}.png`);


});