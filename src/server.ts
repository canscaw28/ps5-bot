import express from 'express';
import env from './env';
import scheduleCrons from './crons';
import setupRoutes from './routes';

const app = express();

scheduleCrons();
setupRoutes(app);

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
