import cron from 'node-cron';
import { Twilio } from 'twilio';
import { inspectTarget } from './inspect';

const cooldownMap = {
  target: 0,
};

const scheduleCrons = (twilioClient: Twilio): void => {
  cron.schedule('*/30 * * * * *', async () =>
    inspectTarget(twilioClient, cooldownMap)
  );
};

export default scheduleCrons;
