import { test, expect } from '@playwright/test';

test.describe('Pittransformed test', () => {
  test('should match snapshot for all menu and submenu URLs', async ({ page }) => {
    test.setTimeout(1000000);
    const baseUrl = 'https://pittransformed.com/';

    //menus
    const menuUrls = [baseUrl];

    await page.goto(baseUrl);

    const mainMenus = await page.$$('.rmp-menu > li');

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

    //   const videoSelector = '.mejs-mediaelement video'; 

    //   const videoExists = await page.$(videoSelector);

    //   if (videoExists) {
    //     await page.evaluate(selector => {
    //         const video = document.querySelector(selector);
    //         setTimeout(() => {
    //             video.currentTime = 2;
    //             video.pause();
    //         }, 1000);
    //     }, videoSelector);
    //  }

    //hide background video
    const videoExists = await page.isVisible('.mejs-mediaelement video');

    if (videoExists) {
      await page.evaluate(() => {
          const element = document.querySelector('.mejs-mediaelement video');
          if (element) {
              element.style.display = 'none'; 
          }
      });
     }

      //click the cookie
      const cookieClose = await page.$('#cookie_action_close_header');
      if (cookieClose && await cookieClose.isVisible()) {
        await cookieClose.click();
      }

       // Hide the cookie
       const isVisiblecookie = await page.isVisible('#cookie-law-info-again');

       if (isVisiblecookie) {
         await page.evaluate(() => {
             const element = document.querySelector('#cookie-law-info-again');
             if (element) {
                 element.style.display = 'none'; 
             }
         });
        }


       // Hide the header
       const isVisibleheader = await page.isVisible('#main-header');

       if (isVisibleheader) {
         await page.evaluate(() => {
             const element = document.querySelector('#main-header');
             if (element) {
                 element.style.display = 'none'; 
             }
         });
        }

       // Hide the menu_trigger
       const isVisiblemenu = await page.isVisible('.rmp_menu_trigger');

       if (isVisiblemenu) {
         await page.evaluate(() => {
             const element = document.querySelector('.rmp_menu_trigger');
             if (element) {
                 element.style.display = 'none'; 
             }
         });
        }

      
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
