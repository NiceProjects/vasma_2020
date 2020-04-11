import { AddCharges } from './commercial-service.model';
import { BillAmount } from './bill-object.model';
import { CustDateObj } from './custom-date.model';

export class BookingData {
  constructor(
    public serviceTitle?: string,
    public serviceOwner?: string,
    public serviceOwnerId?: string,
    public bookingUnits?: string,
    public bookingQty?: number,
    public addCharges?: AddCharges[],
    public basePrice?: number,
    public reciept?: BillAmount,
    public bookingDates?: number[],
    public bookingTime?: StEt[]
  ) {

    const dt = new Date();
    const daySt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
    const Obj = {
      serviceTitle: serviceTitle || null,
      serviceOwner: serviceOwner || null,
      serviceOwnerId: serviceOwnerId || null,
      bookingUnits: bookingUnits || null,
      bookingQty: bookingQty || null,
      addCharges: addCharges || [],
      basePrice: basePrice || null,
      reciept: null,
      bookingDates: bookingDates || [daySt],
      bookingTime: bookingTime || []
    };
    return Obj;
  }
}

export class StEt {
  constructor(
    public st?: number,
    public et?: number
  ) {
    const Obj = {st: st || null, et: et || null};
    return Obj;
  }
}
