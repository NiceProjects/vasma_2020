import { Component, OnInit, Input } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { TransactionObject } from 'src/app/models/transaction-object.model';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { LogMsg } from 'src/app/models/message.model';
import { ChatBoxService } from 'src/app/services/chat-box.service';

@Component({
  selector: 'app-bookings-list-card',
  templateUrl: './bookings-list-card.component.html',
  styleUrls: ['./bookings-list-card.component.scss']
})
export class BookingsListCardComponent implements OnInit {
  @Input('data-trId') trId: string;

  booking: TransactionObject;
  isLoading = true;
  isError = false;
  authUser: PublicUser;
  inBoundBooking: boolean;
  outBoundBooking: boolean;
  payeeData: PublicUser;
  bookingType: 'inbound' | 'outbound' = null;
  toggleMore: boolean = false;
  bookingStateMessages: LogMsg[];
  constructor(
    private _fs: FireService,
    private _cus: CusService,
    private _chat: ChatBoxService
  ) { }

  ngOnInit() {
    if (this.trId) {
      this._fs.getFinalTransactionObject(this.trId).on('value', snap => {
        this.booking = snap.val();
        if (this.booking.bookingStMsg) {
          const msgs = Object.values(this.booking.bookingStMsg);
          this.bookingStateMessages = msgs.sort((a: LogMsg, b: LogMsg) => a.time - b.time);
        }
        console.log(this.booking);
        this.setbookingType();
      }, err => {
        console.log(err);
        this.isError = true;
      })
    } else {
      this.isError = true;
    }

    this.authUser = this._cus.getAuthUser();
    this.setbookingType();
    this._cus.onAuthUserUpdate.subscribe(data => {
      this.authUser = data;
      this.setbookingType();
    });
  }

  // Decides whether inbound booking or outbound booking
  setbookingType() {
    if (this.authUser && this.booking) {
      this.inBoundBooking = this.booking.trTo == this.authUser.uid;
      this.outBoundBooking = this.booking.trBy == this.authUser.uid;
      // if (this.inBoundBooking) this.bookingType = 'inbound';
      // else this.bookingType = 'outbound';
      if (this.inBoundBooking) this.getPayeeData();
    }
  }

  getActionClass(actionStr: string) {
    let _class = '';
    if (actionStr == 'review-by-sp' || actionStr == 'review-by-payer') _class = 'badge-warning';
    if (['reject-by-sp', 'cancel-by-py'].indexOf(actionStr) >= 0) _class = 'badge-danger';
    if (['confirm-by-sp', 'confirmed', 'completed'].indexOf(actionStr) >= 0) _class = 'badge-success';
    if (['others', 'cancel-acpt-by-sp'].indexOf(actionStr) >= 0) _class = 'badge-secondary';
    return _class;
  }

  getPayeeData() {
    this._fs.getUserPublicdata(this.booking.trBy).once('value').then(snap => {
      this.payeeData = snap.val();
    }).catch(err => {
      console.log(err);
    })
  }

  toggleMoreDetails() {
    this.toggleMore = !this.toggleMore;
  }

  AcceptBooking() {
    const conf = confirm('Accepting booking reuest');
    if (conf) {
      let acceptFunction = firebase.functions().httpsCallable('handleBookingRequest');
      acceptFunction({action: 'accept', trId: this.trId}).then(res => {
        console.log(res);
        alert('Booking accept requested. Will be updated soon');
      }).catch(err => {
        console.log(err);
        alert(`Something went wrong. Unable to make accept request at this moment. Please try again later.`);
      })
    }
  }

  acceptCancellationByPY() {
    const conf = confirm('Do you really accepting booking cancellation reuest?');
    if (conf) {
      let acceptFunction = firebase.functions().httpsCallable('handleBookingRequest');
      acceptFunction({action: 'acceptCancellation', trId: this.trId}).then(res => {
        console.log(res);
        alert('Approving booking cancellation requested. Will be updated soon');
      }).catch(err => {
        console.log(err);
        alert(`Something went wrong. Unable to make accept request at this moment. Please try again later.`);
      })
    }
  }

  completeThisBooking() {
    const conf = confirm('Does your booking completed successfully?');
    if (conf) {
      let completeFunction = firebase.functions().httpsCallable('handleBookingRequest');
      completeFunction({action: 'completeBooking', trId: this.trId}).then(res => {
        console.log(res);
        alert('Completing booking. Will be updated soon');
      }).catch(err => {
        console.log(err);
        alert(`Something went wrong. Unable to make complete request at this moment. Please try again later.`);
      })
    }
  }

  CancelBooking() {
    const conf = confirm('Do you really want to cancel the booking and process refund?');
    if (conf) {
      let cancelFunction = firebase.functions().httpsCallable('handleBookingRequest');
      cancelFunction({action: 'cancel', trId: this.trId}).then(res => {
        console.log(res);
        alert('Booking Cancellation requested. Will be updated soon');
      }).catch(err => {
        console.log(err);
        alert(`Smething went wrong. Unable to make cancellation request at this moment. Please try again later.`);
      })
    }
  }

  openBookingChat() {
    this._chat._OpenBookingConversation(this.booking);
  }

  openDisputeChat() {
    // this.
  }
  // cancelBookingByPayee() {
  //   const conf = confirm(`Do you really want to cancel your booking with referrence Id ${this.booking.bId}?`);
  //   if (conf) {
  //     let cancelFunction =
  //   }
  // }
}
