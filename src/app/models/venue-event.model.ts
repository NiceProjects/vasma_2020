import { GalleryItem, PhotoObject } from './gallery-upload.model';

export class VenueEvent {
  constructor(
    public eventData?: VenueEventData,
    public responses?: VenueEventResponse[]
  ) {
    const Obj = {
    };
    return Obj;
  }
}

export class VenueEventData {
  constructor(
    public eventId?: string,                      // Event unique id_ automatically created by server
    public eventOwnerId?: string,                 // Event owner Id
    public title?: string,                        // Event title to display
    public sDesc?: string,                        // event short description
    public fDesc?: string,                        // Event full description
    public avlSlots?: number,                     // Available event slots
    public eventImgs?: PhotoObject[],             // Event photos if any (Optional)
    public eventBanneImg?: PhotoObject,           // Event banner image object
    public eventType?: 'paid' | 'openmic',        // Event type,
    public entryFee?: number,                     // Entry fee for event if any
    public creationTime?: number,                 // Creation time of event object in milliseconds
    public eventStartTime?: string,               // Event start time
    public eventStartDate?: number,               // Event start date
    public eventStartTS?: number,                 // Event start time as time as milliseconds
    public eventEndTime?: string,                 // Event end time
    public eventEndDate?: number,                 // Event end date
    public eventEndTS?: number,                   // Event end time as milliseconds
    public regBufferTime?: string,                // Buffer time to allow registration in milliseconds
    public regBufferDate?: number,                // Buffer time to allow registration in milliseconds
    public regBufferTS?: number,                  // Buffer time to allow registration in milliseconds
    public modifyTime?: number,                   // Event modification time in milliseconds
    public responseCount?: number,                // Number of responses recieved
    public publish?: boolean,                     // Available to public
    public misc?: VenueEventMiscTags              // Miscelleneous options
  ) {
    const Obj = {
      eventId: eventId || null,
      title: title || null,
      sDesc: sDesc || null,
      fDesc: fDesc || null,
      avlSlots: avlSlots || null,
      eventImgs: eventImgs || null,
      eventBanneImg: eventBanneImg || null,
      eventType: eventType || 'openmic',
      entryFee: entryFee || 0,
      eventStartTime: eventStartTime || null,
      eventStartDate: eventStartDate || null,
      eventStartTS: eventStartTS || null,
      eventEndTime: eventEndTime || null,
      eventEndDate: eventEndDate || null,
      eventEndTS: eventEndTS || null,
      regBufferTime: regBufferTime || null,
      regBufferDate: regBufferDate || null,
      regBufferTS: regBufferTS || null,
      creationTime: creationTime || new Date().getTime(),
      modifyTime: modifyTime || null,
      responseCount: responseCount || 0,
      publish: publish || false,
      eventOwnerId: eventOwnerId || null,
      misc: misc || new VenueEventMiscTags()
    };
    return Obj;
  }
}

export class VenueEventRegistrationAction {
  constructor (
    public action?: 'register' | 'de-register',
    public res_uid?: string,
    public actionTime?: number
  ) {
    const Obj = {
      action: action || null,
      res_uid: res_uid || null,
      actionTime: actionTime || null
    };
    return Obj;
  }
}

export class VenueEventResponse {
  constructor(
    public res_uid?: string,
    public res_time?: number,
    public payment_info?: any
  ) {
    const Obj = {
      res_uid: res_uid || null,
      res_time: res_time || null,
      payment_info: payment_info || null
    };
    return Obj;
  }
}

export class VenueEventMiscTags {
  constructor(
    public pid_nu?: boolean,            // Push id not updated
    public owner_nu_pid?: boolean,      // Push id not updated into owner
    public version?: number,            // Version of the object
    public thumbVersion?: number        // Version of the thumbUpdate
  ) {
    const Obj = {
      pid_nu: pid_nu || true,
      owner_nu_pid: owner_nu_pid || true,
      version: version || 1,
      thumbVersion: thumbVersion || 1
    };
    return Obj;
  }
}