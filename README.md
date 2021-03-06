# ps5-bot

## Description

This is a very simple cron that will alert you via sms if a ps5 is in stock. Puppeteer is used to inspect the dom elements. If it appears that an item is in stock, the bot will trigger an sms alert to the designated phone number via twilio's api.

## Considerations

The bot currently supports Target, BestBuy, Walmart, Gamestop, Costco and Sony. If you plan on deploying this live, consider running each cron on a different instance (you may need to fork and slightly modify my code to get this to work).

I was also considering having the bot fill out your credit card information and make the transaction for you. But this honestly seems unnecessary? If the alerting + my human reflexes are not fast enough, I might have to implement this part later. ¯\\\_(ツ)\_/¯

## Setup

installation
`yarn install`

Create a `.env` file with the following values:

```
TWILIO_AUTH_TOKEN="[Your twilio auth token]"
TWILIO_ACCOUNT_SID="[your twilio account sid]"
TWILIO_PHONE_NUMBER="[A designated twilio phone number]"
PHONE_NUMBERS="[comma delimited list of phone numbers to alert]"
```

To run the server:
`yarn start`

## Disclaimer

This bot was made purely for entertainment purposes. I am not responsible for how it is used externally.
