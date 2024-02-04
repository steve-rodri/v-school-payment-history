import cheerio from "cheerio";
import { convertShortDateToISO } from "./convertShortDateToISO";

const columnHeaders = [
  "date",
  "status",
  "description",
  "subtotal",
  "fees",
  "amount",
] as const;

export type Payment = {
  [type in (typeof columnHeaders)[number]]: string;
};

export const getPaymentHistory = async (content: string) => {
  // Use Cheerio to parse the HTML content
  const $ = cheerio.load(content);
  // Traverse the DOM to get column data
  const tableData: Payment[] = [];

  $("table tr").each((_, element) => {
    const columnValues = Array.from(
      { length: columnHeaders.length },
      (_, i) => {
        const cell = $(element)
          .find(`td:nth-child(${i + 1})`)
          .text()
          .trim();
        return cell;
      },
    );

    if (columnValues.every((c) => !c)) return;

    const data = columnHeaders.reduce((row, header, i) => {
      let value = columnValues[i];
      if (columnHeaders[i] === "date") {
        value = convertShortDateToISO(value);
      }
      row[header] = value;
      return row;
    }, {} as Payment);

    tableData.push(data);
  });

  return tableData;
};
