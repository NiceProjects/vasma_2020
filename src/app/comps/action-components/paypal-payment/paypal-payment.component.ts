import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { PaymentResponse } from './payment-res.model';
import * as firebase from 'firebase/app';
import 'firebase/database';
declare var paypal;
@Component({
  selector: 'app-paypal-payment',
  template: `<div #paypal></div>`
})
export class PaypalPaymentComponent implements OnInit {
  @ViewChild('paypal') paypalElement: ElementRef;
  @Input('data-amount') amount: number;
  @Input('data-saleItem') saleItem: number;
  @Input('data-purchase-desc') purchase_desc?: string;
  @Output('paymentResponse') paymenRes = new EventEmitter<any>();
  // purchase = {
  //   price: 0.01,
  //   description: 'used couch, decent condition',
  //   img: 'assets/couch.jpg'
  // };

  paidFor = false;

  ngOnInit() {
    paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color:  'gold',
          shape:  'rect',
          label:  'pay',
          height: 40,
          size: 'responsive',
          tagline: false
      },
      createOrder: (data, actions) => {
        console.log(data, actions);
        return actions.order.create({
          purchase_units: [
            {
              description: this.purchase_desc || 'A service from VASMA',
              amount: {
                currency_code: 'USD',
                // value: 0.01
                value: this.amount
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(actions);
        this.updateTransactionInfo(order);
        this.paymenRes.emit(new PaymentResponse('completed', order));
        this.paidFor = true;
        console.log(order);
      },
      onError: err => {
        this.updateTransactionInfo(err);
        this.paymenRes.emit(new PaymentResponse('failed', err));
        console.log(err);
      },
      onCancel: e => {
        this.updateTransactionInfo(e);
        this.paymenRes.emit(new PaymentResponse('closed', e));
        console.log('Payment window closed');
      }
    })
    .render(this.paypalElement.nativeElement);
  }

  updateTransactionInfo(e) {
    firebase.database().ref(`/privateList/transactions/${e.orderID || e.id}`).set(e);
  }
}


// , {static: true}