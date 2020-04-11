export class ChatListItem {
  constructor(
    public lu?: number,                                                       // Last updated at
    public msgs?: any,                                              // Array of chat messages
    public subj?: string,                                                     // Subject of the chat. Ex:
    public desc?: string,                                                     // Subject of the chat. Ex:
    public pt?: any,                                                          // Participants
    public cType?: 'booking' | 'dispute' | 'one-one' | 'group' | 'other'      // Type of chat
  ) {}
}

export class ChatMessage {
  constructor(
    public sId?: string,                                              // Sender uid
    public msg?: string,                                              // Message
    public time?: number,                                             // Message sent time
  ) {
    const Obj = {
      sId: sId || null,
      msg: msg || null,
      time: time || null
    };
    return Obj;
  }
}

export class ChatList {
  constructor(
    public clUid?: string,                                             // Chat list uid
    public lu?: number                                                // last updated time as number
  ) {}
}