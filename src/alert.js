import twilio from 'twilio';
import Promise from 'bluebird';
import env from './env';
import { targetURL } from './defaults';

export const setupTwilioClient = () =>
  twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const sendTextAlert = async (client, logger) => {
  await Promise.map(env.PHONE_NUMBERS.split(','), async (number) => {
    logger.log(`Sending alert to ${number}`);
    const res = await client.messages
      .create({
        body: `PS5 ALERT!!! visit the following link ASAP: ${targetURL}`,
        from: env.TWILIO_PHONE_NUMBER,
        to: number,
      })
      .then((message) => console.log(message.sid));
    console.log(res);
  });
};
