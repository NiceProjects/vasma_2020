export class ChatMessage {
  constructor(
    public sentBy?: string,
    public sentTo?: string,
    public sentTime?: number,
    public message?: string
  ) {
    const Obj = {
      sentBy: sentBy || null,
      sentTo: sentTo || null,
      sentTime: sentTime || null,
      message: message || null
    };
    return Obj;
  }
}

export class LogMsg {
  constructor(
    public msg?: string,
    public time?: number,
    public ref?: any
  ) {
    const Obj = {
      msg: msg || null,
      time: time || null,
      ref: ref || null
    }
    return Obj;
  }
}