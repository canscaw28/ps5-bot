import cron from 'node-cron';
import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import twilio from 'twilio';
import _ from 'lodash';

dotenv.config();

const targetURL = 'https://www.target.com/p/playstation-5-console/-/A-81114595';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const personalPhoneNumbers = _.split(process.env.PERSONAL_PHONE_NUMBERS, ',');
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);
const app = express();
let cooldown = 0;

const logger = (message) => {
  console.log(new Date(Date.now()), message)
}

const triggerAlert = async () => {
  _.forEach(personalPhoneNumbers, number => {
    twilioClient.messages
      .create({body: `PS5 ALERT!!! visit the following link ASAP: ${targetURL}`, from: twilioPhoneNumber, to: number})
      .then(message => console.log(message.sid));
  });
}

const setupBrowser = async () => {
  logger('Setting up puppeteer');
  return puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
}

// Hacky Target Alert
const fetchTarget = async (browser) => {
  logger('Fetching target page');
  const page = await browser.newPage();
  await page.goto(targetURL);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const element = await page.$('[data-test="soldOutBlock"]');
  if (element) {
    const value = await page.evaluate(el => el.textContent, element);
    if (value === 'Sold out') {
      logger('Product is Sold out.')
      return;
    }
  }

  logger('Product is in stock!')
  cooldown = 10;
  await triggerAlert();
}

cron.schedule('*/30 * * * * *', async () => {
  logger('Cron job started');
  const browser = await setupBrowser();

  if (cooldown > 0) {
    cooldown--;
    return;
  }

  await fetchTarget(browser);

  browser.close();
  logger('~ Job Finished ~')
});

const port = process.env.PORT || 3000;
const server = app.listen(port);

const shutDown = () => {
  logger('Shutting down server');
  server.close(() => {
      process.exit(0);
  });
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);