const { chromium } = require("playwright");

module.exports = {
    screenshot: async function (url) {
        let browser = await chromium.launch();
        let page = await browser.newPage();
        await page.setViewportSize({ width: 1366, height: 768 });
        await page.goto(url);
        const buffer = await page.screenshot();
        await browser.close();
        return buffer;
    }
}