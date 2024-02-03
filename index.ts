import { PAYMENT_CAP } from "./constants";
import {
  createDirectories,
  getCredentials,
  getPageContent,
  deriveMetrics,
  getPaymentHistory,
  writeToCsv,
} from "./utils";

const performScrape = async () => {
  createDirectories();
  const credentials = getCredentials();
  const pageContent = await getPageContent(credentials);
  if (!pageContent) {
    console.log("No page content to scrape. Issue getting page content");
    return;
  }
  const paymentHistory = await getPaymentHistory(pageContent);
  const metrics = deriveMetrics(paymentHistory);
  writeToCsv(paymentHistory, "./dist/payment-history.csv");
  console.log("Payment Cap: ", PAYMENT_CAP);
  console.log("Total Paid: ", metrics.totalPaid);
  console.log("Remaining: ", metrics.remaining);
};

performScrape();
