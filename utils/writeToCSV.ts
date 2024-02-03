import { createObjectCsvWriter } from "csv-writer";

interface Data {
  [key: string]: unknown;
}

export const writeToCsv = (data: Data[], filePath: string) => {
  // Extract column headers from the first object's keys
  const columnHeaders = Object.keys(data[0]);

  // Create a CSV writer
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: columnHeaders.map((header) => ({ id: header, title: header })),
  });

  // Write objects to CSV
  csvWriter
    .writeRecords(data)
    .then(() =>
      console.log(`CSV file has been written successfully to ${filePath}`),
    )
    .catch((err) => console.error("Error writing CSV file:", err));
};
