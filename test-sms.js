// This is a test version of the Steam Deck stock checker that simulates finding stock
const puppeteer = require('puppeteer');
require('dotenv').config();

// Twilio configuration - same as the main script
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const mySMS = process.env.MY_SMS;
const twilioSMS = process.env.TWILIO_SMS;
const client = require('twilio')(accountSid, authToken);

// For testing, we'll create a simulated product that appears to be in stock
const testProduct = {
    title: 'Steam Deck 1TB OLED - Valve Certified Refurbished',
    stock: 'In Stock',  // We're forcing this to be "In Stock" for testing
    price: '£459.00'
};

async function testSMS() {
    try {
        console.log('Testing SMS functionality...');
        console.log('\nSimulated product status:', testProduct);
        
        // Construct the message just like in the main script
        const messageBody = `Steam Deck Stock Alert!\n\n${testProduct.title}\nStock Status: ${testProduct.stock}\nPrice: ${testProduct.price}\n\nLink: https://store.steampowered.com/sale/steamdeckrefurbished/`;
        
        // Send the test message
        const message = await client.messages.create({
            body: messageBody,
            from: twilioSMS,
            to: mySMS
        });

        console.log('\nSMS sent successfully!');
        console.log('Message SID:', message.sid);
        console.log('\nIf you received the SMS, your Twilio configuration is working correctly.');
        console.log('You can now use the main script with confidence that alerts will work.');
        
    } catch (error) {
        console.error('\nError sending SMS:', error);
        console.log('\nPossible issues to check:');
        console.log('1. Verify your .env file has all required Twilio credentials');
        console.log('2. Check that your Twilio account has sufficient credit');
        console.log('3. Confirm your Twilio phone number is properly set up');
        console.log('4. Verify the recipient phone number is in the correct format');
    }
}

// Run the test
console.log('Starting SMS test for Steam Deck stock checker...');
testSMS().then(() => {
    console.log('\nTest complete. You can press Ctrl+C to exit.');
});