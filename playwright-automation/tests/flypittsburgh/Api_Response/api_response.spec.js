import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('flight board api response', async ({ request }) => {
    const apiUrl = 'https://func-amadeusfidsnow-2-api-old.azurewebsites.net/api/AmadeusFIDsNow2ApiOld';

    const response = await request.post(apiUrl);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    const currentTime = new Date().toLocaleString();

    const logMessage = `Timestamp: ${currentTime}\nResponse Status: ${response.status()}\nResponse Body: ${JSON.stringify(responseBody, null, 2)}\n\n`;

    const logFilePath = path.join(__dirname, 'flight_apiresponse.txt');

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
});


test('Security Wait Time api response', async ({ request }) => {
    const apiUrl = 'https://getwaittimes.azurewebsites.net/api/remoteGetWaitTimes';

    const response = await request.post(apiUrl);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    const currentTime = new Date().toLocaleString();

    const logMessage = `Timestamp: ${currentTime}\nResponse Status: ${response.status()}\nResponse Body: ${JSON.stringify(responseBody, null, 2)}\n\n`;

    const logFilePath = path.join(__dirname, 'security_apiresponse.txt');

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
});


test('parking api response', async ({ request }) => {
    const apiUrl = 'https://getparkingpercent.azurewebsites.net/api/remoteGetParkingPercent';

    const response = await request.post(apiUrl);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    const currentTime = new Date().toLocaleString();

    const logMessage = `Timestamp: ${currentTime}\nResponse Status: ${response.status()}\nResponse Body: ${JSON.stringify(responseBody, null, 2)}\n\n`;

    const logFilePath = path.join(__dirname, 'parking_apiresponse.txt');

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
});


test('blueskynews api response', async ({ request }) => {
    const apiUrl = 'https://blueskypit.com/wp-json/wp/v2/posts';

    const response = await request.get(apiUrl);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    const currentTime = new Date().toLocaleString();

    const logMessage = `Timestamp: ${currentTime}\nResponse Status: ${response.status()}\nResponse Body: ${JSON.stringify(responseBody, null, 2)}\n\n`;

    const logFilePath = path.join(__dirname, 'blueskynews_apiresponse.txt');

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
});