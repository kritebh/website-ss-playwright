const { chromium } = require("playwright");

// async function screenshot(url) {
//     let browser = await chromium.launch();
//     let page = await browser.newPage();
//     await page.setViewportSize({ width: 1366, height: 768 });
//     await page.goto(url);
//     const buffer = await page.screenshot();
//     await browser.close();
//     return buffer;
// }


async function screenshot(url) {

    let name = url.slice(-10)
    console.time(name)

    let browser = await chromium.launch();
    let page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1080 });
    await page.goto(url);
    await page.screenshot({ path: `./images/${name}.png` });
    await browser.close();

    console.timeEnd(name)
}



process.on("message", (url) => {

    screenshot(url);

    // process.send(image)
})