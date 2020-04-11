export class CustDateObj {
  constructor(
    public date?: number,
    public day?: number,
    public year?: number,
    public month?: number,
    public dayStTime?: number,
    public dayEndTime?: number,
    public timeStamp?: number
  ) {
    const dt = new Date();
    const Obj = {
      date: date || dt.getDate(),
      day: day || dt.getDay(),
      year: year || dt.getFullYear(),
      month: month || dt.getMonth(),
      dayStTime: dayStTime || new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime(),
      dayEndTime: dayEndTime || new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1).getTime() - 1,
      timeStamp: timeStamp || dt.getTime()
    };
    return Obj;
  }
}