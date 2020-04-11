import { Injectable } from '@angular/core';
import { BusinessHours, SpecialBusinessHours, BusinessDay, OpHours } from '../models/operation-hours.model';
import { DataService } from './data.service';
import { CustDateObj } from '../models/custom-date.model';
import { AppDefService } from './app-def.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessDayService {
  CBH: BusinessHours;                               // Common business hours array
  SBH: SpecialBusinessHours[];                      // Special business hours Array
  dayObj: CustDateObj;
  daysArr;                                          // Days array for easy accessability
  monthsArr;                                        // Months array for easy accessability
  bdObj: BusinessDay = new BusinessDay();           // business day object
  constructor(
    private _ds: DataService,
    private _ads: AppDefService
  ) { }


  // cbh: Common business hours
  // sbh: Special business hours
  // dt:  Date for business hours cheking
  getBusinessDay(dt: number, cbh: BusinessHours , sbh: SpecialBusinessHours[]): BusinessDay {
    console.log('Checking business day', dt, cbh, sbh);
    // Argument passed date value as an active Date object
    const DT = new Date(dt);

    this.daysArr = this._ads.daysArr;
    this.dayObj = this._ds.getDateObj(dt);
    this.SBH = sbh;
    this.CBH = cbh;

    // If the service provider object has common business hour data not available
    if (!cbh) {
      this.bdObj = new BusinessDay();
      this.bdObj.dayOpen = 'na';
      this.bdObj.daySt = 'na';
    }
    // If available
    else {
      // Temporary constant for day of the date string
      this.bdObj.dayOpen = true;
      const dayOfDt = (this.daysArr[DT.getDay()].aaaa).toLowerCase();
      console.log(dayOfDt);
      if (cbh[dayOfDt].OP) {
        this.bdObj.dayOpen = true;
        this.checkOpeningHour(dt, dayOfDt);
      }
      console.log(dayOfDt, cbh, sbh, this.bdObj);
    }

    return this.bdObj;
  }

  checkOpeningHour(dt: number, day?: string) {
    if (this.CBH[day].FD) {
      this.bdObj.bh = '24H';
    } else {
      this.bdObj.bh = this.CBH[day].OH;
    }
  }
}
