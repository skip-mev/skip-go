export const getMobileDateFormat = (date: Date, timeZone?: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timeZone || undefined, // undefined means local time
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  const lookup = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const hours = lookup("hour");
  const minutes = lookup("minute");
  const tz = lookup("timeZoneName");
  const day = lookup("day");
  const month = lookup("month");
  const year = lookup("year");

  return `${hours}:${minutes} ${tz} ${month}/${day}/${year}`;
};
