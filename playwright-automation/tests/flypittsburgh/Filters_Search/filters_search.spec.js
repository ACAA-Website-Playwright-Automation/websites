import { test, expect } from '@playwright/test';


const fs = require('fs');
const path = require('path');

function logFinalResult(status, testName) {
  const currentDateTime = new Date().toLocaleString();
  const logMessage = `[${currentDateTime}] : ${status}: ${testName}\n`;
  const logFilePath = path.join(__dirname, 'filters_search.log');
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

//Arrival list
test.only('filter options cities for arrivals', async ({ page }) => {
  const testName = 'filter options cities for arrivals';

  test.setTimeout(90000);

try{
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');

  const options = await page.$$eval('#arrival-cities option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );

  const randomCity = options[Math.floor(Math.random() * options.length)];
  console.log('Selected City:', randomCity);

  await page.selectOption('#arrival-cities', randomCity);  

  await page.waitForTimeout(1000); 

  const visibleCities = await page.$$eval('#arrivals tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')  
      .map(row => {
        const cell = row.querySelector('td:nth-child(2)');
        return cell ? cell.textContent.trim() : null;
      })
      .filter(city => city !== null)  
  );

  console.log('Visible Cities:', visibleCities);

  expect(visibleCities.every(city => city === randomCity)).toBe(true);

  const rows = await page.$$('#arrivals tbody tr'); 

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none'); 
   
    if (isVisible) {
      const cityElement = await row.$('td:nth-child(2)');
        const cityValue = await cityElement.evaluate(el => el.textContent.trim());
        await row.click()
        await page.waitForTimeout(1000); 

        const drawerCity = await page.$eval('#arrival-drawer .from', el => el.textContent.trim());
        console.log("Drawer City: " + drawerCity);
        
        expect(drawerCity).toBe(cityValue);

        const closeButton = await page.$('#arrival-drawer button');
        if (closeButton) {
          await closeButton.click(); 
          await page.waitForTimeout(1000); 
        }
    }
  }
  console.log('Filter by cities works correctly');
  logFinalResult('Success', `${testName}`);

} catch (error) {
  logFinalResult('Failure', `${testName}`);
  throw error;
}
}
);



test('filter options airlines arrivals', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');

  const options = await page.$$eval('#arrival-airlines option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );

  const randomAirline = options[Math.floor(Math.random() * options.length)];
  console.log('Selected Airline:', randomAirline);

  await page.selectOption('#arrival-airlines', randomAirline);  

  await page.waitForTimeout(1000); 

  const visibleAirlines = await page.$$eval('#arrivals tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')  
      .map(row => {
        const cell = row.querySelector('td:nth-child(3)'); 
        return cell ? cell.textContent.trim() : null;
      })
      .filter(airline => airline !== null)  
  );

  console.log('Visible Airlines:', visibleAirlines);

  expect(visibleAirlines.every(airline => airline.includes(randomAirline))).toBe(true);

  const rows = await page.$$('#arrivals tbody tr'); 

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none'); 
   
    if (isVisible) {
      const airlineElement = await row.$('td:nth-child(3)');  
      const airlineValue = await airlineElement.evaluate(el => el.textContent.trim());
      
      await row.click(); 
      await page.waitForTimeout(1000); 

      const drawerAirline = await page.$eval('#arrival-drawer .airline', el => el.textContent.trim());
      console.log("Drawer Airline: " + drawerAirline);
      
      expect(drawerAirline).toBe(airlineValue);

      const closeButton = await page.$('#arrival-drawer button');
      if (closeButton) {
        await closeButton.click(); 
        await page.waitForTimeout(1000); 
      }
    }
  }
  console.log('Filter by airlines works correctly');
});


test('filter options by search input arrivals', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');
  
  const options = await page.$$eval('#arrival-cities option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );

  const randomCity = options[Math.floor(Math.random() * options.length)];

  console.log('Searching for City:', randomCity);

  await page.fill('input[name="arrival-search"]', randomCity);  
  await page.waitForTimeout(1000);  

  const visibleCities = await page.$$eval('#arrivals tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')  
      .map(row => {
        const cell = row.querySelector('td:nth-child(2)');
        return cell ? cell.textContent.trim() : null;
      })
      .filter(city => city !== null)  
  );

  console.log('Visible Cities:', visibleCities);

  expect(visibleCities.every(city => city.includes(randomCity))).toBe(true);

  const rows = await page.$$('#arrivals tbody tr'); 

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none'); 
   
    if (isVisible) {
      const cityElement = await row.$('td:nth-child(2)');
      const cityValue = await cityElement.evaluate(el => el.textContent.trim());
      
      await row.click();  
      await page.waitForTimeout(1000); 

      const drawerCity = await page.$eval('#arrival-drawer .from', el => el.textContent.trim());
      console.log("Drawer City: " + drawerCity);
      
      expect(drawerCity).toBe(cityValue);

      const closeButton = await page.$('#arrival-drawer button');
      if (closeButton) {
        await closeButton.click(); 
        await page.waitForTimeout(1000); 
      }
    }
  }
  console.log('Search filter works correctly');
});


// Deprtures list
test('filter options cities for departures', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');

  await page.click('ul > li:nth-child(2) a[href="#departures-tab"]');

  await expect(page.locator('#departures-tab')).toBeVisible();

  const options = await page.$$eval('#departure-cities option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );

  const randomCity = options[Math.floor(Math.random() * options.length)];
  console.log('Selected City:', randomCity);

  await page.selectOption('#departure-cities', randomCity);

  await page.waitForTimeout(1000);

  const visibleCities = await page.$$eval('#departures tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')
      .map(row => {
        const cell = row.querySelector('td:nth-child(2)');
        return cell ? cell.textContent.trim() : null;
      })
      .filter(city => city !== null)
  );

  console.log('Visible Cities:', visibleCities);

  expect(visibleCities.every(city => city === randomCity)).toBe(true);

  const rows = await page.$$('#departures tbody tr');

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none');

    if (isVisible) {
      const cityElement = await row.$('td:nth-child(2)');
      const cityValue = await cityElement.evaluate(el => el.textContent.trim());
      await row.click();
      await page.waitForTimeout(1000);

      const drawerCity = await page.$eval('#departure-drawer .to', el => el.textContent.trim());
      console.log("Drawer City: " + drawerCity);

      expect(drawerCity).toBe(cityValue);

      const closeButton = await page.$('#departure-drawer button');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
  }
  console.log('Filter by cities for departures works correctly');
});


test('filter options airlines departures', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');

  await page.click('ul > li:nth-child(2) a[href="#departures-tab"]');

  await expect(page.locator('#departures-tab')).toBeVisible();

  const options = await page.$$eval('#departure-airlines option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );

  const randomAirline = options[Math.floor(Math.random() * options.length)];
  console.log('Selected Airline:', randomAirline);

  await page.selectOption('#departure-airlines', randomAirline);  

  await page.waitForTimeout(1000); 

  const visibleAirlines = await page.$$eval('#departures tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')  
      .map(row => {
        const cell = row.querySelector('td:nth-child(3)'); 
        return cell ? cell.textContent.trim() : null;
      })
      .filter(airline => airline !== null)  
  );

  console.log('Visible Airlines:', visibleAirlines);

  expect(visibleAirlines.every(airline => airline.includes(randomAirline))).toBe(true);

  const rows = await page.$$('#departures tbody tr'); 

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none'); 
   
    if (isVisible) {
      const airlineElement = await row.$('td:nth-child(3)');  
      const airlineValue = await airlineElement.evaluate(el => el.textContent.trim());
      
      await row.click(); 
      await page.waitForTimeout(1000); 

      const drawerAirline = await page.$eval('#departure-drawer .airline', el => el.textContent.trim());
      console.log("Drawer Airline: " + drawerAirline);
      
      expect(drawerAirline).toBe(airlineValue);

      const closeButton = await page.$('#departure-drawer button');
      if (closeButton) {
        await closeButton.click(); 
        await page.waitForTimeout(1000); 
      }
    }
  }
  console.log('Filter by departure airlines works correctly');
});


test('filter options by search input departures', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://flypittsburgh.com/pittsburgh-international-airport/flights/flight-status/');

  await page.click('ul > li:nth-child(2) a[href="#departures-tab"]');

  await expect(page.locator('#departures-tab')).toBeVisible();
  
  const options = await page.$$eval('#departure-cities option', options => 
    options.map(option => option.value).filter(value => value !== null && value !== undefined && value.trim() !== '')
  );
  
  const randomCity = options[Math.floor(Math.random() * options.length)];

  console.log('Searching for City:', randomCity);

  await page.fill('input[name="departure-search"]', randomCity);  
  await page.waitForTimeout(1000);  

  const visibleCities = await page.$$eval('#departures tbody tr', rows => 
    rows
      .filter(row => row.style.display !== 'none')  
      .map(row => {
        const cell = row.querySelector('td:nth-child(2)'); 
        return cell ? cell.textContent.trim() : null;
      })
      .filter(city => city !== null)  
  );

  console.log('Visible Cities:', visibleCities);

  expect(visibleCities.every(city => city.includes(randomCity))).toBe(true);

  const rows = await page.$$('#departures tbody tr'); 

  for (const row of rows) {
    const isVisible = await row.evaluate(row => row.style.display !== 'none'); 
   
    if (isVisible) {
      const cityElement = await row.$('td:nth-child(2)');  
      const cityValue = await cityElement.evaluate(el => el.textContent.trim());
      
      await row.click();  
      await page.waitForTimeout(1000); 

      const drawerCity = await page.$eval('#departure-drawer .to', el => el.textContent.trim());
      console.log("Drawer City: " + drawerCity);
      
      expect(drawerCity).toBe(cityValue);

      const closeButton = await page.$('#departure-drawer button');
      if (closeButton) {
        await closeButton.click(); 
        await page.waitForTimeout(1000); 
      }
    }
  }
  console.log('Search filter for departures works correctly');
});
