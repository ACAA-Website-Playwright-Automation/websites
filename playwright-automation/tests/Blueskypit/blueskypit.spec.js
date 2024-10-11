import { test, expect } from '@playwright/test';

test.describe('Blueskypit test', () => {
  test('should match snapshot for all menu and submenu URLs', async ({ page }) => {
    test.setTimeout(1000000);
    const baseUrl = 'https://blueskypit.com/';

    // Store URLs for menus
    const menuUrls = [baseUrl];

    await page.goto(baseUrl);

    const menuSelectors = [
      'nav #menu-pit-initiatives',
      'nav #menu-recognition',
      'nav #menu-topics',
      'nav #menu-air-travel'
    ];

    for (const selector of menuSelectors) {  
      const mainMenus = await page.$$(selector + ' > li');

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
    }
    
    console.log("---------------------------------------");
    console.log(menuUrls);

    const uniqueUrls = Array.from(new Set(menuUrls));

    // Array to store failed URLs
    const failedScreenshots = [];

    for (const url of uniqueUrls) {
      try {
        await page.goto(url);
        // await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(2000); // Waits for 5 seconds
        // Take a screenshot
        const screenshotBuffer = await page.screenshot();
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
