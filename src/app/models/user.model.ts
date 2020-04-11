import { BusinessHours, SpecialBusinessHours } from './operation-hours.model';
import { TransactionObject } from './transaction-object.model';
import { ChatList } from './chat-box.model';
import { VenueEventResponse } from './venue-event.model';

export class Name {
  constructor(
    public fName?: string,
    public lName?: string,
    public userName?: string
  ) {
    const Obj = {
      fName: fName || null,
      lName: lName || null,
      userName: userName || null
    };
    return Obj;
  }
}

export class Person {
  constructor(
    public name?: Name,
    public contact?: ContactNum[]
  ) {
    const Obj = {
      name: name || new Name(),
      contact: contact || []
    };
    return Obj;
  }
}

export class ArtistInfo {
  constructor(
    public type?: string[],
    public styles?: string[],
    public interests?: string[],
    public soundCloudId?: string
  ) {
    const Obj = {
      type: type || null,
      styles: styles || null,
      interests: interests || ['Pop', 'Cooking', 'Rap'],
      soundCloudId: soundCloudId || null
    };
    return Obj;
  }
}

export class BusinessInfo {
  constructor(
    public type?: string[],
    public prelGenres?: string[]
  ) {
    const Obj = {type: type || null, prelGenres: prelGenres || []};
  }
}

export class ContactNum {
  constructor(
    public cc?: number,
    public num?: number
  ) {
    const Obj = {
      cc: cc || 1,
      num: num || null
    };
    return Obj;
  }
}

export class UserBio {
  constructor(
    public bio?: string,
    public est?: number,
    public origin?: string
  ) {
    const Obj = {
      bio: bio || null,
      est: est || new Date().getTime(),
      origin: origin || null
    };
  }
}

export class AddressModel {
  constructor(
    public line1?: string,
    public line2?: string,
    public city?: string,
    public zip?: string,
    public state?: string
  ) {
    const Obj = {
      line1: line1 || null,
      line2: line2 || null,
      city: city || 'dallas',
      zip: zip || null,
      state: state || 'TX'
    };
    return Obj;
  }
}

export class RatingModel {
  constructor(
    public rating?: number,
    public count?: number
  ) {
    const Obj = {
      rating: rating || 0,
      count: count || 0
    };
    return Obj;
  }
}

export class PublicUser {
  constructor(
    public uid?: string,
    public uniqueKey?: string,
    public email?: string,
    public name?: Name,
    public businessName?: string,
    public photoURL?: string,
    public userType?: string,
    public userOnHold?: boolean,
    public ratingData?: RatingModel,
    public add1?: AddressModel,
    public userBio?: UserBio,
    public artistInfo?: ArtistInfo,
    public businessInfo?: BusinessInfo,
    public bHours?: BusinessHours,
    public SBH?: SpecialBusinessHours[],
    public venueInfo?: any,
    public studioInfo?: any,
    public eventsList?: PublicVenueEvent[]
  ) {
    const Obj = {
      uid: uid || null,
      uniqueKey: uniqueKey || null,
      email: email || null,
      name: name || new Name(),
      photoURL: photoURL || null,
      userType: userType || 'unset',
      userOnHold: userOnHold || false,
      ratingData: ratingData || new RatingModel(),
      add1: add1 || null,
      userBio: userBio || null,
      artistInfo: artistInfo || null,
      businessInfo: businessInfo || null,
      bHours: bHours || null,
      SBH: SBH || null,
      businessName: businessName || null,
      eventsList: eventsList || null
    };
    return Obj;
  }
}

export class PrivateUserData {
  constructor(
    public uid?: string,                                  // user id
    public contact?: ContactNum[],                        // Contact details of business
    public businessOwners?: Person[],                     // Business owners details of the business. "Optional", Applicable only for venues and studios
    public unc?: number,                                  // Unread notifications count
    public npt?: number,                                  // New prospect pending count
    public transactions?: TransactionObject[],            // Transaction id's in which the user involved
    public chatList?: ChatList[],                         // List of chatlist id's involved
    public eventsRegistrations?: VenueEventResponse[]     // List event registration responses
  ) {
    const Obj = {
      uid: uid || null,
      contact: contact || [],
      businessOwners: businessOwners || null,
      transactions: transactions || null,
      chatList: chatList || null,
      eventsRegistrations: eventsRegistrations || null
    };
  }
}

export class AuthUserMeta {
  constructor(
    public email?: string,
    public uid?: string,
    public uniqueKey?: string,
    public createdAt?: number,
    public providerId?: string,
    public lastLoginAt?: number,
    public emailVerified?: boolean
  ) {
    const Obj = {
      email: email || null,
      uid: uid || null,
      uniqueKey: uniqueKey || null,
      createdAt: createdAt || null,
      providerId: providerId || null,
      lastLoginAt: lastLoginAt || null,
      emailVerified: emailVerified || false
    };
    return Obj;
  }
}

export class AuthUserType {
  constructor(
    public isArtist?: boolean,
    public isVenue?: boolean,
    public isStudio?: boolean,
    public unset?: boolean
  ) {
    const Obj = {
      isArtist: isArtist || false,
      isVenue: isVenue || false,
      isStudio: isStudio || false,
      unset: unset || true
    };
    return Obj;
  }
}

export class PublicVenueEvent{
  constructor(
    public eventId?: string,
    public publishSt?: boolean,
    public creationTime?: number
  ) {
    const Obj = {
      eventId: null,
      publishSt: null,
      creationTime: null,
    };
    return Obj;
  }
}

