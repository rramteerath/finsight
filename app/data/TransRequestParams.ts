/// <reference path="../utils/IDateRange.d.ts"/>

class TransRequestParams {
  constructor(public portfolioId: number,
    public dateRange: IDateRange,
    public reinvCalc: string,
    public durationHeld: string) {}
}

export { TransRequestParams };
