import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { VenueEventData, VenueEventResponse, VenueEventRegistrationAction } from 'src/app/models/venue-event.model';
import { HostListener} from "@angular/core";
import { VenueEventService } from 'src/app/services/venue-event.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentResponse } from 'src/app/comps/action-components/paypal-payment/payment-res.model';

declare var $ :any;

@Component({
  selector: 'app-event-public-card',
  templateUrl: './event-public-card.component.html',
  styleUrls: ['./event-public-card.component.scss', './event-public-card.component.css']
})
export class EventPublicCardComponent implements OnInit, OnChanges {
  @Input('data-event-id') eventId: string;
  @Input('data-auth-user-id') authUserId?: string;
  @Input('data-show-item') showItem: boolean;
  topScroll = 0;
  eventData: VenueEventData = undefined;
  eventFullView = false;
  authUser: PublicUser;
  eventRegDetails;
  activeUrl: string;
  regDataFetching = false;
  registeringToEvent = false;
  cancellingRegistration = false;
  idleChanger: any = '';
  flags = {
    event_data_loaded: false,
    event_data_load_err: null,
    auth_user_id: null,
    event_registered: null,
    auth_user_loaded: false,
    auth_user_data_load_err: null
  };
  paymentAmt = 0;
  enablePayment = false;
  paymentDesc;
  regRefKey;
  refKey = null;
  constructor(
    private _fs: FireService,
    private _ves: VenueEventService,
    private _cus: CusService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  // TODO: Fix undefined error in registering to events.
  // TODO: FIx number of allowed slots for openMic event

  ngOnInit() {
    this.topScroll = 0;
    if (this.showItem == undefined || this.showItem == null) this.showItem = false;
    this.eventFullView = this.showItem;

    this._router.events.subscribe(e => {
      this.activeUrl = this._router.url;
      // console.log(this.activeUrl);
    })

    // Load event data
    this._fs.getVenueEventWithEventId(this.eventId).once('value')
    .then(snap => {
      this.eventData = snap.val();
      if (!this.eventData.publish) this.eventFullView = false;
      this.flags.event_data_load_err = false;
      this.flags.event_data_loaded = true;
      this.fetchRegistrationStatus();
    }).catch(err => {
      console.log(err);
      this.flags.event_data_load_err = true;
      this.eventData = null;
    });

    // Watching event data updates
    this._fs.getVenueEventWithEventId(this.eventId).on('value', snap => {
      this.eventData = snap.val();
      if (!this.eventData.publish) this.eventFullView = false;
      this.flags.event_data_load_err = false;
      this.flags.event_data_loaded = true;
      this.fetchRegistrationStatus();
    }, err => {
      console.log(err);
      this.flags.event_data_load_err = true;
      this.eventData = null;
    });

    // load auth User Data
    this.authUser = this._cus.getAuthUser();
    if (this.authUser) this.onAuthUserDataLoaded();
    this._cus.onAuthUserUpdate.subscribe(user => {
      this.authUser = user;
      if (this.authUser) this.onAuthUserDataLoaded();
    });

  }

  onAuthUserDataLoaded() {
    this.flags.auth_user_loaded = true;
    if (this.flags.event_data_loaded && this.eventData.eventId) return this.fetchRegistrationStatus();
  }

  fetchRegistrationStatus() {
    if (!this.eventData || !this.authUser || this.regDataFetching || !this. showItem) return null;
    const eventId = this.eventData.eventId;
    const userId = this.authUser.uid;
    console.log(`Fetching event registrations started for the event ${eventId}`);
    this._ves.geteventRegStat(eventId, userId).once('value', snap => {
      console.log(`Response recieved on fetching event registration details: `);
      this.setRegData(snap.val());
      console.log(this.eventRegDetails);
    }, err => {
      console.log(err);
      console.log('failed to load event registration fetching details for event ', this.eventId);
    });
    this._ves.geteventRegStat(eventId, userId).on('value', snap => {
      this.regDataFetching = true;
      console.log(`Response recieved on fetching event registration details: `);
      this.setRegData(snap.val());
      console.log(this.eventRegDetails);
    }, err => {
      console.log(err);
      console.log('failed to load event registration fetching details for event ', this.eventId);
    });
  }

  setRegData(data) {
    if (!data) return this.eventRegDetails = null;
    return this.eventRegDetails = data;
  }

  ngOnChanges() {
    this.topScroll = 0;
    this.eventFullView = this.showItem;
  }

  // @HostListener("window:scroll", [])
  onWindowScroll(e) {
    //we'll do some stuff here when the window is scrolled
    const i = document.getElementById(e);
    // console.log(i.scrollHeight, i.scrollTop);
    this.topScroll = i.scrollTop;
    // if (this.toggleFullView) console.log('window scrolled', this.topScroll);
  }

  toggleFullView() {
    this.eventFullView = !this.eventFullView;
    if (this.eventFullView) this.fetchRegistrationStatus();
  }

  loginAndRegister() {
    window.localStorage.setItem('returnUrl', this._router.url);
    this._router.navigate(['login']);
  }

  showThisEvent() {
    const routeState = this._router.url;
    console.log(routeState);
    const urlArr = routeState.split('/');
    this._router.navigate([urlArr[1], urlArr[2], urlArr[3], this.eventId]);
  }

  closeThisEvent() {
    const routeState = this._router.url;
    console.log(routeState);
    const urlArr = routeState.split('/');
    this._router.navigate([urlArr[1], urlArr[2], urlArr[3]]);
  }

  onRegister() {
    if (this.registeringToEvent) return null;
    this.registeringToEvent = true;
    // this._ves.venueEventActions(this.eventId).push({res_uid: this.authUser.uid, action: 'register'}).then(() => {
    //   // this.fetchRegistrationStatus();
    //   // alert(`Registration request submittedSuccessfully.`);
    //   // $.fancybox.open('<div class="message text-dark"><h2>Hello!</h2><p>You are awesome!</p></div>');
    // }).catch(err => {
    //   console.log(err);
    //   alert('Something went wrong, Unable to place registration request.');
    // });
    const functoReg = firebase.functions().httpsCallable('registerForEvent');
    functoReg({res_uid: this.authUser.uid, eventId: this.eventData.eventId}).then((data: any) => {
      const res = data.data;
      console.log(res);
      if (!res || !res.status || !res.actionKey) {
        this.registeringToEvent = false;
        return alert(`Something went wrong. Unable to complete the registration process`);
      }
      this.regRefKey = res.actionKey;
      this.registeringToEvent = false;
      if (res.status == 'PAYMENT_REQUIRED') return this.enablePaymentOption(res.amount, res.actionKey);
      if (res.status == 'OK') return null;
    }).catch(err => {
      console.log(err);
      this.registeringToEvent = false;
    });
  }

  enablePaymentOption(amount, paymentRefKey) {
    this.paymentAmt = amount;
    this.paymentDesc = `Entry fee for event "${this.eventData.title}"`;
    this.enablePayment = true;
    return null;
  }

  onPaymentResponse(e: PaymentResponse) {
    console.log(e);
    firebase.database().ref(`/privateList/venue_event_responses/${this.eventData.eventId}/actions/${this.regRefKey}/payment_info`).push(e);
    if (e.state == 'completed') {
      this.enablePayment = false;
      this.paymentAmt = undefined;
      this.paymentDesc = undefined;
      alert('Transaction successfull. you are redirected to bookings page');
      const funcToReg = firebase.functions().httpsCallable('completeEventRegistrationOnPayment');
      funcToReg({eventId: this.eventData.eventId, res_uid: this.authUser.uid, actionKey: this.regRefKey, paymentId: e.res.id}).then(response => {
        const res = response.data;
        if (!res) return alert(`Something went wrong, Please try again. Please have the reference id: ${this.regRefKey}`);
        alert(`You are successfully registered to the event ${this.eventData.title}`);
      }).catch(err => {
        console.log(err);
        alert(`Something went wrong, Please try again. PLease have the reference id: ${this.regRefKey}`);
      });
    }
    if (e.state == 'failed') {
      alert (`Oops...! Something went wrong. Transaction is failed. Please note down the transaction id ${e.res.orderID} for tracking purpose`);
    }
    if (e.state == 'closed') {
      alert (`You closed the transaction window. Transaction is incomplete. Please note down the transaction id: ${e.res.orderID} for your referrence`);
    }
  }

  onCancelRegistration() {
    if (this.cancellingRegistration) return null;
    this.cancellingRegistration = true;
    const func = firebase.functions().httpsCallable('cancelEventRegistration');
    func({eventId: this.eventData.eventId, res_uid: this.authUser.uid}).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  isOneDayEvent(startTime, endTime) {
    const st = new Date(startTime);
    const et = new Date(endTime);
    const sd = st.getDate();
    const sM = st.getMonth();
    const sy = st.getFullYear();
    const ed = et.getDate();
    const eM = et.getMonth();
    const ey = et.getFullYear();
    const std = new Date(sy, sM, sd).getTime();
    const endD = new Date(ey, eM, ed).getTime();
    // console.log(std, endD, std == endD);
    return std == endD;
  }

  isSameYear(startTime, endTime) {
    const st = new Date(startTime);
    const et = new Date(endTime);
    const sy = st.getFullYear();
    const ey = et.getFullYear();
    const cy = new Date().getFullYear();
    return (sy == ey) && (sy == cy);
  }

}
