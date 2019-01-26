const puppeteer = require('puppeteer');

/* 
Before use this module , you have to sync data from your main browser
to temp folder. This help you login multiple times automatically.

Turn your terminal and type following command
1. Created temp user data dir (if not exist)
    mkdir /tmp/puppeteer_test
2.Run Chrome with these arguments

    /usr/bin/google-chrome --user-data-dir=/tmp/puppeteer_test --password-store=basic

3. Go to shopee.vn, log into and then close the browser
4. Run puppeteer with appropriate arguments:
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
        args: ['--user-data-dir=/tmp/puppeteer_test']
    });
Note: Path can be difference, just find it!
*/

const _openChatAndSendMessage = async (shopID) => {
    const BUTTON_CHAT_SELECTOR = '.section-seller-overview-horizontal__leading-content > .section-seller-overview-horizontal__buttons > div:nth-child(2)';
    const ITEM_SELECTOR = '.shop-all-product-view .shop-search-result-view > .row > div:first-child';
    const BUTTON_CHAT_IN_PRODUCT_PAGE = '.page-product__shop ._1jOO4S > button';

    const BLOCKED_SELECTOR = '.section-seller-overview-horizontal__leading-blocking-mask';

    const browser = await puppeteer.launch({
        executablePath:'/snap/bin/chromium',
        slowMo: 10,
        headless: false,
        defaultViewport: false,
        args: ['--user-data-dir=/tmp/puppeteer_test']
    });
    
    const page = await browser.newPage();
    await page.goto(`https://shopee.vn/shop/${shopID}` , {waitUntil: 'networkidle2'});
    try {
       (await page.$eval(BLOCKED_SELECTOR, blocked => blocked)!={})? console.log('Blocked!'):'';
    } catch (error) {
        console.log
        const hasChat = await page.$eval(BUTTON_CHAT_SELECTOR, button => !((" " + button.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf('section-seller-overview-horizontal__button--disabled') > -1));
            console.log(hasChat);
            if(hasChat){ // having chat button on profile page
                await page.click(BUTTON_CHAT_SELECTOR);
                await page.waitFor(1000);
                await page.click('.chat-panel textarea');
                await page.type('.chat-panel textarea', 'Test bot' , {delay: 100});
                await page.waitFor(500);
                await page.keyboard.press('Enter');
            }
            else{ 
                // throw error if not having products
                try{
                    await page.click(ITEM_SELECTOR);
                    //throw error if not cant click
                    try {
                        await page.waitForSelector(BUTTON_CHAT_IN_PRODUCT_PAGE);
                        await page.click(BUTTON_CHAT_IN_PRODUCT_PAGE);
                        await page.waitFor(1000);
                        await page.click('.chat-panel textarea');
                        await page.type('.chat-panel textarea', 'Test bot' , {delay: 100});
                        await page.waitFor(500);
                        await page.keyboard.press('Enter');
                    }catch (error) {
                        console.log(error);
                        console.log("Failed to click");
                    }
                }catch (error) {
                    console.log(error);
                    console.log("Shop nay khong ban hang!");
                }
                
            }
    }
            
}

_openChatAndSendMessage(713952);