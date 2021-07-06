import cron from 'node-cron';
import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { sendTextAlert, setupTwilioClient } from './alert';
import env from './env';

dotenv.config();

const targetURL = 'https://www.target.com/p/playstation-5-console/-/A-81114595';

const app = express();
const twilioClient = setupTwilioClient();
let cooldown = 0;

class Logger {
  constructor() {
    this.id = uuidv4();
  }

  log(message) {
    console.log(new Date(Date.now()), this.id, message);
  }
}

const setupBrowser = async (logger) => {
  logger.log('Setting up puppeteer');
  return puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
};

// Hacky Target Alert
const fetchTarget = async (logger, browser) => {
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
  cooldown = 10;
  await sendTextAlert();
};

cron.schedule('*/30 * * * * *', async () => {
  const logger = new Logger();
  logger.log('Cron job started');
  const browser = await setupBrowser(logger);

  if (cooldown > 0) {
    cooldown--;
    logger.log(`Cron is cooling down. Count: ${cooldown}`);
    return;
  }

  await fetchTarget(logger, browser);

  browser.close();
  logger.log('~ Job Finished ~');
  console.log('');
});

// Test Twillio Alert
app.get('/test', async () => {
  await sendTextAlert(twilioClient, new Logger());
});

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server is listening at port ${port}`);
console.log(`The following phone numbers will be alerted: ${env.PHONE_NUMBERS}`);

const shutDown = () => {
  console.log('Shutting down server');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
