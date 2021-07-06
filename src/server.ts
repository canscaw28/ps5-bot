import express from 'express';
import { schedule } from 'node-cron';
import bluebird from 'bluebird';
import env from './env';
import setupRoutes from './routes';
import { setupTwilioClient } from './alert';
import { CooldownMap, Retailers } from './defaults';

import { inspectionJob } from './inspect';

global.Promise = <any>bluebird;

const app = express();
const twilioClient = setupTwilioClient();

setupRoutes(app, twilioClient);

const cooldownMap: CooldownMap = {
  target: 0,
};

const scheduleCron = (cronSchedule: string, retialer: Retailers) => {
  schedule(
    cronSchedule,
    () => inspectionJob(retialer, twilioClient, cooldownMap),
    { timezone: 'America/Los_Angeles' }
  );
};

scheduleCron('*/30 * * * * *', Retailers.Target);

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
