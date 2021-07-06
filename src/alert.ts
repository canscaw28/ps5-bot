import twilio, { Twilio } from 'twilio';
import env from './env';
import { Retailers, retailerParams } from './defaults';
import Logger from './logger';

export const setupTwilioClient = (): Twilio =>
  twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const sendTextAlert = async (
  retailer: Retailers,
  client: Twilio,
  logger: Logger
): Promise<void> => {
  await Promise.map(env.PHONE_NUMBERS.split(','), async (number) => {
    logger.log(`Sending alert to ${number}`);
    const res = await client.messages
      .create({
        body: `${retailer} PS5 ALERT!!! visit the following link ASAP: ${
          retailerParams[retailer].url
        }`,
        from: env.TWILIO_PHONE_NUMBER,
        to: number,
      })
      .then((message) => console.log(message.sid));
  });
};
