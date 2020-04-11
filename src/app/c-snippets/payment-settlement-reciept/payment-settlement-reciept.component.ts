import { Component, OnInit, Input } from '@angular/core';
import { AppDefService } from 'src/app/services/app-def.service';

@Component({
  selector: 'app-payment-settlement-reciept',
  templateUrl: './payment-settlement-reciept.component.html',
  styleUrls: ['./payment-settlement-reciept.component.scss']
})
export class PaymentSettlementRecieptComponent implements OnInit {
  @Input('data-payment-reciept') reciept: any;
  appDefaults;
  vasmaChargePerc: number;
  constructor(
    private _ads: AppDefService
  ) { }

  ngOnInit() {
    this.appDefaults = this._ads.appDefs;
    console.log(this.reciept);
  }

  getVasmaCommission() {
    return (this.reciept.finalBillAmt - this.reciept.paymentGtwCharges) * this.reciept.vc;
  }

  getFinalSettlementAmount() {
    return this.reciept.finalBillAmt - this.reciept.paymentGtwCharges - this.getVasmaCommission();
  }

}
