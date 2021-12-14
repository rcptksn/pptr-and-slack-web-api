const puppeteer = require('puppeteer');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);
const conversationId = process.env.SLACK_CHANNEL_ID;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
          width:1280,
          height:768
        }
      });
    const page = await browser.newPage();
    await page.goto('http://www.recepteksan.com');

    await page.waitForSelector('p.category');
    const userTitle = await page.$eval("p.category", (element) => {
        return element.innerHTML;
    });

    const result = await web.chat.postMessage({
        text: userTitle,
        channel: conversationId,
      });
      
    console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
  
    await browser.close();
  })();