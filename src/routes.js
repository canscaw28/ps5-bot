import Logger from './logger';
import { sendTextAlert } from './alert';

const setupRoutes = (app, twilioClient) => {
  // Test Twillio Alert
  app.get('/test', async () => {
    await sendTextAlert(twilioClient, new Logger());
  });
};

export default setupRoutes;
