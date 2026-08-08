const defaultTimeZone = "America/Los_Angeles";

function datePartsFor(timeZone: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone,
    year: "numeric",
  }).formatToParts(date);

  return {
    day: Number(parts.find((part) => part.type === "day")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    year: Number(parts.find((part) => part.type === "year")?.value),
  };
}

function formatDate(timeZone: string, year: number, month: number, day: number) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone,
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function lastDayOfMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getCurrentSemiMonthlyPayPeriod(date = new Date()) {
  const timeZone = process.env.KEYSTONE_PAYROLL_TIME_ZONE ?? defaultTimeZone;
  const { day, month, year } = datePartsFor(timeZone, date);
  const isFirstHalf = day <= 15;
  const periodNumber = (month - 1) * 2 + (isFirstHalf ? 1 : 2);
  const startDay = isFirstHalf ? 1 : 16;
  const endDay = isFirstHalf ? 15 : lastDayOfMonth(year, month);
  const startsOn = formatDate(timeZone, year, month, startDay);
  const endsOn = formatDate(timeZone, year, month, endDay);

  return {
    cutoffLabel: `Payroll cutoff: ${endsOn}`,
    periodLabel: `Pay Period ${periodNumber} of 24`,
    rangeLabel: `${startsOn} - ${endsOn}`,
    timeZone,
  };
}
