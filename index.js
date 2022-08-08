const express = require("express");
const { chromium } = require("playwright");

const PORT = 8000;

const app = express();

//! Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!!</h1>");
});

app.post("/get-screenshot", async (req, res) => {
  console.time("Time Taken");
  let inputObj = req.body;
  let arrayOfAsins = inputObj.asin;

  let arrayOfImageURLs = [];
  for (let i = 0; i < arrayOfAsins.length; i++) {
    let asin = arrayOfAsins[i];
    let url = `https://www.amazon.in/dp/${asin}`;

    let browser = await chromium.launch();

    let page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1080 });
    await page.goto(url);
    await page.screenshot({ path: `./images/${asin}.png` });
    await browser.close();

    arrayOfImageURLs.push(`/${asin}.png`);
  }

  console.log("Screenshot Taken Successfully !!!");
  console.timeEnd("Time Taken");
  res.status(200).json({
    message: "Images Rendered Successfully !!!",
    imageURLs: arrayOfImageURLs,
  });
});

//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
