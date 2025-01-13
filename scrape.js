const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('dotenv').config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const mySMS = process.env.MY_SMS;
const twilioSMS = process.env.TWILIO_SMS;
const client = require('twilio')(accountSid, authToken);

// Configuration constants
const url = 'https://store.steampowered.com/sale/steamdeckrefurbished/';
const targetProduct = 'Steam Deck 1TB OLED - Valve Certified Refurbished'; // CHANGE THIS TO THE PRODUCT YOU WANT, THERE IS A LIST ON LINE 51
const checkInterval = 5 * 60 * 1000; // 5 minutes

async function scrape() {
    let browser = null;
    try {
        console.log(`[${new Date().toISOString()}] Checking Steam Deck stock...`);
        
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });

        const page = await browser.newPage();
        
        // Set a longer navigation timeout
        await page.setDefaultNavigationTimeout(60000);
        
        // Navigate to the page and wait for the content to load
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for any dynamic content to load
        await page.waitForTimeout(5000);

        // Extract product information using page.evaluate()
        const products = await page.evaluate(() => {
            // This function runs in the browser context
            const products = [];
            
            // Get all text content from the page
            const pageText = document.body.textContent || '';
            
            // Define known product patterns
            const knownProducts = [
                'Steam Deck 512 GB OLED - Valve Certified Refurbished',
                'Steam Deck 1TB OLED - Valve Certified Refurbished',
                'Steam Deck 64 GB LCD - Valve Certified Refurbished',
                'Steam Deck 256 GB LCD - Valve Certified Refurbished',
                'Steam Deck 512 GB LCD - Valve Certified Refurbished'
            ];
            
            // Look for each known product in the page content
            knownProducts.forEach(productName => {
                if (pageText.includes(productName)) {
                    // Find the closest "Out of stock" or price text
                    const productSection = pageText.substring(
                        pageText.indexOf(productName),
                        pageText.indexOf(productName) + 200
                    );
                    
                    const stockStatus = productSection.includes('Out of stock') 
                        ? 'Out of stock' 
                        : 'In Stock';
                    
                    // Find price using regex
                    const priceMatch = productSection.match(/£\d+\.\d{2}/);
                    const price = priceMatch ? priceMatch[0] : '';
                    
                    products.push({
                        title: productName,
                        stock: stockStatus,
                        price: price
                    });
                }
            });
            
            return products;
        });

        // Log all found products
        console.log('\nAll products found:');
        products.forEach(product => {
            console.log(`\nTitle: ${product.title}`);
            console.log(`Stock: ${product.stock}`);
            console.log(`Price: ${product.price}`);
        });

        // Find our target product
        const targetProductInfo = products.find(p => p.title === targetProduct);

        if (targetProductInfo) {
            console.log(`\n[${new Date().toISOString()}] Target product status:`, targetProductInfo);
            
            if (targetProductInfo.stock !== 'Out of stock') {
                console.log('\nPRODUCT IN STOCK! Sending SMS alert...');
                await sendSMS(targetProductInfo);
                clearInterval(handle);
            } else {
                console.log(`\n${targetProduct} is out of stock. Next check in 5 minutes.`);
            }
        } else {
            console.log('\nWarning: Target product not found on page.');
        }

    } catch (error) {
        console.error('\nError during scraping:', error);
    } finally {
        if (browser) await browser.close();
    }
}

async function sendSMS(product) {
    try {
        const messageBody = `Steam Deck Stock Alert!\n\n${product.title}\nStock Status: ${product.stock}\nPrice: ${product.price}\n\nLink: ${url}`;
        
        const message = await client.messages.create({
            body: messageBody,
            from: twilioSMS,
            to: mySMS
        });

        console.log('SMS sent successfully:', message.sid);
    } catch (error) {
        console.error('Failed to send SMS:', error);
    }
}

// Start monitoring
let handle = setInterval(scrape, checkInterval);
console.log(`Starting monitoring for ${targetProduct}`);
console.log(`Checking every ${checkInterval/1000} seconds`);

// Initial check
scrape();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nStopping monitoring...');
    clearInterval(handle);
    process.exit();
});
