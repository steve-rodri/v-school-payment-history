// Short Date = "7/6/23 3:23 AM EDT";

export const convertShortDateToISO = (dateString: string): string => {
  // Split the date string into its components
  const [month, day, year, hours, minutes, meridian, timeZone] =
    dateString.split(/[ /:]+/);

  // Determine the pivot/windowing year
  // This is used to interpret two-digit years into a four-digit year format
  // For example, if the current year is 2024, the pivot year might be around 1974
  // Any two-digit year less than the pivot year is assumed to be in the current century (2000-2099)
  // Any two-digit year greater than or equal to the pivot year is assumed to be in the previous century (1900-1999)
  const pivotYear = 50; // For example, if the current year is 2024, the pivot year might be 50 years prior (1974)

  // Adjust the year based on the pivot/windowing year
  let adjustedYear: number;
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;

  if (parseInt(year) < pivotYear) {
    // If the two-digit year is less than the pivot year, assume it's in the current century
    adjustedYear = currentCentury + parseInt(year);
  } else {
    // If the two-digit year is greater than or equal to the pivot year,
    // assume it's in the previous century unless it's already in the future
    adjustedYear = currentCentury - 100 + parseInt(year);
    if (adjustedYear < currentYear) {
      adjustedYear = currentCentury + parseInt(year);
    }
  }

  // Construct the formatted date string
  const formattedDateString = `${adjustedYear}-${month.padStart(
    2,
    "0",
  )}-${day.padStart(2, "0")} ${hours}:${minutes} ${meridian} ${timeZone}`;

  // Use toLocaleString to convert to ISO format
  const isoDateString = new Date(formattedDateString).toLocaleString("en", {
    timeZone: "UTC",
    timeZoneName: "short",
  });

  return new Date(isoDateString).toISOString();
};
