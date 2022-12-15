const puppeteer = require('puppeteer');

async function puppeter() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://simpeg.bondowosokab.go.id/auth/login', { waitUntil: 'networkidle0' });
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', '199210252020121011');
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', 'Tonny@kominfo2020');
        await page.waitForSelector('button[type="submit"]'),
            await page.click('button[type=submit]'),
            console.log('berhasil')
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            console.log('Halaman URL:', page.url())
        ]);
        browser.close()
    } catch (e) {
        console.log(e)
    }
}

puppeter();

module.exports = {
    puppeter
}