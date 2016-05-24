/// <reference path="./IDateRange.d.ts"/>
import { DATE_PERIOD_ALL, DATE_PERIOD_YTD, DATE_PERIOD_QTD, DATE_PERIOD_MTD } from './datePeriods'

class DateRange implements IDateRange {
  constructor(public startDate: Date, public endDate: Date) {}

  public static getDateRangeByPeriod(period: string) : IDateRange {
    const currDate = new Date()
    const currYear = currDate.getFullYear()

    switch (period) {
      case DATE_PERIOD_ALL:
        return new DateRange(new Date(0), currDate)
      case DATE_PERIOD_YTD:
        return new DateRange(new Date(currYear, 0, 1), currDate)
      case DATE_PERIOD_QTD:
        return new DateRange(new Date(currYear, DateRange.getQuarterStart(currDate).getMonth(), 1), currDate)
      case DATE_PERIOD_MTD:
        return new DateRange(new Date(currYear, currDate.getMonth(), 1), currDate)
    }
  }

  private static getQuarterStart(date: Date): Date {
    let newDate = new Date(date.getFullYear(), 0, 1)
    const month = date.getMonth()

    // To bad can't do ranges - case 0-1, or case 0,1,2
    // Can do it in C#, thought it would be in Typescript
    switch (true) {
      case (month < 3):
        newDate.setMonth(0)
        break
      case (month < 6):
        newDate.setMonth(3)
        break
      case (month < 9):
        newDate.setMonth(6)
        break
      case (month < 12):
        newDate.setMonth(9)
    }

    return newDate
  }
}

export { DateRange };
