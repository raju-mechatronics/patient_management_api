import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

export async function paymentGraph(
  period: 'day' | 'month' | 'year' | 'week',
  compare = false
): Promise<{ data: any[]; x_axis: string; elements: string[] }> {
  let payment2: { date: Date; amount: number }[] = [];
  const payment1 = await prisma.payment.findMany({
    where: {
      date:
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
      date: true,
      amount: true
    },
    orderBy: {
      date: 'asc'
    }
  });
  if (compare)
    payment2 = await prisma.payment.findMany({
      where: {
        date:
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
        date: true,
        amount: true
      },
      orderBy: {
        date: 'asc'
      }
    });

  if (period === 'day') {
    return {
      data: [
        {
          x_axis: new Date().toDateString(),
          today: payment1.reduce((prev, cur) => {
            return prev + cur.amount;
          }, 0),
          yesterday: payment1.reduce((prev, cur) => {
            return prev + cur.amount;
          }, 0)
        }
      ],
      x_axis: 'x_axis',
      elements: ['today', 'yesterday']
    };
  }

  if (period === 'week') {
    const now = new Date();
    const data: any = [];
    const map: { [p: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const dayname = getWeekday(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      );
      map[dayname] = i;
      data.push({
        x_axis: dayname,
        'this week': 0,
        'last week': 0
      });
    }

    for (const payment of payment1) {
      const dayname = getWeekday(payment.date);
      data[map[dayname]]['this week'] += payment.amount;
    }

    for (const payment of payment2) {
      const dayname = getWeekday(payment.date);
      data[map[dayname]]['last week'] += payment.amount;
    }

    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this week', 'last week']
    };
  }

  if (period === 'year') {
    const data: any[] = [];
    for (const monthName of months) {
      data.push({
        x_axis: monthName,
        'this year': 0,
        'last year': 0
      });
    }

    for (const payment of payment1) {
      const dayname = getMonthday(payment.date);
      data[payment.date.getMonth()]['this year'] += payment.amount;
    }

    for (const payment of payment2) {
      const dayname = getMonthday(payment.date);
      data[payment.date.getMonth()]['last year'] += payment.amount;
    }

    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this year', 'last year']
    };
  }

  if (period === 'month') {
    const data: any[] = [];
    for (let i = 1; i <= 31; i++) {
      data.push({
        name: i.toString(),
        'this month': 0,
        'last month': 0
      });
    }
    for (const payment of payment1) {
      const day = payment.date.getDate() - 1;
      data[day]['this month'] += payment.amount;
    }

    for (const payment of payment2) {
      const day = payment.date.getDate() - 1;
      try {
        data[day]['last month'] += payment.amount;
      } catch (e) {
        console.log(day, data[day]);
      }
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['this month', 'last month']
    };
  }
  return { data: [], x_axis: '', elements: [] };
}
