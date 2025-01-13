<h1>Deck Scraper</h1>
This is a web scraping application that checks the stock of Steam Deck refurbished models and sends you a text when it's in stock! This script has been updated to work with Valve's official refurbished Steam Deck store page instead of the original store, giving you a chance to get a certified refurbished Steam Deck at a discounted price.

## Contents
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Testing SMS](#testing-sms)
-   [Monitoring a different Steam Deck model](#monitoring-a-different-steam-deck-model)
-   [Deployment](#deployment)

## Requirements
This project was written in node.js so make sure you have it installed on your system.

<details>
<summary>Help I'm scared and lost</summary>
<br>
If you are not sure, run the following command in your terminal/command prompt:

```sh
node -v
```

This will check the version (if any) of Node.js you have installed.
Download at the following link if needed:
https://nodejs.org/en

</details>

## Installation
1. Download the files from this repository.
2. Open a new terminal/command prompt and navigate to the root folder (Deck_Scraper-main).
3. Run the following command in the terminal/command prompt.

```sh
npm install
```

This will install the node.js packages required:
**Puppeteer** and **Twilio**. The script no longer requires Cheerio as it now uses Puppeteer's built-in page evaluation capabilities to check the refurbished store page.

#### Configuring SMS
There is a little bit of set up required to get the SMS working. You need to make a (free) account with Twilio and enter the required details into the .env file. I've detailed the steps below:

First set up an account with Twilio:
https://www.twilio.com/en-us.
The free trial account will give you everything required for this script to work.

Once you make it to the console page, click 'get a free phone number'.
You also need your Account SID and Auth Token (found on the console page).

Next, open the .env file with a text editor (.env may be a hidden file) and paste the Account SID, Auth Token, twilio phone number, and your verified phone number as shown in the comments in the file. Save and exit the file.

**Important Note**: Don't upload your edited .env file anywhere on the internet. Other people have web scrapers that will alert them that you have uploaded your twilio details and personal phone number.

Now you should be good to go!

## Usage
Open the root folder (Deck_Scraper-main) in your terminal/command prompt and enter the following command:

```sh
node scrape.js
```

This will check Valve's official refurbished Steam Deck store page every 5 minutes and display all available models. The script has been updated to work with the new refurbished store page (store.steampowered.com/sale/steamdeckrefurbished/) instead of the original Steam Deck store, and now shows you the status of all available refurbished models:

```
All products found:
Title: Steam Deck 512 GB OLED - Valve Certified Refurbished
Stock: Out of stock
Price: £389.00

Title: Steam Deck 1TB OLED - Valve Certified Refurbished
Stock: Out of stock
Price: £459.00
```

## Testing SMS
To test if your SMS configuration is working correctly, run:

```sh
node test-sms.js
```

This will simulate finding a Steam Deck in stock and send a test message to your phone to verify everything is set up correctly.

#### Monitoring a different Steam Deck model
The script has been updated to work with Valve's complete refurbished lineup. By default, it monitors the Steam Deck 1TB OLED model. To monitor a different model, change the targetProduct variable in scrape.js to match exactly one of these refurbished models:

```js
const targetProduct = 'Steam Deck 512 GB OLED - Valve Certified Refurbished';
// or
const targetProduct = 'Steam Deck 1TB OLED - Valve Certified Refurbished';
// or
const targetProduct = 'Steam Deck 64 GB LCD - Valve Certified Refurbished';
// or
const targetProduct = 'Steam Deck 256 GB LCD - Valve Certified Refurbished';
// or
const targetProduct = 'Steam Deck 512 GB LCD - Valve Certified Refurbished';
```

Make sure to use the exact name including "Valve Certified Refurbished" as this identifies the products on the refurbished store page. The script now uses direct text matching instead of checking individual size and stock properties, making it more reliable for the refurbished store format.

## Deployment
If you want this script to run on a server, I personally recommend setting it up to run on a raspberry pi. Another option would be to deploy it to a cloud service such as Google cloud or AWS.
