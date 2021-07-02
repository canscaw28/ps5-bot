import cron from 'node-cron';
import express from 'express';
import puppeteer from 'puppeteer';
  
const app = express();

const targetURL = 'https://www.target.com/p/playstation-5-console/-/A-81114595';

// Hacky Target Alert
const setupBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(targetURL);

  // Wait for page content to load
  await page.waitForTimeout(3000);
  const html = await page.evaluate(() => document.querySelector('*').outerHTML);
  console.log(html)

  await browser.close();
}

cron.schedule('*/30 * * * * *', async () => {
    console.log('test');
    await setupBrowser();
});
  
app.listen(3000);