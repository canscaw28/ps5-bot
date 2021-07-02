# ps5-bot

## Description
This is a very simple cron that will alert you via sms if a ps5 is in stock. Puppeteer is used to inspect the dom elements. If it appears that an item is in stock, the bot will trigger an sms alert to the designated phone number via twilio's api.

## Setup
intallation
`yarn install`

Create a `.env` file with the following values:
```
TWILIO_AUTH_TOKEN="[Your twilio auth token]"
TWILIO_ACCOUNT_SID="[your twilio accound sid]"
TWILIO_PHONE_NUMBER="[A designated twilio phone number]"
PERSONAL_PHONE_NUMBER="[the recipient phone number of the alert]"
```

To run the server:
`yarn start`

## Disclaimer
This bot was made purely for entertainment purposes. I am not responsible for how it is used externally.
