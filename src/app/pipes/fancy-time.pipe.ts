import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'fancyTime'
})
export class FancyTimePipe implements PipeTransform {
  constructor(
    private _ds: DataService
  ) {}
  transform(value: number, args?: any): any {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = this._ds.getDateObj(new Date().getTime());
    // console.log(today);
    const tSt = today.dayStTime;
    const tEt = today.dayEndTime;
    const tDiff = this.getValDiff(today.dayStTime, value);              // Time difference
    const cT = new Date(value);                                         // Check time

    // tStr Time string. Ex: 9:28 am;
    const tStr = `${this._convertTo12(cT.getHours())}:${this._convertTo2digit(cT.getMinutes())} ${cT.getHours() >= 12 ? 'pm':'am'}`;
    const fullTimeStr = tStr + ` • ${cT.getDate()}`;

    // Check for same day
    if (value >= tSt && value < tEt) {
      return tStr;
    }
    if (value < tSt && this.getValDiff(tSt, value) < 518400000) {
      return tStr + ` • ${days[cT.getDay()]}`;
    }
    return tStr + ` • ${cT.getDate()} ${months[cT.getMonth()]}, ${cT.getFullYear()}`;
  }

  _convertTo12(num: number) {
    if (num <= 12) return num;
    else return num - 12;
  }

  _convertTo2digit(num) {
    if (num >= 10) return num;
    else return `0${num}`;
  }

  getValDiff(val1, val2) {
    return Math.abs(val1 - val2);
  }

}
