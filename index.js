const express = require("express");
const { chromium } = require("playwright");
const cors = require("cors");

const PORT = 8000;
const app = express();

//! Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!!</h1>");
});


// Playwright Function
async function takeScreenshot(url) {
  let browser = await chromium.launch();
  let page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(url);
  const buffer = await page.screenshot();
  await browser.close();
  return buffer;
}


app.post("/get-screenshot", async (req, res) => {
  console.time("Time Taken");
  let inputObj = req.body;
  let arrayOfAsins = inputObj.asin;

  let arrayOfImageURLs = [];

  if (arrayOfAsins.length > 10) {
    res.status(500).json({
      message: "Can't render more than 10 ASINs at a single time",
    });
  }

  for (let i = 0; i < arrayOfAsins.length; i++) {
    let asin = arrayOfAsins[i];
    let url = `https://www.amazon.in/dp/${asin}`;

    //Taking Screenshot
    let buffer = await takeScreenshot(url);

    // Storing Buffer
    arrayOfImageURLs.push(buffer);

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
  console.log(`Server Running on http://localhost:${PORT} `, process.pid);
});
