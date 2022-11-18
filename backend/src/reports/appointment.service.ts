import { PrismaClient } from '@prisma/client';
import { appointmentType } from '../appointment/appointment.service';
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

export async function appointmentCompareGraph(
  period: 'day' | 'month' | 'year' | 'week',
  compare = false,
  type: appointmentType | null = null
): Promise<{ data: any[]; x_axis: string; elements: string[] }> {
  let appointment2: { appointment_at: Date }[] = [];
  const appointment1 = await prisma.appointment.findMany({
    where: {
      appointment_at:
        period === 'day'
          ? getThisDayObj()
          : period === 'week'
          ? getThisWeekObj()
          : period === 'month'
          ? getThisMonthObj()
          : period === 'year'
          ? getThisYearObj()
          : 'undefined',
      Type_Name: type ? type : undefined
    },
    select: {
      appointment_at: true
    },
    orderBy: {
      appointment_at: 'asc'
    }
  });
  if (compare)
    appointment2 = await prisma.appointment.findMany({
      where: {
        appointment_at:
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
        appointment_at: true
      },
      orderBy: {
        appointment_at: 'asc'
      }
    });

  if (period === 'day') {
    return {
      data: [
        {
          name: new Date().toDateString(),
          today: appointment2.length,
          yesterday: appointment2.length || undefined
        }
      ],
      x_axis: 'name',
      elements: ['today', 'yesterday']
    };
  }

  if (period === 'week') {
    const pw1 = appointment1
      .map((e) => getWeekday(e.appointment_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const pw2 = appointment2
      .map((e) => getWeekday(e.appointment_at))
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
    const py1 = appointment1
      .map((e) => getMonthday(e.appointment_at))
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const py2 = appointment2
      .map((e) => getMonthday(e.appointment_at))
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
    const pm1 = appointment1
      .map((e) => e.appointment_at.getDate().toString())
      .reduce((prev: { [p: string]: number }, cur: string) => {
        if (prev[cur]) prev[cur] += 1;
        else prev[cur] = 1;
        return prev;
      }, {});
    const pm2 = appointment2
      .map((e) => e.appointment_at.getDate().toString())
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
    return {
      data: data,
      x_axis: 'name',
      elements: ['this month', 'last month']
    };
  }
  return { data: [], x_axis: '', elements: [] };
}

export async function appointmentGraph(
  period: 'day' | 'month' | 'year' | 'week',
  type: appointmentType | null = null
): Promise<{ data: any[]; x_axis: string; elements: string[] }> {
  const data: {
    x_axis: string;
    'New reservations'?: number;
    Surgeries?: number;
    'Patients checkup'?: number;
  }[] = [];
  const appointment = await prisma.appointment.findMany({
    where: {
      appointment_at:
        period === 'day'
          ? getThisDayObj()
          : period === 'week'
          ? getThisWeekObj()
          : period === 'month'
          ? getThisMonthObj()
          : period === 'year'
          ? getThisYearObj()
          : 'undefined',
      Type_Name: type ? type : undefined
    },
    select: {
      appointment_at: true,
      Type_Name: true
    },
    orderBy: {
      appointment_at: 'asc'
    }
  });

  if (period === 'day') {
    const ap_count = appointment.reduce(
      (prev: { [p: string]: number }, next) => {
        if (prev[next.Type_Name]) {
          prev[next.Type_Name] += 1;
        } else {
          prev[next.Type_Name] = 1;
        }
        return prev;
      },
      {}
    );
    return {
      data: [
        {
          x_axis: 'today',
          ...ap_count
        }
      ],
      x_axis: 'x_axis',
      elements: Object.keys(ap_count)
    };
  }

  if (period === 'week') {
    const now = new Date();
    const aw = appointment.reduce((prev: { [p: string]: any }, current) => {
      const day = getWeekday(current.appointment_at);
      if (prev[day]) {
        if (prev[day][current.Type_Name]) {
          prev[day][current.Type_Name] += 1;
        } else {
          prev[day][current.Type_Name] = 1;
        }
      } else {
        prev[day] = { [current.Type_Name]: 1 };
      }
      return prev;
    }, {});
    for (let i = 6; i >= 0; i--) {
      const dayname = getWeekday(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      );
      data.push({
        x_axis: dayname,
        Surgeries: aw[dayname]['Surgeries'],
        'New reservations': aw[dayname]['New reservations'],
        'Patients checkup': aw[dayname]['Patients checkup']
      });
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['Surgeries', 'Patients checkup', 'New reservations']
    };
  }

  if (period === 'year') {
    const aw = appointment.reduce((prev: { [p: string]: any }, current) => {
      const month = getMonthday(current.appointment_at);
      if (prev[month]) {
        if (prev[month][current.Type_Name]) {
          prev[month][current.Type_Name] += 1;
        } else {
          prev[month][current.Type_Name] = 1;
        }
      } else {
        prev[month] = { [current.Type_Name]: 1 };
      }
      return prev;
    }, {});
    for (const month of months) {
      data.push({
        x_axis: month,
        Surgeries: aw[month] ? aw[month]['Surgeries'] : undefined,
        'New reservations': aw[month]
          ? aw[month]['New reservations']
          : undefined,
        'Patients checkup': aw[month]
          ? aw[month]['Patients checkup']
          : undefined
      });
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['Surgeries', 'Patients checkup', 'New reservations']
    };
  }

  if (period === 'month') {
    const aw = appointment.reduce((prev: { [p: string]: any }, current) => {
      const day = current.appointment_at.getDate().toString();
      if (prev[day]) {
        if (prev[day][current.Type_Name]) {
          prev[day][current.Type_Name] += 1;
        } else {
          prev[day][current.Type_Name] = 1;
        }
      } else {
        prev[day] = { [current.Type_Name]: 1 };
      }
      return prev;
    }, {});
    for (let i = 1; i <= 31; i++) {
      data.push({
        x_axis: i.toString(),
        Surgeries: aw[i.toString()] ? aw[i.toString()]['Surgeries'] : undefined,
        'New reservations': aw[i.toString()]
          ? aw[i.toString()]['New reservations']
          : undefined,
        'Patients checkup': aw[i.toString()]
          ? aw[i.toString()]['Patients checkup']
          : undefined
      });
    }
    return {
      data: data,
      x_axis: 'x_axis',
      elements: ['Surgeries', 'Patients checkup', 'New reservations']
    };
  }
  return { data: [], x_axis: '', elements: [] };
}
