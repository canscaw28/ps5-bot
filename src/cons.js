import cron from 'node-cron';
import { setupTwilioClient } from './alert';
import { inspectTarget } from './inspect';

const twilioClient = setupTwilioClient();
const cooldownMap = {
  target: 0,
};

const scheduleCrons = () => {
  cron.schedule('*/30 * * * * *', async () =>
    inspectTarget(twilioClient, cooldownMap)
  );
};

export default scheduleCrons;
