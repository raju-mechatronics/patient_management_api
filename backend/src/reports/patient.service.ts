import {
  getLastDayObj,
  getLastMonthObj,
  getLastWeekObj,
  getLastYearObj,
  getMonthday,
  getThisDayObj,
  getThisMonthObj,
  getThisWeekObj,
  getThisYearObj,
  getWeekday,
  months
} from '../util/date';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function patientsGraph(
  period: 'day' | 'month' | 'year' | 'week',
  compare = false
): Promise<{ data: any[]; x_axis: string; elements: string[] }> {
  let patients2: { created_at: Date }[] = [];
  const patients1 = await prisma.patient.findMany({
    where: {
      created_at:
        period === 'day'
          ? getThisDayObj()
          : period === 'week'
          ? getThisWeekObj()
          : period === 'month'
          ? getThisMonthObj()
          : period === 'year'
          ? getThisYearObj()
          : 'undefined'
    },
    select: {
      created_at: true
    },
    orderBy: {
      created_at: 'asc'
    }
  });
  if (compare)
    patients2 = await prisma.patient.findMany({
      where: {
        created_at:
          period === 'day'
            ? getLastDayObj()
            : period === 'week'
            ? getLastWeekObj()
            : period === 'month'
            ? getLastMonthObj()
            : period === 'year'
            ? getLastYearObj()
            : 'undefined'
      },
      select: {
        created_at: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });

  if (period === 'day') {
    return {
      data: [
        {
          x_axis: new Date().toDateString(),
          today: patients1.length,
          yesterday: patients2.length || undefined
        }
      ],
      x_axis: 'x_axis',
      elements: ['today', 'yesterday']
    };
  }

  if (period === 'week') {
    const pw1 = patients1
      .map((e) => getWeekday(e.created_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const pw2 = patients2
      .map((e) => getWeekday(e.created_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const data: any[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const dayname = getWeekday(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      );
      data.push({
        x_axis: dayname,
        'this week': pw1[dayname],
        'last week': pw2[dayname]
      });
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this week', 'last week']
    };
  }

  if (period === 'year') {
    const py1 = patients1
      .map((e) => getMonthday(e.created_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const py2 = patients2
      .map((e) => getMonthday(e.created_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const data: any[] = [];
    for (const month of months) {
      data.push({
        x_axis: month,
        'this year': py1[month],
        'last year': py2[month]
      });
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this year', 'last year']
    };
  }

  if (period === 'month') {
    const pm1 = patients1
      .map((e) => e.created_at.getDate().toString())
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const pm2 = patients2
      .map((e) => e.created_at.getDate().toString())
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});

    const data: any[] = [];
    for (let i = 1; i <= 31; i++) {
      data.push({
        x_axis: i.toString(),
        'this month': pm1[i.toString()],
        'last month': pm2[i.toString()]
      });
    }
    console.log(data);
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this month', 'last month']
    };
  }
  return { data: [], x_axis: '', elements: [] };
}
