import puppeteer, { Browser } from 'puppeteer';
import { Twilio } from 'twilio';
import Logger from './logger';
import { sendTextAlert } from './alert';
import { CooldownMap, Retailers, retailSites } from './defaults';

const setupBrowser = async (logger: Logger) => {
  logger.log('Setting up puppeteer');
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
  const retailerParams = retailSites[retailer];
  const page = await browser.newPage();
  await page.goto(retailerParams.url);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const element = await page.$(retailerParams.selector);
  if (element) {
    const value = await page.evaluate((el) => el.textContent, element);
    if (value === retailerParams.value || (retailerParams.fn && retailerParams.fn(value))) {
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
  const browser = await setupBrowser(logger);

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
