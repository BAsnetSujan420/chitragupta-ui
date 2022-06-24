export const addDays = (date, days) =>  {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const getDateString = (date) => date.toISOString().slice(0, 10)
