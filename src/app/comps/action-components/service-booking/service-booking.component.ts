import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicUser, PrivateUserData, AuthUserType } from 'src/app/models/user.model';
import { ComService, DefKVPairs } from 'src/app/models/commercial-service.model';
import { CusService } from 'src/app/services/cus.service';
import { FireService } from 'src/app/services/fire.service';
import { TransactionObject } from 'src/app/models/transaction-object.model';
import { BookingData, StEt } from 'src/app/models/booking-object.model';
import { BillAmount } from 'src/app/models/bill-object.model';
import { PriceCalcService } from 'src/app/services/price-calc.service';
import { DataService } from 'src/app/services/data.service';
import { CustDateObj } from 'src/app/models/custom-date.model';
import { PaymentResponse } from '../paypal-payment/payment-res.model';
import { BusinessDayService } from 'src/app/services/business-day.service';
import { BusinessDay } from 'src/app/models/operation-hours.model';
import { AppDefService } from 'src/app/services/app-def.service';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-service-booking',
  templateUrl: './service-booking.component.html',
  styleUrls: ['./service-booking.component.scss']
})
export class ServiceBookingComponent implements OnInit {
  transaction: TransactionObject;
  so: PublicUser;                                   // Service provider public details object
  _serviceProvId: string;                           // Service provider UID
  _serviceId: string;                               // Service UID
  isLoading = true;
  SPData = {                                        // Service provider data
    PD: null,                                       // service Provider public details object
    CE: null                                        // Calander Events
  };
  authUser: PublicUser = null;                      // Logged in user data
  authPvtData: PrivateUserData = null;              // Logged in user private data
  serviceData: ComService = null;                   // Service data
  hasErr = false;                                   // Any error occured
  errSt = 0;                                        // Error state
  errMsg = '';                                      // Error message
  dtlsObj = {                                       // Data loadstate Object
    SD: false,                                      // Service data loaded
    SPPD: false,                                    // Service provider public data loaded
    SPCE: false,                                    // Service provider calendar events loaded
    AUDL: false                                     // Logged in user data loaded
  };

  businessDay: BusinessDay;                         // Business day details
  bussinessHoursSt:DefKVPairs[] = [];
  bussinessHoursCl:DefKVPairs[] = [];
  aUserType: AuthUserType = new AuthUserType();
  currStepId = 0;
  billReciept: BillAmount;
  pricingModels;
  _tmpSelStartTime;
  _tmpSelEndTime;
  businessHours: DefKVPairs[];
  allowToPay = false;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cus: CusService,
    private _fs: FireService,
    private _pcs: PriceCalcService,
    public _ds: DataService,
    private _bds: BusinessDayService,
    private _ads: AppDefService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this._serviceProvId = params.servProvId;
      this._serviceId = params.servId;
      if (!this._serviceId || this._serviceId === 'undefined' || !this._serviceProvId || this._serviceProvId === 'undefined') {
        this.hasErr = true;
        this.errMsg = `Invalid Url. Please check the url and try again.`;
          this.isLoading = false;
      } else {
        this.checkAuthUser();
        this.loadServiceDetails();
        this.loadServiceProvider();
        this.loadServiceProviderCalendarBlockings();
      }
    });
    this.businessHours = this._ads._businessHours;
    this.pricingModels = this._ads.defPricing;
  }

  checkAuthUser() {
    this.authUser = this._cus.getAuthUser();
    this.aUserType = this._cus.getAuthUserTypeObject();
    this._cus.onAuthUserUpdate.subscribe(authUser => {
      this.authUser = authUser;
      this.aUserType = this._cus.getAuthUserTypeObject();
      if (this.authUser) {
        this.dtlsObj.AUDL = true;
      }
      this.onBackendDataLoad();
    });
    if (this.authUser) {
      this.dtlsObj.AUDL = true;
    }
    this.onBackendDataLoad();
  }

  loadServiceProvider() {
    this._fs.getUserPublicdata(this._serviceProvId).once('value').then(snap => {
      this.SPData.PD = snap.val();
      this.so = snap.val();
      this.dtlsObj.SPPD = true;
      if (!snap.val()) {
        this.hasErr = true;
        this.errMsg = `Unable to load service provider data.`;
      }
      this.onBackendDataLoad();
    }).catch(err => {
      console.log(err);
      this.dtlsObj.SPPD = true;
      this.hasErr = true;
      this.errMsg = `Unable to load service provider data.`;
      this.onBackendDataLoad();
    });
  }

  loadServiceDetails() {
    this._fs.getComService(this._serviceId, this._serviceProvId).once('value').then(snap => {
      this.serviceData = snap.val();
      console.log(this.serviceData);
      this.dtlsObj.SD = true;
      if (!snap.val()) {
        this.hasErr = true;
        this.errMsg = `Unable to load service details.`;
      }
      this.onBackendDataLoad();
    }).catch(err => {
      this.dtlsObj.SD = true;
      console.log(err);
      this.hasErr = true;
      this.errMsg = `Unable to load service details.`;
      this.onBackendDataLoad();
    });
  }

  loadServiceProviderCalendarBlockings() {
    this._fs.getPublicCalendarEventsFiltered('eType', 'busy', this._serviceProvId).once('value').then(snap => {
      this.dtlsObj.SPCE = true;
      if (snap.val()) this.SPData.CE = Object.values(snap.val());
      this.onBackendDataLoad();
    }).catch(err => {
      console.log(err);
      this.dtlsObj.SPCE = true;
      this.hasErr = true;
      this.errMsg = `Unable to fetch calendar availability of service provider`;
      this.onBackendDataLoad();
    });
  }


  // This function will check for all the required data is loaded for service booking process to be completed.
  onBackendDataLoad() {
    // console.log('Backend data load checking');
    if (this.dtlsObj.SPCE && this.dtlsObj.SPPD && this.dtlsObj.SD && this.dtlsObj.AUDL) {
      const sv = this.serviceData;
      if (!sv.BType) {
        if (sv.pricingModel == 'HR') {
          this.serviceData.BType = 'hours';
          this.serviceData.BBFT = 3 * 3600000;
        } else {
          this.serviceData.BType = 'beforeday';
          this.serviceData.BBFT = 0;
        }
      }
      this.so = this.SPData.PD;
      this.transaction = new TransactionObject();
      this.transaction.purDesc = `Booking "${this.serviceData.title.toLowerCase()}" from "${this.so.businessName.toLowerCase()}"`;
      this.transaction.trBy = this.authUser.uid;
      this.transaction.trTo = this.so.uid;
      this.FormBusinessDay(new Date().getTime());
      this._fs.createTempTransactionId(this.transaction).then(snap => {
        this.transaction.trId = snap.key;
        // this.transaction.
        this.transaction.bookingData = new BookingData(sv.title, this.so.businessName, this.so.uid, sv.unit, sv.minBookValue, sv.addCharges, sv.price, null, null);
        this.getBillAmount();
        if (this.serviceData.pricingModel !== 'HR') {
          this.allowToPay = true;
        }
        this.setAvailableBusinessHours();
        this.isLoading = false;
      }).catch(err => console.log(err));
    }
    // console.log(this.dtlsObj);
  }

  toggleStep(id?: number, step?: 'next' | 'prev') {
    if (id >= 0 || step) {
      if (step == 'next') {
        this.currStepId = this.currStepId + 1;
      }
      if (step == 'prev') {
        this.currStepId = this.currStepId - 1;
      }
      if (!step) {
        if (!isNaN(id) && id >= 0) {
          this.currStepId = id;
        } else {
          this.currStepId = 0;
        }
      }
    }
  }

  getAllowQty() {
    var ar = [];
    for (let i = this.serviceData.minBookValue; i <= this.serviceData.maxBookValue; i++) {
      ar.push(i);
    }
    return ar;
  }

  onBookingQtyChange(e) {
    this.setAvailableBusinessHours();
    this.transaction.bookingData.bookingQty = e;
    this.getBillAmount();
    if (this.serviceData.pricingModel == 'HR') {
      this.resetBookingHours();
    }
    if (this.serviceData.pricingModel == 'DY' && e > 1) {
      this.getMultipleDaySelection(e);
    }
    if (this.serviceData.pricingModel == 'DY' && e <= 1) {
      const dtObj = new CustDateObj();
      this.transaction.bookingData.bookingDates = [dtObj.dayStTime];
      this.allowToPay = true;
    }
    if (this.serviceData.pricingModel == 'SV') {
      const dtObj = new CustDateObj();
      this.transaction.bookingData.bookingDates = [dtObj.dayStTime];
      this.allowToPay = true;
    }
  }

  getMultipleDaySelection(n?: number) {
    const stDt = this.transaction.bookingData.bookingDates[0];
    let arr = [stDt];
    for (let i = 1; i < n; i++) {
      arr.push(stDt + (i * 86400000));
    }
    this.transaction.bookingData.bookingDates = arr;
    console.log(this.transaction.bookingData.bookingDates);
    this.allowToPay = true;
  }

  getBillAmount() {
    this.transaction.bookingData.reciept = this._pcs.getBillAmt(this.transaction.bookingData, this.serviceData.addCharges);
    // console.log(this.transaction);
  }

  getToday(): CustDateObj {
    return this._ds.getDateObj();
  }

  getDaysFromToday(days: number): CustDateObj {
    const dt = this._ds.getDateObj();
    return this._ds.getDateObj(new Date(dt.year, dt.month, dt.date + days));
  }

  onBookingDateSelect(e) {
    // e => date recieved from calander selections.
    this.setAvailableBusinessHours();
    console.log('Selected date: ', e);
    this.FormBusinessDay(e);
    this.transaction.bookingData.bookingDates[0] = e;
    this.resetBookingHours();
    if (this.serviceData.pricingModel == 'DY' && this.transaction.bookingData.bookingQty > 1) {
      this.getMultipleDaySelection(this.transaction.bookingData.bookingQty);
    }
    if (this.serviceData.pricingModel == 'DY' && this.transaction.bookingData.bookingQty == 1) {
      this.allowToPay = true;
    }
    if (this.serviceData.pricingModel == 'SV') {
      this.allowToPay = true;
    }
  }

  onPaymentResponse(e: PaymentResponse) {
    console.log(e);
    this.transaction.trResObj = e.res;
    this.transaction.trStatus = e.state;
    this.transaction.trCompAt = new Date().getTime();
    this._fs.updateTransactionObject(this.transaction).then(snap => {
      if (e.state == 'completed') {
        alert('Transaction successfull. you are redirected to bookings page');
        this._router.navigate(['/my_account/bookings']);
      }
      if (e.state == 'failed') {
        alert (`Oops...! Something went wrong. Transaction is failed. Please note down the transaction id ${e.res.orderID} for tracking purpose`);
      }
      if (e.state == 'closed') {
        alert (`You closed the transaction window. Transaction is incomplete. Please note down the transaction id: ${e.res.orderID} for your referrence`);
      }
    });
  }

  FormBusinessDay(dt?: number) {
    console.log('Form business day triggered');
    this.businessDay = this._bds.getBusinessDay(dt, this.so.bHours, this.so.SBH);
  }

  // e => time
  // st => 0 or 1, Start time 0, end time 1
  onSelectionHoursChange(e) {
    console.log('Booking time changed to: ', e);
    this._tmpSelEndTime = e + (this.transaction.bookingData.bookingQty * 60);
    const st = this.transaction.bookingData.bookingDates[0] + (e * 60000);
    const et = st + (this.transaction.bookingData.bookingQty * 60 * 60000);
    this.transaction.bookingData.bookingTime = [new StEt(st, et)];
    console.log(this.transaction.bookingData);
    this.allowToPay = true;
  }

  resetBookingHours() {
    this._tmpSelEndTime = null;
    this._tmpSelStartTime = null;
    this.allowToPay = false;
    this.transaction.bookingData.bookingTime = [];
  }

  // Function to set array of available buiness hours start time to book
  setAvailableBusinessHours() {
    const now = new Date().getTime();
    // selHours => number of selected boking hours or days
    const selHours = this.transaction.bookingData.bookingQty || this.serviceData.minBookValue;
    const selDay = this.transaction.bookingData.bookingDates[0];  // starting time of selected day
    const arrOfBusinessHours = [...this._ads._businessHours];
    let bufferTime: number;                                       // final buffer time stamp in milliseconds
    const bType = this.serviceData.BType;                         // Buffer type
    const bTime = this.serviceData.BBFT;                          // Buffer time in milliseconds
    const selDayObj: CustDateObj = this._ds.getDateObj(selDay);
    const bStartTime = null;
    const bCloseTime = null;
    if (bType == 'hours') {
      bufferTime = now + bTime;
    }
    if (bType == 'beforeday' || (bType == 'days' && bTime == 0)) {
      const dtObj:CustDateObj = this._ds.getDateObj();
      bufferTime = dtObj.dayEndTime + 1;
    }
    if (bType == 'days' && bTime != 0) {
      bufferTime = now + bTime;
    }
    console.log(arrOfBusinessHours);
    this.businessHours = [];
    // arrOfBusinessHours.forEach((h: DefKVPairs) => {

    // });
    for (let h of arrOfBusinessHours) {
      const hourTime = Number(selDay) + (Number(h.key) * 60 * 1000);
      if (now <= hourTime && bufferTime <= hourTime) {
        this.businessHours.push(h);
      }
    }
    // if (bStartTime && bCloseTime) {

    // }
    console.log(this.businessHours);
  }
}
