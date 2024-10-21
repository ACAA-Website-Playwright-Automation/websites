import { test, expect } from '@playwright/test';

test.describe('Neighborhood91 test', () => {
  test('should match snapshot for all menu and submenu URLs', async ({ page }) => {
    test.setTimeout(1000000);
    const baseUrl = 'https://neighborhood91.com/';

    //menus
    const menuUrls = [baseUrl];

    await page.goto(baseUrl);

    const mainMenus = await page.$$('#menu-main-nav > li');

    for (const menu of mainMenus) {

        const mainMenuLink = await menu.$('a');
        if (mainMenuLink) {
          const href = await mainMenuLink.getAttribute('href');
          if (href) {
            const fullUrl = new URL(href, baseUrl).toString();
            if (!menuUrls.includes(fullUrl)) {
              menuUrls.push(fullUrl);
            }
          }
        }
    }
    
    console.log("All menu urls");
    console.log(menuUrls);

    const uniqueUrls = Array.from(new Set(menuUrls));

    // Array to store failed URLs
    const failedScreenshots = [];

    for (const url of uniqueUrls) {
    try {
      await page.goto(url);

      const videoSelector = '.video-wrapper video'; 

      const videoExists = await page.$(videoSelector);

      if (videoExists) {
        await page.evaluate(selector => {
            const video = document.querySelector(selector);
            setTimeout(() => {
                const duration = video.duration;
                video.currentTime = Math.max(duration - 1, 0);
                video.pause();
            }, 1000);
        }, videoSelector);
    }

      //hide toTop element
      await page.evaluate(() => {
        const element = document.querySelector('#toTop');
        if (element) {
            element.style.display = 'none'; 
        }
      });
      
      //Take body height for scrolling
      // const bodyHandle = await page.$('body');
      // const bodyBoundingBox = await bodyHandle.boundingBox();
      // await bodyHandle.dispose();

      // const fullHeight = bodyBoundingBox.height;
      // const viewportHeight = 720;
      // const scrollStep = viewportHeight;


      // for (let scrollY = fullHeight; scrollY >= 0; scrollY -= scrollStep) {
      //   await page.evaluate((scrollY) => window.scrollTo(0, scrollY), scrollY);
      //   await page.waitForTimeout(3000);
      // }
      await page.evaluate(async () => {
        for (let i = 0; i < document.body.scrollHeight; i += 200) {
          window.scrollTo(0, i);
          await new Promise(resolve => setTimeout(resolve, 200)); 
        }
      });

      //Take a screenshot
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      const fileName = url.split('/').filter(Boolean).pop();
      await expect(screenshotBuffer).toMatchSnapshot(`${fileName}.png`);

    } catch (error) {
      console.error(`Screenshot comparison failed for URL: ${url}`);
      failedScreenshots.push({ url, error });
    }
    }
   

    if (failedScreenshots.length > 0) {
      console.log("---------------------------------------");
      console.log('Summary of failed screenshots:');
      for (const failure of failedScreenshots) {
        console.log("---------------------------------------");
        console.log(`URL: ${failure.url}`);
        console.log(`Error: ${failure.error.message}`);
      }
    } else {
      console.log("---------------------------------------");
      console.log('All screenshots matched successfully.');
    }

  });
});
