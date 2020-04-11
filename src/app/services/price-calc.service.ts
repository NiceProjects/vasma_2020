import { Injectable } from '@angular/core';
import { AddCharges } from '../models/commercial-service.model';
import { BillAmount, ChargeDtl } from '../models/bill-object.model';
import { BookingData } from '../models/booking-object.model';
import { AppDefService } from './app-def.service';

@Injectable({
  providedIn: 'root'
})
export class PriceCalcService {
  vasmaMargin = null;
  fixedCharges = {
    commTaxPerc: 0.0625,
    vasmaMargin: 0.1,
    paypalGatewayFeePerc: 0.06,
    paypalGatewayFixedFee: 0.3
  };
  constructor(
    private _ads: AppDefService
  ) { }

  getBillAmt(booking: BookingData, charges: AddCharges[]): BillAmount {
    const defs = this._ads.appDefs;
    this.fixedCharges = defs.fixedCharges;
    let fr = new BillAmount();
    // console.log('Calculated bill amount object', fr);
    fr.bp = +booking.basePrice;
    fr.bQty = +booking.bookingQty;
    fr.billAmtValue = fr.bp * fr.bQty;
    fr.charges.push(new ChargeDtl(`Sub total`, `For ${booking.bookingQty} ${booking.bookingUnits}(s)`, fr.billAmtValue));
    fr.taxableAmt = fr.billAmtValue;
    if (charges) {
      for (let c of charges) {
        let Obj = new ChargeDtl();
        if (c.fixedCharge) {
          Obj.amount = c.amount;
          Obj.sDesc = c.chargeTitle;
        } else {
          Obj.amount = c.amount * fr.bQty;
          Obj.sDesc = c.chargeTitle;
          Obj.lDesc = `@ (${fr.bQty} x ${c.amount})`;
        }
        fr.charges.push(Obj);
        fr.taxableAmt += +Obj.amount;
      }
    }
    const tx = this._ads.appDefs.fixedCharges;
    fr.commTaxPerc = tx.commTaxPerc;
    fr.commTaxAmt = +(fr.taxableAmt * tx.commTaxPerc).toFixed(2);
    fr.charges.push(new ChargeDtl(`Commercial Tax @ ${tx.commTaxPerc * 100}%`, null, +fr.commTaxAmt.toFixed(2)));
    fr.paymentGtwCharges = this.getPaymentGatewayChargeAmt(fr.taxableAmt + fr.commTaxAmt)
    const famt: number = fr.taxableAmt + fr.commTaxAmt + fr.paymentGtwCharges;
    fr.finalBillAmt = +(famt.toFixed(2));
    fr.vc = this.fixedCharges.vasmaMargin;
    return fr;
  }

  getPaymentGatewayChargeAmt(payableAmt): number {
    const txac = this._ads.appDefs.fixedCharges;
    const Amount = (+payableAmt * +txac.paypalGatewayFeePerc) + (+txac.paypalGatewayFixedFee);
    return Amount;
  }
}
