import cron from 'node-cron';
import express from 'express';
import puppeteer from 'puppeteer';

const targetURL = 'https://www.target.com/p/playstation-5-console/-/A-81114595';

const app = express();
let browser = null;

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
  const html = await page.evaluate(() => document.querySelector('*').outerHTML);
  console.log(html)
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