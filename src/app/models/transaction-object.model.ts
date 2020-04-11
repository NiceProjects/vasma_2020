import { BookingData } from './booking-object.model';
import { ChatMessage, LogMsg } from './message.model';

export class TransactionObject {
  constructor(
    public trId?: string,                                                       // Transaction uid
    public bId?: string,                                                        // Unique transaction number or booking id
    public trTo?: string,                                                       // Transaction to
    public trBy?: string,                                                       // Transaction initiated by
    public trInitAt?: number,                                                   // Transaction initiation time
    public trCompAt?: number,                                                   // Transaction completion time
    public trFinalAmt?: number,                                                 // Transaction amount
    public trMode?: 'paypal',                                                   // Transaction mode
    public trResObj?: any,                                                      // Transaction response Obj
    public trStatus?: 'completed' | 'closed' | 'failed' | 'init',               // Transaction status
    public bookingData?: BookingData,                                            // Booking details
    public bookingST?: 'init' | 'review-by-payer' | 'review-by-sp' | 'reject-by-sp' | 'cancel-by-py' | 'cancel-acpt-by-sp' | 'reject-by-adm' | 'confirm-by-sp' | 'confirm-by-adm' | 'auto-rejet' | 'confirmed' | 'completed' | 'others',
    public bookingStMsg?: LogMsg[],                                             // Booking state messages
    public paymentSt?: 'init' | 'success' | 'failed' | 'cancel',                // Payment status
    public refundReqSt?: 'negative' | 'init' | 'ref-req-by-sp' | 'ref-req-by-by',
    public refundProcSt?: 'negative' | 'init' | 'ref-success' | 'ref-failed' | 'ref-pending',
    public trRatedByPye?: boolean,                                              // Transaction rated by payee  => Service provider
    public trRatedByPyr?: boolean,                                              // Transaction rated by payer  => Service consumer
    public trPyeRating?: number,                                                //
    public trPyrRating?: number,                                                //
    public trReview?: LogMsg[],                                                 //
    public trChat?: ChatMessage[],                                              //
    public purDesc?: string,                                                    //
    public psSt?: boolean,                                                      // Payment settled => boolean
    public psStMsg?: string                                                     // Payment settlement state message
  ) {
    const Obj = {
      trId: trId || null,
      trTo: trTo || null,
      trBy: trBy || null,
      trInitAt: trInitAt || new Date().getTime(),
      trCompAt: trCompAt || null,
      trFinalAmt: trFinalAmt || null,
      trMode: trMode || 'paypal',
      trResObj: trResObj || null,
      trStatus: trStatus  || 'init',
      bookingData: bookingData || null,
      bookingST: bookingST || 'init',
      bookingStMsg: bookingStMsg || null,
      paymentSt: paymentSt || null,
      refundReqSt: refundReqSt || null,
      refundProcSt: refundProcSt || null,
      trRatedByPye: trRatedByPye || false,
      trRatedByPyr: trRatedByPyr || false,
      trPyeRating: trPyeRating || null,
      trPyrRating: trPyrRating || null,
      trReview: trReview || null,
      trChat: trChat || null,
      purDesc: purDesc || null,
      psSt: psSt || false,
      psStMsg: psStMsg || 'Not yet initiated'
    };
    return Obj;
  }
}
