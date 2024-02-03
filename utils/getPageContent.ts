import fs from "fs";
import puppeteer from "puppeteer";

import { Credentials } from "./getCredentials";
import { BASE_URL } from "../constants";

export const CONTENT_PATH = "./storage/page_content.html";

export const getPageContent = async (credentials: Credentials) => {
  if (fs.existsSync(CONTENT_PATH)) {
    console.log("Using downloaded page content.");
    return fs.readFileSync(CONTENT_PATH, "utf-8");
  }
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    console.log("Fetching page content...");
    // Go to the login page
    await page.goto(`${BASE_URL}/login`);

    // Fill in the login form
    await page.type("#email", credentials.email);
    await page.type("#password", credentials.password);
    await page.click('button[type="submit"]');

    // Wait for navigation to complete after login
    await page.waitForNavigation();

    // Now, you should be logged in and can navigate to the protected page
    await page.goto(`${BASE_URL}/payments`);

    // Write page content to a file
    const content = await page.content();
    fs.writeFileSync(CONTENT_PATH, content);
    console.log("Content Fetched Successfully...");
    return content;
  } catch (error) {
    console.error("Error fetching page content:", error);
  } finally {
    await browser.close();
  }
};
