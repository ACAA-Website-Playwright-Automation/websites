import { test, expect } from '@playwright/test';

test.describe('ACAA test', () => {
  test('should match snapshot for all menu and submenu URLs', async ({ page }) => {
    test.setTimeout(1000000);
    const baseUrl = 'https://flypittsburgh.com/acaa-corporate/';

    //menus
    const menuUrls = [baseUrl];

    // URLs to skip
    const urlsToSkip = [
      // 'https://flypittsburgh.com/acaa-corporate/',
       'https://blueskypit.com/',
      'https://form.asana.com/?k=7BbSzzpmHBrN6aFsT7IFnQ&d=1203301408719217'
    ];

    await page.goto(baseUrl);

    const mainMenus = await page.$$('#nav > ul > li');

    for (const menu of mainMenus) {

      const subMenus = await menu.$$('ul > li > a');

      if (subMenus.length > 0) {
        for (const subMenu of subMenus) {
          const href1 = await subMenu.getAttribute('href');
          if (href1) {
            const fullUrl1 = new URL(href1, baseUrl).toString();
            if (!menuUrls.includes(fullUrl1)) {
              menuUrls.push(fullUrl1);
            }
          }
        }
      }
      else {
        const mainMenuLink = await menu.$('a');
        if (mainMenuLink) {
          const href2 = await mainMenuLink.getAttribute('href');
          if (href2) {
            const fullUrl2 = new URL(href2, baseUrl).toString();
            if (!menuUrls.includes(fullUrl2)) {
              menuUrls.push(fullUrl2);
            }
          }
        }
      }

    }

    console.log(menuUrls);

    const uniqueUrls = Array.from(new Set(menuUrls));

    const filteredUrls = uniqueUrls.filter(url => !urlsToSkip.includes(url));

    // Array to store failed URLs
    const failedScreenshots = [];

    for (const url of filteredUrls) {
    try {
      await page.goto(url);
      
      //close the front popup
      const wpfrontClose = await page.$('.wpfront-close');
      if (wpfrontClose && await wpfrontClose.isVisible()) {
        await wpfrontClose.click();
      }
      
      //click the cookie
      const cookieClose = await page.$('#cookie_action_close_header');
      if (cookieClose && await cookieClose.isVisible()) {
        await cookieClose.click();
      }
      
      // Hide the element chat with us
      const isVisiblehelpButton = await page.isVisible('.embeddedServiceHelpButton .helpButton');

      if (isVisiblehelpButton) {
        await page.evaluate(() => {
            const element = document.querySelector('.embeddedServiceHelpButton .helpButton');
            if (element) {
                element.style.display = 'none'; 
            }
        });
       }
       
      // Hide the element weatherwidget
      await page.evaluate(() => {
        const element = document.querySelector('[class*="weatherwidget"]');
        if (element) {
          element.style.display = 'none';
        }
      });

      //pause the video
      const iframeSelector = '.multicolumn iframe'; 
      const iframeElement = await page.$(iframeSelector);

        if (iframeElement) {
            
            const frame = await iframeElement.contentFrame();
            const videoSelector = 'video'; 
            const videoExists = await frame.$(videoSelector);

            if (videoExists) {
                await frame.evaluate(selector => {
                    const video = document.querySelector(selector);
                    if (video) {
                        setTimeout(() => {
                            const duration = video.duration;
                            video.currentTime = Math.max(duration-1, 0);
                            video.pause();
                        }, 1000); 
                    }
                }, videoSelector);
            }
        }

      // Hide the element upper scroll
     const isVisiblehelpButton2 = await page.isVisible('.upper.smoothscroll');

     if (isVisiblehelpButton2) {
       await page.evaluate(() => {
           const element = document.querySelector('.upper.smoothscroll');
           if (element) {
               element.style.display = 'none'; 
           }
       });
      }

      // Hide the element upper scroll
     const isVisiblehelpButton3 = await page.isVisible('.searchbar');

     if (isVisiblehelpButton3) {
       await page.evaluate(() => {
           const element = document.querySelector('.searchbar');
           if (element) {
               element.style.display = 'none'; 
           }
       });
      }  
      
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
