import { Twilio } from 'twilio';
import { Express } from 'express';
import Logger from './logger';
import { sendTextAlert } from './alert';
import { Retailers } from './defaults';

const setupRoutes = (app: Express, twilioClient: Twilio): void => {
  // Test Twillio Alert
  app.get('/test', async () => {
    await sendTextAlert(Retailers.Target, twilioClient, new Logger());
  });
};

export default setupRoutes;
