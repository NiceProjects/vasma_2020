import { Component, OnInit } from '@angular/core';
import { CusService } from 'src/app/services/cus.service';
import { PrivateUserData } from 'src/app/models/user.model';
import { TransactionObject } from 'src/app/models/transaction-object.model';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit {
  userPvtDt: PrivateUserData;
  transactions: any[];
  constructor(
    private _cus: CusService
  ) { }

  ngOnInit() {
    this.userPvtDt = this._cus.getAuthPdt();
    this.setTransactions();
    this._cus.onAuthpdtUpdate.subscribe(data => {
      this.userPvtDt = data;
      this.setTransactions();
    });
  }

  setTransactions() {
    if (this.userPvtDt) {
      if (this.userPvtDt.transactions) {
        const transactions = Object.values(this.userPvtDt.transactions);
        this.transactions = transactions.sort((a: any, b: any) => b.trTime - a.trTime);
        console.log(this.transactions);
      }
    }
  }

}
