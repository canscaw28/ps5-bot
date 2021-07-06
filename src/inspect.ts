import puppeteer, { Browser } from 'puppeteer';
import { Twilio } from 'twilio';
import Logger from './logger';
import { sendTextAlert } from './alert';
import { CooldownMap, Retailers, retailerParams } from './defaults';

const setupBrowser = async (retailer: Retailers, logger: Logger) => {
  logger.log('Setting up puppeteer');
  return puppeteer.launch({
    headless: retailerParams[retailer].headless,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1400,900',
      '--remote-debugging-port=9222',
      '--remote-debugging-address=0.0.0.0',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process',
      '--blink-settings=imagesEnabled=true'
    ],
  });
};

interface InspectRetailer {
  retailer: Retailers;
  logger: Logger;
  browser: Browser;
  twilioClient: Twilio;
  cooldownMap: CooldownMap;
}

const inspectRetailer = async ({
  retailer,
  logger,
  browser,
  twilioClient,
  cooldownMap,
}: InspectRetailer): Promise<void> => {
  logger.log(`Fetching page from ${retailer}`);
  const params = retailerParams[retailer];
  const page = await browser.newPage();
  await page.goto(params.url);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const element = await page.$(params.selector);
  if (element) {
    const value = await page.evaluate((el) => el.textContent, element);
    if (value === params.value || (params.fn && params.fn(value))) {
      logger.log(`Product is Sold out at ${retailer}`);
      return;
    }
  }

  logger.log('Product is in stock!');
  cooldownMap[retailer] = 10;
  await sendTextAlert(retailer, twilioClient, logger);
};

export const inspectionJob = async (
  retailer: Retailers,
  twilioClient: Twilio,
  cooldownMap: CooldownMap
): Promise<void> => {
  const logger = new Logger(retailer);
  logger.log(`Cron job started for retailer: ${retailer}`);
  const browser = await setupBrowser(retailer, logger);

  if (cooldownMap[retailer] > 0) {
    cooldownMap[retailer]--;
    logger.log(
      `${Retailers} cron is cooling down. Count: ${cooldownMap[retailer]}`
    );
    return;
  }

  await inspectRetailer({
    retailer,
    logger,
    browser,
    twilioClient,
    cooldownMap,
  });

  browser.close();
  logger.log('~ Job Finished ~');
  console.log('');
};
