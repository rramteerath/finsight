
/// <reference path="./IDateRange.d.ts"/>

class DateRange {
  constructor(public startDate: Date, public endDate: Date) {

  }

  public static getDateRangeByPeriod(period: string) : IDateRange {
    if (period === "ytd")
      return new DateRange(new Date(new Date().getFullYear(), 0, 1), new Date())
    else if (period == "all")
      return new DateRange(new Date(0), new Date())
    else
      return new DateRange(new Date(), new Date())
  }
}

export { DateRange };
