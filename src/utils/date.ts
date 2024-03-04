export const dateFormat = (
  str: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  },
  timeZone = 'en-US',
) => {
  const date = new Date(str);
  // console.log(date.toLocaleDateString());

  return date.toLocaleString(timeZone, options as Intl.DateTimeFormatOptions);
};
