export const getMobileDateFormat = (date: Date) => {
  const hours = String(date.getHours());
  const minutes = String(date.getMinutes());

  const timeZone = date.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop();

  const month = date.getMonth() + 1; // Months are 0-indexed
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${hours}:${minutes} ${timeZone} ${month}/${day}/${year}`;
};
