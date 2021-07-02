import cron from 'node-cron';
import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const targetURL = 'https://www.target.com/p/playstation-5-console/-/A-81114595';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const personalPhoneNumber = process.env.PERSONAL_PHONE_NUMBER;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);
const app = express();
let browser = null;

const triggerAlert = async () => {
  twilioClient.messages
      .create({body: `PS5 ALERT!!! visit ${targetURL}`, from: twilioPhoneNumber, to: personalPhoneNumber})
      .then(message => console.log(message.sid));
}

const setupBrowser = async () => {
  console.log('Setting up puppeteer')
  browser = await puppeteer.launch();
}

// Hacky Target Alert
const fetchTarget = async () => {
  console.log('Fetching target page')
  const page = await browser.newPage();
  await page.goto(targetURL);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const element = await page.$('[data-test="soldOutBlock"]');
  if (element) {
    const value = await page.evaluate(el => el.textContent, element);
    if (value === 'Sold out') {
      console.log('Product is Sold out.')
      return;
    }
  }

  console.log('Product is in stock!')
  await triggerAlert();
}

cron.schedule('*/30 * * * * *', async () => {
    console.log('Cron job started', new Date(Date.now()));
    if (!browser) {
      await setupBrowser();
    }
    await fetchTarget();
});
  
const server = app.listen(3000);

const shutDown = () => {
  console.log('Shutting down server');
  server.close(() => {
      process.exit(0);
  });
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);