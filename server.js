import cron from 'node-cron';
import express from 'express';
  
app = express();

cron.schedule("*/10 * * * * *", () => {
    console.log("test");
});
  
app.listen(3000);