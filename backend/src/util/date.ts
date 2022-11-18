export function getThisWeekObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  };
}

export const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getWeekday(
  day: Date
): 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' {
  // @ts-ignore
  return weekday[day.getDay()];
}

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export function getMonthday(
  day: Date
):
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec' {
  // @ts-ignore
  return months[day.getMonth()];
}

export function getLastWeekObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13)
  };
}

export function getThisMonthObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth() + 1),
    gte: new Date(now.getFullYear(), now.getMonth())
  };
}

export function getLastMonthObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth()),
    gte: new Date(now.getFullYear(), now.getMonth() - 1)
  };
}

export function getThisYearObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear() + 1, 0),
    gte: new Date(now.getFullYear(), 0)
  };
}

export function getLastYearObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), 0),
    gte: new Date(now.getFullYear() - 1, 0)
  };
}

export function getThisDayObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
  };
}

export function getLastDayObj() {
  const now = new Date();
  return {
    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  };
}
