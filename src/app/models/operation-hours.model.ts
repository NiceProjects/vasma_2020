export class OpHours {
  constructor(
    public sT?: number,                                 // Starting time
    public eT?: number                                  // Ending time
  ) {
    const Obj = {sT: sT || null, eT: eT || null};
    return Obj;
  }
}

export class BHData {
  constructor(
    public OP?: boolean,                      // is open
    public FD?: boolean,                      // is full day. ie 24 Hours
    public OH?: OpHours[]                     // If not 24 hours, business hours array
  ) {
    const Obj = {
      OP: OP || true,
      FD: FD || false,
      OH: OH || [{sT: 540, eT: 1080}]
    };
    return Obj;
  }
}

export class BusinessHours {
  constructor(
    public sunday?: BHData,
    public monday?: BHData,
    public tuesday?: BHData,
    public wednusday?: BHData,
    public thursday?: BHData,
    public friday?: BHData,
    public saturday?: BHData
  ) {
    const Obj = {
      sunday: sunday || new BHData(false),
      monday: monday || new BHData(),
      tuesday: tuesday || new BHData(),
      wednusday: wednusday || new BHData(),
      thursday: thursday || new BHData(),
      friday: friday || new BHData(),
      saturday: saturday || new BHData()
    };
    return Obj;
  }
}

export class SpecialBusinessHours {
  constructor(
    public specialDate?: number,                                         // Special business day
    public bhData?: BHData                                               // Business hours data
  ) {
    const Obj = {
      specialDate: specialDate || null,
      bhData: bhData || new BHData()
    };
    return Obj;
  }
}

export class BusinessDay {
  constructor(
    public dt?: number,                                                   // Date of selection
    public dayOpen?: boolean | 'na',                                      // Is that day open
    public daySt?: 'open' | 'close' | 'na',                    // Day state
    public bh?: OpHours[] | '24H'                                         // Business hours
  ) {
    const Obj = {
      dt: dt || new Date().getTime(),
      dayOpen: dayOpen || 'na',
      daySt: daySt || 'na',
      bh: bh || []
    };
    return Obj;
  }
}

// export enum TimeInMinutes {
//   '12:00 am' = 0,
// }
