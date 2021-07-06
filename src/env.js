import envalid, { str } from 'envalid';

const env = envalid.cleanEnv(process.env, {
  TWILIO_ACCOUNT_SID: str(),
  TWILIO_AUTH_TOKEN: str(),
  TWILIO_PHONE_NUMBER: str(),
  PHONE_NUMBERS: str(),
});

export default env;
