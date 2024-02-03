import fs from "fs";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

const BASE_URL = "https://vschool.mia-share.com";

const EMAIL = "";
const PASSWORD = "";

const AMOUNT_COLUMN_NUM = 6;
const PAYMENT_CAP = 39000;

const CONTENT_PATH = "page_content.html";

async function scrapeProtectedPage() {
  const content = await getPageContent();
  if (!content) {
    console.log("No page content to scrape. Issue getting page content");
    return;
  }
  // Use Cheerio to parse the HTML content
  const $ = cheerio.load(content);

  // Traverse the DOM to find the amount column of table data
  const amountValues: string[] = [];
  $("table tr").each((_, element) => {
    const amountValue = $(element)
      .find(`td:nth-child(${AMOUNT_COLUMN_NUM})`)
      .text()
      .trim();
    amountValues.push(amountValue);
  });

  const totalPaid = amountValues.reduce((total, currentValue) => {
    if (!currentValue) return total;
    const num = parseFloat(currentValue.replace("$", "").replace(",", ""));
    total += num;
    return total;
  }, 0);

  const remaining = parseFloat((PAYMENT_CAP - totalPaid).toFixed(2));
  console.log({ paymentCap: PAYMENT_CAP });
  console.log({ totalPaid });
  console.log({ remaining });
}

const getPageContent = async () => {
  if (fs.existsSync(CONTENT_PATH)) {
    console.log("Using downloaded page content.");
    return fs.readFileSync(CONTENT_PATH, "utf-8");
  } else {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    try {
      console.log("Fetching page content...");
      // Go to the login page
      await page.goto(`${BASE_URL}/login`);

      // Fill in the login form
      await page.type("#email", EMAIL);
      await page.type("#password", PASSWORD);
      await page.click('button[type="submit"]');

      // Wait for navigation to complete after login
      await page.waitForNavigation();

      // Now, you should be logged in and can navigate to the protected page
      await page.goto(`${BASE_URL}/payments`);

      // Write page content to a file
      const content = await page.content();
      fs.writeFileSync("page_content.html", content);
      console.log("Content Fetched Successfully...");
      return content;
    } catch (error) {
      console.error("Error scraping protected page:", error);
    } finally {
      await browser.close();
    }
  }
};

scrapeProtectedPage();
