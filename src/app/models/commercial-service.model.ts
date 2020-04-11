import { strictEqual } from 'assert';

export class ComService {
  constructor(
    public uid?: string,                            // UNIQUE Service selection key / id
    public sProvId?: string,                        // Service provider unique id
    public title?: string,                          // service name
    public shortCode?: string,                      // Short code/Name of service
    public desc?: string,                           // Long description related to the service
    public price?: number,                          // Price of service
    public addCharges?: AddCharges[],               // Other charges
    public pricingModel?: string ,                  // Pricing model. Ex: 'HR' for hourly charging, 'DY' for daily charging
    public unit?: string,                           // unit of the service booking duration ex: 'hour', 'day'
    public minBookValue?: number,                   // Min booking limit per order
    public maxBookValue?: number,                   // Max booking limit per order
    public slotsAvl?: number,                       // No of slots available at once
    public createdAt?: number,                      // Creation time
    public modified?: any[],                        // Modification time
    public publish?: boolean,                       // public or draft
    public BBFT?: number,                           // Booking Buffer time required before booking as number (milliseconds)
    public BType?: 'hours' | 'days' | 'beforeday'   // Buffer type
  ) {
    const Obj = {
      uid: uid || null,
      sProvId: sProvId || null,
      title: title || null,
      shortCode: shortCode || null,
      desc: desc || null,
      price: price || null,
      addCharges: addCharges || [],
      pricingModel: pricingModel || null,
      unit: unit || null,
      minBookValue: minBookValue || 1,
      maxBookValue: maxBookValue || 1,
      slotsAvl: slotsAvl || 1,
      createdAt: createdAt || new Date().getTime(),
      modified: modified || [],
      publish: publish || false,
      BBFT: BBFT || null,
      BType: BType || null
    };
    return Obj;
  }
}

export class PricingModel {
  constructor(
    public unitName?: string
  ) {}
}

export class AddCharges {
  constructor(
    public chargeTitle?: string,
    public fixedCharge?: boolean,
    public amount?: number
  ) {
    const Obj = {
      chargeTitle: chargeTitle || null,
      fixedCharge: fixedCharge || true,
      amount: amount || null
    };
    return Obj;
  }
}

export interface DefKVPairs {
  key: string | number;
  type: string;
  defUnit?: string;
  defUnits?: string;
}
