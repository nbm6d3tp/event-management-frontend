import { TDateResponse } from '../data/event';

export function toISOStringWithTimeZoneOffset(date: Date) {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
}

export function formatTime(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }`;
}

export function combineDateAndTime(dateObj: Date, timeStr: string) {
  // Extract year, month, and day from the date object
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // Note: Months are zero-based (0-11)
  const day = dateObj.getDate();

  // Extract hours and minutes from the time string
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a new Date object with the combined date and time
  const combinedDate = new Date(year, month, day, hours, minutes);

  return combinedDate;
}

export function getTimeAsNumberOfMinutes(time: string) {
  const timeParts = time.split(':');

  const timeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

  return timeInMinutes;
}

export const convertDateArrayToDateInstance = (dateArray: TDateResponse) => {
  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4]
  );
};
