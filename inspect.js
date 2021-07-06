import puppeteer from 'puppeteer';
import Logger from './logger';
import { sendTextAlert } from './alert';
import { targetURL } from './defaults';

const setupBrowser = async (logger) => {
  logger.log('Setting up puppeteer');
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
};

// Hacky Target Alert
const fetchTarget = async (logger, browser, twilioClient, cooldownMap) => {
  logger.log('Fetching target page');
  const page = await browser.newPage();
  await page.goto(targetURL);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const element = await page.$('[data-test="soldOutBlock"]');
  if (element) {
    const value = await page.evaluate((el) => el.textContent, element);
    if (value === 'Sold out') {
      logger.log('Product is Sold out.');
      return;
    }
  }

  logger.log('Product is in stock!');
  cooldownMap.target = 10;
  await sendTextAlert(twilioClient, logger);
};

export const inspectTarget = async (twilioClient, cooldownMap) => {
  const logger = new Logger();
  logger.log('Cron job started');
  const browser = await setupBrowser(logger);

  if (cooldownMap.target > 0) {
    cooldownMap.target--;
    logger.log(`Cron is cooling down. Count: ${cooldownMap.target}`);
    return;
  }

  await fetchTarget(logger, browser, twilioClient, cooldownMap);

  browser.close();
  logger.log('~ Job Finished ~');
  console.log('');
};
