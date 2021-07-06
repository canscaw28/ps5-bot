import express from 'express';
import { schedule } from 'node-cron';
import bluebird from 'bluebird';
import env from './env';
import setupRoutes from './routes';
import { setupTwilioClient } from './alert';
import { CooldownMap, Retailers } from './defaults';
import _ from 'lodash';

import { inspectionJob } from './inspect';

global.Promise = <any>bluebird;

const app = express();
const twilioClient = setupTwilioClient();

setupRoutes(app, twilioClient);

const cooldownMap: CooldownMap = {
  [Retailers.Target]: 0,
  [Retailers.BestBuy]: 0,
  [Retailers.GameStop]: 0,
  [Retailers.Walmart]: 0,
  [Retailers.Costco]: 0,
  [Retailers.Sony]: 0,
};

const scheduleCron = (cronSchedule: string, retialer: Retailers) => {
  schedule(
    cronSchedule,
    () => inspectionJob(retialer, twilioClient, cooldownMap),
    { timezone: 'America/Los_Angeles' }
  );
};

// Schedule crons for each retailer
_.forEach(Retailers, retailer => scheduleCron('*/30 * * * * *', retailer));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server is listening at port ${port}`);
console.log(
  `The following phone numbers will be alerted: ${env.PHONE_NUMBERS}`
);

const shutDown = () => {
  console.log('Shutting down server');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
