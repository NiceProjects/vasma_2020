import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BusinessHours, SpecialBusinessHours } from 'src/app/models/operation-hours.model';
import { AppDefService } from 'src/app/services/app-def.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input('vc-sel-date') selectedDates?: number[];
  @Input('vc-allow-range') allowRange?: [number, number];
  @Input('vc-business-hours') businessHours?: BusinessHours;
  @Input('vc-special-business-days') specialBusinessDays?: SpecialBusinessHours[];
  @Input('vc-disablePastDays') disablePast?: boolean;
  @Output('onDateSelect') dateSelect = new EventEmitter<number>();

  businessCloseDays = {
    weekDays: [],
    specialDays: []
  };
  dayArr = [
    {a: 'S', aa: 'Su', aaa: 'Sun', aaaa: 'Sunday'},
    {a: 'M', aa: 'Mo', aaa: 'Mon', aaaa: 'Monday'},
    {a: 'T', aa: 'Tu', aaa: 'Tue', aaaa: 'Tuesday'},
    {a: 'W', aa: 'We', aaa: 'Wed', aaaa: 'Wednusday'},
    {a: 'T', aa: 'Th', aaa: 'Thu', aaaa: 'Tursday'},
    {a: 'F', aa: 'Fr', aaa: 'Fri', aaaa: 'Friday'},
    {a: 'S', aa: 'Sa', aaa: 'Sat', aaaa: 'Saturday'},
  ];
  monthsArr = [
    {mmm: 'Jan', mmmm: 'January'},
    {mmm: 'Feb', mmmm: 'February'},
    {mmm: 'Mar', mmmm: 'March'},
    {mmm: 'Apr', mmmm: 'April'},
    {mmm: 'May', mmmm: 'May'},
    {mmm: 'Jun', mmmm: 'June'},
    {mmm: 'Jul', mmmm: 'July'},
    {mmm: 'Aug', mmmm: 'August'},
    {mmm: 'Sep', mmmm: 'September'},
    {mmm: 'Oct', mmmm: 'October'},
    {mmm: 'Nov', mmmm: 'November'},
    {mmm: 'Dec', mmmm: 'December'}
  ];
  yearsArr = [];
  curYear = new Date().getFullYear();
  curMonth = new Date().getMonth();
  today = this.getToday();
  // selDates = this.selectedDates;
  selDates = this.selectedDates || [this.getToday()];
  selYear = new Date(this.selDates[0]).getFullYear() || new Date().getFullYear();
  selMonth = new Date(this.selDates[0]).getMonth() || new Date().getMonth();
  selMonthDtArr = this.getCalanderDates(this.selYear, this.selMonth);
  calObj = {
    year: 2019,
    month: 6,
    stDayInMonth: this.getStartDateInMonth(this.selYear, this.selMonth),
    stDateInMonth: 1,
    lastDayInMonth: this.getLastDayInMonth(this.selYear, this.selMonth),
    lastDateInMonth: new Date(this.getLastDayInMonth(this.selYear, this.selMonth)).getDate(),
  };
  constructor(
    private _ads: AppDefService
  ) { }
  ngOnInit() {
    // this.selDates = this.selectedDates;
    console.log(this.selectedDates);
    this.dayArr = this._ads.daysArr;
    this.monthsArr = this._ads.monthsArr;
    const cYr = new Date().getFullYear();
    for (let i = 1900; i <= 2100; i ++) {
      this.yearsArr.push(i);
    }
    // console.log(this.yearsArr);
    if (this.isExist(this.disablePast)) {
      this.allowRange[0] = this.getToday();
    }

    if (this.businessHours) {
      // console.log(this.businessHours);
      const days = Object.keys(this.businessHours);
      for (let x in days) {
        if (!this.businessHours[days[x]].OP) {
          this.businessCloseDays.weekDays.push(days[x].toLowerCase());
        }
      }
      // console.log(this.businessCloseDays);
      // if (this.businessHours)
    }

    // if (this.specialBusinessDays) {
    //   this.businessCloseDays.specialDays = this.specialBusinessDays;
    // }
    // this.calObj = {
    //   year: 2019,
    //   month: 6,
    //   stDayInMonth: this.getStartDateInMonth(this.selYear, this.selMonth),
    //   stDateInMonth: 1,
    //   lastDayInMonth: this.getLastDayInMonth(this.selYear, this.selMonth),
    //   lastDateInMonth: new Date(this.getLastDayInMonth(this.selYear, this.selMonth)).getDate(),
    //   // datesArr: this.getCalanderDates(this.selYear, this.selMonth)
    // };
  }

  ngOnChanges() {
    this.selDates = this.selectedDates;
    this.getCalanderDates(this.selYear, this.selMonth);
  }

  getCalanderDates(year: number, month: number) {
    let dtArr = [];
    const firstDate = 1;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    const endDay = new Date(year, month, lastDate).getDay();
    // console.log(`First date: ${firstDate}`, `Last Date: ${lastDate}`,`Start day: ${this.dayArr[startDay].aaa}`, `End day: ${this.dayArr[endDay].aaa}`);

    //  Adding dates in week from previous month
    const precDates = [];
    for (let x=0; x < startDay; x++) {
      precDates.push(new Date(year, month, 0 - x).getTime());
      // console.log(new Date(year, month, 0 - x).getDate());
    }
    dtArr.push(...precDates.reverse());
    // console.log(dtArr);

    // Adding Actual month days and remaining days in week from next month
    for (let x = 1; x <= (42 - startDay); x++) {
      dtArr.push(new Date(year, month, x).getTime());
    }
    // console.log(dtArr);
    // Adding days in week from next month
    return dtArr;
  }

  getToday(): number {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    return new Date(year, month, date).getTime();
  }

  getDate(time?: number): number {
    const dt = time || new Date().getTime();
    return new Date(dt).getDate();
  }

  getStartDateInMonth(year, month) {
    return new Date(year, month, 1).getTime();
  }
  getLastDayInMonth(year, month) {
    return new Date(year, month + 1, 0).getTime();
  }

  getDateButtonClass(dt: number) {
    const stDate = new Date(this.selYear, this.selMonth, 1).getTime();
    const lastDate = new Date(this.selYear, this.selMonth + 1, 0).getTime();
    const today = this.getToday();
    // console.log(this.selDates);
    // console.log(dt);
    const businessClosedDays = {
      days: [],
      specialDates: []
    };
    let classStr = '';
    if (dt === today) {
      classStr += ' today';
    }

    if (this.selDates.includes(dt)) {
      classStr += ' dt-selected';
    }

    if (dt == this.selDates[0] || dt == this.selDates[this.selDates.length - 1]) {
      classStr += ' start-end-date'
    }

    if (dt < stDate || dt > lastDate) {
      classStr += ' out-of-month';
    }

    if (this.checkClosingDay(dt) || this.checkClosingDate(dt)) {
      classStr += ' business-closing';
    }

    return classStr;
  }

  onDateSelect(dt) {
    this.selDates = [dt];
    this.dateSelect.emit(this.selDates[0]);
  }

  onMonthSelect(mo: number) {
    this.selMonth = mo;
    this.formNewCalander();
  }

  onYearSelect(yr: number) {
    this.selYear = yr;
    this.formNewCalander();
  }

  formNewCalander() {
    this.selMonthDtArr = this.getCalanderDates(this.selYear, this.selMonth);
  }

  selNextMonth() {
    if (this.selMonth == 11) {
      this.selMonth = 0;
      this.selYear += 1;
    } else {
      this.selMonth += 1;
    }
    this.formNewCalander();
  }

  selPrevMonth() {
    if (this.selMonth == 0) {
      this.selMonth = 11;
      this.selYear -= 1;
    } else {
      this.selMonth -= 1;
    }
    this.formNewCalander();
  }

  getDisableSt(dt: number) {
    let disable = false;
    if (this.isExist(this.allowRange)) {
      if (this.allowRange[0] > dt) {
        disable = true;
      }
      if (this.allowRange[1] < dt) {
        disable = true;
      }
    }
    return disable;
  }

  isExist(t) {
    if (t !== null && t !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  checkClosingDay(DT: number): boolean {
    if (!DT) return false;
    const dt = new Date(DT);
    const day = this.dayArr[dt.getDay()].aaaa.toLowerCase();
    return this.businessCloseDays.weekDays.indexOf(day) >= 0;
  }

  checkClosingDate(DT: number): boolean {
    if (!DT) return false;
    return this.businessCloseDays.specialDays.indexOf[DT] >= 0;
  }

}

// [1561919400000,1562005800000,1562092200000,1562178600000,
//   1562265000000,1562351400000,1562437800000,1562524200000,
//   1562610600000,1562697000000,1562783400000,1562869800000,
//   1562956200000,1563042600000,1563129000000,1563215400000,1563301800000,
//   1563388200000,1563474600000,1563561000000,1563647400000,1563733800000,
//   1563820200000,1563906600000,1563993000000,1564079400000,1564165800000,
//   1564252200000,1564338600000,1564425000000,1564511400000]